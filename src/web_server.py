#!/usr/bin/env python3
"""
Angel Generator AI - Web Server & REST API v2.5
Features:
  - 4K Ultra-HD Resolution Handling
  - High Thinking Deep Reasoning Mode
  - Cancellation / Stop Endpoint (/api/stop)
  - Detail Level Customization
"""

import argparse
import os
import sys
import time
import threading
import webbrowser
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "src"))

from neural_engine import synthesize_angel_art, generate_high_thinking_analysis
from angel_generator import run_c_executable, PRESETS

app = Flask(__name__, static_folder=str(BASE_DIR / "web"))
CORS(app)

LIBRARY_DIR = BASE_DIR / "AI generated image library"
LIBRARY_DIR.mkdir(parents=True, exist_ok=True)
OUTPUTS_DIR = LIBRARY_DIR

# Global cancellation event
current_cancel_event = threading.Event()


@app.route("/")
def index():
    return send_from_directory(str(BASE_DIR / "web"), "index.html")


@app.route("/<path:path>")
def static_proxy(path):
    return send_from_directory(str(BASE_DIR / "web"), path)


@app.route("/outputs/<path:filename>")
@app.route("/library/<path:filename>")
def serve_output(filename):
    return send_from_directory(str(LIBRARY_DIR), filename)


@app.route("/api/status", methods=["GET"])
def api_status():
    has_exe = (BASE_DIR / "AI_Image_Generator.exe").exists()
    return jsonify({
        "success": True,
        "pytorch": True,
        "c_native": has_exe,
        "version": "3.0.0",
        "supports_4k": True,
        "supports_high_thinking": True,
        "offline_autonomous": True
    })


@app.route("/api/presets", methods=["GET"])
def api_presets():
    return jsonify({
        "success": True,
        "presets": PRESETS
    })


@app.route("/api/stop", methods=["POST"])
def api_stop():
    global current_cancel_event
    current_cancel_event.set()
    return jsonify({"success": True, "message": "Cancellation signal sent."})


@app.route("/api/generate", methods=["POST"])
def api_generate():
    global current_cancel_event
    current_cancel_event.clear()

    data = request.get_json(force=True) or {}
    prompt = data.get("prompt", "Archangel with golden wings")
    engine = data.get("engine", "neural")
    style = data.get("style", "renaissance")
    width = int(data.get("width", 512))
    height = int(data.get("height", 512))
    detail_level = int(data.get("detail_level", 3))
    high_thinking = bool(data.get("high_thinking", False))
    seed = data.get("seed")
    if seed is None:
        seed = int(time.time() * 1000) % 999999

    filename = f"angel_{int(time.time())}_{seed}.png"
    out_file = OUTPUTS_DIR / filename
    provider_used = engine

    # Generate high thinking thought chain
    thinking_log = []
    if high_thinking:
        thinking_log = generate_high_thinking_analysis(prompt, style, detail_level, width, height)

    try:
        t0 = time.time()
        if engine == "c_native":
            bmp_file = out_file.with_suffix(".bmp")
            ok = run_c_executable(prompt, str(bmp_file), BASE_DIR)
            if ok:
                from PIL import Image
                Image.open(bmp_file).save(str(out_file))
                provider_used = "Windows C Native (PE32+)"
            else:
                raise RuntimeError("C executable generation failed")
        else:
            # Proprietary Neural PyTorch Coordinate Fourier Field with cancellation token
            img = synthesize_angel_art(
                prompt=prompt,
                width=width,
                height=height,
                seed=seed,
                style=style,
                detail_level=detail_level,
                high_thinking=high_thinking,
                cancel_check=lambda: current_cancel_event.is_set()
            )
            img.save(str(out_file))
            res_label = "4K Ultra-HD " if width >= 3840 else ("2K QHD " if width >= 2048 else "")
            provider_used = f"PyTorch Neural {res_label}Coordinate Field"

        duration = round(time.time() - t0, 2)
        return jsonify({
            "success": True,
            "filename": filename,
            "image_url": f"/library/{filename}",
            "library_folder": "AI generated image library",
            "provider": provider_used,
            "seed": seed,
            "duration_sec": duration,
            "thinking_log": thinking_log,
            "resolution": f"{width}x{height}",
            "detail_level": detail_level
        })

    except InterruptedError:
        return jsonify({
            "success": False,
            "cancelled": True,
            "error": "Generation stopped by user."
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


def main():
    parser = argparse.ArgumentParser(description="Angel Generator AI Web Studio Server")
    parser.add_argument("--port", type=int, default=5050, help="Port to listen on (default: 5050)")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Host address (default: 127.0.0.1)")
    parser.add_argument("--no-browser", action="store_true", help="Do not open browser automatically")
    args = parser.parse_args()

    url = f"http://{args.host}:{args.port}"
    print("==================================================")
    print("     ANGEL GENERATOR AI — WEB STUDIO SERVER       ")
    print("==================================================")
    print(f" Web Studio running at: {url}")
    print(" Press Ctrl+C to terminate.")
    print("==================================================")

    if not args.no_browser:
        try:
            webbrowser.open(url)
        except Exception:
            pass

    app.run(host=args.host, port=args.port, debug=False)


if __name__ == "__main__":
    main()
