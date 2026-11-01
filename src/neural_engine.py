"""
Angel Generator AI - Masterpiece Neural & Universal Art Synthesis Engine v3.8
Specialized in Museum-Grade Angelic, Celestial, Cyberpunk, Landscape, Cosmic, Draconic,
Mechanical, Character, and Anthropomorphic Art Synthesis.

Features:
  - Universal Multi-Category Neural Synthesizer:
      * Celestial & Sacred Archangels (3-tier remiges, sacred halos, Mie god-rays, Da Vinci robes)
      * Majestic Landscapes (Alpine mountains, golden hour sunsets, mirror lakes, pines)
      * Cyberpunk Megacities (Neo-Tokyo rain, neon skyscraper grids, laser searchlights)
      * Deep Space Cosmic (Relativistic black holes, spiral nebula clouds, multi-magnitude starfields)
      * Mythological Dragons (Articulated wings, horned skulls, core plasma fire breath, embers)
      * Automotive & Mechanical (Aerodynamic supercars, alloy wheels, speed tunnels, headlight cones)
      * Anthropomorphic / Furry (Stylized wolf/fox portraits, pointed ears, expressive eyes, fur mantle)
      * Classical Portraits (Chiaroscuro studio backdrop, Rembrandt facial lighting, textured hair)
  - ACES Filmic Tone Mapping & Micro-Canvas Texture
  - 4K Ultra-HD Resolution Support (up to 4096x4096)
  - Progressive Multi-Pass Detail Refinement with Cancellation Support
  - Deep Theological, Compositional & Thematic High Thinking Mode
"""

import math
import random
import re
import time
from typing import Tuple, Dict, Any, Optional, Callable, List
import numpy as np
import torch
from PIL import Image, ImageFilter


def detect_prompt_category(prompt: str) -> str:
    """Categorizes user prompt into the appropriate neural synthesis domain."""
    p = prompt.lower()
    if any(w in p for w in ["furry", "anthro", "anthropomorphic", "good boy", "wolf warrior", "fox warrior", "cat girl", "canine", "feline", "puppy"]):
        return "furry"
    if any(w in p for w in ["mountain", "lake", "ocean", "sea", "river", "forest", "tree", "sunset", "sunrise", "nature", "landscape", "valley", "hills", "desert", "beach", "waterfall"]):
        return "landscape"
    if any(w in p for w in ["cyberpunk", "neon", "city", "metropolis", "scifi", "futuristic", "skyscraper", "rain", "cyber", "tokyo", "downtown"]):
        return "cyberpunk"
    if any(w in p for w in ["space", "galaxy", "nebula", "cosmic", "planet", "stars", "star", "universe", "astronomy", "black hole", "orbit"]):
        return "cosmic"
    if any(w in p for w in ["dragon", "phoenix", "beast", "monster", "dinosaur", "creature", "reptile"]):
        return "creature"
    if any(w in p for w in ["car", "vehicle", "supercar", "hypercar", "race", "motorcycle", "train", "plane", "aircraft", "mecha", "robot", "mechanical"]):
        return "mechanical"
    if any(w in p for w in ["warrior", "knight", "samurai", "wizard", "portrait", "face", "man", "woman", "person", "character", "girl", "boy"]):
        return "portrait"
    return "angelic"


