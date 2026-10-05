The good news is that we do not put the model weights inside the Git repository. For Kaagaz, the clean approach is:

Kaagaz Git Repository
        │
        ├── application code
        ├── prompts
        ├── schemas
        ├── model configuration
        └── setup scripts
                │
                ▼
             Ollama
                │
                ▼
        Downloads model weights
                │
                ▼
       Local machine model store
                │
                ▼
             Gemma

Ollama already provides Gemma models and exposes a local API; for example, its Gemma library supports commands such as ollama run gemma:2b and ollama run gemma:7b.

And there's an important update compared with the older architecture: Ollama now has Gemma 4 models, including multimodal variants that support text + images. That matters a lot for Kaagaz because household documents can be scanned PDFs or photographs rather than clean text PDFs.

1. What models do we actually need?

I would structure Kaagaz around one primary model initially, rather than downloading five different models.

Primary model — document understanding

Gemma 4

This is particularly interesting for Kaagaz because current Ollama listings describe Gemma 4 as supporting multimodal understanding, with text + image variants available.

Conceptually:

                    KAAGAZ AI
                       │
                       ▼
                Gemma 4 Local
                 /          \
                /            \
        Text documents     Images/scans
              │                 │
              ▼                 ▼
        Text extraction    Visual understanding
              \                 /
               \               /
                ▼             ▼
                  Structured JSON
                       │
                       ▼
                    Pydantic

This gives us a much cleaner architecture than having one model for OCR, another for classification, another for extraction, etc.

2. But don't download Gemma immediately

This is important.

Antigravity should first inspect the machine.

We don't know from the architecture file exactly what GPU/RAM/VRAM your current machine has.

So the setup process should be:

Check hardware
      ↓
Check Ollama
      ↓
Check available models
      ↓
Select appropriate Gemma variant
      ↓
Pull model
      ↓
Run inference test
      ↓
Benchmark
      ↓
Lock configuration

That prevents us from accidentally installing a ~10–20 GB model that runs terribly on the development machine.

For example, Ollama currently lists several Gemma 4 sizes, including approximately:

gemma4:e2b — ~7.2 GB
gemma4:e4b — ~9.6 GB
gemma4:12b — ~7.6 GB
gemma4:26b — ~19 GB
gemma4:31b — ~20 GB

with the available variants differing in capabilities and quantization.

So the exact model should be selected after checking your hardware, not hard-coded blindly.

3. How the model gets into the project

This is the key distinction:

❌ Don't do this
kaagaz/
└── models/
    └── gemma-xxxxx.gguf

We don't want multi-GB model weights inside GitHub.

✅ Do this
kaagaz/
│
├── backend/
├── frontend/
├── samples/
├── eval/
├── scripts/
│   └── setup_models.ps1
│
├── .env.example
├── model-config.example.json
└── architectural_flow.md

The repository contains instructions/configuration, while Ollama manages the actual model.

For example:

OLLAMA_BASE_URL=http://localhost:11434
KAAGAZ_MODEL=gemma4:e4b

Then:

setup script
      ↓
ollama pull gemma4:e4b
      ↓
model installed locally

The model weights stay outside the repository.

4. What happens when someone clones Kaagaz?

Eventually, we want this experience:

git clone <kaagaz-repository>

cd kaagaz

# install backend
...

# install frontend
...

# install/check Ollama
...

# install Kaagaz model
ollama pull gemma4:e4b

# start application
...

Then Kaagaz detects:

Ollama: ✓
Model: gemma4:e4b ✓
Backend: ✓
Database: ✓

and starts.

That's much better for an open-source project because someone can reproduce the AI environment without us committing model weights.

5. We should add a dedicated Model Setup Guide

I recommend adding:

docs/
└── MODEL_SETUP.md

This should become the definitive guide for installing the AI layer.

I'd structure it like this:

MODEL_SETUP.md

