# Angel Generator AI — Multi-Engine 4K Text-to-Image Studio

![Version](https://img.shields.io/badge/version-2.5.0-gold)
![Resolution](https://img.shields.io/badge/quality-up%20to%204K%20UHD%20(4096x4096)-red)
![Reasoning](https://img.shields.io/badge/mode-High%20Thinking%20AI-purple)
![Engines](https://img.shields.io/badge/engines-PyTorch%20%7C%20WebGL%20%7C%20Cloud%20Diffusion%20%7C%20Win64%20C-brightgreen)
![Platform](https://img.shields.io/badge/platform-Windows%20x64%20%7C%20Web%20%7C%20Desktop%20GUI-blue)

A complete, high-performance **Text-to-Image AI Generative Studio** specialized in **Angel, Celestial, Fantasy, and Sacred Artwork**, built with multiple generation methods, **instant stop control**, **live countdown timer**, **up to 4K Ultra-HD quality**, and **🧠 High Thinking** reasoning decomposition.

---

## 🌟 Key Features (v2.5)

- **Dual Interactive Interfaces**:
  - 🌐 **Interactive Web Studio** (`Start-AngelWeb.ps1` or double-click `web/index.html`)
  - 🖥️ **Native Desktop Window Studio** (`Start-AngelGUI.ps1`)
- **Generate & Stop Control**: Start generation with one click, or hit **⏹ Stop** at any moment to cancel or freeze the render at its current detail pass.
- **Live Progress & Estimated Time Remaining**: Real-time progress bar with live countdown display (`Estimated time: ~X.Xs remaining`).
- **Quality up to 4K Ultra-HD**:
  - `512 x 512` (Standard Draft)
  - `768 x 768` (Detailed)
  - `1024 x 1024` (HD Masterpiece)
  - `2048 x 2048` (2K Quad HD)
  - `3840 x 2160` (4K Widescreen UHD)
  - `4096 x 4096` (4K Ultra-HD Maximum Detail)
- **🧠 High Thinking Deep Reasoning Mode**:
  - Decomposes the prompt into theological archetypes.
  - Constructs multi-tiered feathered wing aerodynamics.
  - Computes volumetric god-ray light shafts with inverse-square falloff.
  - Synthesizes 4K micro-feather striations and displays the reasoning thoughts in real time.
- **Detail Level Multi-Pass Refinement**: Detail slider from Level 1 (Fast Draft) to Level 5 (4K Masterpiece).
- **PowerShell Automation Suite**: Native `AngelAI` module with pipeline cmdlets.

---

## 🚀 Quick Launch

### 1. Interactive Web Studio
```powershell
.\Start-AngelWeb.ps1
```
> Or open `web/index.html` directly in any web browser for offline client-side synthesis!

### 2. Native Desktop Window Studio
```powershell
.\Start-AngelGUI.ps1
```

### 3. Generate from PowerShell CLI
```powershell
Import-Module .\AngelAI.psm1

# 4K Ultra-HD Archangel with High Thinking
New-AngelImage -Prompt "Archangel Michael with glowing white feathered wings and golden halo" -Style Renaissance -Width 4096 -Height 4096 -Open

# Launch the Desktop GUI
Start-AngelGUI

# Launch the Web Studio
Start-AngelWeb
```

### 4. Interactive Windows Launcher
Double-click `run_windows.bat` for an interactive menu with all choices:
```
  [1] Launch Interactive Web Studio (Browser + Real-time Canvas)
  [2] Launch Desktop Window Studio (4K Ultra-HD & High Thinking GUI)
  [3] Generate 4K Archangel Artwork Now (PowerShell CLI)
  [4] Run Comprehensive Diagnostic Health Check
  [5] Run Native 64-bit Windows C Binary (AI_Image_Generator.exe)
```

---

## 📁 Project Structure

```
Angel_Generator_AI/
├── web/                           # 🌐 Interactive Web Studio
│   ├── index.html                 # Web interface with Generate/Stop, 4K, & High Thinking
│   ├── style.css                  # Celestial dark-and-gold styling & progress bars
│   └── app.js                     # Dual-mode synthesizer with live time countdown
│
├── src/                           # 🧠 Multi-Engine & Multi-Method Core
│   ├── gui_app.py                 # Native Desktop Window Studio (CustomTkinter)
│   ├── neural_engine.py           # PyTorch 4K coordinate field & High Thinking engine
│   ├── cloud_engine.py            # Diffusion API & Cloud provider integration
│   ├── angel_generator.py         # Master CLI tool & multi-engine bridge
│   ├── web_server.py              # Flask REST API server with /api/stop endpoint
│   ├── train_and_export_weights.py# Neural weight generator & vocabulary builder
│   └── ai_image_generator.c       # Native C source code for standalone PE32+ EXE
│
├── AngelAI.psm1                   # ⚡ Native PowerShell Module (New-AngelImage, Start-AngelGUI, etc.)
├── Start-AngelWeb.ps1             # One-click launcher for the Web Studio
├── Start-AngelGUI.ps1             # One-click launcher for the Desktop Window Studio
├── New-AngelImage.ps1             # Standalone CLI image generator script
├── Invoke-BatchGenerator.ps1      # Batch generation script
├── Test-AngelGenerator.ps1        # Diagnostics and system test runner
├── Install-Dependencies.ps1       # Dependency installer & verifier
├── Export-AngelModel.ps1          # Re-exports model weights and JSON config
├── run_windows.bat                # Windows interactive batch menu
│
├── AI_Image_Generator.exe         # Standalone 64-bit Windows Executable (PE32+)
├── model_weights.txt              # Plain-text neural weights (115 words + 3-layer MLP)
├── model_config.json              # Model configuration metadata
├── MODEL_ARCHITECTURE.txt         # Technical coordinate field specification
└── outputs/                       # Default destination for generated images
```

---

## 🛠️ PowerShell Cmdlet Reference

| Cmdlet | Description | Example |
| :--- | :--- | :--- |
| `New-AngelImage` | Generates an AI image with style, resolution up to 4K, and engine control. | `New-AngelImage -Prompt "Seraphim" -Width 2048 -Height 2048 -Open` |
| `Start-AngelGUI` | Launches the Native Desktop Window Studio. | `Start-AngelGUI` |
| `Start-AngelWeb` | Launches the local Web Studio and opens your browser. | `Start-AngelWeb -Port 5050` |
| `Get-AngelPresets` | Lists all built-in curated prompts and style presets. | `Get-AngelPresets` |
| `Invoke-AngelBatch` | Generates multiple images from a list or text file. | `Invoke-AngelBatch -Style Renaissance` |
| `Test-AngelAI` | Verifies Python, PyTorch, CustomTkinter, Flask, and weights. | `Test-AngelAI` |
| `Export-AngelModel` | Re-exports plain-text weights and JSON config. | `Export-AngelModel` |

---

## 🎨 Artistic Styles Supported

- **Renaissance Divine (`renaissance`)** — Da Vinci & Michelangelo chiaroscuro, warm ochre, sacred oil paint textures.
- **Golden Baroque (`divine_gold`)** — Radiant gold leaf, brilliant celestial halo, amber and honey light.
- **Celestial Cosmic (`celestial`)** — Deep space nebula, starlight particles, violet and cyan aura.
- **Cyberpunk Hologram (`cyberpunk`)** — Electric neon cyan wings, rainy futuristic metropolis, holographic glow.
- **Classic Ethereal (`default`)** — Pure sacred white feathers, dawn mist, volumetric heavenly rays.

---

## ⚙️ Technical Requirements

- **Operating System:** Windows 10 or 11 (64-bit)
- **PowerShell:** Version 5.1 or PowerShell Core 7+
- **Python:** Python 3.10+ (Recommended for PyTorch Neural & Desktop/Web GUI)
- **Zero-Dependency Fallback:** If Python is not installed, double-clicking `web/index.html` runs client-side in any modern browser!

---

## 📜 License
MIT License. Created for the Angel Generator AI community.