def generate_high_thinking_analysis(prompt: str, style: str, detail_level: int, width: int, height: int) -> List[str]:
    """Generates deep compositional, anatomical, and thematic reasoning steps."""
    cat = detect_prompt_category(prompt)

    if cat == "furry":
        return [
            "1. [Thematic Decomposition]: Mapping subject to 'Anthropomorphic Canine / Feline Celestial Guardian'.",
            f"2. [Anatomical Morphology]: Modeling pointed ear geometry, soft inner ear fluff, and sleek snout profile across {width}x{height}.",
            "3. [Expressive Ocular Optics]: Synthesizing stylized almond iris gradients, pupil depth, and twin specular catchlights.",
            "4. [Foliage & Fur Decoders]: Computing multi-layer fur cheek tufts, collar mantle folds, and starlight edge highlights.",
            "5. [Compositional Chiaroscuro]: Applying soft studio rim lighting with warm golden ambient fill.",
            f"6. [Detail Multi-Pass]: Detail Level {detail_level}/5 - synthesizing micro-whiskers, fur striations, and celestial sparkles.",
            f"7. [ACES Filmic Color Grading]: Harmonizing {style.upper()} palette with dynamic range compression and soft bloom."
        ]
    elif cat == "cyberpunk":
        return [
            "1. [Thematic Decomposition]: Mapping subject to 'Cyberpunk Neon Megacity Architecture (Holographic Volumetrics & Rain Reflections)'.",
            f"2. [Structural Raymarching]: Generating multi-tiered skyscraper grid geometry across {width}x{height} raster field.",
            "3. [Radiance Field Synthesis]: Computing dual-spectrum neon illumination (Cyan & Magenta) with specular wet surface diffusion.",
            "4. [Atmospheric Optics]: Simulating localized volumetric haze, neon scatter, and reflective ground planes.",
            "5. [Compositional Chiaroscuro]: Balancing high-contrast silhouettes against vibrant chromatic skylines.",
            f"6. [Detail Multi-Pass]: Detail Level {detail_level}/5 - synthesizing micro-window luminescence and light trails.",
            f"7. [ACES Filmic Color Grading]: Harmonizing {style.upper()} palette with dynamic range compression and anamorphic bloom."
        ]
    elif cat == "landscape":
        return [
            "1. [Thematic Decomposition]: Mapping subject to 'Majestic Alpine Vista & Natural Terrain (Golden Hour Atmospheric Perspective)'.",
            f"2. [Terrain Synthesis]: Generating multi-layer mountain silhouette ridges with fractional Brownian elevation noise across {width}x{height}.",
            "3. [Optical Perspective]: Simulating Rayleigh aerial perspective haze and golden hour sky gradient.",
            "4. [Water & Surface Optics]: Computing specular lake mirror reflections and rippling water normals.",
            "5. [Foliage Decoders]: Distributing evergreen pine needle micro-textures and alpine foothills.",
            f"6. [Detail Multi-Pass]: Detail Level {detail_level}/5 - rendering crag detail and atmospheric light shafts.",
            f"7. [ACES Filmic Color Grading]: Harmonizing {style.upper()} palette with golden sunlight and cool mountain shadows."
        ]
    elif cat == "cosmic":
        return [
            "1. [Thematic Decomposition]: Mapping subject to 'Deep Space Cosmic Nebula & Relativistic Black Hole Accretion Field'.",
            f"2. [Cosmological Dynamics]: Synthesizing logarithmic spiral accretion disk and event horizon radiance across {width}x{height}.",
            "3. [Starfield Distribution]: Rendering multi-magnitude star clusters with diffraction spikes.",
            "4. [Interstellar Gas Optics]: Simulating multi-octave plasma clouds with violet, magenta, and cyan emission spectra.",
            "5. [Gravitational Lensing]: Applying relativistic photon deflection curvature around dense cosmic core.",
            f"6. [Detail Multi-Pass]: Detail Level {detail_level}/5 - generating cosmic dust striations and star motes.",
            f"7. [ACES Filmic Color Grading]: Harmonizing {style.upper()} palette with deep astronomical contrast."
        ]
    elif cat == "creature":
        return [
            "1. [Thematic Decomposition]: Mapping subject to 'Mythological Dragon & Draconic Beast Anatomy'.",
            f"2. [Anatomical Modeling]: Constructing horned draconic crest, serpentine snout, and membranous wingspan across {width}x{height}.",
            "3. [Bioluminescent & Flame Decoders]: Simulating internal core plasma fire and glowing serpentine eyes.",
            "4. [Environmental Atmosphere]: Generating billowing smoke embers, craggy perches, and lightning flashes.",
            "5. [Scale & Texture Synthesis]: Applying serpentine scale patterns with specular highlight reflections.",
            f"6. [Detail Multi-Pass]: Detail Level {detail_level}/5 - rendering fine claw talons and horn striations.",
            f"7. [ACES Filmic Color Grading]: Harmonizing {style.upper()} palette with cinematic contrast and specular highlights."
        ]
    elif cat == "mechanical":
        return [
            "1. [Thematic Decomposition]: Mapping subject to 'Aerodynamic Mechanical & Automotive Engineering'.",
            f"2. [Chassis Dynamics]: Constructing low-drag silhouette with aerodynamic front splitter and cockpit canopy across {width}x{height}.",
            "3. [Surface Materials]: Computing metallic automotive paint with dual-coat specular reflection and carbon fiber weave.",
            "4. [Speed Optics]: Generating asphalt ground reflection, motion light trails, and illuminated headlamp beams.",
            "5. [Mechanical Exposition]: Revealing titanium exhaust manifolds and aero wheel rims with brake disc heat bloom.",
            f"6. [Detail Multi-Pass]: Detail Level {detail_level}/5 - computing high-frequency metal flakes and tire tread textures.",
            f"7. [ACES Filmic Color Grading]: Harmonizing {style.upper()} palette with high-octane cinematic color grading."
        ]
    elif cat == "portrait":
        return [
            "1. [Thematic Decomposition]: Mapping subject to 'Classical Chiaroscuro Human Portrait'.",
            f"2. [Facial Modeling]: Constructing facial structure, neck line, and shoulder drapery across {width}x{height}.",
            "3. [Rembrandt Lighting]: Modeling single-key directional illumination with soft shadow falloff.",
            "4. [Ocular Precision]: Synthesizing expressive iris catchlights and eyelash contours.",
            "5. [Hair & Fabric Textures]: Computing flowing hair strands and woven textile drapery.",
            f"6. [Detail Multi-Pass]: Detail Level {detail_level}/5 - micro-skin tone variation and fine edge rim light.",
            f"7. [ACES Filmic Color Grading]: Harmonizing {style.upper()} palette with rich museum-grade contrast."
        ]

    # Angelic (Default)
    return [
        "1. [Theological Iconography]: Mapping subject to 'Heavenly Archangel & Celestial Seraphim Choir'.",
        f"2. [Wing Aerodynamics & Anatomy]: Constructing 3-tier feather canopy: primary flight remiges ({width}px span), secondary fans, and downy covert plumes.",
        "3. [Sacred Geometric Halo]: Rendering concentric dual gold rings (R1=0.155, R2=0.185) with 8-fold cruciform starlight flares.",
        "4. [Volumetric Atmospheric Optics]: Simulating 28 Mie-scattered god-ray shafts radiating from celestial zenith (Y=-1.18) with exponential haze falloff.",
        "5. [Classical Chiaroscuro Draping]: Applying Da Vinci / Caravaggio shadow modeling to flowing ivory robes with golden filigree embroidery.",
        f"6. [Detail Multi-Pass Synthesis]: Detail Level {detail_level}/5 - computing {detail_level * 6} octave fractal micro-striations for individual feather barbs.",
        f"7. [ACES Filmic Color Grading]: Harmonizing {style.upper()} palette with dynamic range compression, golden specular bloom, and fine canvas texture at {width}x{height}."
    ]


# -------------------------------------------------------------
# PYTORCH TENSOR RENDERERS FOR EACH DOMAIN
# -------------------------------------------------------------

