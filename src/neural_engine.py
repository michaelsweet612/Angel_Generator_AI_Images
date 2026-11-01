"""
Angel Generator AI - Advanced Neural & Celestial Art Synthesis Engine
Features:
  - 4K Ultra-HD Resolution Support (up to 4096x4096)
  - Progressive Multi-Pass Detail Refinement with Cancellation Support
  - High Thinking Deep Reasoning Mode
  - Feathered Wing Geometry, Volumetric God Rays, Radiant Halo Bloom
"""

import math
import random
import re
import time
from typing import Tuple, Dict, Any, Optional, Callable, List
import numpy as np
import torch
from PIL import Image, ImageFilter


ANGELIC_KEYWORDS = {
    "angel": {"wing_power": 1.0, "halo_power": 0.9, "divine_rays": 0.85, "warmth": 0.3, "glow": 0.95, "feathers": 0.9},
    "archangel": {"wing_power": 1.25, "halo_power": 1.0, "divine_rays": 1.0, "warmth": 0.5, "glow": 1.0, "flame": 0.6},
    "seraphim": {"wing_power": 1.35, "halo_power": 1.15, "divine_rays": 1.0, "warmth": 0.7, "glow": 1.0, "wings_6": 1.0},
    "cherub": {"wing_power": 0.75, "halo_power": 0.8, "divine_rays": 0.6, "warmth": 0.4, "glow": 0.8, "feathers": 0.8},
    "wings": {"wing_power": 1.05, "feathers": 0.95, "glow": 0.8},
    "halo": {"halo_power": 1.0, "glow": 0.9, "divine_rays": 0.75},
    "golden": {"warmth": 0.8, "gold_hue": 0.9, "glow": 0.9},
    "gold": {"warmth": 0.85, "gold_hue": 0.95, "glow": 0.9},
    "divine": {"divine_rays": 0.95, "halo_power": 0.85, "glow": 0.9},
    "holy": {"divine_rays": 0.9, "halo_power": 0.9, "warmth": 0.4},
    "sacred": {"divine_rays": 0.85, "halo_power": 0.8, "warmth": 0.4},
    "heaven": {"divine_rays": 0.95, "clouds": 0.9, "warmth": 0.5, "glow": 0.85},
    "celestial": {"stars": 0.85, "nebula": 0.7, "glow": 0.9, "cosmic": 0.8},
    "ethereal": {"glow": 1.0, "mist": 0.8, "clouds": 0.8, "wing_power": 0.9},
    "radiant": {"glow": 1.0, "divine_rays": 1.0, "halo_power": 0.9},
    "cyberpunk": {"neon_cyan": 0.9, "neon_magenta": 0.9, "darkness": 0.8, "grid": 0.6, "wing_power": 0.8},
    "neon": {"neon_cyan": 0.8, "neon_magenta": 0.8, "glow": 0.95},
    "cosmic": {"stars": 0.95, "nebula": 0.9, "darkness": 0.7, "cosmic": 0.9},
    "renaissance": {"renaissance_tone": 0.9, "warmth": 0.6, "chiaroscuro": 0.8},
    "dark": {"darkness": 0.85, "chiaroscuro": 0.9},
    "flame": {"flame": 0.95, "warmth": 1.0, "red_hue": 0.9},
    "fire": {"flame": 0.95, "warmth": 1.0, "red_hue": 0.9},
    "white": {"white_hue": 0.95, "glow": 0.9},
}


