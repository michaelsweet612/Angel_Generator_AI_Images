#!/usr/bin/env python3
"""
Angel Generator AI - Master Multi-Method CLI & Universal Synthesizer
Supports:
  1. Neural PyTorch High-Res Synthesis (100% From-Scratch Coordinate Field)
  2. Native Windows C Executable (AI_Image_Generator.exe)
"""

import argparse
import os
import subprocess
import sys
import time
from pathlib import Path
from PIL import Image

# Import our custom proprietary neural engines
try:
    from neural_engine import synthesize_angel_art
except ImportError:
    from src.neural_engine import synthesize_angel_art


PRESETS = [
    {
        "id": "archangel_michael",
        "title": "Archangel Michael Divine Guardian",
        "prompt": "Archangel Michael with glowing golden wings, flaming divine sword, golden halo, volumetric celestial light, masterpiece, 8k",
        "style": "renaissance"
    },
    {
        "id": "seraphim_glory",
        "title": "Six-Winged Seraphim in Heavenly Dawn",
        "prompt": "Magnificent six-winged Seraphim surrounded by celestial clouds, radiant golden halo, sacred light beams, ethereal beauty",
        "style": "divine_gold"
    },
    {
        "id": "guardian_cathedral",
        "title": "Guardian Angel Over Cathedral",
        "prompt": "Guardian angel with pure white feathered wings overlooking sacred gothic cathedral spire, golden sunset, divine presence",
        "style": "renaissance"
    },
    {
        "id": "cyberpunk_angel",
        "title": "Cyberpunk Holographic Angel",
        "prompt": "Futuristic cyberpunk holographic angel with glowing neon cyan wings overlooking rainy neon skyscraper metropolis, scifi",
        "style": "cyberpunk"
    },
    {
        "id": "cosmic_celestial",
        "title": "Cosmic Angel Born in Nebula",
        "prompt": "Celestial divine angel silhouette emerging from deep space galaxy nebula, glowing starlight, cosmic purple and gold aura",
        "style": "celestial"
    }
]


def run_c_executable(prompt: str, output_path: str, base_dir: Path) -> bool:
    """Execute the native 64-bit Windows C executable."""
    exe_path = base_dir / "AI_Image_Generator.exe"
    if not exe_path.exists():
        print(f"[Error] C executable not found at: {exe_path}")
        return False

    cmd = [str(exe_path), prompt, output_path]
    print(f"[C Engine] Running: {' '.join(cmd)}")
    try:
        proc = subprocess.run(cmd, cwd=str(base_dir), capture_output=True, text=True, timeout=20)
        if proc.returncode == 0 and os.path.exists(output_path):
            print(f"[C Engine] Successfully generated image: {output_path}")
            return True
        else:
            print(f"[C Engine] Failed with code {proc.returncode}:\n{proc.stderr}\n{proc.stdout}")
            return False
    except Exception as e:
        print(f"[C Engine] Exception: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Angel Generator AI - Standalone Text-to-Image Generation Suite"
    )
    parser.add_argument(
        "-p", "--prompt",
        type=str,
        default="Majestic Archangel with glowing white feathered wings and golden halo in heavenly clouds",
        help="Text prompt describing the image"
    )
    parser.add_argument(
        "-e", "--engine",
        type=str,
        choices=["neural", "c_native", "auto"],
        default="auto",
        help="Proprietary generation engine: 'neural' (PyTorch 4K), 'c_native' (Native 64-bit EXE), or 'auto'"
    )
    parser.add_argument(
        "-s", "--style",
        type=str,
        choices=["default", "renaissance", "divine_gold", "cyberpunk", "celestial"],
        default="default",
        help="Art style preset"
    )
    parser.add_argument("-w", "--width", type=int, default=512, help="Image width (default: 512)")
    parser.add_argument("-H", "--height", type=int, default=512, help="Image height (default: 512)")
    parser.add_argument("--seed", type=int, default=None, help="Random seed for reproducible generation")
    parser.add_argument("-o", "--out", type=str, default="AI generated image library/angel_output.png", help="Output file path")
    parser.add_argument("--list-presets", action="store_true", help="Print available curated angel prompts")

    args = parser.parse_args()

    if args.list_presets:
        print("=== Angel Generator AI - Curated Presets ===")
        for i, p in enumerate(PRESETS, 1):
            print(f"\n{i}. [{p['id']}] {p['title']}")
            print(f"   Prompt: \"{p['prompt']}\"")
            print(f"   Style:  {p['style']}")
        return

    base_dir = Path(__file__).resolve().parent.parent
    out_path = Path(args.out).resolve()

    out_path.parent.mkdir(parents=True, exist_ok=True)

    print("==================================================")
    print("        ANGEL GENERATOR AI - INFERENCE ENGINE     ")
    print("==================================================")
    print(f" Prompt: {args.prompt}")
    print(f" Engine: {args.engine}")
    print(f" Style:  {args.style}")
    print(f" Output: {out_path}")
    print("--------------------------------------------------")

    t0 = time.time()
    success = False

    if args.engine == "c_native":
        # Force native C binary
        c_bmp = str(out_path.with_suffix(".bmp"))
        success = run_c_executable(args.prompt, c_bmp, base_dir)
        if success and str(out_path).lower().endswith(".png"):
            # Convert BMP to PNG for modern viewing
            try:
                Image.open(c_bmp).save(str(out_path))
                print(f"[Conversion] Saved PNG version to: {out_path}")
            except Exception as e:
                print(f"[Conversion Warning] Could not convert to PNG: {e}")
    else:
        # Default / Neural PyTorch (Proprietary Coordinate Fourier Neural Field)
        print("[Neural Engine] Synthesizing high-resolution celestial artwork...")
        img = synthesize_angel_art(
            prompt=args.prompt,
            width=args.width,
            height=args.height,
            seed=args.seed,
            style=args.style
        )
        img.save(str(out_path))
        print(f"[Success] Synthesized artwork in {time.time() - t0:.2f}s -> {out_path}")
        success = True

    if success:
        print("==================================================")
        print(f" Done! Output saved to: {out_path}")
        print("==================================================")


if __name__ == "__main__":
    main()