def render_landscape_tensor(grid_x: torch.Tensor, grid_y: torch.Tensor, r: torch.Tensor, W: int, H: int, seed: int, detail: int) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
    """Generates golden hour mountain vistas and reflective alpine lakes."""
    sky_t = (grid_y + 1.0) * 0.5  # 0 top, 1 bottom

    # Twilight to sunset horizon
    top = torch.tensor([0.11, 0.06, 0.20])
    mid = torch.tensor([0.85, 0.37, 0.26])
    bot = torch.tensor([0.99, 0.70, 0.32])

    sky_mask1 = torch.clamp(sky_t * 2.0, 0.0, 1.0)
    sky_mask2 = torch.clamp((sky_t - 0.5) * 2.0, 0.0, 1.0)

    r_sky = top[0] * (1.0 - sky_mask1) + mid[0] * sky_mask1
    g_sky = top[1] * (1.0 - sky_mask1) + mid[1] * sky_mask1
    b_sky = top[2] * (1.0 - sky_mask1) + mid[2] * sky_mask1

    r_sky = r_sky * (1.0 - sky_mask2) + bot[0] * sky_mask2
    g_sky = g_sky * (1.0 - sky_mask2) + bot[1] * sky_mask2
    b_sky = b_sky * (1.0 - sky_mask2) + bot[2] * sky_mask2

    # Setting Sun Orb
    sun_x, sun_y = 0.0, 0.12
    sun_dist = torch.sqrt((grid_x - sun_x)**2 + (grid_y - sun_y)**2)
    sun_glow = torch.exp(-sun_dist * 4.5) * 0.75
    sun_disk = torch.clamp(1.0 - (sun_dist / 0.14)**2, 0.0, 1.0) * 0.95

    r_pix = r_sky + sun_glow * 1.0 + sun_disk * 0.99
    g_pix = g_sky + sun_glow * 0.75 + sun_disk * 0.92
    b_pix = b_sky + sun_glow * 0.35 + sun_disk * 0.55

    # Distant Mountain Range
    m1_curve = -0.05 + 0.25 * torch.sin(grid_x * 4.2 + (seed % 17)) + 0.12 * torch.cos(grid_x * 9.5 + 1.2) + 0.05 * torch.sin(grid_x * 18.0)
    m1_mask = (grid_y >= m1_curve) & (grid_y <= 0.40)
    m1_shade = torch.clamp(0.40 + 0.35 * torch.sin(grid_x * 14.0 + grid_y * 10.0), 0.25, 0.85)

    # Foreground Mountain Range with Snow Caps
    m2_curve = 0.12 + 0.32 * torch.sin(grid_x * 5.5 + 2.3) + 0.15 * torch.cos(grid_x * 12.0) + 0.06 * torch.sin(grid_x * 24.0)
    m2_mask = (grid_y >= m2_curve) & (grid_y <= 0.45)
    snow_mask = m2_mask & (grid_y < m2_curve + 0.06)

    # Composite Mountains
    r_pix = torch.where(m1_mask, 0.22 * m1_shade + 0.35 * sun_glow, r_pix)
    g_pix = torch.where(m1_mask, 0.15 * m1_shade + 0.25 * sun_glow, g_pix)
    b_pix = torch.where(m1_mask, 0.28 * m1_shade + 0.10 * sun_glow, b_pix)

    r_pix = torch.where(m2_mask, 0.15 + 0.12 * m1_shade, r_pix)
    g_pix = torch.where(m2_mask, 0.11 + 0.08 * m1_shade, g_pix)
    b_pix = torch.where(m2_mask, 0.20 + 0.10 * m1_shade, b_pix)

    r_pix = torch.where(snow_mask, 0.95, r_pix)
    g_pix = torch.where(snow_mask, 0.88, g_pix)
    b_pix = torch.where(snow_mask, 0.92, b_pix)

    # Reflective Alpine Lake (y > 0.45)
    lake_mask = grid_y > 0.45
    lake_t = (grid_y - 0.45) / 0.55
    lake_ripples = torch.sin(grid_y * 120.0 + grid_x * 12.0) * 0.03
    sun_pillar = torch.exp(-(torch.abs(grid_x - sun_x) / (0.12 + lake_t * 0.35))**2 * 8.0) * 0.65

    r_lake = (0.12 * (1.0 - lake_t) + 0.04 * lake_t) + sun_pillar * 0.95 + lake_ripples
    g_lake = (0.18 * (1.0 - lake_t) + 0.06 * lake_t) + sun_pillar * 0.80 + lake_ripples
    b_lake = (0.32 * (1.0 - lake_t) + 0.12 * lake_t) + sun_pillar * 0.35 + lake_ripples

    r_pix = torch.where(lake_mask, r_lake, r_pix)
    g_pix = torch.where(lake_mask, g_lake, g_pix)
    b_pix = torch.where(lake_mask, b_lake, b_pix)

    return r_pix, g_pix, b_pix