1. Why Kaagaz uses local models
2. Ollama installation
3. Hardware requirements
4. Model selection
5. Installing Gemma
6. Verifying the model
7. Testing inference
8. Connecting FastAPI to Ollama
9. Model configuration
10. Troubleshooting
11. Model licensing
12. Reproducing the environment
6. Step-by-step installation

For Windows, the basic model flow is extremely simple.

Install Ollama, then verify:

ollama --version

Check installed models:

ollama list

Then pull the selected model:

ollama pull gemma4:e4b

And test:

ollama run gemma4:e4b

Ollama's model library provides the model commands and local API integration directly.

Then:

You
 ↓
Ollama
 ↓
Gemma
 ↓
response

No API key is required for the local inference path.

7. How FastAPI communicates with the model

Our backend shouldn't execute shell commands like:

subprocess.run("ollama run ...")

for every document.

Instead:

FastAPI
   │
   │ HTTP
   ▼
Ollama
   │
   ▼
Gemma

Ollama exposes a local API, and its official model page shows API usage through localhost:11434.

So our provider becomes:

class OllamaGemmaProvider(AIProvider):

    def classify_document(...):
        ...

    def extract_document(...):
        ...

    def answer_question(...):
        ...

Internally:

OllamaGemmaProvider
       │
       ▼
http://localhost:11434
       │
       ▼
gemma4:e4b

This is much cleaner.

8. The important part: model configuration

I want Antigravity to create something like:

# AI
OLLAMA_BASE_URL=http://localhost:11434
KAAGAZ_MODEL=gemma4:e4b
KAAGAZ_AI_ENABLED=true

And in Python:

config.py

reads:

OLLAMA_BASE_URL
KAAGAZ_MODEL

rather than having:

MODEL = "gemma4:e4b"

scattered across the project.

This means later we can change:

gemma4:e4b

to:

gemma4:12b

without rewriting the application.

9. What about OCR?

This is where we need to be careful.

There are two different problems:

Problem A — extracting text from a normal PDF

Use deterministic PDF extraction.

PDF
 ↓
PyMuPDF
 ↓
text
 ↓
Gemma
Problem B — scanned/photo document
JPG
 ↓
Gemma multimodal
 ↓
structured extraction

or:

scanned PDF
 ↓
render page
 ↓
image
 ↓
Gemma vision
 ↓
structured extraction

This is why the newer multimodal Gemma 4 family is attractive for the project. Ollama's current listing explicitly describes Gemma 4 as supporting image input/multimodal understanding.

We shouldn't unnecessarily create an OCR-model dependency unless our evaluation shows that we actually need one.

10. Do we need an embedding model?

Not initially.

The architecture has an optional assistant, but we shouldn't build RAG immediately.

For TASK 001–005:

Gemma
+
PDF/text extraction
+
Pydantic

is enough.

Later, if we implement:

"Why was my bill higher?"

or:

"Which document expires next?"

we can first query our structured SQLite data.

We don't automatically need embeddings.

If later we need semantic search across large document collections, then we can add an open embedding model.

But that should be a measured requirement, not an architecture trophy.

11. Do we need a second model?

Potentially, later.

The architecture can eventually become:

                 Kaagaz AI
                    │
        ┌───────────┴───────────┐
        │                       │
   Gemma 4                    Embedding
        │                       │
 document understanding    semantic search
        │                       │
        └───────────┬───────────┘
                    │
                  Kaagaz

But do not install the embedding model now.

12. Model licensing also needs to be documented

This is important for an open-source submission.

The repository should contain a section explaining:

Model:
Gemma

Provider:
Google DeepMind

Runtime:
Ollama

License/terms:
Gemma Terms of Use

The Ollama Gemma listing identifies the model as a Gemma model developed by Google/DeepMind and links the applicable Gemma terms.

We should not copy model weights into our repository or imply that Kaagaz owns the model.

Instead:

