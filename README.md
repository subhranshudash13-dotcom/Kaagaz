# Kaagaz — Life Admin Copilot 📄⚡

> **Turn messy household documents into clear, actionable things a person needs to know, remember, and do.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Ollama Gemma 2](https://img.shields.io/badge/Ollama-Gemma%202-FF6F00.svg?logo=google&logoColor=white)](https://ollama.com)
[![Privacy First](https://img.shields.io/badge/Privacy-Local%20Only-4CAF50.svg)](https://github.com/subhranshudash13-dotcom/Kaagaz)

---

## 🌟 The Problem & North Star

People accumulate endless stacks of paperwork: **electricity & utility bills, insurance policies, equipment warranties, tuition notices, municipal tax letters, and medical invoices**.

The core problem is **not** simply that these documents are tedious to read. **The real problem is that critical information is trapped inside documents, while you need to think in terms of actions, deadlines, money, and decisions.**

**Kaagaz bridges this gap with a privacy-first, local-first architecture.**

```
┌─────────────────┐       ┌──────────────────────┐       ┌────────────────────────┐
│  Messy Document │ ────> │ Open-Source AI (OCR) │ ────> │  Deterministic Engine  │
│  (PDF / Image)  │       │ (Gemma 2 via Ollama) │       │ (Dates, Rules, Money)  │
└─────────────────┘       └──────────────────────┘       └────────────────────────┘
                                                                     │
                                                                     ▼
                                                         ┌────────────────────────┐
                                                         │   Actionable Copilot   │
                                                         │ (Todos, Insights, Q&A) │
                                                         └────────────────────────┘
```

---

## 🏛️ Core Architecture Principle

> **"The model understands documents. Code makes decisions."**

- **Open-source AI (Gemma 2)** handles semantic interpretation, visual OCR extraction, entity resolution, and document classification.
- **Deterministic code** enforces business logic, date calculations, late fee penalties, threshold alerts, and recurring action schedules.
- **Strict Privacy**: Your sensitive paperwork, personal data, and financial figures remain on your own machine/server—never uploaded to commercial third-party cloud LLMs.

---

## ✨ Key Capabilities

| Feature | Description |
| :--- | :--- |
| 📑 **Multi-Format Extraction** | Scans PDFs, images, and text files. Extracts verified amounts, due dates, billing periods, account IDs, and issuers. |
| ⏱️ **Urgency & Action Engine** | Categorizes tasks into `CRITICAL`, `UPCOMING`, and `RESOLVED` with dynamic countdowns and penalty prevention. |
| 💼 **Family Briefcase** | Organizes documents by household members, categories (Utilities, Healthcare, Education, Legal, Financial), and tags. |
| 📊 **Trend & Anomaly Analysis** | Compares current consumption/costs against previous bills, flagging abnormal spikes or tariff changes. |
| 💬 **"Ask Kaagaz" AI Assistant** | Grounded question-answering over your verified document archive with zero hallucinations. |
| 🔍 **Pipeline Traceability** | Inspect OCR confidence, raw extracted JSON, token latency, and classification reasoning for every document. |

---

## 🗂️ Project Structure

```
Kaagaz/
├── Architecture.md           # Exhaustive system design and execution specs
├── LLM_integration.md        # AI prompt templates & Gemma 2 Ollama specs
├── docker-compose.yml        # Full-stack container orchestration
├── .env.example              # Environment variable template
├── backend/
│   ├── Dockerfile            # Production Python container (with Tesseract)
│   ├── requirements.txt      # Python dependencies (FastAPI, SQLAlchemy, PyPDF)
│   └── app/
│       ├── ai/               # Ollama / Gemma 2 provider & Smart Assistant
│       ├── analytics/        # Financial trends & consumption forecasting
│       ├── extraction/       # OCR engine, document classification & schemas
│       ├── routes/           # REST endpoints (documents, todo, assistant, health)
│       ├── rules/            # Deterministic business logic & urgency calculation
│       ├── services/         # Storage and document processing pipelines
│       ├── telemetry/        # Pipeline tracers and latency profiling
│       └── main.py           # FastAPI entrypoint
├── frontend/
│   ├── Dockerfile            # Multi-stage Nginx + Vite React build
│   ├── nginx.conf            # Reverse proxy configuration
│   ├── package.json          # UI dependencies (React 19, Tailwind CSS, Lucide)
│   └── src/
│       ├── components/       # Dashboard, Actions, AskKaagaz, Family Briefcase
│       ├── types.ts          # TypeScript type definitions
│       └── App.tsx           # Main application root
├── eval/                     # Model benchmarking & automated evaluation suite
│   ├── dataset_generator.py  # Synthetic test data generation
│   ├── run_eval.py           # Field-level extraction scoring
│   └── run_tinker_benchmark.py
└── samples/                  # Real-world test documents (bills, notices, warranties)
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & `npm`
- **Tesseract OCR** (optional for scanned images)
- **Ollama** (for local AI inference with `gemma2:2b` or `gemma2:9b`)

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Backend will be live at `http://127.0.0.1:8000` (API Docs at `http://127.0.0.1:8000/docs`).

---

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend will be accessible at `http://localhost:5173`.

---

### 3. Setup Local AI (Ollama + Gemma 2)

```bash
# Install Ollama from https://ollama.com, then pull Gemma 2
ollama pull gemma2:2b

# Verify Ollama is running
curl http://localhost:11434/api/tags
```

---

## 🐳 Docker Deployment (Local / Production)

Run the entire stack (Frontend + Backend + Ollama) with a single command:

```bash
docker compose up -d --build
```

- **Frontend**: `http://localhost`
- **Backend API**: `http://localhost:8000`
- **Ollama Service**: `http://localhost:11434`

Pull the model inside the Ollama container:
```bash
docker exec -it kaagaz-ollama ollama pull gemma2:2b
```

---

## 🧪 Testing & Evaluation Benchmark


Kaagaz includes an automated benchmarking harness to measure OCR extraction precision, recall, and field-level accuracy.

```bash
# Run backend test suite
cd backend
pytest -v

# Run document extraction benchmark
cd ../eval
python run_eval.py

# Run Tinker model evaluation
python run_tinker_benchmark.py
```

---

## ⚙️ Environment Variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `HOST` | `127.0.0.1` | Host address for backend |
| `PORT` | `8000` | Port for backend server |
| `DATABASE_URL` | `sqlite:///./data/db/kaagaz.db` | SQLite or PostgreSQL connection URI |
| `STORAGE_DIR` | `./data/documents` | Directory for uploaded documents |
| `THUMBNAILS_DIR` | `./data/thumbnails` | Directory for generated thumbnails |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama instance API endpoint |
| `OLLAMA_MODEL` | `gemma2:2b` | Target LLM model for extraction & Q&A |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