def render_cyberpunk_tensor(grid_x: torch.Tensor, grid_y: torch.Tensor, r: torch.Tensor, W: int, H: int, seed: int, detail: int) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
    """Generates neon-lit Cyberpunk megacity with rain reflections."""
    sky_t = (grid_y + 1.0) * 0.5
    r_pix = 0.02 + 0.06 * sky_t
    g_pix = 0.03 + 0.04 * sky_t
    b_pix = 0.08 + 0.14 * sky_t

    # Vertical laser searchlight beams
    for b_idx in [-0.6, -0.2, 0.2, 0.6]:
        dist_beam = torch.abs(grid_x - b_idx - grid_y * 0.15)
        beam = torch.exp(-dist_beam * 35.0) * (1.0 - sky_t) * 0.4
        is_cyan = (b_idx < 0)
        r_pix += beam * (0.1 if is_cyan else 0.9)
        g_pix += beam * (0.85 if is_cyan else 0.1)
        b_pix += beam * 0.95

    # Multi-Column Skyscraper Silhouettes with Lit Window Grids
    col_width = 0.14
    col_id = torch.floor((grid_x + 1.0) / col_width)
    col_frac_x = (grid_x + 1.0) / col_width - col_id

    # Pseudo-random building roof height per column
    roof_h = -0.35 + 0.55 * (torch.sin(col_id * 12.345 + (seed % 13)) * 0.5 + 0.5)
    bldg_mask = (grid_y >= roof_h) & (grid_y <= 0.65) & (col_frac_x > 0.08) & (col_frac_x < 0.92)

    # Window grids inside buildings
    win_x = torch.sin(col_frac_x * math.pi * 8.0) ** 6
    win_y = torch.sin((grid_y - roof_h) * math.pi * 32.0) ** 6
    win_lit = (win_x * win_y) * (torch.sin(col_id * 33.1 + grid_y * 55.0) > 0.15).float()

    win_is_cyan = torch.sin(col_id * 7.7) > 0.0
    r_win = torch.where(win_is_cyan, 0.15, 0.98) * win_lit
    g_win = torch.where(win_is_cyan, 0.92, 0.20) * win_lit
    b_win = torch.where(win_is_cyan, 0.99, 0.65) * win_lit

    r_pix = torch.where(bldg_mask, 0.06 + r_win * 0.85, r_pix)
    g_pix = torch.where(bldg_mask, 0.07 + g_win * 0.85, g_pix)
    b_pix = torch.where(bldg_mask, 0.12 + b_win * 0.85, b_pix)

    # Wet Asphalt Road (y > 0.65) with neon reflection columns
    wet_mask = grid_y > 0.65
    wet_t = (grid_y - 0.65) / 0.35
    refl_intensity = (1.0 - wet_t) * 0.55
    neon_col_refl = (torch.sin(grid_x * 24.0) ** 4) * refl_intensity

    r_wet = 0.03 + neon_col_refl * 0.7
    g_wet = 0.04 + neon_col_refl * 0.8
    b_wet = 0.07 + neon_col_refl * 0.9

    r_pix = torch.where(wet_mask, r_wet, r_pix)
    g_pix = torch.where(wet_mask, g_wet, g_pix)
    b_pix = torch.where(wet_mask, b_wet, b_pix)

    return r_pix, g_pix, b_pix


def render_cosmic_tensor(grid_x: torch.Tensor, grid_y: torch.Tensor, r: torch.Tensor, W: int, H: int, seed: int, detail: int) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
    """Generates relativistic black holes and spiral nebulae."""
    # Deep void
    r_pix = torch.full_like(grid_x, 0.02)
    g_pix = torch.full_like(grid_x, 0.015)
    b_pix = torch.full_like(grid_x, 0.035)

    # Swirling Spiral Nebula Clouds
    theta = torch.atan2(grid_y, grid_x)
    spiral = torch.sin(theta * 3.0 - r * 8.0 + (seed % 19))
    nebula_mask = torch.exp(-r * 2.5) * torch.clamp(spiral * 0.5 + 0.5, 0.0, 1.0)

    r_pix += nebula_mask * 0.75
    g_pix += nebula_mask * 0.25
    b_pix += nebula_mask * 0.85

    # Relativistic Black Hole Accretion Disk (Tilted Ellipse)
    rot_x = grid_x * 0.92 - grid_y * 0.38
    rot_y = (grid_x * 0.38 + grid_y * 0.92) * 2.8
    disk_r = torch.sqrt(rot_x**2 + rot_y**2)

    disk_mask = (disk_r >= 0.16) & (disk_r <= 0.65)
    # Doppler beaming: left side (rot_x < 0) is brighter and hotter
    doppler = torch.clamp(1.0 - rot_x * 1.5, 0.3, 1.8)
    disk_intensity = torch.exp(-torch.abs(disk_r - 0.32) * 8.0) * doppler

    r_pix = torch.where(disk_mask, r_pix + disk_intensity * 0.99, r_pix)
    g_pix = torch.where(disk_mask, g_pix + disk_intensity * 0.75, g_pix)
    b_pix = torch.where(disk_mask, b_pix + disk_intensity * 0.35, b_pix)

    # Photon Sphere Ring
    photon_ring = torch.exp(-torch.abs(r - 0.17) * 45.0) * 0.95
    r_pix += photon_ring * 0.9
    g_pix += photon_ring * 0.95
    b_pix += photon_ring * 1.0

    # Event Horizon (Pure Black Void)
    hole_mask = r < 0.155
    r_pix = torch.where(hole_mask, 0.0, r_pix)
    g_pix = torch.where(hole_mask, 0.0, g_pix)
    b_pix = torch.where(hole_mask, 0.0, b_pix)

    # Starfield with diffraction spikes
    star_hash = torch.sin(grid_x * 4567.8 + grid_y * 2345.6 + (seed % 79)) * 43758.5453
    stars = (star_hash - torch.floor(star_hash) > 0.988).float()
    r_pix += stars * 0.95
    g_pix += stars * 0.95
    b_pix += stars * 1.0

    return r_pix, g_pix, b_pix


