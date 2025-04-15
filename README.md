# CasaLingua – Where Language Feels Like Home



**Version:** 0.20.1  
**Author:** TEAM 1 – James Wilson  
**License:** MIT

---

## 🌐 About CasaLingua
CasaLingua is a fully offline, ethical AI system for simplifying and translating complex housing-related documents into accessible formats. It supports multilingual access, human-in-the-loop editing, PII masking, and integration with platforms like Bloom Housing.

---

## 🚀 Features
- 📄 Legal document simplification (LLM)
- 🌍 Translation (MarianMT or NLLB)
- 🔐 PII detection and redaction
- 🧑‍⚖️ Reviewer edits and compliance flagging
- 🖥️ Flask GUI for testing + Admin Panel
- 📊 CLI diagnostics with environment detection
- 💬 Redis-backed session tracking
- 🤖 Fastlane parallel AI pipelines

---

## 📦 Setup Instructions

Collecting fastapi
  Using cached fastapi-0.115.12-py3-none-any.whl (95 kB)
Collecting uvicorn
  Using cached uvicorn-0.34.1-py3-none-any.whl (62 kB)
Collecting flask
  Using cached flask-3.1.0-py3-none-any.whl (102 kB)
Collecting transformers
  Downloading transformers-4.51.3-py3-none-any.whl (10.4 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 10.4/10.4 MB 82.8 MB/s eta 0:00:00
Collecting sentencepiece
  Downloading sentencepiece-0.2.0-cp310-cp310-macosx_11_0_arm64.whl (1.2 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 1.2/1.2 MB 62.6 MB/s eta 0:00:00
Collecting spacy
  Downloading spacy-3.8.5-cp310-cp310-macosx_11_0_arm64.whl (6.3 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 6.3/6.3 MB 91.9 MB/s eta 0:00:00
Collecting textstat
  Using cached textstat-0.7.5-py3-none-any.whl (105 kB)
Collecting openai-whisper
  Downloading openai-whisper-20240930.tar.gz (800 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 800.5/800.5 kB 68.1 MB/s eta 0:00:00
  Installing build dependencies: started
  Installing build dependencies: finished with status 'done'
  Getting requirements to build wheel: started
  Getting requirements to build wheel: finished with status 'done'
  Preparing metadata (pyproject.toml): started
  Preparing metadata (pyproject.toml): finished with status 'done'
Collecting pytesseract
  Downloading pytesseract-0.3.13-py3-none-any.whl (14 kB)
Collecting opencv-python
  Using cached opencv_python-4.11.0.86-cp37-abi3-macosx_13_0_arm64.whl (37.3 MB)
Collecting langdetect
  Downloading langdetect-1.0.9.tar.gz (981 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 981.5/981.5 kB 71.7 MB/s eta 0:00:00
  Preparing metadata (setup.py): started
  Preparing metadata (setup.py): finished with status 'done'
Collecting langcodes
  Using cached langcodes-3.5.0-py3-none-any.whl (182 kB)
Collecting redis
  Downloading redis-5.2.1-py3-none-any.whl (261 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 261.5/261.5 kB 37.2 MB/s eta 0:00:00
Collecting python-multipart
  Using cached python_multipart-0.0.20-py3-none-any.whl (24 kB)
Collecting python-dotenv
  Using cached python_dotenv-1.1.0-py3-none-any.whl (20 kB)
Collecting pymupdf
  Downloading pymupdf-1.25.5-cp39-abi3-macosx_11_0_arm64.whl (18.6 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 18.6/18.6 MB 93.4 MB/s eta 0:00:00
Collecting rich
  Using cached rich-14.0.0-py3-none-any.whl (243 kB)
Collecting starlette<0.47.0,>=0.40.0
  Using cached starlette-0.46.2-py3-none-any.whl (72 kB)
Collecting pydantic!=1.8,!=1.8.1,!=2.0.0,!=2.0.1,!=2.1.0,<3.0.0,>=1.7.4
  Using cached pydantic-2.11.3-py3-none-any.whl (443 kB)
Collecting typing-extensions>=4.8.0
  Using cached typing_extensions-4.13.2-py3-none-any.whl (45 kB)
Collecting click>=7.0
  Using cached click-8.1.8-py3-none-any.whl (98 kB)
Collecting h11>=0.8
  Using cached h11-0.14.0-py3-none-any.whl (58 kB)
Collecting itsdangerous>=2.2
  Using cached itsdangerous-2.2.0-py3-none-any.whl (16 kB)
Collecting Jinja2>=3.1.2
  Using cached jinja2-3.1.6-py3-none-any.whl (134 kB)
Collecting Werkzeug>=3.1
  Using cached werkzeug-3.1.3-py3-none-any.whl (224 kB)
Collecting blinker>=1.9
  Using cached blinker-1.9.0-py3-none-any.whl (8.5 kB)
Collecting regex!=2019.12.17
  Using cached regex-2024.11.6-cp310-cp310-macosx_11_0_arm64.whl (284 kB)
Collecting huggingface-hub<1.0,>=0.30.0
  Using cached huggingface_hub-0.30.2-py3-none-any.whl (481 kB)
Collecting pyyaml>=5.1
  Using cached PyYAML-6.0.2-cp310-cp310-macosx_11_0_arm64.whl (171 kB)
Collecting tokenizers<0.22,>=0.21
  Using cached tokenizers-0.21.1-cp39-abi3-macosx_11_0_arm64.whl (2.7 MB)
Collecting requests
  Using cached requests-2.32.3-py3-none-any.whl (64 kB)
Collecting filelock
  Using cached filelock-3.18.0-py3-none-any.whl (16 kB)
Collecting safetensors>=0.4.3
  Using cached safetensors-0.5.3-cp38-abi3-macosx_11_0_arm64.whl (418 kB)
Collecting numpy>=1.17
  Using cached numpy-2.2.4-cp310-cp310-macosx_14_0_arm64.whl (5.4 MB)
Collecting packaging>=20.0
  Using cached packaging-24.2-py3-none-any.whl (65 kB)
Collecting tqdm>=4.27
  Using cached tqdm-4.67.1-py3-none-any.whl (78 kB)
Collecting srsly<3.0.0,>=2.4.3
  Downloading srsly-2.5.1-cp310-cp310-macosx_11_0_arm64.whl (634 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 634.4/634.4 kB 53.7 MB/s eta 0:00:00
Collecting typer<1.0.0,>=0.3.0
  Downloading typer-0.15.2-py3-none-any.whl (45 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 45.1/45.1 kB 4.9 MB/s eta 0:00:00
Collecting spacy-legacy<3.1.0,>=3.0.11
  Using cached spacy_legacy-3.0.12-py2.py3-none-any.whl (29 kB)
Collecting cymem<2.1.0,>=2.0.2
  Downloading cymem-2.0.11-cp310-cp310-macosx_11_0_arm64.whl (41 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 41.7/41.7 kB 5.8 MB/s eta 0:00:00
Collecting weasel<0.5.0,>=0.1.0
  Using cached weasel-0.4.1-py3-none-any.whl (50 kB)
Collecting spacy-loggers<2.0.0,>=1.0.0
  Using cached spacy_loggers-1.0.5-py3-none-any.whl (22 kB)
Collecting thinc<8.4.0,>=8.3.4
  Downloading thinc-8.3.6-cp310-cp310-macosx_11_0_arm64.whl (844 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 844.9/844.9 kB 49.7 MB/s eta 0:00:00
Collecting catalogue<2.1.0,>=2.0.6
  Using cached catalogue-2.0.10-py3-none-any.whl (17 kB)
Collecting preshed<3.1.0,>=3.0.2
  Downloading preshed-3.0.9-cp310-cp310-macosx_11_0_arm64.whl (127 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 127.8/127.8 kB 12.9 MB/s eta 0:00:00
Requirement already satisfied: setuptools in ./.venv/lib/python3.10/site-packages (from spacy->-r requirements.txt (line 14)) (65.5.0)
Collecting wasabi<1.2.0,>=0.9.1
  Using cached wasabi-1.1.3-py3-none-any.whl (27 kB)
Collecting murmurhash<1.1.0,>=0.28.0
  Downloading murmurhash-1.0.12-cp310-cp310-macosx_11_0_arm64.whl (26 kB)
Collecting cmudict
  Using cached cmudict-1.0.32-py3-none-any.whl (939 kB)
Collecting pyphen
  Using cached pyphen-0.17.2-py3-none-any.whl (2.1 MB)
Collecting more-itertools
  Downloading more_itertools-10.6.0-py3-none-any.whl (63 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 63.0/63.0 kB 7.2 MB/s eta 0:00:00
Collecting tiktoken
  Downloading tiktoken-0.9.0-cp310-cp310-macosx_11_0_arm64.whl (1.0 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 1.0/1.0 MB 66.3 MB/s eta 0:00:00
Collecting torch
  Using cached torch-2.6.0-cp310-none-macosx_11_0_arm64.whl (66.5 MB)
Collecting numba
  Downloading numba-0.61.2-cp310-cp310-macosx_11_0_arm64.whl (2.8 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 2.8/2.8 MB 87.0 MB/s eta 0:00:00
Collecting Pillow>=8.0.0
  Downloading pillow-11.2.1-cp310-cp310-macosx_11_0_arm64.whl (3.0 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 3.0/3.0 MB 87.0 MB/s eta 0:00:00
Collecting six
  Using cached six-1.17.0-py2.py3-none-any.whl (11 kB)
Collecting language-data>=1.2
  Using cached language_data-1.3.0-py3-none-any.whl (5.4 MB)
Collecting async-timeout>=4.0.3
  Downloading async_timeout-5.0.1-py3-none-any.whl (6.2 kB)
Collecting pygments<3.0.0,>=2.13.0
  Using cached pygments-2.19.1-py3-none-any.whl (1.2 MB)
Collecting markdown-it-py>=2.2.0
  Using cached markdown_it_py-3.0.0-py3-none-any.whl (87 kB)
Collecting fsspec>=2023.5.0
  Using cached fsspec-2025.3.2-py3-none-any.whl (194 kB)
Collecting MarkupSafe>=2.0
  Using cached MarkupSafe-3.0.2-cp310-cp310-macosx_11_0_arm64.whl (12 kB)
Collecting marisa-trie>=1.1.0
  Downloading marisa_trie-1.2.1-cp310-cp310-macosx_11_0_arm64.whl (174 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 174.7/174.7 kB 22.3 MB/s eta 0:00:00
Collecting mdurl~=0.1
  Using cached mdurl-0.1.2-py3-none-any.whl (10.0 kB)
Collecting typing-inspection>=0.4.0
  Using cached typing_inspection-0.4.0-py3-none-any.whl (14 kB)
Collecting pydantic-core==2.33.1
  Using cached pydantic_core-2.33.1-cp310-cp310-macosx_11_0_arm64.whl (1.9 MB)
Collecting annotated-types>=0.6.0
  Using cached annotated_types-0.7.0-py3-none-any.whl (13 kB)
Collecting certifi>=2017.4.17
  Using cached certifi-2025.1.31-py3-none-any.whl (166 kB)
Collecting idna<4,>=2.5
  Using cached idna-3.10-py3-none-any.whl (70 kB)
Collecting charset-normalizer<4,>=2
  Using cached charset_normalizer-3.4.1-cp310-cp310-macosx_10_9_universal2.whl (198 kB)
Collecting urllib3<3,>=1.21.1
  Using cached urllib3-2.4.0-py3-none-any.whl (128 kB)
Collecting anyio<5,>=3.6.2
  Using cached anyio-4.9.0-py3-none-any.whl (100 kB)
Collecting blis<1.4.0,>=1.3.0
  Downloading blis-1.3.0-cp310-cp310-macosx_11_0_arm64.whl (1.3 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 1.3/1.3 MB 72.0 MB/s eta 0:00:00
Collecting confection<1.0.0,>=0.0.1
  Using cached confection-0.1.5-py3-none-any.whl (35 kB)
Collecting shellingham>=1.3.0
  Using cached shellingham-1.5.4-py2.py3-none-any.whl (9.8 kB)
Collecting cloudpathlib<1.0.0,>=0.7.0
  Downloading cloudpathlib-0.21.0-py3-none-any.whl (52 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 52.7/52.7 kB 8.4 MB/s eta 0:00:00
Collecting smart-open<8.0.0,>=5.2.1
  Using cached smart_open-7.1.0-py3-none-any.whl (61 kB)
Collecting importlib-metadata>=5
  Using cached importlib_metadata-8.6.1-py3-none-any.whl (26 kB)
Collecting importlib-resources>=5
  Using cached importlib_resources-6.5.2-py3-none-any.whl (37 kB)
Collecting llvmlite<0.45,>=0.44.0dev0
  Downloading llvmlite-0.44.0-cp310-cp310-macosx_11_0_arm64.whl (26.2 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 26.2/26.2 MB 88.1 MB/s eta 0:00:00
Collecting networkx
  Using cached networkx-3.4.2-py3-none-any.whl (1.7 MB)
Collecting sympy==1.13.1
  Using cached sympy-1.13.1-py3-none-any.whl (6.2 MB)
Collecting mpmath<1.4,>=1.1.0
  Using cached mpmath-1.3.0-py3-none-any.whl (536 kB)
Collecting exceptiongroup>=1.0.2
  Using cached exceptiongroup-1.2.2-py3-none-any.whl (16 kB)
Collecting sniffio>=1.1
  Using cached sniffio-1.3.1-py3-none-any.whl (10 kB)
Collecting zipp>=3.20
  Using cached zipp-3.21.0-py3-none-any.whl (9.6 kB)
Collecting wrapt
  Using cached wrapt-1.17.2-cp310-cp310-macosx_11_0_arm64.whl (38 kB)
Building wheels for collected packages: openai-whisper
  Building wheel for openai-whisper (pyproject.toml): started
  Building wheel for openai-whisper (pyproject.toml): finished with status 'done'
  Created wheel for openai-whisper: filename=openai_whisper-20240930-py3-none-any.whl size=803405 sha256=0ac0187af84044ff94371850eb7e9a39efe008f1831c75a366629479ea6f6987
  Stored in directory: /Users/jameswilson/Library/Caches/pip/wheels/dd/4a/1f/d1c4bf3b9133c8168fe617ed979cab7b14fe381d059ffb9d83
Successfully built openai-whisper
Installing collected packages: sentencepiece, mpmath, cymem, zipp, wrapt, wasabi, urllib3, typing-extensions, tqdm, sympy, spacy-loggers, spacy-legacy, sniffio, six, shellingham, safetensors, regex, pyyaml, python-multipart, python-dotenv, pyphen, pymupdf, pygments, Pillow, packaging, numpy, networkx, murmurhash, more-itertools, mdurl, MarkupSafe, marisa-trie, llvmlite, itsdangerous, importlib-resources, idna, h11, fsspec, filelock, exceptiongroup, click, charset-normalizer, certifi, catalogue, blinker, async-timeout, annotated-types, Werkzeug, uvicorn, typing-inspection, srsly, smart-open, requests, redis, pytesseract, pydantic-core, preshed, opencv-python, numba, markdown-it-py, language-data, langdetect, Jinja2, importlib-metadata, cloudpathlib, blis, anyio, torch, tiktoken, starlette, rich, pydantic, langcodes, huggingface-hub, flask, cmudict, typer, tokenizers, textstat, openai-whisper, fastapi, confection, weasel, transformers, thinc, spacy
  Running setup.py install for langdetect: started
  Running setup.py install for langdetect: finished with status 'done'
Successfully installed Jinja2-3.1.6 MarkupSafe-3.0.2 Pillow-11.2.1 Werkzeug-3.1.3 annotated-types-0.7.0 anyio-4.9.0 async-timeout-5.0.1 blinker-1.9.0 blis-1.3.0 catalogue-2.0.10 certifi-2025.1.31 charset-normalizer-3.4.1 click-8.1.8 cloudpathlib-0.21.0 cmudict-1.0.32 confection-0.1.5 cymem-2.0.11 exceptiongroup-1.2.2 fastapi-0.115.12 filelock-3.18.0 flask-3.1.0 fsspec-2025.3.2 h11-0.14.0 huggingface-hub-0.30.2 idna-3.10 importlib-metadata-8.6.1 importlib-resources-6.5.2 itsdangerous-2.2.0 langcodes-3.5.0 langdetect-1.0.9 language-data-1.3.0 llvmlite-0.44.0 marisa-trie-1.2.1 markdown-it-py-3.0.0 mdurl-0.1.2 more-itertools-10.6.0 mpmath-1.3.0 murmurhash-1.0.12 networkx-3.4.2 numba-0.61.2 numpy-2.2.4 openai-whisper-20240930 opencv-python-4.11.0.86 packaging-24.2 preshed-3.0.9 pydantic-2.11.3 pydantic-core-2.33.1 pygments-2.19.1 pymupdf-1.25.5 pyphen-0.17.2 pytesseract-0.3.13 python-dotenv-1.1.0 python-multipart-0.0.20 pyyaml-6.0.2 redis-5.2.1 regex-2024.11.6 requests-2.32.3 rich-14.0.0 safetensors-0.5.3 sentencepiece-0.2.0 shellingham-1.5.4 six-1.17.0 smart-open-7.1.0 sniffio-1.3.1 spacy-3.8.5 spacy-legacy-3.0.12 spacy-loggers-1.0.5 srsly-2.5.1 starlette-0.46.2 sympy-1.13.1 textstat-0.7.5 thinc-8.3.6 tiktoken-0.9.0 tokenizers-0.21.1 torch-2.6.0 tqdm-4.67.1 transformers-4.51.3 typer-0.15.2 typing-extensions-4.13.2 typing-inspection-0.4.0 urllib3-2.4.0 uvicorn-0.34.1 wasabi-1.1.3 weasel-0.4.1 wrapt-1.17.2 zipp-3.21.0

---

## 📁 Structure Overview

| Path                      | Description                                 |
|---------------------------|---------------------------------------------|
|                 | FastAPI launch point                         |
|                    | Flask GUI app for user testing               |
|            | Admin UI to change model settings + toggles  |
|               | LLM pipeline components                      |
|                    | API routing and schema validation            |
|                 | Reviewer tools with audit logging            |
|                | Session + context tracker (Redis)            |
|              | Jinja2 HTML for GUI + Admin Panel            |
|             | CLI environment report                       |
|             | Hardware-aware recommendations               |

---

## ❤️ Philosophy
> "Language should never be a barrier to safe housing."

CasaLingua exists to remove that barrier—ethically, securely, and beautifully.

---

## 📄 License
MIT