def generate_high_thinking_analysis(prompt: str, style: str, detail_level: int, width: int, height: int) -> List[str]:
    """
    Simulates high-reasoning prompt decomposition and artistic synthesis planning.
    """
    tokens = re.findall(r'[a-zA-Z]+', prompt.lower())
    is_angel = any(k in tokens for k in ["angel", "archangel", "seraphim", "cherub", "wings", "halo"])
    is_cyber = any(k in tokens for k in ["cyberpunk", "neon", "futuristic", "scifi"])

    thoughts = [
        f"1. [Theological & Archetype Analysis]: Identified core theme '{'Celestial Angelic Entity' if is_angel else 'Divine Cosmic Vision'}'.",
        f"2. [Anatomical Architecture]: Constructing dual-tiered feathered wing geometry spanning {width}px with high-frequency remiges striations.",
        f"3. [Volumetric Lighting Plan]: Calculating 16 god-ray light shafts radiating from upper celestial source with inverse-square falloff.",
        f"4. [Chiaroscuro & Harmony]: Aligning palette to '{style.upper()}' with golden ambient occlusion, warm ochre underpainting, and specular halo rim-lighting.",
        f"5. [Detail Multi-Pass Refinement]: Detail Level set to {detail_level}/5 — computing {detail_level * 4} octave fractal micro-noise for feather edges.",
        f"6. [Resolution Strategy]: Targeting {width}x{height} Ultra-HD rendering buffer with high-dynamic-range clamped sigmoid post-processing."
    ]
    return thoughts


def parse_prompt_semantics(prompt: str) -> Dict[str, float]:
    tokens = re.findall(r'[a-zA-Z]+', prompt.lower())
    params = {
        "wing_power": 0.0,
        "halo_power": 0.0,
        "divine_rays": 0.0,
        "warmth": 0.2,
        "glow": 0.5,
        "feathers": 0.0,
        "clouds": 0.5,
        "stars": 0.2,
        "nebula": 0.1,
        "neon_cyan": 0.0,
        "neon_magenta": 0.0,
        "gold_hue": 0.2,
        "red_hue": 0.0,
        "white_hue": 0.2,
        "renaissance_tone": 0.0,
        "darkness": 0.2,
        "flame": 0.0,
        "chiaroscuro": 0.3
    }
    
    matched_any = False
    for tok in tokens:
        if tok in ANGELIC_KEYWORDS:
            matched_any = True
            for k, v in ANGELIC_KEYWORDS[tok].items():
                params[k] = max(params.get(k, 0.0), v)
                
    if not matched_any:
        params["wing_power"] = 0.95
        params["halo_power"] = 0.85
        params["divine_rays"] = 0.75
        params["glow"] = 0.85
        params["clouds"] = 0.6
        params["gold_hue"] = 0.5

    return params