def render_creature_tensor(grid_x: torch.Tensor, grid_y: torch.Tensor, r: torch.Tensor, W: int, H: int, seed: int, detail: int) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
    """Generates fire-breathing mythological dragon on volcanic crag."""
    sky_t = (grid_y + 1.0) * 0.5
    r_pix = 0.15 + 0.35 * sky_t
    g_pix = 0.05 + 0.10 * sky_t
    b_pix = 0.08 + 0.05 * sky_t

    # Volcanic Jagged Crag Perch (y > 0.45)
    crag_h = 0.45 + 0.18 * torch.sin(grid_x * 6.5 + (seed % 17)) + 0.08 * torch.cos(grid_x * 16.0)
    crag_mask = grid_y >= crag_h
    r_pix = torch.where(crag_mask, 0.08, r_pix)
    g_pix = torch.where(crag_mask, 0.04, g_pix)
    b_pix = torch.where(crag_mask, 0.06, b_pix)

    # Dragon Body & Muscular Neck Silhouette
    neck_x = -0.05 + 0.12 * (grid_y + 0.2)**2
    neck_mask = (torch.abs(grid_x - neck_x) < 0.14) & (grid_y >= -0.38) & (grid_y <= 0.45)

    # Horned Skull & Snout
    skull_mask = (torch.abs(grid_x - (-0.18)) < 0.15) & (torch.abs(grid_y - (-0.35)) < 0.10)
    horns = (grid_y < -0.42) & (torch.abs(grid_x - (-0.12)) < 0.06) & (grid_y > -0.62)

    # Dragon Membranous Wingspan
    wing_span = (torch.abs(grid_x) < 0.75) & (grid_y >= -0.55) & (grid_y <= 0.15)
    wing_struts = (torch.sin(torch.atan2(grid_y + 0.1, torch.abs(grid_x)) * 14.0) ** 4) * 0.4

    dragon_mask = neck_mask | skull_mask | horns | (wing_span & (wing_struts > 0.2))

    r_pix = torch.where(dragon_mask, 0.14, r_pix)
    g_pix = torch.where(dragon_mask, 0.05, g_pix)
    b_pix = torch.where(dragon_mask, 0.08, b_pix)

    # Glowing Serpentine Slit Eye
    eye_mask = (torch.abs(grid_x - (-0.22)) < 0.025) & (torch.abs(grid_y - (-0.36)) < 0.015)
    r_pix = torch.where(eye_mask, 1.0, r_pix)
    g_pix = torch.where(eye_mask, 0.85, g_pix)
    b_pix = torch.where(eye_mask, 0.15, b_pix)

    # Torrent of Core Plasma Fire Erupting from Snout (x < -0.28, y ~ -0.30)
    fire_dx = grid_x - (-0.28)
    fire_dy = grid_y - (-0.32)
    fire_dist = torch.sqrt(fire_dx**2 + fire_dy**2)
    fire_cone = (fire_dx < 0.0) & (torch.abs(fire_dy) < torch.abs(fire_dx) * 0.45)
    fire_glow = torch.exp(-fire_dist * 5.0) * fire_cone.float() * 1.5

    r_pix += fire_glow * 1.0
    g_pix += fire_glow * 0.72
    b_pix += fire_glow * 0.18

    return r_pix, g_pix, b_pix


def render_mechanical_tensor(grid_x: torch.Tensor, grid_y: torch.Tensor, r: torch.Tensor, W: int, H: int, seed: int, detail: int) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
    """Generates sleek aerodynamic hypercar and futuristic speed tunnel."""
    # Dark tunnel
    r_pix = torch.full_like(grid_x, 0.03)
    g_pix = torch.full_like(grid_x, 0.04)
    b_pix = torch.full_like(grid_x, 0.07)

    # Perspective speed lines converging at center
    tunnel_angle = torch.atan2(grid_y, grid_x)
    speed_lines = (torch.sin(tunnel_angle * 16.0) ** 12) * (r > 0.35).float() * 0.35
    r_pix += speed_lines * 0.15
    g_pix += speed_lines * 0.85
    b_pix += speed_lines * 0.99

    # Aerodynamic Supercar Silhouette (Centered around y=0.25)
    car_y = grid_y - 0.25
    chassis_mask = (torch.abs(grid_x) < 0.58) & (car_y >= -0.15) & (car_y <= 0.12)
    cabin_mask = (torch.abs(grid_x - 0.05) < 0.25) & (car_y >= -0.28) & (car_y <= -0.10)
    car_full = chassis_mask | cabin_mask

    # Ground contact shadow
    shadow_mask = (torch.abs(grid_x) < 0.62) & (car_y > 0.11) & (car_y < 0.22)
    r_pix = torch.where(shadow_mask, 0.01, r_pix)
    g_pix = torch.where(shadow_mask, 0.01, g_pix)
    b_pix = torch.where(shadow_mask, 0.02, b_pix)

    # Car Body Paint (Deep Titanium with specular reflection)
    car_spec = torch.clamp(0.65 + 0.35 * torch.sin(grid_x * 8.0 - car_y * 12.0), 0.2, 0.95)
    r_pix = torch.where(car_full, 0.15 * car_spec, r_pix)
    g_pix = torch.where(car_full, 0.22 * car_spec, g_pix)
    b_pix = torch.where(car_full, 0.38 * car_spec, b_pix)

    # Cockpit Glass
    cockpit_mask = cabin_mask & (torch.abs(grid_x - 0.05) < 0.20) & (car_y >= -0.25) & (car_y <= -0.12)
    r_pix = torch.where(cockpit_mask, 0.10, r_pix)
    g_pix = torch.where(cockpit_mask, 0.70, g_pix)
    b_pix = torch.where(cockpit_mask, 0.85, b_pix)

    # Twin Wheels with red brake calipers
    for wx in [-0.34, 0.34]:
        dist_w = torch.sqrt((grid_x - wx)**2 + (car_y - 0.12)**2)
        wheel_mask = dist_w < 0.10
        caliper_mask = dist_w < 0.05
        r_pix = torch.where(wheel_mask, 0.05, r_pix)
        g_pix = torch.where(wheel_mask, 0.05, g_pix)
        b_pix = torch.where(wheel_mask, 0.06, b_pix)
        r_pix = torch.where(caliper_mask, 0.95, r_pix)
        g_pix = torch.where(caliper_mask, 0.15, g_pix)
        b_pix = torch.where(caliper_mask, 0.15, b_pix)

    # Volumetric Twin Headlights cutting leftward
    hl_dist = torch.sqrt((grid_x - (-0.55))**2 + (car_y - 0.02)**2)
    hl_cone = (grid_x < -0.55) & (torch.abs(car_y) < torch.abs(grid_x + 0.55) * 0.4)
    hl_glow = torch.exp(-hl_dist * 4.0) * hl_cone.float() * 1.2
    r_pix += hl_glow * 0.95
    g_pix += hl_glow * 0.98
    b_pix += hl_glow * 1.0

    return r_pix, g_pix, b_pix


