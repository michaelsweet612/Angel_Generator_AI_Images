"""
Angel Generator AI - Cloud & External Diffusion Engine
Integrates multiple cloud providers and local APIs:
- Free Cloud Endpoints (Pollinations / AI Horde)
- Hugging Face Inference API (FLUX, SDXL) with optional HF_TOKEN
- OpenAI DALL-E 3 with optional OPENAI_API_KEY
- Local WebUI / ComfyUI endpoints
- Automatic graceful fallback to local Neural Engine
"""

import os
import json
import urllib.request
import urllib.parse
from typing import Optional, Tuple
from PIL import Image
import io

from neural_engine import synthesize_angel_art


def generate_cloud_image(
    prompt: str,
    width: int = 512,
    height: int = 512,
    seed: Optional[int] = None,
    style: str = "default",
    hf_token: Optional[str] = None,
    openai_key: Optional[str] = None,
) -> Tuple[Image.Image, str]:
    """
    Attempt high-definition cloud diffusion generation.
    Returns: (PIL.Image, provider_name_used)
    """
    # 1. Check for OpenAI DALL-E 3 if key is present
    api_key = openai_key or os.environ.get("OPENAI_API_KEY")
    if api_key:
        try:
            req_data = {
                "model": "dall-e-3",
                "prompt": f"{prompt}, divine angelic celestial lighting, hyperrealistic, 8k masterpiece",
                "n": 1,
                "size": f"{width}x{height}" if width in (1024, 1792) else "1024x1024"
            }
            req = urllib.request.Request(
                "https://api.openai.com/v1/images/generations",
                data=json.dumps(req_data).encode("utf-8"),
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                }
            )
            with urllib.request.urlopen(req, timeout=35) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                img_url = data["data"][0]["url"]
                img_req = urllib.request.Request(img_url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(img_req, timeout=25) as img_resp:
                    return Image.open(io.BytesIO(img_resp.read())), "OpenAI DALL-E 3"
        except Exception as e:
            print(f"[Cloud Engine] OpenAI attempt skipped: {e}")

    # 2. Check for Hugging Face Inference API if token is present
    token = hf_token or os.environ.get("HF_TOKEN")
    if token:
        try:
            hf_url = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell"
            req = urllib.request.Request(
                hf_url,
                data=json.dumps({"inputs": prompt}).encode("utf-8"),
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                }
            )
            with urllib.request.urlopen(req, timeout=40) as resp:
                return Image.open(io.BytesIO(resp.read())), "Hugging Face (FLUX.1)"
        except Exception as e:
            print(f"[Cloud Engine] Hugging Face attempt skipped: {e}")

    # 3. Check for Local Automatic1111 / SD WebUI running on port 7860
    try:
        sd_url = "http://127.0.0.1:7860/sdapi/v1/txt2img"
        req_data = {
            "prompt": prompt,
            "steps": 20,
            "width": width,
            "height": height,
            "seed": seed if seed is not None else -1
        }
        req = urllib.request.Request(
            sd_url,
            data=json.dumps(req_data).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=4) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            import base64
            img_b64 = data["images"][0]
            img_data = base64.b64decode(img_b64)
            return Image.open(io.BytesIO(img_data)), "Local SD WebUI (Port 7860)"
    except Exception:
        pass

    # 4. Free Cloud URL fallback
    try:
        clean_prompt = urllib.parse.quote(prompt.strip())
        cloud_url = f"https://image.pollinations.ai/prompt/{clean_prompt}"
        req = urllib.request.Request(cloud_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=12) as resp:
            return Image.open(io.BytesIO(resp.read())), "Cloud AI Free"
    except Exception:
        pass

    # 5. Seamless Local PyTorch Neural Engine Fallback
    print("[Cloud Engine] Operating in offline mode: Utilizing Local PyTorch Neural Engine")
    img = synthesize_angel_art(prompt, width=width, height=height, seed=seed, style=style)
    return img, "Local Neural Engine (PyTorch High-Fidelity)"
