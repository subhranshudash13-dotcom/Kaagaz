"""
Kaagaz High-Fidelity Local OCR & Multi-Engine Document Processing Architecture.
Zero-cloud, air-gapped, multi-engine document ingestion:
- Digital / Text PDF: PyMuPDF high-fidelity text extraction with layout and block preservation
- Scanned / Image PDF: PyMuPDF 300-DPI high-res page rendering & deep neural OCR
- Image files (JPG, PNG, TIFF, BMP, WEBP): Adaptive scaling, contrast enhancement, sharpening, and RapidOCR ONNX / Windows OCR ensemble
- Structured provenance & word/line bounding boxes for rich frontend scanner HUD
"""

import io
import os
import re
import time
import logging
from pathlib import Path
from typing import Dict, Any, List, Tuple, Optional
from PIL import Image, ImageEnhance, ImageFilter

logger = logging.getLogger(__name__)

# Engine 1: PyMuPDF (High-Fidelity PDF rendering & text extraction)
try:
    import pymupdf as fitz
except ImportError:
    try:
        import fitz
    except ImportError:
        fitz = None

# Engine 2: RapidOCR ONNX (State-of-the-Art Deep Learning Local OCR)
try:
    from rapidocr_onnxruntime import RapidOCR
    import numpy as np
    rapid_ocr = RapidOCR()
except Exception as e:
    rapid_ocr = None
    np = None
    logger.info(f"RapidOCR not initialized: {e}")

# Engine 3: Native Windows Media OCR
try:
    import winocr
except ImportError:
    winocr = None

# Engine 4: Tesseract OCR (Optional system fallback)
try:
    import pytesseract
except ImportError:
    pytesseract = None

# Engine 5: pypdf fallback
try:
    import pypdf
except ImportError:
    pypdf = None


