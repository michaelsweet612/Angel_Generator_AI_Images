# Project Mandates & Guidelines: Angel Generator AI

## 1. From-Scratch & Proprietary Model Mandate
- **100% From-Scratch Synthesis**: The entire generative pipeline must be built, trained, and executed from scratch.
- **No External Generative Cloud Models**: Never outsource generation to third-party cloud APIs (such as OpenAI, DALL-E, Stability AI, Pollinations, Replicate, or Hugging Face hosted inference). Do not download pre-trained remote diffusion models to generate images.
- **Our Own Model & Weights**: Image synthesis must be performed exclusively by our own neural architecture:
  - Custom Coordinate Fourier Neural Field (CPPN)
  - 16-D Semantic Latent Space & Plain-Text Embedding Weights (`model_weights.txt`)
  - Multi-Octave Mie Atmospheric & Feather Decoders
  - Native 64-bit C Engine (`AI_Image_Generator.exe`), Local PyTorch Engine (`neural_engine.py`), and Client-Side WebGL (`app.js`).
- **Permitted Internet Use**: Network access is strictly restricted to developer documentation, mathematical research, and API reference retrieval. The generative model itself must be 100% self-contained and run completely offline.

## 2. Brand Identity & Thematic Grounding
- **Core Brand**: This project is branded as **Angel Generator AI** (repository `Angel_Generator_AI_Images`).
- **Thematic Consistency**: All prompts, presets, UI themes, and sample images must center strictly on angelic and celestial aesthetics (Archangels, Seraphim, feathered wings, volumetric god-rays, luminous halos, sacred illumination).
- **No Generic Placeholders**: Never retain or introduce generic templates or off-brand placeholder assets (e.g., standard procedural landscapes or unrelated demoscene noise).

## 3. Visual Polish & "Download Appeal" Standard
- **Commercial-Grade Aesthetics**: All user-facing touchpoints (Web Studio, Desktop GUI, terminal menus, ASCII banners, and README documentation) must look premium, polished, and compelling.
- **Visual Standards**:
  - Palette: Dark midnight navy (`#060813`), royal purple accents, warm 24K gold leaf (`#f5c542`), and luminous white.
  - Typography: Regal serif headings (`Cinzel`) paired with modern sans-serif body fonts (`Plus Jakarta Sans`).
  - Interactive Polish: Live progress bars, time-remaining countdowns, audio feedback, and dual Generate/Stop controls.
  - Showcase Gallery: The `samples/` directory must contain high-resolution (1024x1024 / 4K) rendered artworks showcasing the from-scratch model's capabilities.

## 4. Release & Packaging Discipline
- **Mandatory Detailed Release on Every Change**: For every modification (large or small):
  - Always publish a new GitHub release and synchronize the standalone `.zip` distribution.
  - Write comprehensive, highly detailed release notes itemizing:
    1. **What Changed / Added**: Every specific feature, UI element, or algorithm addition.
    2. **What Was Removed / Replaced**: Exact templates, legacy logic, or bugs eliminated.
    3. **Why the Change Was Made**: Root cause and design rationale.
    4. **How It Helps**: Direct benefits to the user in usability, speed, stability, or visual quality.
- When preparing new releases:
  - Ensure standalone binaries (`AI_Image_Generator.exe`), model weights (`model_weights.txt`), and batch scripts (`run_windows.bat`, `.ps1`) are synchronized and functional offline.
  - Maintain a visual showcase table in `README.md` embedding actual rendered samples with their exact prompts and render benchmarks.
  - Ensure zero-dependency fallback (e.g., WebGL canvas running directly in any browser without Python or internet).