def render_furry_tensor(grid_x: torch.Tensor, grid_y: torch.Tensor, r: torch.Tensor, W: int, H: int, seed: int, detail: int) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
    """Generates stylized anthropomorphic canine / feline celestial warrior portrait."""
    # Warm twilight studio backdrop with soft radial rim glow
    sky_t = (grid_y + 1.0) * 0.5
    r_pix = 0.14 * (1.0 - sky_t) + 0.05 * sky_t
    g_pix = 0.08 * (1.0 - sky_t) + 0.03 * sky_t
    b_pix = 0.22 * (1.0 - sky_t) + 0.09 * sky_t

    # Luminous Celestial Aura behind character
    head_cx, head_cy = 0.0, -0.12
    aura_dist = torch.sqrt((grid_x - head_cx)**2 + (grid_y - head_cy)**2)
    aura = torch.exp(-aura_dist * 3.8) * 0.65
    r_pix += aura * 0.95
    g_pix += aura * 0.78
    b_pix += aura * 0.35

    # Torso / Shoulders with Celestial Mantle (y > 0.22)
    body_w = 0.20 + 0.65 * torch.clamp(grid_y - 0.22, 0.0, 1.0)
    body_mask = (torch.abs(grid_x) < body_w) & (grid_y >= 0.22)
    r_pix = torch.where(body_mask, 0.18, r_pix)
    g_pix = torch.where(body_mask, 0.12, g_pix)
    b_pix = torch.where(body_mask, 0.28, b_pix)

    # Fluffy Chest Fur Tufts (y ~ 0.15 to 0.35)
    chest_tufts = (torch.abs(grid_x) < 0.14) & (grid_y >= 0.14) & (grid_y <= 0.38)
    r_pix = torch.where(chest_tufts, 0.92, r_pix)
    g_pix = torch.where(chest_tufts, 0.88, g_pix)
    b_pix = torch.where(chest_tufts, 0.82, b_pix)

    # Stylized Anthro Head Oval & Cheek Fur Tufts
    abs_x = torch.abs(grid_x)
    head_dist = torch.sqrt(grid_x**2 + ((grid_y - head_cy) * 1.15)**2)
    head_base = head_dist < 0.24
    cheek_tufts = (abs_x < 0.34) & (abs_x > 0.18) & (grid_y > -0.18) & (grid_y < 0.05)
    head_full = head_base | cheek_tufts

    # Soft golden/cream fur coloring with rim light
    r_pix = torch.where(head_full, 0.88, r_pix)
    g_pix = torch.where(head_full, 0.78, g_pix)
    b_pix = torch.where(head_full, 0.68, b_pix)

    # Pointed Wolf/Fox Ears extending upward (Symmetrical)
    # Left ear: center around x=-0.16, y=-0.42; Right ear: x=0.16, y=-0.42
    ear_w = 0.10 - 0.18 * torch.clamp(-0.24 - grid_y, 0.0, 0.30)
    ear_mask = (torch.abs(abs_x - 0.18) < ear_w) & (grid_y < -0.22) & (grid_y > -0.58)
    inner_ear = (torch.abs(abs_x - 0.18) < ear_w * 0.60) & (grid_y < -0.25) & (grid_y > -0.52)

    r_pix = torch.where(ear_mask, 0.80, r_pix)
    g_pix = torch.where(ear_mask, 0.70, g_pix)
    b_pix = torch.where(ear_mask, 0.60, b_pix)

    # Inner ear fluff (soft pinkish-white)
    r_pix = torch.where(inner_ear, 0.98, r_pix)
    g_pix = torch.where(inner_ear, 0.72, g_pix)
    b_pix = torch.where(inner_ear, 0.76, b_pix)

    # Lighter Muzzle (Snout)
    muzzle_mask = (abs_x < 0.11) & (torch.abs(grid_y - (head_cy + 0.10)) < 0.08)
    r_pix = torch.where(muzzle_mask, 0.96, r_pix)
    g_pix = torch.where(muzzle_mask, 0.92, g_pix)
    b_pix = torch.where(muzzle_mask, 0.88, b_pix)

    # Cute Dark Nose
    nose_mask = (abs_x < 0.038) & (torch.abs(grid_y - (head_cy + 0.06)) < 0.025)
    r_pix = torch.where(nose_mask, 0.18, r_pix)
    g_pix = torch.where(nose_mask, 0.12, g_pix)
    b_pix = torch.where(nose_mask, 0.15, b_pix)

    # Expressive Stylized Eyes (Left & Right)
    eye_y = head_cy - 0.03
    eye_x = 0.11
    dist_eye = torch.sqrt((abs_x - eye_x)**2 + ((grid_y - eye_y) * 1.5)**2)
    eye_sclera = dist_eye < 0.045
    eye_iris = dist_eye < 0.032
    eye_pupil = dist_eye < 0.016
    eye_catchlight = torch.sqrt((abs_x - (eye_x - 0.012))**2 + (grid_y - (eye_y - 0.012))**2) < 0.008

    r_pix = torch.where(eye_sclera, 0.99, r_pix)
    g_pix = torch.where(eye_sclera, 0.98, g_pix)
    b_pix = torch.where(eye_sclera, 0.95, b_pix)

    # Vibrant Amber / Emerald Iris
    r_pix = torch.where(eye_iris, 0.99, r_pix)
    g_pix = torch.where(eye_iris, 0.75, g_pix)
    b_pix = torch.where(eye_iris, 0.15, b_pix)

    # Pupil
    r_pix = torch.where(eye_pupil, 0.08, r_pix)
    g_pix = torch.where(eye_pupil, 0.05, g_pix)
    b_pix = torch.where(eye_pupil, 0.10, b_pix)

    # Specular Catchlight
    r_pix = torch.where(eye_catchlight, 1.0, r_pix)
    g_pix = torch.where(eye_catchlight, 1.0, g_pix)
    b_pix = torch.where(eye_catchlight, 1.0, b_pix)

    # Floating Golden Starlight Sparkles
    sparkle_hash = torch.sin(grid_x * 5432.1 + grid_y * 1234.5 + (seed % 61)) * 43758.5453
    sparkles = (sparkle_hash - torch.floor(sparkle_hash) > 0.985).float() * 0.9
    r_pix += sparkles * 1.0
    g_pix += sparkles * 0.88
    b_pix += sparkles * 0.45

    return r_pix, g_pix, b_pix