Kaagaz uses the model through a local Ollama runtime.

That's a much cleaner open-source story.

13. This also makes the Hacktoberfest story stronger

This isn't just an implementation detail.

Our architecture can honestly demonstrate:

                KAAGAZ
                  │
       ┌──────────┴──────────┐
       │                     │
   Open Source           Open Source
   Application            AI Runtime
       │                     │
 React/FastAPI             Ollama
       │                     │
       └──────────┬──────────┘
                  │
                Gemma
                  │
                  ▼
          Local document AI

The user can take a household bill and have:

PDF
 ↓
Local processing
 ↓
Local Gemma
 ↓
Structured facts
 ↓
Local database
 ↓
Actions

without uploading the household document to a third-party AI API.

That's a real technical choice, rather than simply saying "we used AI."

14. I would add this to the Antigravity master prompt

The previous master prompt needs a MODEL MANAGEMENT section.

Add this immediately after the AI stack section:

Kaagaz — Open-Source Model Management Instructions for Antigravity
OPEN-SOURCE MODEL MANAGEMENT

Kaagaz uses locally hosted open-weight models through Ollama.

The model weights are NOT part of the Git repository.

The repository contains:

model configuration
setup scripts
prompts
provider implementation
model health checks
documentation
evaluation data
model/version metadata

Ollama manages the actual model weights on the developer's machine.

1. MODEL RUNTIME

Primary runtime:

Ollama

Default local endpoint:

http://localhost:11434

Do not invoke model inference by repeatedly spawning shell processes.

The application should communicate with Ollama through its local API.

2. PRIMARY MODEL

The primary document-understanding model is:

Gemma family

Prefer a current multimodal Gemma model compatible with the developer's hardware because Kaagaz must eventually support:

text PDFs
scanned PDFs
photographs
document images

The exact model tag must NOT be hard-coded until hardware and Ollama availability have been inspected.

Examples of possible model configurations include:

gemma4:e2b
gemma4:e4b
gemma4:12b

Select the smallest model that provides acceptable extraction quality for the available development hardware.

Do not automatically download the largest model.

3. HARDWARE CHECK BEFORE MODEL INSTALLATION

Before pulling a model, inspect:

OS
CPU
RAM
GPU
VRAM
available disk space
Ollama version
existing Ollama models

Then determine an appropriate Gemma variant.

Never silently install a large model without checking available storage and hardware.

4. MODEL INSTALLATION

The setup workflow should use Ollama.

Example:

ollama pull <SELECTED_GEMMA_MODEL>

Then verify:

ollama list

Then perform an actual inference test:

ollama run <SELECTED_GEMMA_MODEL>

Do not mark the AI environment as ready until the inference test succeeds.

5. MODEL CONFIGURATION

Do not scatter model names through the source code.

Use configuration:

OLLAMA_BASE_URL=http://localhost:11434
KAAGAZ_MODEL=<SELECTED_GEMMA_MODEL>
KAAGAZ_AI_ENABLED=true

The Python application must read these through the centralized configuration layer.

6. MODEL HEALTH CHECK

The backend should eventually be able to determine:

Ollama reachable?
Model installed?
Model name configured?
Model inference working?

The application should distinguish:

OLLAMA_UNAVAILABLE
MODEL_NOT_INSTALLED
MODEL_MISCONFIGURED
MODEL_INFERENCE_FAILED
AI_READY

Do not display "AI ready" merely because the Ollama URL exists.

7. MODEL SETUP SCRIPT

Create a developer setup script when appropriate:

scripts/
└── setup_models.ps1

The script should:

Check whether Ollama is installed.
Check whether Ollama is running.
Read the configured model.
Check whether the model exists locally.
Pull it if missing.
Verify the model.
Run a small smoke test.
Report the result.

The script must not download a model every time it runs.

8. MODEL WEIGHTS MUST NEVER BE COMMITTED

Never commit:

