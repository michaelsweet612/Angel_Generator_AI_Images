# ScratchGen-T2I v1.0 — From-Scratch AI Text-to-Image Generator (Windows x64)

A complete, standalone **Text-to-Image AI Generator** built from scratch, including a native 64-bit Windows executable (`AI_Image_Generator.exe`), a human-readable plain-text neural model weights file (`model_weights.txt`), full C and Python source code, and sample generated outputs.

## What's Inside This ZIP Package

| File / Folder | Description |
| :--- | :--- |
| `AI_Image_Generator.exe` | **Standalone 64-bit Windows Executable (PE32+)** — runs natively on Windows 10/11 (x64) with zero external dependencies or installation required. |
| `model_weights.txt` | **Plain-Text Neural Model File** — contains the 98-word 16-D semantic embedding table and the 3-layer CPPN neural network weight matrices (`LAYER1`, `BIAS1`, `LAYER2`, `BIAS2`, `LAYER3`, `BIAS3`). |
| `model_config.json` | **Model Configuration Metadata** — JSON specification of layer dimensions, activations, and tokenizer settings. |
| `run_windows.bat` | **Windows Batch Launcher** — double-click to launch interactive text-to-image generation on Windows. |
| `MODEL_ARCHITECTURE.txt` | **Technical Architecture Guide** — detailed breakdown of the 16-D semantic latent space, Coordinate Fourier Feature MLP, and fBm scene decoder. |
| `src/ai_image_generator.c` | **Complete C Source Code** — zero-CRT-dependency C implementation of the text tokenizer, neural forward pass, and 24-bit BMP renderer. |
| `src/train_and_export_weights.py` | **Weight Generator Script** — Python script that constructs and exports `model_weights.txt` and `model_config.json`. |
| `samples/` | **Sample Generated Images** — 5 pre-rendered 512×512 `.png` and `.bmp` outputs generated directly by the model. |

## How to Run on Windows

### Option 1: Interactive Mode (Double-Click)
1. Extract all files from this `.zip` archive into a folder on your Windows PC.
2. Double-click **`AI_Image_Generator.exe`** (or **`run_windows.bat`**).
3. Type any text prompt when asked (for example: `cyberpunk neon city at night with purple sky and water reflections`) and press **Enter**.
4. Choose an output filename (or press **Enter** to save as `generated_image.bmp`).
5. Open `generated_image.bmp` in Windows Photos or Paint!

### Option 2: Command Prompt / PowerShell CLI
You can also pass a prompt, output filename, and random seed directly from `cmd.exe` or PowerShell:
```bat
AI_Image_Generator.exe "golden sunset over mountain lake with pine forest" sunset.bmp 77
AI_Image_Generator.exe "aurora borealis glowing green over snowy mountain peaks" aurora.bmp 256
AI_Image_Generator.exe "cosmic purple magenta galaxy nebula starfield with glowing planet" space.bmp 108
AI_Image_Generator.exe "retro synthwave sun and glowing magenta cyan grid horizon" synthwave.bmp 512
```

## Editing the Model Text File (`model_weights.txt`)
`AI_Image_Generator.exe` automatically loads `model_weights.txt` from the current folder at startup (and also carries built-in fallback weights inside the `.exe` if `model_weights.txt` is moved). You can open `model_weights.txt` in Notepad to inspect or tweak the 16-D word embeddings and neural layer weights directly!