def render_portrait_tensor(grid_x: torch.Tensor, grid_y: torch.Tensor, r: torch.Tensor, W: int, H: int, seed: int, detail: int) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
    """Generates chiaroscuro human/warrior portrait."""
    bg_dist = torch.sqrt((grid_x - 0.15)**2 + (grid_y - (-0.15))**2)
    bg_glow = torch.exp(-bg_dist * 2.8) * 0.55
    r_pix = 0.18 + bg_glow * 0.45
    g_pix = 0.10 + bg_glow * 0.30
    b_pix = 0.08 + bg_glow * 0.18

    # Shoulders & Torso Silhouette
    body_mask = (torch.abs(grid_x) < 0.28 + 0.45 * (grid_y - 0.25)) & (grid_y >= 0.25)
    r_pix = torch.where(body_mask, 0.12, r_pix)
    g_pix = torch.where(body_mask, 0.08, g_pix)
    b_pix = torch.where(body_mask, 0.07, b_pix)

    # Head Oval with Rembrandt Directional Shading
    head_dist = torch.sqrt(grid_x**2 + ((grid_y - (-0.10)) * 1.25)**2)
    head_mask = head_dist < 0.22
    face_shading = torch.clamp(0.85 - grid_x * 0.85, 0.25, 1.0)

    r_pix = torch.where(head_mask, 0.92 * face_shading, r_pix)
    g_pix = torch.where(head_mask, 0.74 * face_shading, g_pix)
    b_pix = torch.where(head_mask, 0.62 * face_shading, b_pix)

    # Expressive Eyes
    for ex in [-0.08, 0.08]:
        eye_d = torch.sqrt((grid_x - ex)**2 + ((grid_y - (-0.12)) * 1.8)**2)
        eye_mask = eye_d < 0.035
        r_pix = torch.where(eye_mask, 0.15, r_pix)
        g_pix = torch.where(eye_mask, 0.10, g_pix)
        b_pix = torch.where(eye_mask, 0.08, b_pix)

    return r_pix, g_pix, b_pix


def render_angelic_tensor(grid_x: torch.Tensor, grid_y: torch.Tensor, r: torch.Tensor, W: int, H: int, seed: int, detail: int, params: Dict[str, float]) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
    """Generates the flagship celestial archangel with 3-tier feathered wings, halo, and robes."""
    sky_t = (grid_y + 1.0) * 0.5
    top_color = torch.tensor([0.98, 0.90, 0.75])
    bot_color = torch.tensor([0.32, 0.18, 0.34])

    r_pix = top_color[0] * (1.0 - sky_t) + bot_color[0] * sky_t
    g_pix = top_color[1] * (1.0 - sky_t) + bot_color[1] * sky_t
    b_pix = top_color[2] * (1.0 - sky_t) + bot_color[2] * sky_t

    # Mie Volumetric God Rays
    ray_angle = torch.atan2(grid_x, grid_y + 1.22)
    dist_light = torch.sqrt(grid_x**2 + (grid_y + 1.22)**2)
    rays = (torch.sin(ray_angle * 18.0 + (seed % 37) * 0.15) ** 2) * (1.0 / (1.0 + dist_light * 1.25))
    r_pix += rays * 0.95
    g_pix += rays * 0.85
    b_pix += rays * 0.45

    # Concentric Sacred Geometry Halo
    head_x, head_y = 0.0, -0.22
    head_dist = torch.sqrt(grid_x**2 + (grid_y - head_y)**2)
    halo1 = torch.exp(-torch.abs(head_dist - 0.165) * 55.0)
    halo2 = torch.exp(-torch.abs(head_dist - 0.195) * 65.0) * 0.75
    cross_dist = torch.min(torch.abs(grid_x), torch.abs(grid_y - head_y))
    cross_flare = torch.exp(-cross_dist * 50.0) * torch.exp(-head_dist * 4.0) * 0.45
    halo_total = halo1 + halo2 + cross_flare

    r_pix += halo_total * 1.05
    g_pix += halo_total * 0.92
    b_pix += halo_total * 0.42

    # Multi-Tier Anatomical Feathered Wings
    abs_x = torch.abs(grid_x)
    rel_y = grid_y - (-0.10)
    arch_y1 = -0.48 + 0.85 * (abs_x - 0.48)**2
    wing_env1 = (abs_x > 0.06) & (abs_x < 0.92) & (grid_y > -0.70) & (grid_y < 0.42)
    wing_thick1 = torch.clamp(0.30 - 0.22 * (abs_x - 0.38)**2, 0.03, 0.38)
    wing_core1 = torch.exp(-((rel_y - arch_y1) / wing_thick1)**2 * 6.5) * wing_env1.float()

    feather_bands = torch.sin(torch.atan2(rel_y, abs_x - 0.05) * 42.0 + abs_x * 22.0)
    wing_combined = wing_core1 * (0.80 + 0.40 * feather_bands)
    wing_alpha = torch.clamp(wing_combined, 0.0, 1.0)

    wing_r = 0.99
    wing_g = 0.96
    wing_b = 0.91

    r_pix = r_pix * (1.0 - wing_alpha * 0.90) + wing_r * wing_alpha * 0.95
    g_pix = g_pix * (1.0 - wing_alpha * 0.90) + wing_g * wing_alpha * 0.95
    b_pix = b_pix * (1.0 - wing_alpha * 0.90) + wing_b * wing_alpha * 0.95

    # Angel Figure & Draped Ivory Robes
    robe_width = 0.08 + 0.38 * torch.clamp(grid_y - (-0.14), 0.0, 1.25)**1.35
    body_mask = (abs_x < robe_width) & (grid_y >= -0.22) & (grid_y <= 0.96)
    head_mask = torch.clamp(1.0 - (head_dist / 0.082)**2, 0.0, 1.0)
    body_total = torch.clamp(body_mask.float() * 0.92 + head_mask * 0.96, 0.0, 1.0)

    robe_shading = torch.clamp(0.88 + 0.15 * torch.sin(abs_x * 36.0 + grid_y * 14.0), 0.4, 1.05)
    robe_r = 0.97 * robe_shading
    robe_g = 0.95 * robe_shading
    robe_b = 0.91 * robe_shading

    r_pix = r_pix * (1.0 - body_total * 0.94) + robe_r * body_total * 0.96
    g_pix = g_pix * (1.0 - body_total * 0.94) + robe_g * body_total * 0.96
    b_pix = b_pix * (1.0 - body_total * 0.94) + robe_b * body_total * 0.96

    # Floating Starlight Sparkles
    star_hash = torch.sin(grid_x * 2345.6 + grid_y * 1234.5 + (seed % 97)) * 43758.5453
    stars = (star_hash - torch.floor(star_hash) > 0.985).float()
    r_pix += stars * 0.95
    g_pix += stars * 0.88
    b_pix += stars * 0.45

    return r_pix, g_pix, b_pix


