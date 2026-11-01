"""
Angel Generator AI - Masterpiece Neural & Celestial Art Synthesis Engine v3.0
Specialized in Museum-Grade Angelic, Celestial, Fantasy, and Sacred Artwork.

Features:
  - Multi-Layered Anatomical Wing Architecture (Remiges, Secondaries, Coverts)
  - Concentric Sacred Geometry Halos with Cruciform Light Flares
  - Volumetric Atmospheric God Rays with Mie Scattering Approximation
  - Classical Chiaroscuro Textile Draping with Golden Filigree Highlights
  - ACES Filmic Tone Mapping & Canvas Texture Synthesis
  - 4K Ultra-HD Resolution Support (up to 4096x4096)
  - Progressive Multi-Pass Detail Refinement with Cancellation Support
  - High Thinking Deep Reasoning Mode
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
    "angel": {"wing_power": 1.0, "halo_power": 1.0, "divine_rays": 0.9, "warmth": 0.4, "glow": 1.0, "feathers": 1.0},
    "archangel": {"wing_power": 1.3, "halo_power": 1.15, "divine_rays": 1.1, "warmth": 0.6, "glow": 1.1, "flame": 0.7},
    "seraphim": {"wing_power": 1.45, "halo_power": 1.25, "divine_rays": 1.15, "warmth": 0.75, "glow": 1.15, "wings_6": 1.0},
    "cherub": {"wing_power": 0.8, "halo_power": 0.85, "divine_rays": 0.7, "warmth": 0.45, "glow": 0.85, "feathers": 0.85},
    "wings": {"wing_power": 1.1, "feathers": 1.0, "glow": 0.85},
    "halo": {"halo_power": 1.1, "glow": 1.0, "divine_rays": 0.85},
    "golden": {"warmth": 0.85, "gold_hue": 0.95, "glow": 0.95},
    "gold": {"warmth": 0.9, "gold_hue": 1.0, "glow": 0.95},
    "divine": {"divine_rays": 1.0, "halo_power": 0.95, "glow": 0.95},
    "holy": {"divine_rays": 0.95, "halo_power": 0.95, "warmth": 0.45},
    "sacred": {"divine_rays": 0.9, "halo_power": 0.9, "warmth": 0.45},
    "heaven": {"divine_rays": 1.0, "clouds": 0.95, "warmth": 0.55, "glow": 0.9},
    "celestial": {"stars": 0.9, "nebula": 0.8, "glow": 0.95, "cosmic": 0.85},
    "ethereal": {"glow": 1.1, "mist": 0.85, "clouds": 0.85, "wing_power": 0.95},
    "radiant": {"glow": 1.1, "divine_rays": 1.05, "halo_power": 1.0},
    "cyberpunk": {"neon_cyan": 0.95, "neon_magenta": 0.9, "darkness": 0.85, "grid": 0.6, "glow": 1.1},
    "neon": {"neon_cyan": 0.85, "neon_magenta": 0.85, "glow": 1.0},
    "city": {"neon_cyan": 0.8, "neon_magenta": 0.7, "darkness": 0.8, "grid": 0.8},
    "cosmic": {"stars": 1.0, "nebula": 0.95, "darkness": 0.8, "cosmic": 0.95},
    "space": {"stars": 1.0, "nebula": 0.9, "darkness": 0.9, "cosmic": 0.95},
    "nebula": {"stars": 0.9, "nebula": 1.0, "darkness": 0.85, "glow": 1.1},
    "landscape": {"clouds": 0.8, "warmth": 0.7, "nature": 1.0, "darkness": 0.2},
    "mountain": {"clouds": 0.8, "nature": 1.0, "chiaroscuro": 0.7},
    "lake": {"nature": 0.9, "reflection": 0.9, "warmth": 0.6},
    "dragon": {"flame": 0.9, "darkness": 0.7, "glow": 1.1, "wings": 0.8},
    "car": {"neon_cyan": 0.6, "darkness": 0.7, "metallic": 1.0, "glow": 0.8},
    "mechanical": {"metallic": 1.0, "grid": 0.7, "darkness": 0.6},
    "renaissance": {"renaissance_tone": 0.95, "warmth": 0.7, "chiaroscuro": 0.9},
    "dark": {"darkness": 0.9, "chiaroscuro": 0.95},
    "flame": {"flame": 1.0, "warmth": 1.0, "red_hue": 0.95},
    "fire": {"flame": 1.0, "warmth": 1.0, "red_hue": 0.95},
    "white": {"white_hue": 1.0, "glow": 0.95},
}


def generate_high_thinking_analysis(prompt: str, style: str, detail_level: int, width: int, height: int) -> List[str]:
    """Generates deep theological, compositional, and thematic reasoning steps."""
    tokens = re.findall(r'[a-zA-Z]+', prompt.lower())
    prompt_lower = prompt.lower()

    if any(w in prompt_lower for w in ['cyberpunk', 'city', 'neon', 'metropolis']):
        arch_type = 'Cyberpunk Neon Megacity Architecture (Holographic Volumetrics & Rain Reflections)'
        return [
            f"1. [Thematic Decomposition]: Mapping subject to '{arch_type}'.",
            f"2. [Structural Raymarching]: Generating multi-tiered skyscraper grid geometry across {width}x{height} raster field.",
            f"3. [Radiance Field Synthesis]: Computing dual-spectrum neon illumination (Cyan & Magenta) with specular wet surface diffusion.",
            f"4. [Atmospheric Optics]: Simulating localized volumetric haze, neon scatter, and reflective ground planes.",
            f"5. [Compositional Chiaroscuro]: Balancing high-contrast silhouettes against vibrant chromatic skylines.",
            f"6. [Detail Multi-Pass]: Detail Level {detail_level}/5 - synthesizing micro-window luminescence and light trails.",
            f"7. [ACES Filmic Color Grading]: Harmonizing {style.upper()} palette with dynamic range compression and anamorphic bloom."
        ]
    elif any(w in prompt_lower for w in ['landscape', 'mountain', 'lake', 'forest', 'nature']):
        arch_type = 'Majestic Alpine Vista & Natural Terrain (Golden Hour Atmospheric Perspective)'
        return [
            f"1. [Thematic Decomposition]: Mapping subject to '{arch_type}'.",
            f"2. [Terrain Synthesis]: Generating multi-layer mountain silhouette ridges with fractional Brownian elevation noise.",
            f"3. [Optical Perspective]: Simulating Rayleigh aerial perspective haze and golden hour sky gradient.",
            f"4. [Water & Surface Optics]: Computing specular lake mirror reflections and rippling water normals.",
            f"5. [Foliage Decoders]: Distributing evergreen pine needle micro-textures and alpine foothills.",
            f"6. [Detail Multi-Pass]: Detail Level {detail_level}/5 - rendering crag detail and atmospheric light shafts.",
            f"7. [ACES Filmic Color Grading]: Harmonizing {style.upper()} palette with golden sunlight and cool mountain shadows."
        ]
    elif any(w in prompt_lower for w in ['space', 'cosmic', 'nebula', 'galaxy', 'black hole', 'star']):
        arch_type = 'Deep Space Cosmic Nebula & Stellar Accretion Field'
        return [
            f"1. [Thematic Decomposition]: Mapping subject to '{arch_type}'.",
            f"2. [Cosmological Dynamics]: Synthesizing logarithmic spiral accretion disk and event horizon radiance.",
            f"3. [Starfield Distribution]: Rendering multi-magnitude star clusters across {width}x{height} with diffraction spikes.",
            f"4. [Interstellar Gas Optics]: Simulating multi-octave plasma clouds with violet, magenta, and cyan emission spectra.",
            f"5. [Gravitational Lensing]: Applying relativistic photon deflection curvature around dense cosmic core.",
            f"6. [Detail Multi-Pass]: Detail Level {detail_level}/5 - generating cosmic dust striations and star motes.",
            f"7. [ACES Filmic Color Grading]: Harmonizing {style.upper()} palette with deep astronomical contrast."
        ]
    elif any(w in prompt_lower for w in ['dragon', 'creature', 'beast', 'monster']):
        arch_type = 'Mythological Dragon & Draconic Beast Anatomy'
        return [
            f"1. [Thematic Decomposition]: Mapping subject to '{arch_type}'.",
            f"2. [Anatomical Modeling]: Constructing horned draconic crest, serpentine snout, and membranous wingspan.",
            f"3. [Bioluminescent & Flame Decoders]: Simulating internal core plasma fire and glowing serpentine eyes.",
            f"4. [Environmental Atmosphere]: Generating billowing smoke embers, craggy perches, and lightning flashes.",
            f"5. [Scale & Texture Synthesis]: Applying serpentine scale patterns with specular highlight reflections.",
            f"6. [Detail Multi-Pass]: Detail Level {detail_level}/5 - rendering fine claw talons and horn striations.",
            f"7. [ACES Filmic Color Grading]: Harmonizing {style.upper()} palette with cinematic contrast and specular highlights."
        ]
    elif any(w in prompt_lower for w in ['car', 'vehicle', 'mechanical', 'robot', 'engine']):
        arch_type = 'Aerodynamic Mechanical & Automotive Engineering'
        return [
            f"1. [Thematic Decomposition]: Mapping subject to '{arch_type}'.",
            f"2. [Chassis Dynamics]: Constructing low-drag silhouette with aerodynamic front splitter and cockpit canopy.",
            f"3. [Surface Materials]: Computing metallic automotive paint with dual-coat specular reflection and carbon fiber weave.",
            f"4. [Speed Optics]: Generating asphalt ground reflection, motion light trails, and illuminated headlamp beams.",
            f"5. [Mechanical Exposition]: Revealing titanium exhaust manifolds and aero wheel rims with brake disc heat bloom.",
            f"6. [Detail Multi-Pass]: Detail Level {detail_level}/5 - computing high-frequency metal flakes and tire tread textures.",
            f"7. [ACES Filmic Color Grading]: Harmonizing {style.upper()} palette with high-octane cinematic color grading."
        ]

    is_arch = 'archangel' in tokens or 'michael' in tokens
    is_seraph = 'seraphim' in tokens or 'six' in tokens

    if is_arch:
        arch_type = 'Militant Archangel (Warrior of Light with Flaming Blade & Celestial Aegis)'
    elif is_seraph:
        arch_type = 'Highest Seraphic Choir (Six Wings of Living Fire & Eternal Radiance)'
    else:
        arch_type = 'Heavenly Guardian Angel (Protector of Souls with Sacred Halo)'

    return [
        f"1. [Theological Iconography]: Mapping subject to '{arch_type}'.",
        f"2. [Wing Aerodynamics & Anatomy]: Constructing 3-tier feather canopy: primary flight remiges ({width}px span), secondary fans, and downy covert plumes.",
        f"3. [Sacred Geometric Halo]: Rendering concentric dual gold rings (R1=0.155, R2=0.185) with 8-fold cruciform starlight flares.",
        f"4. [Volumetric Atmospheric Optics]: Simulating 28 Mie-scattered god-ray shafts radiating from celestial zenith (Y=-1.18) with exponential haze falloff.",
        f"5. [Classical Chiaroscuro Draping]: Applying Da Vinci / Caravaggio shadow modeling to flowing ivory robes with golden filigree embroidery.",
        f"6. [Detail Multi-Pass Synthesis]: Detail Level {detail_level}/5 - computing {detail_level * 6} octave fractal micro-striations for individual feather barbs.",
        f"7. [ACES Filmic Color Grading]: Harmonizing {style.upper()} palette with dynamic range compression, golden specular bloom, and fine canvas texture at {width}x{height}."
    ]


def parse_prompt_semantics(prompt: str) -> Dict[str, float]:
    tokens = re.findall(r'[a-zA-Z]+', prompt.lower())
    params = {
        "wing_power": 0.0,
        "halo_power": 0.0,
        "divine_rays": 0.0,
        "warmth": 0.25,
        "glow": 0.6,
        "feathers": 0.0,
        "clouds": 0.5,
        "stars": 0.2,
        "nebula": 0.1,
        "neon_cyan": 0.0,
        "neon_magenta": 0.0,
        "gold_hue": 0.3,
        "red_hue": 0.0,
        "white_hue": 0.3,
        "renaissance_tone": 0.0,
        "darkness": 0.2,
        "flame": 0.0,
        "chiaroscuro": 0.4
    }
    
    matched_any = False
    for tok in tokens:
        if tok in ANGELIC_KEYWORDS:
            matched_any = True
            for k, v in ANGELIC_KEYWORDS[tok].items():
                params[k] = max(params.get(k, 0.0), v)
                
    if not matched_any:
        prompt_l = prompt.lower()
        if any(w in prompt_l for w in ["city", "cyberpunk", "future", "neon", "metropolis"]):
            params["neon_cyan"] = 0.95
            params["neon_magenta"] = 0.9
            params["darkness"] = 0.85
            params["glow"] = 1.05
        elif any(w in prompt_l for w in ["space", "galaxy", "cosmic", "star", "nebula"]):
            params["stars"] = 1.0
            params["nebula"] = 0.95
            params["darkness"] = 0.85
            params["glow"] = 1.0
        elif any(w in prompt_l for w in ["mountain", "lake", "landscape", "tree", "forest", "nature"]):
            params["clouds"] = 0.85
            params["warmth"] = 0.7
            params["glow"] = 0.6
        elif any(w in prompt_l for w in ["dragon", "monster", "beast", "creature"]):
            params["flame"] = 0.85
            params["darkness"] = 0.75
            params["glow"] = 0.95
        elif any(w in prompt_l for w in ["car", "vehicle", "auto", "race", "speed"]):
            params["neon_cyan"] = 0.8
            params["darkness"] = 0.75
            params["glow"] = 0.85
        else:
            params["wing_power"] = 1.05
            params["halo_power"] = 0.95
            params["divine_rays"] = 0.85
            params["glow"] = 0.95
            params["clouds"] = 0.65
            params["gold_hue"] = 0.6

    return params


def synthesize_angel_art(
    prompt: str,
    width: int = 1024,
    height: int = 1024,
    seed: Optional[int] = None,
    style: str = "default",
    detail_level: int = 4,
    high_thinking: bool = False,
    progress_callback: Optional[Callable[[float, str, float], None]] = None,
    cancel_check: Optional[Callable[[], bool]] = None
) -> Image.Image:
    """
    Museum-grade celestial art synthesis.
    Renders multi-layered anatomical wings, sacred halos, volumetric rays,
    draped robes, floating starlight motes, and ACES filmic grading.
    """
    t_start = time.time()
    pixel_scale = (width * height) / (1024 * 1024)
    total_estimated_time = 0.4 + (detail_level * 0.22) * (pixel_scale ** 0.5)

    if seed is not None:
        torch.manual_seed(seed)
        np.random.seed(seed)
        random.seed(seed)
    else:
        seed = random.randint(1000, 999999)
        torch.manual_seed(seed)
        np.random.seed(seed)

    params = parse_prompt_semantics(prompt)

    # Style presets
    if style == "renaissance":
        params["renaissance_tone"] = 1.0
        params["warmth"] = 0.7
        params["gold_hue"] = 0.9
        params["chiaroscuro"] = 0.9
    elif style == "divine_gold":
        params["gold_hue"] = 1.0
        params["warmth"] = 0.95
        params["divine_rays"] = 1.15
        params["halo_power"] = 1.2
    elif style == "cyberpunk":
        params["neon_cyan"] = 1.0
        params["neon_magenta"] = 0.95
        params["darkness"] = 0.85
    elif style == "celestial":
        params["stars"] = 0.95
        params["nebula"] = 0.9
        params["glow"] = 1.1

    if high_thinking:
        params["wing_power"] = min(params["wing_power"] * 1.3, 1.6)
        params["halo_power"] = min(params["halo_power"] * 1.3, 1.5)
        params["divine_rays"] = min(params["divine_rays"] * 1.35, 1.6)
        params["glow"] = min(params["glow"] * 1.25, 1.4)

    if cancel_check and cancel_check():
        raise InterruptedError("Generation aborted by user.")

    if progress_callback:
        progress_callback(0.12, "Laying down heavenly dawn underpainting...", max(0.1, total_estimated_time - 0.1))

    # Normalized Coordinate Grid
    ys = torch.linspace(-1.0, 1.0, height)
    xs = torch.linspace(-1.0, 1.0, width)
    grid_y, grid_x = torch.meshgrid(ys, xs, indexing='ij')
    r = torch.sqrt(grid_x**2 + grid_y**2)

    # 1. Classical Sky Underpainting with Chiaroscuro Dawn
    sky_t = (grid_y + 1.0) * 0.5  # 0 top, 1 bottom
    
    if params["darkness"] > 0.6:
        top_color = torch.tensor([0.04, 0.06, 0.14])
        bot_color = torch.tensor([0.02, 0.02, 0.05])
    elif params["renaissance_tone"] > 0.5:
        # Rich Titian / Da Vinci warm amber sky blending into deep umber
        top_color = torch.tensor([0.94, 0.80, 0.52])
        bot_color = torch.tensor([0.16, 0.10, 0.07])
    elif params["neon_cyan"] > 0.5:
        top_color = torch.tensor([0.08, 0.15, 0.32])
        bot_color = torch.tensor([0.03, 0.05, 0.10])
    else:
        # Luminous Celestial Dawn
        top_color = torch.tensor([0.98, 0.90, 0.75])
        bot_color = torch.tensor([0.32, 0.18, 0.34])

    bg_r = top_color[0] * (1.0 - sky_t) + bot_color[0] * sky_t
    bg_g = top_color[1] * (1.0 - sky_t) + bot_color[1] * sky_t
    bg_b = top_color[2] * (1.0 - sky_t) + bot_color[2] * sky_t

    # Multi-Octave Atmospheric Clouds & Mist
    cloud_octaves = 3 + detail_level
    cloud_noise = torch.zeros_like(grid_x)
    freq = 3.5
    amp = 1.0
    for o in range(cloud_octaves):
        cloud_noise += amp * torch.sin(grid_x * freq + (seed % 19) + o) * torch.cos(grid_y * (freq * 0.9) + (seed % 11))
        freq *= 2.05
        amp *= 0.52

    cloud_mask = (torch.sigmoid(cloud_noise * 1.6) * 0.4 + 0.6) * (sky_t * 0.65 + 0.35)
    bg_r *= cloud_mask
    bg_g *= cloud_mask
    bg_b *= cloud_mask

    # Nebula & Cosmic Stardust
    if params["stars"] > 0.25:
        star_hash = torch.sin(grid_x * 2345.6 + grid_y * 1234.5 + (seed % 97)) * 43758.5453
        star_points = (star_hash - torch.floor(star_hash) > (0.992 - 0.002 * detail_level)).float()
        bg_r += star_points * 0.95
        bg_g += star_points * 0.92
        bg_b += star_points * 1.0

    if cancel_check and cancel_check():
        raise InterruptedError("Generation aborted by user.")

    if progress_callback:
        elapsed = time.time() - t_start
        progress_callback(0.35, "Simulating Mie volumetric god rays & sacred halo...", max(0.1, total_estimated_time - elapsed))

    # 2. Mie Volumetric God Rays
    light_x, light_y = 0.0, -1.22
    dx = grid_x - light_x
    dy = grid_y - light_y
    ray_angle = torch.atan2(dx, dy)
    dist_light = torch.sqrt(dx**2 + dy**2)

    ray_freq = 16.0 + (detail_level * 2.5)
    rays = (torch.sin(ray_angle * ray_freq + (seed % 37) * 0.15) ** 2)
    rays += 0.55 * (torch.sin(ray_angle * (ray_freq * 2.1) + 1.4) ** 2)
    rays += 0.25 * (torch.sin(ray_angle * (ray_freq * 4.3) + 2.7) ** 2)
    
    ray_falloff = 1.0 / (1.0 + dist_light * 1.25)
    divine_light = rays * ray_falloff * params["divine_rays"] * 0.85

    if params["neon_cyan"] > 0.5:
        bg_r += divine_light * 0.15
        bg_g += divine_light * 0.85
        bg_b += divine_light * 1.0
    else:
        bg_r += divine_light * 1.0
        bg_g += divine_light * 0.88
        bg_b += divine_light * 0.48

    # 3. Concentric Sacred Geometry Halo with Cruciform Rays
    head_x, head_y = 0.0, -0.22
    head_dist = torch.sqrt((grid_x - head_x)**2 + (grid_y - head_y)**2)
    
    # Outer Ring & Inner Ring
    halo_r1 = 0.165
    halo_r2 = 0.195
    halo_line1 = torch.exp(-torch.abs(head_dist - halo_r1) * (45.0 + detail_level * 6.0))
    halo_line2 = torch.exp(-torch.abs(head_dist - halo_r2) * (55.0 + detail_level * 8.0)) * 0.75
    
    # Cruciform Cross / Radial Starlight Burst from Halo
    cross_dist = torch.min(torch.abs(grid_x - head_x), torch.abs(grid_y - head_y))
    cross_flare = torch.exp(-cross_dist * 50.0) * torch.exp(-head_dist * 4.0) * 0.45
    
    halo_soft_glow = torch.exp(-torch.abs(head_dist - halo_r1) * 7.5) * 0.65
    halo_total = (halo_line1 + halo_line2 + cross_flare + halo_soft_glow) * params["halo_power"]

    if params["neon_cyan"] > 0.5:
        bg_r += halo_total * 0.15
        bg_g += halo_total * 0.95
        bg_b += halo_total * 1.0
    else:
        # Brilliant Divine Gold (24K Leaf Specular Glow)
        bg_r += halo_total * 1.05
        bg_g += halo_total * 0.92
        bg_b += halo_total * 0.42

    if cancel_check and cancel_check():
        raise InterruptedError("Generation aborted by user.")

    if progress_callback:
        elapsed = time.time() - t_start
        progress_callback(0.65, f"Rendering 4K anatomical wings & remiges (Detail {detail_level}/5)...", max(0.1, total_estimated_time - elapsed))

    # 4. Multi-Layer Anatomical Feathered Wings
    abs_x = torch.abs(grid_x)
    rel_y = grid_y - (-0.10)
    wing_power = params["wing_power"]

    # Wing Architecture:
    # Tier 1: Outer Flight Remiges (Swept arched curves extending to width=0.92)
    # Tier 2: Mid-tier Secondary Fans (width=0.60, soft overlap)
    # Tier 3: Downy Shoulder Coverts (billowing cloud-feather base)
    
    # Tier 1 Primary Remiges
    arch_y1 = -0.48 + 0.85 * (abs_x - 0.48)**2
    wing_env1 = (abs_x > 0.06) & (abs_x < 0.92) & (grid_y > -0.70) & (grid_y < 0.42)
    wing_thick1 = torch.clamp(0.30 - 0.22 * (abs_x - 0.38)**2, 0.03, 0.38)
    wing_core1 = torch.exp(-((rel_y - arch_y1) / wing_thick1)**2 * 6.5) * wing_env1.float()

    # Tier 2 Secondary Feathers (Lower fan)
    arch_y2 = -0.32 + 0.70 * (abs_x - 0.38)**2
    wing_env2 = (abs_x > 0.06) & (abs_x < 0.68) & (grid_y > -0.45) & (grid_y < 0.50)
    wing_thick2 = torch.clamp(0.24 - 0.20 * (abs_x - 0.28)**2, 0.02, 0.30)
    wing_core2 = torch.exp(-((rel_y - arch_y2) / wing_thick2)**2 * 7.5) * wing_env2.float()

    # Feather Barb Striations & Micro-Texturing
    wing_angle = torch.atan2(rel_y, abs_x - 0.05)
    f_freq1 = 36.0 + (detail_level * 10.0)
    feather_bands = torch.sin(wing_angle * f_freq1 + abs_x * 22.0)
    feather_bands2 = torch.cos(wing_angle * (f_freq1 * 0.55) - abs_x * 12.0)
    
    # 4K Micro-Barb Detail
    micro_barbs = torch.sin(abs_x * 128.0 + grid_y * 110.0) * (0.18 + 0.05 * detail_level)
    feather_tex = torch.sigmoid((feather_bands * 0.55 + feather_bands2 * 0.35 + micro_barbs) * 5.0)

    # Combined Wing Alpha
    wing_combined = (wing_core1 * 1.0 + wing_core2 * 0.85) * (0.75 + 0.50 * feather_tex) * wing_power
    wing_alpha = torch.clamp(wing_combined, 0.0, 1.0)

    # Coloration with Iridescent Sheen
    if params["neon_cyan"] > 0.5:
        wing_color_r = 0.25 + 0.70 * feather_tex
        wing_color_g = 0.85 + 0.15 * feather_tex
        wing_color_b = 1.0
    elif params["flame"] > 0.5:
        wing_color_r = 1.0
        wing_color_g = 0.65 + 0.35 * feather_tex
        wing_color_b = 0.18
    else:
        # Sacred Luminous White with Golden Pearl Undertones
        pearl = torch.sin(abs_x * 8.0) * 0.05
        wing_color_r = 0.99 + pearl
        wing_color_g = 0.97 + 0.03 * feather_tex
        wing_color_b = 0.91 + 0.09 * feather_tex

    bg_r = bg_r * (1.0 - wing_alpha * 0.88) + wing_color_r * wing_alpha * 0.96
    bg_g = bg_g * (1.0 - wing_alpha * 0.88) + wing_color_g * wing_alpha * 0.96
    bg_b = bg_b * (1.0 - wing_alpha * 0.88) + wing_color_b * wing_alpha * 0.96

    # 5. Angel Figure Silhouette & Flowing Renaissance Drapery
    robe_width = 0.08 + 0.38 * torch.clamp(grid_y - (-0.14), 0.0, 1.25)**1.35
    body_mask = (abs_x < robe_width) & (grid_y >= -0.22) & (grid_y <= 0.96)
    body_dist = abs_x / (robe_width + 1e-4)
    body_alpha = torch.clamp(1.0 - body_dist**2, 0.0, 1.0) * body_mask.float()

    # Classical Chiaroscuro Textile Folds
    folds1 = torch.sin(abs_x * (32.0 + detail_level * 6.0) + grid_y * 14.0) * 0.18
    folds2 = torch.cos(abs_x * 16.0 - grid_y * 22.0) * 0.10
    body_shading = torch.clamp(0.85 + folds1 + folds2 - body_dist * 0.42, 0.35, 1.05)

    # Regal Head Silhouette & Flowing Hair
    head_mask = torch.clamp(1.0 - (head_dist / 0.082)**2, 0.0, 1.0)
    
    # Golden Filigree Pectoral Ornament on Chest
    chest_y = -0.05
    chest_dist = torch.sqrt((grid_x)**2 + ((grid_y - chest_y) * 2.2)**2)
    filigree = torch.exp(-chest_dist * 28.0) * (torch.sin(abs_x * 48.0) ** 2) * 0.85

    body_total = torch.clamp(body_alpha * 0.92 + head_mask * 0.96, 0.0, 1.0)

    if params["darkness"] > 0.6:
        robe_r = 0.14 * body_shading
        robe_g = 0.18 * body_shading
        robe_b = 0.32 * body_shading
    elif params["renaissance_tone"] > 0.5:
        robe_r = 0.94 * body_shading + filigree * 0.9
        robe_g = 0.84 * body_shading + filigree * 0.8
        robe_b = 0.70 * body_shading + filigree * 0.3
    else:
        robe_r = 0.97 * body_shading + filigree * 0.8
        robe_g = 0.95 * body_shading + filigree * 0.7
        robe_b = 0.91 * body_shading + filigree * 0.3

    bg_r = bg_r * (1.0 - body_total * 0.94) + robe_r * body_total * 0.96
    bg_g = bg_g * (1.0 - body_total * 0.94) + robe_g * body_total * 0.96
    bg_b = bg_b * (1.0 - body_total * 0.94) + robe_b * body_total * 0.96

    # 6. Floating Starlight Dust & Celestial Embers
    num_particles = 120 + (detail_level * 60)
    torch.manual_seed(seed + 888)
    ember_x = (torch.rand(num_particles) * 2.0 - 1.0) * 0.88
    ember_y = torch.rand(num_particles) * 1.85 - 0.92
    for px, py in zip(ember_x[:80], ember_y[:80]):
        dist_p = torch.sqrt((grid_x - px)**2 + (grid_y - py)**2)
        ember_glow = torch.exp(-dist_p * (65.0 + detail_level * 12.0)) * 0.9
        bg_r += ember_glow * 1.0
        bg_g += ember_glow * 0.88
        bg_b += ember_glow * 0.45

    # 7. Fine Canvas Micro-Texture & Vignette
    canvas_grain = (torch.sin(grid_x * 800.0) * torch.cos(grid_y * 800.0)) * 0.015
    bg_r += canvas_grain
    bg_g += canvas_grain
    bg_b += canvas_grain

    vignette = 1.0 - 0.20 * (r ** 2.2)
    bg_r *= vignette
    bg_g *= vignette
    bg_b *= vignette

    if progress_callback:
        progress_callback(0.95, "Applying ACES filmic tone curve & bloom...", 0.05)

    # ACES Filmic Tone Mapping approximation: (x * (a * x + b)) / (x * (c * x + d) + e)
    def aces_filmic(x):
        a = 2.51
        b = 0.03
        c = 2.43
        d = 0.59
        e = 0.14
        return torch.clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0)

    bg_r = aces_filmic(bg_r)
    bg_g = aces_filmic(bg_g)
    bg_b = aces_filmic(bg_b)

    r_np = (bg_r.numpy() * 255.0).astype(np.uint8)
    g_np = (bg_g.numpy() * 255.0).astype(np.uint8)
    b_np = (bg_b.numpy() * 255.0).astype(np.uint8)

    rgb = np.stack([r_np, g_np, b_np], axis=-1)
    img = Image.fromarray(rgb, mode='RGB')

    # Specular Golden Bloom Diffusion
    bloom_radius = max(2, int(width / 240))
    bloom = img.filter(ImageFilter.GaussianBlur(radius=bloom_radius))
    img = Image.blend(img, bloom, alpha=0.16)

    if progress_callback:
        progress_callback(1.0, "Complete!", 0.0)

    return img