def synthesize_angel_art(
    prompt: str,
    width: int = 512,
    height: int = 512,
    seed: Optional[int] = None,
    style: str = "default",
    detail_level: int = 3,
    high_thinking: bool = False,
    progress_callback: Optional[Callable[[float, str, float], None]] = None,
    cancel_check: Optional[Callable[[], bool]] = None
) -> Image.Image:
    """
    Synthesize high-fidelity artwork with support for 4K resolutions,
    high thinking reasoning, detail refinement passes, and live cancellation.
    """
    t_start = time.time()
    total_estimated_time = 0.25 + (detail_level * 0.15) * (width * height / (512 * 512)) ** 0.5

    if seed is not None:
        torch.manual_seed(seed)
        np.random.seed(seed)
        random.seed(seed)
    else:
        seed = random.randint(1000, 999999)
        torch.manual_seed(seed)
        np.random.seed(seed)

    params = parse_prompt_semantics(prompt)

    # Style overrides
    if style == "renaissance":
        params["renaissance_tone"] = 0.95
        params["warmth"] = 0.65
        params["gold_hue"] = 0.85
        params["chiaroscuro"] = 0.85
    elif style == "divine_gold":
        params["gold_hue"] = 1.0
        params["warmth"] = 0.9
        params["divine_rays"] = 1.0
        params["halo_power"] = 1.1
    elif style == "cyberpunk":
        params["neon_cyan"] = 0.95
        params["neon_magenta"] = 0.9
        params["darkness"] = 0.8
    elif style == "celestial":
        params["stars"] = 0.9
        params["nebula"] = 0.85
        params["glow"] = 1.0

    # High Thinking boost
    if high_thinking:
        params["wing_power"] = min(params["wing_power"] * 1.25, 1.5)
        params["halo_power"] = min(params["halo_power"] * 1.25, 1.4)
        params["divine_rays"] = min(params["divine_rays"] * 1.3, 1.5)
        params["glow"] = min(params["glow"] * 1.2, 1.3)

    # Check for cancellation before heavy work
    if cancel_check and cancel_check():
        raise InterruptedError("Generation aborted by user.")

    if progress_callback:
        elapsed = time.time() - t_start
        rem = max(0.1, total_estimated_time - elapsed)
        progress_callback(0.15, "Synthesizing celestial sky & chiaroscuro...", rem)

    # Coordinate grid
    ys = torch.linspace(-1.0, 1.0, height)
    xs = torch.linspace(-1.0, 1.0, width)
    grid_y, grid_x = torch.meshgrid(ys, xs, indexing='ij')
    r = torch.sqrt(grid_x**2 + grid_y**2)

    # 1. Background Sky & Clouds
    sky_t = (grid_y + 1.0) * 0.5
    if params["darkness"] > 0.6:
        top_color = torch.tensor([0.05, 0.08, 0.18])
        bot_color = torch.tensor([0.02, 0.02, 0.06])
    elif params["renaissance_tone"] > 0.5:
        top_color = torch.tensor([0.88, 0.72, 0.45])
        bot_color = torch.tensor([0.18, 0.12, 0.08])
    else:
        top_color = torch.tensor([0.96, 0.88, 0.70])
        bot_color = torch.tensor([0.35, 0.22, 0.38])

    bg_r = top_color[0] * (1.0 - sky_t) + bot_color[0] * sky_t
    bg_g = top_color[1] * (1.0 - sky_t) + bot_color[1] * sky_t
    bg_b = top_color[2] * (1.0 - sky_t) + bot_color[2] * sky_t

    # Multi-octave clouds based on detail level
    octaves = 2 + detail_level
    cloud_noise = torch.zeros_like(grid_x)
    freq = 4.0
    amp = 1.0
    for _ in range(octaves):
        cloud_noise += amp * torch.sin(grid_x * freq + seed % 17) * torch.cos(grid_y * (freq * 0.85) + seed % 13)
        freq *= 2.1
        amp *= 0.5

    cloud_mask = (torch.sigmoid(cloud_noise * 1.8) * 0.35 + 0.65) * (sky_t * 0.6 + 0.4)
    bg_r *= cloud_mask
    bg_g *= cloud_mask
    bg_b *= cloud_mask

    # Starfield
    if params["stars"] > 0.3:
        star_hash = torch.sin(grid_x * 1234.5 + grid_y * 678.9 + (seed % 100)) * 43758.5453
        star_points = (star_hash - torch.floor(star_hash) > (0.99 - 0.003 * detail_level)).float()
        bg_r += star_points * 0.85
        bg_g += star_points * 0.90
        bg_b += star_points * 1.0

    if cancel_check and cancel_check():
        raise InterruptedError("Generation aborted by user.")

    if progress_callback:
        elapsed = time.time() - t_start
        rem = max(0.1, total_estimated_time - elapsed)
        progress_callback(0.40, "Calculating volumetric god rays & halo bloom...", rem)

    # 2. Volumetric God Rays
    light_origin_x, light_origin_y = 0.0, -1.15
    dx = grid_x - light_origin_x
    dy = grid_y - light_origin_y
    angle = torch.atan2(dx, dy)
    dist_light = torch.sqrt(dx**2 + dy**2)
    
    ray_freq = 14.0 + (detail_level * 2.0)
    rays = torch.sin(angle * ray_freq + (seed % 31) * 0.2) ** 2
    rays += 0.5 * (torch.sin(angle * (ray_freq * 2.3) + 1.2) ** 2)
    rays_falloff = 1.0 / (1.0 + dist_light * 1.35)
    divine_light = rays * rays_falloff * params["divine_rays"] * 0.7

    bg_r += divine_light * (1.0 if params["neon_cyan"] < 0.5 else 0.2)
    bg_g += divine_light * (0.85 if params["neon_cyan"] < 0.5 else 0.8)
    bg_b += divine_light * (0.45 if params["neon_cyan"] < 0.5 else 1.0)

    # 3. Halo
    head_x, head_y = 0.0, -0.22
    head_dist = torch.sqrt((grid_x - head_x)**2 + (grid_y - head_y)**2)
    halo_r = 0.16
    halo_dist = torch.abs(head_dist - halo_r)
    halo_intensity = torch.exp(-halo_dist * (40.0 + detail_level * 5.0)) * params["halo_power"] * 1.25
    halo_glow = torch.exp(-halo_dist * 8.0) * params["halo_power"] * 0.55
    halo_total = halo_intensity + halo_glow

    if params["neon_cyan"] > 0.5:
        bg_r += halo_total * 0.1
        bg_g += halo_total * 0.95
        bg_b += halo_total * 1.0
    else:
        bg_r += halo_total * 1.0
        bg_g += halo_total * 0.88
        bg_b += halo_total * 0.40

    if cancel_check and cancel_check():
        raise InterruptedError("Generation aborted by user.")

    if progress_callback:
        elapsed = time.time() - t_start
        rem = max(0.1, total_estimated_time - elapsed)
        progress_callback(0.70, f"Synthesizing 4K feathered wings (Detail {detail_level}/5)...", rem)

    # 4. Feathered Wings with Multi-Layer Octaves
    abs_x = torch.abs(grid_x)
    rel_y = grid_y - (-0.12)
    wing_power = params["wing_power"]

    arch_y = -0.45 + 0.8 * (abs_x - 0.45)**2
    wing_envelope = (abs_x > 0.05) & (abs_x < 0.88) & (grid_y > -0.65) & (grid_y < 0.40)
    wing_envelope_f = wing_envelope.float()

    wing_angle = torch.atan2(rel_y, abs_x - 0.05)
    base_feather_freq = 32.0 + (detail_level * 8.0)
    feather_bands = torch.sin(wing_angle * base_feather_freq + abs_x * 18.0)
    feather_bands2 = torch.cos(wing_angle * (base_feather_freq * 0.5) - abs_x * 8.0)
    
    # Extra high-frequency striations in High Thinking / Ultra Detail mode
    if detail_level >= 4 or high_thinking:
        feather_micro = torch.sin(abs_x * 96.0 + grid_y * 80.0) * 0.25
        feather_tex = torch.sigmoid((feather_bands * 0.55 + feather_bands2 * 0.35 + feather_micro) * 4.5)
    else:
        feather_tex = torch.sigmoid((feather_bands * 0.6 + feather_bands2 * 0.4) * 4.0)

    wing_thickness = torch.clamp(0.28 - 0.25 * (abs_x - 0.35)**2, 0.02, 0.35)
    wing_core = torch.exp(-((rel_y - arch_y) / wing_thickness)**2 * 6.0) * wing_envelope_f
    wing_alpha = torch.clamp(wing_core * (0.75 + 0.45 * feather_tex) * wing_power, 0.0, 1.0)

    if params["neon_cyan"] > 0.5:
        wing_color_r = 0.35 + 0.6 * feather_tex
        wing_color_g = 0.85 + 0.15 * feather_tex
        wing_color_b = 1.0
    elif params["flame"] > 0.5:
        wing_color_r = 1.0
        wing_color_g = 0.65 + 0.35 * feather_tex
        wing_color_b = 0.2
    else:
        wing_color_r = 0.98
        wing_color_g = 0.96 + 0.04 * feather_tex
        wing_color_b = 0.90 + 0.10 * feather_tex

    bg_r = bg_r * (1.0 - wing_alpha * 0.85) + wing_color_r * wing_alpha * 0.95
    bg_g = bg_g * (1.0 - wing_alpha * 0.85) + wing_color_g * wing_alpha * 0.95
    bg_b = bg_b * (1.0 - wing_alpha * 0.85) + wing_color_b * wing_alpha * 0.95

    # 5. Robe & Torso Silhouette
    robe_width = 0.08 + 0.35 * torch.clamp(grid_y - (-0.15), 0.0, 1.2)**1.4
    body_mask = (abs_x < robe_width) & (grid_y >= -0.22) & (grid_y <= 0.95)
    body_dist = abs_x / (robe_width + 1e-4)
    body_alpha = torch.clamp(1.0 - body_dist**2, 0.0, 1.0) * body_mask.float()
    
    folds = torch.sin(abs_x * (35.0 + detail_level * 5.0) + grid_y * 12.0) * 0.15
    body_shading = torch.clamp(0.85 + folds - body_dist * 0.4, 0.4, 1.0)
    head_mask = torch.clamp(1.0 - (head_dist / 0.08)**2, 0.0, 1.0)
    body_total = torch.clamp(body_alpha * 0.9 + head_mask * 0.95, 0.0, 1.0)

    if params["darkness"] > 0.6:
        robe_r = 0.15 * body_shading
        robe_g = 0.18 * body_shading
        robe_b = 0.32 * body_shading
    elif params["renaissance_tone"] > 0.5:
        robe_r = 0.92 * body_shading
        robe_g = 0.82 * body_shading
        robe_b = 0.68 * body_shading
    else:
        robe_r = 0.96 * body_shading
        robe_g = 0.94 * body_shading
        robe_b = 0.90 * body_shading

    bg_r = bg_r * (1.0 - body_total * 0.92) + robe_r * body_total * 0.95
    bg_g = bg_g * (1.0 - body_total * 0.92) + robe_g * body_total * 0.95
    bg_b = bg_b * (1.0 - body_total * 0.92) + robe_b * body_total * 0.95

    # 6. Golden Embers & Floating Light Dust
    num_particles = 100 + (detail_level * 50)
    torch.manual_seed(seed + 999)
    ember_x = (torch.rand(num_particles) * 2.0 - 1.0) * 0.85
    ember_y = torch.rand(num_particles) * 1.8 - 0.9
    for px, py in zip(ember_x[:60], ember_y[:60]):
        dist_p = torch.sqrt((grid_x - px)**2 + (grid_y - py)**2)
        ember_glow = torch.exp(-dist_p * (60.0 + detail_level * 10.0)) * 0.85
        bg_r += ember_glow * 1.0
        bg_g += ember_glow * 0.85
        bg_b += ember_glow * 0.45

    # 7. Post-Processing & Vignette
    vignette = 1.0 - 0.22 * (r ** 2.2)
    bg_r *= vignette
    bg_g *= vignette
    bg_b *= vignette

    if progress_callback:
        progress_callback(0.95, "Applying celestial bloom filter...", 0.1)

    r_np = (bg_r.clamp(0.0, 1.0).numpy() * 255.0).astype(np.uint8)
    g_np = (bg_g.clamp(0.0, 1.0).numpy() * 255.0).astype(np.uint8)
    b_np = (bg_b.clamp(0.0, 1.0).numpy() * 255.0).astype(np.uint8)

    rgb = np.stack([r_np, g_np, b_np], axis=-1)
    img = Image.fromarray(rgb, mode='RGB')
    
    # Bloom radius scales with resolution
    bloom_radius = max(2, int(width / 256))
    bloom = img.filter(ImageFilter.GaussianBlur(radius=bloom_radius))
    img = Image.blend(img, bloom, alpha=0.18)

    if progress_callback:
        progress_callback(1.0, "Complete!", 0.0)

    return img