class OCREngine:
    """Enterprise-grade local OCR engine with multi-engine deep learning fallback."""

    def __init__(self):
        self._tesseract_available = False
        self._configure_tesseract()

    def _configure_tesseract(self):
        """Checks for Tesseract executable in standard Windows/Linux locations."""
        if not pytesseract:
            return

        candidate_paths = [
            os.environ.get("TESSERACT_CMD", ""),
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
            os.path.expanduser(r"~\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"),
        ]

        for p in candidate_paths:
            if p and os.path.exists(p):
                try:
                    pytesseract.pytesseract.tesseract_cmd = p
                    self._tesseract_available = True
                    logger.info(f"OCREngine: Bound Tesseract OCR engine at '{p}'")
                    return
                except Exception as e:
                    logger.warning(f"OCREngine: Failed to bind tesseract path '{p}': {e}")

    def preprocess_image(self, pil_img: Image.Image) -> Image.Image:
        """
        Applies adaptive resolution scaling, contrast boost, and edge sharpening
        to maximize character recognition accuracy on receipts, bills, and stamps.
        """
        try:
            w, h = pil_img.size
            target_dim = 2200
            max_side = max(w, h)
            factor = max(target_dim / max_side, 1.0)
            if factor > 1.2:
                scaled_img = pil_img.resize((int(w * factor), int(h * factor)), Image.Resampling.LANCZOS)
            else:
                scaled_img = pil_img

            # Contrast enhancement
            enhancer = ImageEnhance.Contrast(scaled_img.convert("RGB"))
            enhanced = enhancer.enhance(1.4)

            # Subtle sharpening for numeric clarity
            sharpened = enhanced.filter(ImageFilter.SHARPEN)
            return sharpened
        except Exception as e:
            logger.warning(f"OCREngine: Preprocessing fallback: {e}")
            return pil_img

    async def _ocr_with_rapidocr(self, pil_image: Image.Image) -> Tuple[str, List[Dict[str, Any]], float]:
        """Runs Deep Learning RapidOCR ONNX model with accurate bounding boxes."""
        if not rapid_ocr or np is None:
            return "", [], 0.0

        try:
            preprocessed = self.preprocess_image(pil_image)
            img_rgb = preprocessed.convert("RGB")
            img_np = np.array(img_rgb)

            result, _ = rapid_ocr(img_np)
            if not result:
                return "", [], 0.0

            lines_out = []
            confidences = []
            text_lines = []

            for item in result:
                box, txt, score = item[0], item[1], float(item[2])
                txt_clean = txt.strip()
                if txt_clean:
                    text_lines.append(txt_clean)
                    confidences.append(score)
                    # Compute standard bounding box [x, y, width, height]
                    xs = [pt[0] for pt in box]
                    ys = [pt[1] for pt in box]
                    lines_out.append({
                        "text": txt_clean,
                        "confidence": round(score, 3),
                        "box": [round(min(xs), 1), round(min(ys), 1), round(max(xs) - min(xs), 1), round(max(ys) - min(ys), 1)]
                    })

            avg_conf = sum(confidences) / len(confidences) if confidences else 0.85
            full_text = "\n".join(text_lines)
            return full_text, lines_out, avg_conf
        except Exception as e:
            logger.warning(f"OCREngine: RapidOCR execution note: {e}")
            return "", [], 0.0

    async def _ocr_with_winocr(self, pil_image: Image.Image) -> Tuple[str, List[Dict[str, Any]], float]:
        """Runs native Windows Media OCR with line reconstruction."""
        if not winocr:
            return "", [], 0.0

        try:
            preprocessed = self.preprocess_image(pil_image)
            rgb_img = preprocessed.convert("RGB")
            res = await winocr.recognize_pil(rgb_img, "en")
            if not res or not hasattr(res, "lines"):
                return "", [], 0.0

            lines_out = []
            text_lines = []
            for line in res.lines:
                line_txt = line.text.strip()
                if line_txt:
                    text_lines.append(line_txt)
                    box = [0.0, 0.0, 0.0, 0.0]
                    if hasattr(line, "words") and line.words:
                        w_first = line.words[0].bounding_rect
                        w_last = line.words[-1].bounding_rect
                        box = [
                            round(w_first.x, 1),
                            round(w_first.y, 1),
                            round((w_last.x + w_last.width) - w_first.x, 1),
                            round(max(w_first.height, w_last.height), 1)
                        ]
                    lines_out.append({
                        "text": line_txt,
                        "confidence": 0.94,
                        "box": box
                    })

            full_text = "\n".join(text_lines)
            return full_text, lines_out, 0.94 if text_lines else 0.0
        except Exception as e:
            logger.info(f"OCREngine: Windows OCR execution note: {e}")
            return "", [], 0.0

    async def _ocr_single_image(self, pil_image: Image.Image) -> Tuple[str, List[Dict[str, Any]], float, str]:
        """Ensemble OCR pipeline prioritizing RapidOCR ONNX, then Windows Media OCR, then Tesseract."""
        # 1. Try RapidOCR (Best on complex scanned bills, tables & numbers)
        txt, lines, conf = await self._ocr_with_rapidocr(pil_image)
        if txt and len(txt.strip()) > 15:
            return txt, lines, conf, "RapidOCR ONNX Deep Engine"

        # 2. Try Windows Media Native OCR
        txt_win, lines_win, conf_win = await self._ocr_with_winocr(pil_image)
        if txt_win and len(txt_win.strip()) > 15:
            return txt_win, lines_win, conf_win, "Windows Media AI OCR"

        # 3. Try Tesseract OCR
        if pytesseract and self._tesseract_available:
            try:
                pre = self.preprocess_image(pil_image).convert("L")
                tess_txt = pytesseract.image_to_string(pre, lang="eng", config="--oem 3 --psm 6")
                if tess_txt and len(tess_txt.strip()) > 15:
                    tess_lines = [{"text": l.strip(), "confidence": 0.88, "box": [0, 0, 0, 0]} for l in tess_txt.splitlines() if l.strip()]
                    return tess_txt.strip(), tess_lines, 0.88, "Tesseract OCR"
            except Exception as e:
                logger.warning(f"OCREngine: Tesseract note: {e}")

        # Fallback to whatever partial text was gathered
        if txt:
            return txt, lines, conf, "RapidOCR ONNX"
        if txt_win:
            return txt_win, lines_win, conf_win, "Windows Media OCR"

        return "", [], 0.0, "None"

    async def process_file(self, file_path: Path, file_type: str) -> Dict[str, Any]:
        """
        Full OCR pipeline supporting digital PDFs, scanned PDFs, images, and text formats.
        Returns structured extraction payload with lines, bounding boxes, and provenance.
        """
        start_time = time.time()
        ext = file_path.suffix.lower()
        warnings = []
        pages_output = []
        all_lines = []
        full_text = ""
        source_type = "unknown"
        confidence = 0.90
        engine_used = "Direct Ingestion"

        if ext == ".pdf":
            # 1. Attempt High-Fidelity PyMuPDF extraction
            if fitz:
                try:
                    doc = fitz.open(str(file_path))
                    digital_pages_text = []
                    
                    for page_idx in range(len(doc)):
                        page = doc[page_idx]
                        page_text = page.get_text("text").strip()
                        page_lines = []

                        # Extract text blocks with layout positioning
                        blocks = page.get_text("blocks")
                        for b in blocks:
                            b_text = b[4].strip() if len(b) > 4 else ""
                            if b_text:
                                page_lines.append({
                                    "text": b_text,
                                    "confidence": 0.99,
                                    "box": [round(b[0], 1), round(b[1], 1), round(b[2] - b[0], 1), round(b[3] - b[1], 1)]
                                })

                        if len(page_text) > 30:
                            digital_pages_text.append(f"--- Page {page_idx + 1} ---\n" + page_text)
                            pages_output.append({
                                "page_num": page_idx + 1,
                                "text": page_text,
                                "lines": page_lines,
                                "confidence": 0.99
                            })
                            all_lines.extend(page_lines)

                    # If digital PDF has rich text across pages, use it directly
                    if digital_pages_text and len("\n".join(digital_pages_text)) > 40:
                        full_text = "\n\n".join(digital_pages_text)
                        source_type = "digital_pdf"
                        confidence = 0.99
                        engine_used = "PyMuPDF Vector Text Engine"
                    else:
                        # Scanned PDF: Render every page at 300 DPI and run Deep OCR
                        source_type = "scanned_pdf"
                        ocr_page_texts = []
                        for page_idx in range(len(doc)):
                            page = doc[page_idx]
                            pix = page.get_pixmap(dpi=300)
                            img_data = pix.tobytes("png")
                            pil_page_img = Image.open(io.BytesIO(img_data))
                            
                            p_txt, p_lines, p_conf, p_engine = await self._ocr_single_image(pil_page_img)
                            engine_used = p_engine
                            if p_txt:
                                ocr_page_texts.append(f"--- Page {page_idx + 1} ---\n" + p_txt)
                                pages_output.append({
                                    "page_num": page_idx + 1,
                                    "text": p_txt,
                                    "lines": p_lines,
                                    "confidence": p_conf
                                })
                                all_lines.extend(p_lines)
                        
                        full_text = "\n\n".join(ocr_page_texts)
                        confidence = 0.94 if full_text else 0.50

                except Exception as e:
                    warnings.append(f"PyMuPDF reader notice: {str(e)}")

            # Fallback to pypdf if PyMuPDF failed
            if not full_text and pypdf:
                try:
                    reader = pypdf.PdfReader(str(file_path))
                    pdf_text = ""
                    for i, page in enumerate(reader.pages):
                        txt = page.extract_text() or ""
                        if txt.strip():
                            pdf_text += f"--- Page {i+1} ---\n" + txt.strip() + "\n\n"
                    if len(pdf_text.strip()) > 30:
                        full_text = pdf_text.strip()
                        source_type = "text_pdf"
                        confidence = 0.95
                        engine_used = "pypdf Engine"
                except Exception as e:
                    warnings.append(f"pypdf reader notice: {str(e)}")

        elif ext in [".jpg", ".jpeg", ".png", ".webp", ".tiff", ".bmp"]:
            source_type = "image"
            try:
                with Image.open(str(file_path)) as img:
                    img_copy = img.copy()
                    txt, lines, conf, eng = await self._ocr_single_image(img_copy)
                    full_text = txt
                    confidence = conf
                    engine_used = eng
                    all_lines = lines
                    pages_output.append({
                        "page_num": 1,
                        "text": txt,
                        "lines": lines,
                        "confidence": conf
                    })
            except Exception as e:
                warnings.append(f"Image load error: {str(e)}")
                full_text = ""
                confidence = 0.0

        elif ext in [".txt", ".csv", ".json", ".md"]:
            source_type = "text_file"
            engine_used = "UTF-8 Direct Ingestion"
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    full_text = f.read().strip()
                    confidence = 1.0
                    lines = [{"text": l.strip(), "confidence": 1.0, "box": [0, 0, 0, 0]} for l in full_text.splitlines() if l.strip()]
                    all_lines = lines
                    pages_output.append({
                        "page_num": 1,
                        "text": full_text,
                        "lines": lines,
                        "confidence": 1.0
                    })
            except Exception as e:
                warnings.append(f"Text read error: {str(e)}")

        processing_time_ms = round((time.time() - start_time) * 1000, 2)

        status = "OCR_SUCCESS"
        if not full_text or len(full_text.strip()) == 0:
            status = "OCR_EMPTY_RESULT"
            full_text = f"No legible text could be extracted from {file_path.name}"
            warnings.append("OCR found no readable alphanumeric characters.")
        elif confidence < 0.60:
            status = "OCR_LOW_CONFIDENCE"
            warnings.append("Low confidence character recognition.")

        words_count = len(full_text.split()) if full_text else 0
        chars_count = len(full_text) if full_text else 0

        return {
            "status": status,
            "text": full_text.strip(),
            "pages": pages_output,
            "lines": all_lines,
            "confidence": round(confidence, 3),
            "source_type": source_type,
            "engine_used": engine_used,
            "stats": {
                "word_count": words_count,
                "character_count": chars_count,
                "line_count": len(all_lines),
                "pages_count": len(pages_output) or 1
            },
            "processing_time_ms": processing_time_ms,
            "warnings": warnings
        }


# Global singleton instance
ocr_engine = OCREngine()

