# Angel Generator AI — Multi-Engine Text-to-Image Generation Studio

![Version](https://img.shields.io/badge/version-2.0.0-gold)
![Engines](https://img.shields.io/badge/engines-PyTorch%20%7C%20WebGL%20%7C%20Cloud%20Diffusion%20%7C%20Win64%20C-brightgreen)
![Platform](https://img.shields.io/badge/platform-Windows%20x64%20%7C%20Web-blue)
![License](https://img.shields.io/badge/license-MIT-purple)

A complete, high-performance **Text-to-Image AI Generative Studio** specialized in **Angel, Celestial, Fantasy, and Sacred Artwork**, built with multiple generation methods:
1. **PyTorch Neural Coordinate Engine** — Ultra-fast, high-resolution offline synthesis with volumetric god rays, layered feathered wings, and golden radiant halos.
2. **Interactive Web Studio** — Modern, responsive dark-and-gold UI with real-time in-browser WebGL canvas rendering, preset selectors, and live gallery.
3. **PowerShell Automation Suite & `AngelAI` Module** — Native PowerShell cmdlets (`New-AngelImage`, `Start-AngelWeb`, `Invoke-AngelBatch`, `Test-AngelAI`).
4. **Cloud Diffusion Engine** — High-definition AI generation with support for FLUX, SDXL, DALL-E 3, and free community endpoints.
5. **Native 64-bit Windows C Executable (`AI_Image_Generator.exe`)** — Zero-dependency standalone PE32+ inference engine with expanded 115-word semantic embeddings.

---

## 🌟 Why the Upgraded Multi-Method Architecture?

The initial v1.0 release used a minimal 98-word procedural landscape CPPN written in raw C. While compact, it was limited to geometric terrain and demoscene noise, meaning prompts for angels, characters, or fine art generated indistinct muddy shapes. 

**Angel Generator AI v2.0 fixes this completely** by providing a comprehensive multi-backend pipeline:
- Dedicated **Celestial Coordinate Fields** with analytical wing curves, feather striations, volumetric rays, and radiant halos.
- **Instant Web Studio** that runs either standalone in your browser or connected to the Python backend.
- Full **PowerShell cmdlets** for automation, scripting, and pipeline integration.
- Multiple coding interfaces: Python, PowerShell, REST API, HTML5/Canvas/WebGL, and C.

---

## 🚀 Quick Start Guide

### 1. Launch the Interactive Web Studio
Double-click or run from PowerShell:
```powershell
.\Start-AngelWeb.ps1
```
This starts the local web server on `http://127.0.0.1:5050` and automatically opens the studio in your default browser.

> **Offline / No Python Server?** You can also directly double-click `web/index.html` in Windows Explorer! The client-side WebGL canvas engine will run right in your browser with zero server setup!

---

### 2. Generate from PowerShell
Import the included PowerShell module and generate celestial artwork directly from your console:

```powershell
# Import the AngelAI Module
Import-Module .\AngelAI.psm1

# Generate an Archangel artwork and open it immediately
New-AngelImage -Prompt "Archangel Michael with glowing white feathered wings and golden halo" -Style Renaissance -Open

# Generate high-resolution 1024x1024 artwork
New-AngelImage -Prompt "Six-winged Seraphim in divine dawn" -Style Divine_Gold -Width 1024 -Height 1024 -Open

# Run diagnostic health check
Test-AngelAI
```

Or run the standalone script without importing:
```powershell
.\New-AngelImage.ps1 -Prompt "Guardian angel overlooking cathedral" -Style Renaissance -Open
```

---

### 3. Generate from Python CLI
```bash
# High-resolution neural synthesis
python src/angel_generator.py --prompt "Archangel Michael with golden wings" --style renaissance --out michael.png

# List curated celestial presets
python src/angel_generator.py --list-presets

# Native Win64 C engine execution
python src/angel_generator.py --prompt "mountains and sunset" --engine c_native --out mountain.bmp
```

---

## 📁 Project Structure

```
Angel_Generator_AI/
├── web/                           # 🌐 Interactive Web Studio
│   ├── index.html                 # Modern glassmorphism web interface
│   ├── style.css                  # Celestial dark-and-gold styling
│   └── app.js                     # Real-time WebGL canvas synthesizer & API client
│
├── src/                           # 🧠 Multi-Method Codebases
│   ├── neural_engine.py           # PyTorch deep coordinate field & celestial renderer
│   ├── cloud_engine.py            # Diffusion API & Cloud provider integration
│   ├── angel_generator.py         # Master CLI tool & multi-engine bridge
│   ├── web_server.py              # Flask REST API server for Web Studio
│   ├── train_and_export_weights.py# Neural weight generator & vocabulary builder
│   └── ai_image_generator.c       # Native C source code for standalone PE32+ EXE
│
├── AngelAI.psm1                   # ⚡ Native PowerShell Module
├── Start-AngelWeb.ps1             # One-click launcher for the Web Studio
├── New-AngelImage.ps1             # CLI image generator script
├── Invoke-BatchGenerator.ps1      # Batch generation script
├── Test-AngelGenerator.ps1        # Diagnostics and system test runner
├── Install-Dependencies.ps1       # Dependency installer & verifier
├── Export-AngelModel.ps1          # Re-exports model weights and JSON config
│
├── AI_Image_Generator.exe         # Standalone 64-bit Windows Executable (PE32+)
├── model_weights.txt              # Plain-text neural weights (115 words + 3-layer MLP)
├── model_config.json              # Model configuration metadata
├── MODEL_ARCHITECTURE.txt         # Technical coordinate field specification
├── samples/                       # Sample generated reference images
└── outputs/                       # Default destination for generated images
```

---

## 🛠️ PowerShell Cmdlet Reference

| Cmdlet | Description | Example |
| :--- | :--- | :--- |
| `New-AngelImage` | Generates an AI image with full style, resolution, and engine control. | `New-AngelImage -Prompt "Seraphim" -Open` |
| `Start-AngelWeb` | Launches the local Web Studio and opens your browser. | `Start-AngelWeb -Port 5050` |
| `Get-AngelPresets` | Lists all built-in curated prompts and style presets. | `Get-AngelPresets` |
| `Invoke-AngelBatch` | Generates multiple images from a list or text file. | `Invoke-AngelBatch -Style Renaissance` |
| `Test-AngelAI` | Verifies Python, PyTorch, Pillow, Flask, C binary, and weights. | `Test-AngelAI` |
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
- **Python:** Python 3.10+ (Recommended for PyTorch Neural & Web API)
- **Optional Python Libraries:**
  ```powershell
  pip install torch pillow flask flask-cors requests
  ```
  *(Or simply run `.\Install-Dependencies.ps1` to configure everything automatically!)*
- **Zero-Dependency Fallback:** If Python is not installed, double-clicking `web/index.html` runs entirely in any modern browser using WebGL!

---

## 📜 License
MIT License. Created for the Angel Generator AI community.