*.gguf
model weights
Ollama model storage
large model binaries

to the Git repository.

Add appropriate rules to .gitignore.

9. MODEL VERSION RECORDING

Record the selected model in project documentation.

At minimum record:

model name
model tag
runtime
Ollama version
date tested
hardware used

Do not claim benchmark numbers until they have actually been measured.

10. DOCUMENT PROCESSING

Use deterministic text extraction when a PDF already contains machine-readable text.

Conceptual pipeline:

Text PDF
   ↓
PDF text extraction
   ↓
Gemma

For scanned/image documents:

Scanned PDF / Image
        ↓
page rendering / image processing
        ↓
multimodal Gemma
        ↓
structured extraction

Do not add a separate OCR model unless evaluation demonstrates that it is required.

11. FUTURE MODELS

Do NOT install embedding, reranking, OCR, speech, or other models during TASK 001–005 unless explicitly required by the current task.

Future model categories may include:

Embedding model
OCR model
Speech model
Reranker
Specialized document model

These must be introduced only when a concrete product requirement requires them.

12. AI PROVIDER ABSTRACTION

The application must not depend directly on Ollama throughout the codebase.

Use:

AIProvider
    ↓
OllamaGemmaProvider
    ↓
Ollama
    ↓
Gemma

This ensures that the application can later support another local provider/model without rewriting the document-processing architecture.

13. MODEL FAILURE MUST BE HONEST

If:

Ollama is unavailable

or:

Gemma is not installed

the application must report the actual state.

Never:

fabricate AI output
fall back to a cloud model silently
return fake extraction
claim local processing when the document was sent elsewhere
14. REPRODUCIBILITY

A fresh developer should eventually be able to:

clone repository
      ↓
install dependencies
      ↓
install Ollama
      ↓
run setup_models
      ↓
Gemma installed locally
      ↓
start backend
      ↓
start frontend
      ↓
process sample document

The setup process should be documented in:

docs/MODEL_SETUP.md
15. OPEN-SOURCE DISCLOSURE

README documentation must clearly state:

Kaagaz is the application.
Ollama is the local model runtime.
Gemma is the underlying model family.
Model weights are downloaded separately.
Model terms/licenses apply separately from Kaagaz's source code.
Kaagaz does not claim ownership of the model.

Do not bundle or redistribute model weights unless explicitly permitted by the applicable model terms.

16. FIRST IMPLEMENTATION MILESTONE

For TASK 003, the success condition is:

Ollama running
        ↓
Selected Gemma model installed
        ↓
FastAPI connects to Ollama
        ↓
Kaagaz sends a test prompt
        ↓
Gemma returns a real response
        ↓
Kaagaz successfully parses it

Only after this works should the document extraction pipeline depend on Gemma.

One change I would make to our original architecture

There's one thing I would upgrade from the original architectural_flow.md:

Instead of treating the model as simply “Gemma via Ollama”, make the architecture explicitly:

Local multimodal Gemma + deterministic document preprocessing + Pydantic validation.

That gives us:

                 DOCUMENT
                    │
          ┌─────────┴─────────┐
          │                   │
     Text PDF             Image/Scan
          │                   │
     PyMuPDF             Page/Image
          │                   │
          └─────────┬─────────┘
                    ▼
             Gemma via Ollama
                    │
                    ▼
             Structured JSON
                    │
                    ▼
              Pydantic
                    │
                    ▼
          User Verification
                    │
                    ▼
              SQLite
                    │
                    ▼
        Deterministic Rule Engine

This is a much stronger technical architecture for Kaagaz than simply saying “we use an LLM.”

And importantly, we shouldn't download multiple models just to make the project look more AI-heavy. Start with one strong local Gemma model, benchmark it on our actual electricity bills/warranties/notices, and only add OCR/embedding/specialized models if the evaluation demonstrates a real gap. That keeps the system explainable, reproducible, and lightweight.S