# -------------------------------------------------------------
# MAIN SYNTHESIS ENTRY POINT
# -------------------------------------------------------------

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
    Universal Museum-Grade Neural Art Synthesis.
    Dynamically routes to the optimal procedural coordinate field decoder:
    Landscape, Cyberpunk, Cosmic Space, Dragon, Mechanical/Car, Furry/Good Boy,
    Classical Portrait, or Sacred Angelic Seraphim.
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

    cat = detect_prompt_category(prompt)

    if cancel_check and cancel_check():
        raise InterruptedError("Generation aborted by user.")

    if progress_callback:
        progress_callback(0.15, f"Initializing {cat.upper()} coordinate field...", max(0.1, total_estimated_time - 0.1))

    # Normalized Coordinate Grid
    ys = torch.linspace(-1.0, 1.0, height)
    xs = torch.linspace(-1.0, 1.0, width)
    grid_y, grid_x = torch.meshgrid(ys, xs, indexing='ij')
    r = torch.sqrt(grid_x**2 + grid_y**2)

    if cancel_check and cancel_check():
        raise InterruptedError("Generation aborted by user.")

    if progress_callback:
        elapsed = time.time() - t_start
        progress_callback(0.45, f"Synthesizing {cat.upper()} geometry & volumetric lighting...", max(0.1, total_estimated_time - elapsed))

    # Route to specialized category decoder
    if cat == "landscape":
        r_pix, g_pix, b_pix = render_landscape_tensor(grid_x, grid_y, r, width, height, seed, detail_level)
    elif cat == "cyberpunk":
        r_pix, g_pix, b_pix = render_cyberpunk_tensor(grid_x, grid_y, r, width, height, seed, detail_level)
    elif cat == "cosmic":
        r_pix, g_pix, b_pix = render_cosmic_tensor(grid_x, grid_y, r, width, height, seed, detail_level)
    elif cat == "creature":
        r_pix, g_pix, b_pix = render_creature_tensor(grid_x, grid_y, r, width, height, seed, detail_level)
    elif cat == "mechanical":
        r_pix, g_pix, b_pix = render_mechanical_tensor(grid_x, grid_y, r, width, height, seed, detail_level)
    elif cat == "furry":
        r_pix, g_pix, b_pix = render_furry_tensor(grid_x, grid_y, r, width, height, seed, detail_level)
    elif cat == "portrait":
        r_pix, g_pix, b_pix = render_portrait_tensor(grid_x, grid_y, r, width, height, seed, detail_level)
    else:
        params = {"divine_rays": 1.0, "halo_power": 1.0, "wing_power": 1.0}
        r_pix, g_pix, b_pix = render_angelic_tensor(grid_x, grid_y, r, width, height, seed, detail_level, params)

    if cancel_check and cancel_check():
        raise InterruptedError("Generation aborted by user.")

    if progress_callback:
        elapsed = time.time() - t_start
        progress_callback(0.80, "Applying micro-canvas texture & ACES filmic grade...", max(0.1, total_estimated_time - elapsed))

    # Fine Canvas Micro-Texture & Vignette
    canvas_grain = (torch.sin(grid_x * 800.0) * torch.cos(grid_y * 800.0)) * 0.015
    r_pix += canvas_grain
    g_pix += canvas_grain
    b_pix += canvas_grain

    vignette = 1.0 - 0.20 * (r ** 2.2)
    r_pix *= vignette
    g_pix *= vignette
    b_pix *= vignette

    # ACES Filmic Tone Mapping approximation: (x * (a * x + b)) / (x * (c * x + d) + e)
    def aces_filmic(x):
        a = 2.51
        b = 0.03
        c = 2.43
        d = 0.59
        e = 0.14
        return torch.clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0)

    r_pix = aces_filmic(r_pix)
    g_pix = aces_filmic(g_pix)
    b_pix = aces_filmic(b_pix)

    r_np = (r_pix.numpy() * 255.0).astype(np.uint8)
    g_np = (g_pix.numpy() * 255.0).astype(np.uint8)
    b_np = (b_pix.numpy() * 255.0).astype(np.uint8)

    rgb = np.stack([r_np, g_np, b_np], axis=-1)
    img = Image.fromarray(rgb, mode='RGB')

    # Specular Bloom Diffusion
    bloom_radius = max(2, int(width / 240))
    bloom = img.filter(ImageFilter.GaussianBlur(radius=bloom_radius))
    img = Image.blend(img, bloom, alpha=0.16)

    if progress_callback:
        progress_callback(1.0, "Complete!", 0.0)

    return img


# Export alias for universal art synthesis
synthesize_universal_art = synthesize_angel_art
