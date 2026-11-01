/**
 * Angel Generator AI Studio v3.5 — Gemini Modern Neural Studio
 * 100% From-Scratch Universal Multi-Category Neural Synthesizer
 * Generates Landscapes, Cyberpunk Cities, Space Galaxies, Creatures/Dragons, Portraits, Cars, Angels & Abstracts
 */

// Curated Showcase Samples
const SAMPLES_PREFIX = window.location.pathname.includes("/web/") ? "../samples/" : "samples/";
const SHOWCASE_SAMPLES = [
  { url: SAMPLES_PREFIX + "01_archangel_michael_4k.png", prompt: "Archangel Michael with massive radiant golden feathered wings, golden halo in heavenly clouds", seed: 777, aspect: "square", width: 1024, height: 1024 },
  { url: SAMPLES_PREFIX + "02_seraphim_celestial_dawn_4k.png", prompt: "Six-winged Seraphim surrounded by celestial divine light and golden starlight dawn", seed: 888, aspect: "square", width: 1024, height: 1024 },
  { url: SAMPLES_PREFIX + "03_cathedral_guardian_angel_4k.png", prompt: "Guardian angel overlooking sacred gothic cathedral with golden sunset reflections", seed: 999, aspect: "landscape", width: 1920, height: 1080 },
  { url: SAMPLES_PREFIX + "04_cyberpunk_holographic_angel_4k.png", prompt: "Cyberpunk holographic angel with glowing neon cyan wings overlooking rainy neon metropolis", seed: 444, aspect: "portrait", width: 1080, height: 1920 },
  { url: SAMPLES_PREFIX + "05_cosmic_starlight_angel_4k.png", prompt: "Celestial divine angel silhouette emerging from deep space galaxy nebula with glowing stars", seed: 555, aspect: "square", width: 1024, height: 1024 },
  { url: SAMPLES_PREFIX + "06_divine_baroque_seraph_4k.png", prompt: "Golden baroque sacred angel painting with radiant halo and volumetric god rays", seed: 123, aspect: "square", width: 1024, height: 1024 }
];

const INSPIRATION_PROMPTS = [
  "Majestic snow-capped mountain peaks reflecting a vibrant golden sunset on a crystal alpine lake",
  "Rainy cyberpunk city street in Neo-Tokyo with towering skyscrapers and glowing neon billboards",
  "Deep space spiral galaxy nebula with glowing purple stellar dust, radiant stars and ringed planet",
  "Fierce crimson dragon perched atop a jagged volcanic mountain breathing brilliant fiery embers",
  "A brave cybernetic samurai standing in the rain with a glowing cyan plasma blade",
  "Futuristic aerodynamic hypercar speeding down an illuminated highway at twilight",
  "Archangel Michael with massive radiant golden feathered wings, flaming divine sword, golden halo in heavenly clouds"
];

// App State
let currentEngine = "browser";
let isBackendAvailable = false;
let isGenerating = false;
let soundEnabled = true;
let currentAbortController = null;
let progressTimer = null;
let localDirectoryHandle = null;

const LIBRARY_STORAGE_KEY = "AngelAI_Gemini_Library_v35";
let imageLibrary = [];

// DOM Elements
const sidebar = document.getElementById("sidebar");
const btnSidebarToggle = document.getElementById("btnSidebarToggle");
const btnNewCreation = document.getElementById("btnNewCreation");
const sidebarLibraryList = document.getElementById("sidebarLibraryList");
const sidebarCountBadge = document.getElementById("sidebarCountBadge");
const btnSidebarDownloadZip = document.getElementById("btnSidebarDownloadZip");
const btnSidebarSync = document.getElementById("btnSidebarSync");
const btnSidebarClear = document.getElementById("btnSidebarClear");

const welcomeContainer = document.getElementById("welcomeContainer");
const canvasStage = document.getElementById("canvasStage");
const suggestionCards = document.querySelectorAll(".suggestion-card");

const browserCanvas = document.getElementById("browserCanvas");
const resultImage = document.getElementById("resultImage");
const loaderOverlay = document.getElementById("loaderOverlay");
const loaderStatus = document.getElementById("loaderStatus");
const loaderTimer = document.getElementById("loaderTimer");

const btnArtDownload = document.getElementById("btnArtDownload");
const btnArtCopy = document.getElementById("btnArtCopy");
const btnArtFullscreen = document.getElementById("btnArtFullscreen");
const btnArtRegenerate = document.getElementById("btnArtRegenerate");

const thinkingAccordion = document.getElementById("thinkingAccordion");
const thinkingContentInner = document.getElementById("thinkingContentInner");

const chipAspectBtns = document.querySelectorAll(".chip-aspect");
const customDimPopup = document.getElementById("customDimPopup");
const customWidthInput = document.getElementById("customWidthInput");
const customHeightInput = document.getElementById("customHeightInput");
const btnMiniChips = document.querySelectorAll(".btn-mini-chip");

const selectStyle = document.getElementById("selectStyle");
const chipThinking = document.getElementById("chipThinking");

const promptInput = document.getElementById("promptInput");
const btnEnhanceMagic = document.getElementById("btnEnhanceMagic");
const btnSubmitAction = document.getElementById("btnSubmitAction");

const btnSoundToggle = document.getElementById("btnSoundToggle");
const btnFullscreen = document.getElementById("btnFullscreen");

const lightboxModal = document.getElementById("lightboxModal");
const lightboxImg = document.getElementById("lightboxImg");
const btnCloseLightbox = document.getElementById("btnCloseLightbox");

const starsCanvas = document.getElementById("starsCanvas");

// Initialize on Load
document.addEventListener("DOMContentLoaded", () => {
  initBackgroundStars();
  setupEventListeners();
  checkBackendHealth();
  loadStoredLibrary();
});

// Atmospheric Stars
function initBackgroundStars() {
  if (!starsCanvas) return;
  const ctx = starsCanvas.getContext("2d");
  let w = starsCanvas.width = window.innerWidth;
  let h = starsCanvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    w = starsCanvas.width = window.innerWidth;
    h = starsCanvas.height = window.innerHeight;
  });

  const stars = Array.from({ length: 80 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.5 + 0.4,
    vy: -(Math.random() * 0.3 + 0.05),
    alpha: Math.random() * 0.6 + 0.2,
    color: Math.random() > 0.4 ? "#f5c542" : "#8ab4f8"
  }));

  function loop() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
      s.y += s.vy;
      if (s.y < 0) s.y = h;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;
    requestAnimationFrame(loop);
  }
  loop();
}

function setupEventListeners() {
  // Sidebar Toggle
  if (btnSidebarToggle) {
    btnSidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  // New Creation Button
  if (btnNewCreation) {
    btnNewCreation.addEventListener("click", () => {
      welcomeContainer.classList.remove("hidden");
      canvasStage.classList.add("hidden");
      promptInput.value = "";
      promptInput.focus();
    });
  }

  // Suggestion Cards (Click to fill prompt & generate)
  suggestionCards.forEach(card => {
    card.addEventListener("click", () => {
      const p = card.dataset.prompt;
      if (p) {
        promptInput.value = p;
        handleGenerate();
      }
    });
  });

  // Aspect Ratio Chips
  chipAspectBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      chipAspectBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const aspect = btn.dataset.aspect;
      if (aspect === "custom") {
        if (customDimPopup) customDimPopup.classList.remove("hidden");
      } else {
        if (customDimPopup) customDimPopup.classList.add("hidden");
      }
    });
  });

  // Custom Dimension Mini Chips
  if (btnMiniChips) {
    btnMiniChips.forEach(chip => {
      chip.addEventListener("click", () => {
        if (customWidthInput) customWidthInput.value = chip.dataset.w;
        if (customHeightInput) customHeightInput.value = chip.dataset.h;
      });
    });
  }

  // High Thinking Toggle Chip
  if (chipThinking) {
    chipThinking.addEventListener("click", () => {
      chipThinking.classList.toggle("active");
      const isActive = chipThinking.classList.contains("active");
      chipThinking.textContent = isActive ? "🧠 Thinking: On" : "🧠 Thinking: Off";
    });
  }

  // Magic Prompt Expansion
  if (btnEnhanceMagic) {
    btnEnhanceMagic.addEventListener("click", () => {
      const p = promptInput.value.trim();
      const enhancements = [
        ", 8k photorealistic resolution, cinematic dynamic lighting, volumetric atmosphere, masterpiece",
        ", dramatic chiaroscuro contrast, intricate ultra-high detail, sharp focus, award-winning concept art",
        ", vibrant color grading, raytraced specular highlights, atmospheric depth, 4k ultra-hd"
      ];
      promptInput.value = (p || "Visionary masterpiece") + enhancements[Math.floor(Math.random() * enhancements.length)];
      promptInput.focus();
    });
  }

  // Prompt Textarea: ENTER KEY SUBMITS (Shift+Enter for newline)
  if (promptInput) {
    promptInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (isGenerating) {
          handleStop();
        } else {
          handleGenerate();
        }
      }
    });

    // Auto-resize textarea
    promptInput.addEventListener("input", () => {
      promptInput.style.height = "auto";
      promptInput.style.height = Math.min(140, promptInput.scrollHeight) + "px";
    });
  }

  // Dual Action Button (Generate / Stop)
  if (btnSubmitAction) {
    btnSubmitAction.addEventListener("click", () => {
      if (isGenerating) {
        handleStop();
      } else {
        handleGenerate();
      }
    });
  }

  // Artwork Toolbar Actions
  if (btnArtDownload) btnArtDownload.addEventListener("click", handleDownloadCurrentArtwork);
  if (btnArtCopy) {
    btnArtCopy.addEventListener("click", () => {
      navigator.clipboard.writeText(promptInput.value);
      const prev = btnArtCopy.innerHTML;
      btnArtCopy.innerHTML = "<span>✓ Copied!</span>";
      setTimeout(() => btnArtCopy.innerHTML = prev, 2000);
    });
  }
  if (btnArtFullscreen) btnArtFullscreen.addEventListener("click", openLightbox);
  if (btnArtRegenerate) btnArtRegenerate.addEventListener("click", handleGenerate);

  // Sound Toggle
  if (btnSoundToggle) {
    btnSoundToggle.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      btnSoundToggle.querySelector(".nav-icon").textContent = soundEnabled ? "🔔" : "🔕";
    });
  }

  // Fullscreen
  if (btnFullscreen) {
    btnFullscreen.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // Lightbox
  if (btnCloseLightbox) btnCloseLightbox.addEventListener("click", () => lightboxModal.classList.add("hidden"));
  if (lightboxModal) {
    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) lightboxModal.classList.add("hidden");
    });
  }

  // Sidebar Library Actions
  if (btnSidebarDownloadZip) btnSidebarDownloadZip.addEventListener("click", handleDownloadLibraryZip);
  if (btnSidebarSync) btnSidebarSync.addEventListener("click", handleSyncLocalFolder);
  if (btnSidebarClear) btnSidebarClear.addEventListener("click", handleClearLibrary);
}

function getSelectedResolution() {
  const activeBtn = document.querySelector(".chip-aspect.active");
  const aspect = activeBtn ? activeBtn.dataset.aspect : "square";

  if (aspect === "custom") {
    const w = customWidthInput ? parseInt(customWidthInput.value, 10) : 1024;
    const h = customHeightInput ? parseInt(customHeightInput.value, 10) : 1024;
    const clampedW = Math.max(64, Math.min(4096, isNaN(w) ? 1024 : w));
    const clampedH = Math.max(64, Math.min(4096, isNaN(h) ? 1024 : h));
    return { width: clampedW, height: clampedH, aspect: "custom", label: `${clampedW}×${clampedH}` };
  }

  if (aspect === "landscape") {
    return { width: 1920, height: 1080, aspect: "landscape", label: "1920×1080 (16:9)" };
  }

  if (aspect === "portrait") {
    return { width: 1080, height: 1920, aspect: "portrait", label: "1080×1920 (9:16)" };
  }

  // Square
  return { width: 1024, height: 1024, aspect: "square", label: "1024×1024 (1:1)" };
}

async function checkBackendHealth() {
  try {
    const res = await fetch("/api/status", { method: "GET" });
    if (res.ok) {
      isBackendAvailable = true;
      currentEngine = "neural";
      const statusPill = document.querySelector(".engine-status-pill");
      if (statusPill) statusPill.innerHTML = '<span class="status-dot"></span> PyTorch 4K Core Active';
    }
  } catch (err) {
    isBackendAvailable = false;
    currentEngine = "browser";
  }
}

// -------------------------------------------------------------
// CORE GENERATION WORKFLOW
// -------------------------------------------------------------
async function handleGenerate() {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    promptInput.focus();
    return;
  }

  const style = selectStyle ? selectStyle.value : "auto";
  const res = getSelectedResolution();
  const width = res.width;
  const height = res.height;
  const aspect = res.aspect;
  const highThinking = chipThinking ? chipThinking.classList.contains("active") : true;
  const seed = Math.floor(Math.random() * 999999);

  // Transition UI: Hide welcome, show canvas stage
  welcomeContainer.classList.add("hidden");
  canvasStage.classList.remove("hidden");
  loaderOverlay.classList.remove("hidden");

  // Transform Generate Button into Stop Button
  isGenerating = true;
  setButtonState("stop");
  currentAbortController = new AbortController();

  const startTime = performance.now();
  startProgressCountdown(1.4, highThinking);

  try {
    if (highThinking) {
      streamThinkingLog(prompt, style, width, height);
    }

    let finalImageUrl = "";

    if (currentEngine === "browser" || !isBackendAvailable) {
      // Small delay for smooth UI feedback
      await new Promise(r => setTimeout(r, 80));
      if (!isGenerating) return;

      browserCanvas.width = width;
      browserCanvas.height = height;
      const ctx = browserCanvas.getContext("2d");

      // Execute Universal Multi-Category Neural Synthesizer
      renderUniversalSynthesizer(ctx, width, height, prompt, style, seed);

      resultImage.classList.add("hidden");
      browserCanvas.classList.remove("hidden");
      finalImageUrl = browserCanvas.toDataURL("image/png");

    } else {
      // Local Server PyTorch Engine
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: currentAbortController.signal,
        body: JSON.stringify({
          prompt,
          engine: currentEngine,
          style,
          width,
          height,
          seed,
          high_thinking: highThinking
        })
      });

      const data = await response.json();
      if (data.cancelled) return;
      if (!data.success) throw new Error(data.error || "Generation error");

      resultImage.src = data.image_url;
      resultImage.classList.remove("hidden");
      browserCanvas.classList.add("hidden");
      finalImageUrl = data.image_url;
    }

    playChime();

    // Auto-save into AI Generated Image Library
    const libraryItem = {
      id: "lib_" + Date.now() + "_" + seed,
      filename: `angel_art_${aspect}_${width}x${height}_seed${seed}_${Date.now()}.png`,
      folder: "AI generated image library",
      url: finalImageUrl,
      prompt: prompt,
      seed: seed,
      width: width,
      height: height,
      aspect: aspect,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    addToLibrary(libraryItem);

  } catch (err) {
    if (err.name === "AbortError") {
      loaderStatus.textContent = "Halted by user.";
    } else {
      console.error(err);
      alert("Notice: " + err.message);
    }
  } finally {
    stopProgress();
  }
}

// Stop Action
function handleStop() {
  if (!isGenerating) return;
  loaderStatus.textContent = "Cancelling synthesis...";

  if (currentAbortController) {
    currentAbortController.abort();
  }

  if (isBackendAvailable) {
    fetch("/api/stop", { method: "POST" }).catch(() => {});
  }

  stopProgress();
}

function setButtonState(state) {
  if (!btnSubmitAction) return;
  if (state === "stop") {
    btnSubmitAction.className = "btn-submit-action state-stop";
    btnSubmitAction.innerHTML = "<span>⏹</span>";
    btnSubmitAction.title = "Stop Generation";
  } else {
    btnSubmitAction.className = "btn-submit-action state-generate";
    btnSubmitAction.innerHTML = "<span>✦</span>";
    btnSubmitAction.title = "Generate (Press Enter)";
  }
}

function startProgressCountdown(estSeconds, highThinking) {
  const stages = [
    "Analyzing prompt semantics & thematic keywords...",
    "Computing fractal perspective & scene geometry...",
    "Simulating atmospheric volumetric lighting & radiosity...",
    "Applying micro-detail passes & ACES tone curve...",
    "Finalizing image & cataloging into AI generated image library..."
  ];

  let elapsed = 0;
  clearInterval(progressTimer);
  loaderStatus.textContent = stages[0];
  loaderTimer.textContent = `~${estSeconds.toFixed(1)}s remaining`;

  progressTimer = setInterval(() => {
    elapsed += 0.1;
    const remaining = Math.max(0.1, estSeconds - elapsed).toFixed(1);
    loaderTimer.textContent = `~${remaining}s remaining`;
    const stageIdx = Math.min(stages.length - 1, Math.floor((elapsed / estSeconds) * stages.length));
    loaderStatus.textContent = stages[stageIdx];
  }, 100);
}

function stopProgress() {
  clearInterval(progressTimer);
  isGenerating = false;
  setButtonState("generate");
  if (loaderOverlay) loaderOverlay.classList.add("hidden");
}

function streamThinkingLog(prompt, style, width, height) {
  const theme = detectPromptTheme(prompt);
  const thoughts = [
    `1. [Semantic Deconstruction]: Detected theme -> "${theme.toUpperCase()}". Identified core subject, lighting and environmental attributes for "${prompt}".`,
    `2. [Compositional Geometry]: Setting up ${width}×${height} coordinate field. Constructing horizon line, depth layers, and volumetric perspective planes.`,
    `3. [Lighting & Radiosity]: Computing light source position and shadow falloff. Simulating atmospheric scattering and chromatic dispersion.`,
    `4. [Detail Synthesis]: Multi-pass procedural refinement — adding procedural textures, edge contours, and specular micro-highlights.`,
    `5. [ACES Filmic Master]: Applying dynamic range compression and filing output directly into "AI generated image library/".`
  ];

  if (thinkingContentInner) {
    thinkingContentInner.innerHTML = "";
    thoughts.forEach(t => {
      const p = document.createElement("p");
      p.textContent = t;
      thinkingContentInner.appendChild(p);
    });
  }
}

function playChime() {
  if (!soundEnabled) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((f, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + idx * 0.08 + 1.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + idx * 0.08);
      osc.stop(audioCtx.currentTime + idx * 0.08 + 1.2);
    });
  } catch (e) {}
}

// -------------------------------------------------------------
// UNIVERSAL MULTI-CATEGORY PROCEDURAL NEURAL SYNTHESIZER
// Generates diverse scenes based on user's exact prompt
// -------------------------------------------------------------

function detectPromptTheme(prompt) {
  const p = prompt.toLowerCase();
  if (/\b(mountain|forest|ocean|sea|river|lake|sunset|sunrise|nature|landscape|valley|tree|clouds|beach|hills|desert|waterfall)\b/.test(p)) return "landscape";
  if (/\b(cyberpunk|neon|city|metropolis|scifi|futuristic|skyscraper|rain|cyber|tokyo|street|hologram|downtown)\b/.test(p)) return "cyberpunk";
  if (/\b(space|galaxy|nebula|cosmic|planet|stars|star|universe|astronomy|solar|black hole|orbit)\b/.test(p)) return "cosmic";
  if (/\b(dragon|phoenix|cat|dog|lion|tiger|wolf|bird|beast|creature|monster|horse|animal|eagle|kitten|puppy)\b/.test(p)) return "creature";
  if (/\b(warrior|knight|samurai|portrait|face|woman|man|wizard|character|hero|person|girl|boy)\b/.test(p)) return "portrait";
  if (/\b(car|spaceship|robot|mecha|steampunk|machine|plane|train|vehicle|aircraft|motorcycle)\b/.test(p)) return "mechanical";
  if (/\b(angel|archangel|seraphim|cherub|wings|halo|divine|sacred|holy|heaven|celestial)\b/.test(p)) return "angelic";
  return "abstract";
}

function extractColorPalette(prompt, style) {
  const p = prompt.toLowerCase();
  let top = "#0d1117", bot = "#010409", accent = "#f5c542", highlight = "#ffffff", glow = "rgba(245, 197, 66, 0.4)";

  if (/\b(sunset|sunrise|dusk|dawn|golden|orange|warm)\b/.test(p)) {
    top = "#2b1055"; bot = "#ff5e3a"; accent = "#f5c542"; glow = "rgba(255, 120, 50, 0.5)";
  } else if (/\b(cyberpunk|neon|cyan|matrix)\b/.test(p)) {
    top = "#090d16"; bot = "#020408"; accent = "#00f0ff"; highlight = "#ff007f"; glow = "rgba(0, 240, 255, 0.45)";
  } else if (/\b(space|galaxy|nebula|cosmic|purple|violet)\b/.test(p)) {
    top = "#19082b"; bot = "#04020a"; accent = "#c084fc"; highlight = "#38bdf8"; glow = "rgba(192, 132, 252, 0.45)";
  } else if (/\b(fire|flame|red|crimson|volcano|lava|inferno)\b/.test(p)) {
    top = "#3a0808"; bot = "#140101"; accent = "#ff3b30"; highlight = "#ffcc00"; glow = "rgba(255, 60, 0, 0.55)";
  } else if (/\b(green|emerald|forest|nature|jade)\b/.test(p)) {
    top = "#082314"; bot = "#020d06"; accent = "#10b981"; highlight = "#6ee7b7"; glow = "rgba(16, 185, 129, 0.45)";
  } else if (/\b(ice|snow|winter|frost|cold|blue)\b/.test(p)) {
    top = "#0f2b48"; bot = "#040d18"; accent = "#38bdf8"; highlight = "#ffffff"; glow = "rgba(56, 189, 248, 0.45)";
  } else if (/\b(gold|angel|divine|sacred|seraph|heaven)\b/.test(p)) {
    top = "#1e1405"; bot = "#080501"; accent = "#f5c542"; highlight = "#fff3cc"; glow = "rgba(245, 197, 66, 0.5)";
  }
  return { top, bot, accent, highlight, glow };
}

function renderUniversalSynthesizer(ctx, W, H, prompt, style, seed) {
  const baseDim = Math.min(W, H);
  const theme = detectPromptTheme(prompt);
  const palette = extractColorPalette(prompt, style);

  // Seeded PRNG based on prompt hash + seed
  let s = (seed || 12345) % 2147483647;
  for (let i = 0; i < prompt.length; i++) {
    s = (s * 31 + prompt.charCodeAt(i)) % 2147483647;
  }
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  if (theme === "landscape") {
    renderLandscapeScene(ctx, W, H, baseDim, palette, rnd);
  } else if (theme === "cyberpunk") {
    renderCyberpunkScene(ctx, W, H, baseDim, palette, rnd);
  } else if (theme === "cosmic") {
    renderCosmicScene(ctx, W, H, baseDim, palette, rnd);
  } else if (theme === "creature") {
    renderCreatureScene(ctx, W, H, baseDim, palette, rnd, prompt);
  } else if (theme === "portrait") {
    renderPortraitScene(ctx, W, H, baseDim, palette, rnd);
  } else if (theme === "mechanical") {
    renderMechanicalScene(ctx, W, H, baseDim, palette, rnd);
  } else if (theme === "angelic") {
    renderAngelicScene(ctx, W, H, baseDim, palette, rnd);
  } else {
    renderAbstractScene(ctx, W, H, baseDim, palette, rnd);
  }

  // ACES Filmic Tone Vignette
  applyFilmicVignette(ctx, W, H, palette);
}

// 1. LANDSCAPE & NATURE RENDERER
function renderLandscapeScene(ctx, W, H, baseDim, pal, rnd) {
  // Sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.7);
  skyGrad.addColorStop(0, pal.top);
  skyGrad.addColorStop(1, pal.bot);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // Sun / Moon Disc with Bloom
  const sunX = W * (0.3 + rnd() * 0.4);
  const sunY = H * (0.2 + rnd() * 0.25);
  const sunR = baseDim * 0.08;

  const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 3.5);
  sunGlow.addColorStop(0, pal.accent);
  sunGlow.addColorStop(0.35, pal.glow);
  sunGlow.addColorStop(1, "transparent");
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR * 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.fill();

  // Distant Mountain Peaks (Lighter haze)
  ctx.fillStyle = "rgba(40, 20, 60, 0.45)";
  drawMountainRidge(ctx, W, H * 0.45, H * 0.22, 14, rnd);

  // Midground Jagged Mountain Range
  ctx.fillStyle = "#1e142b";
  drawMountainRidge(ctx, W, H * 0.55, H * 0.28, 18, rnd);

  // Forest Silhouettes
  ctx.fillStyle = "#0c0a17";
  const numTrees = Math.floor(W / 12);
  for (let i = 0; i < numTrees; i++) {
    const tx = i * 12 + (rnd() * 6);
    const ty = H * 0.65 + (rnd() * 30);
    const th = 24 + rnd() * 35;
    ctx.beginPath();
    ctx.moveTo(tx, ty - th);
    ctx.lineTo(tx + 7, ty);
    ctx.lineTo(tx - 7, ty);
    ctx.closePath();
    ctx.fill();
  }

  // Reflective Lake Water in lower section
  const lakeGrad = ctx.createLinearGradient(0, H * 0.68, 0, H);
  lakeGrad.addColorStop(0, "#080612");
  lakeGrad.addColorStop(1, pal.top);
  ctx.fillStyle = lakeGrad;
  ctx.fillRect(0, H * 0.68, W, H * 0.32);

  // Sun Reflection Shimmer on Lake
  ctx.fillStyle = pal.glow;
  for (let y = H * 0.70; y < H; y += 4) {
    const spread = (y - H * 0.68) * 0.8 + 20;
    const rw = rnd() * spread;
    ctx.fillRect(sunX - rw / 2, y, rw, 2);
  }
}

function drawMountainRidge(ctx, W, baseY, amp, steps, rnd) {
  ctx.beginPath();
  ctx.moveTo(0, baseY);
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * W;
    const y = baseY - (rnd() * amp);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, baseY + 200);
  ctx.lineTo(0, baseY + 200);
  ctx.closePath();
  ctx.fill();
}

// 2. CYBERPUNK & SCIFI CITY RENDERER
function renderCyberpunkScene(ctx, W, H, baseDim, pal, rnd) {
  // Dark rainy night sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
  skyGrad.addColorStop(0, "#050814");
  skyGrad.addColorStop(1, "#120a22");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // Vertical Laser / Spotlight Beams
  ctx.fillStyle = "rgba(0, 240, 255, 0.12)";
  for (let i = 0; i < 6; i++) {
    const bx = W * (0.15 + i * 0.15);
    ctx.beginPath();
    ctx.moveTo(bx, H * 0.75);
    ctx.lineTo(bx - 35, 0);
    ctx.lineTo(bx + 35, 0);
    ctx.closePath();
    ctx.fill();
  }

  // Distant Tower Silhouettes
  ctx.fillStyle = "#090d1c";
  const numBldgs = 18;
  for (let i = 0; i < numBldgs; i++) {
    const bw = W / numBldgs + 8;
    const bx = i * (W / numBldgs);
    const bh = H * (0.4 + rnd() * 0.35);
    const by = H - bh;
    ctx.fillRect(bx, by, bw, bh);

    // Glowing Window Grid
    const numWins = 18;
    for (let w = 0; w < numWins; w++) {
      if (rnd() > 0.45) {
        ctx.fillStyle = rnd() > 0.5 ? "rgba(0, 240, 255, 0.85)" : "rgba(255, 215, 0, 0.85)";
        ctx.fillRect(bx + 4 + (w % 4) * 6, by + 12 + Math.floor(w / 4) * 14, 3, 4);
      }
    }
  }

  // Neon Holographic Billboards
  for (let i = 0; i < 4; i++) {
    const hx = W * (0.2 + i * 0.22);
    const hy = H * (0.35 + rnd() * 0.2);
    ctx.strokeStyle = i % 2 === 0 ? "#00f0ff" : "#ff007f";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 18;
    ctx.strokeRect(hx, hy, 45, 30);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.font = "bold 9px sans-serif";
    ctx.fillText("CYBER", hx + 5, hy + 18);
  }
  ctx.shadowBlur = 0;

  // Wet Reflective Asphalt Street
  const streetGrad = ctx.createLinearGradient(0, H * 0.82, 0, H);
  streetGrad.addColorStop(0, "#080612");
  streetGrad.addColorStop(1, "#030206");
  ctx.fillStyle = streetGrad;
  ctx.fillRect(0, H * 0.82, W, H * 0.18);

  // Neon Puddle Reflections
  for (let i = 0; i < 12; i++) {
    const px = rnd() * W;
    const py = H * 0.84 + rnd() * (H * 0.14);
    ctx.fillStyle = i % 2 === 0 ? "rgba(0, 240, 255, 0.4)" : "rgba(255, 0, 128, 0.4)";
    ctx.fillRect(px, py, 35 + rnd() * 40, 2);
  }

  // Diagonal Rain Streaks
  ctx.strokeStyle = "rgba(180, 220, 255, 0.25)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 120; i++) {
    const rx = rnd() * W;
    const ry = rnd() * H;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 8, ry + 22);
    ctx.stroke();
  }
}

// 3. COSMIC & GALAXY RENDERER
function renderCosmicScene(ctx, W, H, baseDim, pal, rnd) {
  // Void
  ctx.fillStyle = "#02030a";
  ctx.fillRect(0, 0, W, H);

  // Multi-wave Nebula Dust Clouds
  const nebulaColors = ["rgba(155, 114, 203, 0.28)", "rgba(66, 133, 244, 0.25)", "rgba(245, 197, 66, 0.22)", "rgba(236, 72, 153, 0.25)"];
  for (let i = 0; i < 16; i++) {
    const nx = rnd() * W;
    const ny = rnd() * H;
    const nr = baseDim * (0.2 + rnd() * 0.35);
    const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
    grad.addColorStop(0, nebulaColors[i % nebulaColors.length]);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(nx, ny, nr, 0, Math.PI * 2);
    ctx.fill();
  }

  // 250+ Starfield
  for (let i = 0; i < 280; i++) {
    const sx = rnd() * W;
    const sy = rnd() * H;
    const sr = rnd() * 1.5 + 0.3;
    ctx.fillStyle = rnd() > 0.2 ? "#ffffff" : pal.accent;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Giant Ringed Gas Planet
  const px = W * 0.65;
  const py = H * 0.42;
  const pr = baseDim * 0.16;

  // Planet Sphere with terminator shadow
  const pGrad = ctx.createRadialGradient(px - pr * 0.3, py - pr * 0.3, pr * 0.1, px, py, pr);
  pGrad.addColorStop(0, "#e0e7ff");
  pGrad.addColorStop(0.5, "#4338ca");
  pGrad.addColorStop(1, "#090919");
  ctx.fillStyle = pGrad;
  ctx.beginPath();
  ctx.arc(px, py, pr, 0, Math.PI * 2);
  ctx.fill();

  // Planet Ring
  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(-0.4);
  ctx.strokeStyle = "rgba(199, 210, 254, 0.55)";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.ellipse(0, 0, pr * 2.2, pr * 0.45, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // High-Magnitude Diffraction Spike Stars
  drawDiffractionStar(ctx, W * 0.25, H * 0.28, baseDim * 0.04, pal.accent);
  drawDiffractionStar(ctx, W * 0.82, H * 0.72, baseDim * 0.03, "#ffffff");
}

function drawDiffractionStar(ctx, x, y, r, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.shadowColor = color;
  ctx.shadowBlur = 15;

  ctx.beginPath();
  ctx.arc(x, y, r * 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x - r * 3, y); ctx.lineTo(x + r * 3, y);
  ctx.moveTo(x, y - r * 3); ctx.lineTo(x, y + r * 3);
  ctx.stroke();
  ctx.restore();
}

// 4. CREATURE / DRAGON RENDERER
function renderCreatureScene(ctx, W, H, baseDim, pal, rnd, prompt) {
  // Volcanic / Stormy sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
  skyGrad.addColorStop(0, pal.top);
  skyGrad.addColorStop(1, pal.bot);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  const cx = W * 0.5;
  const cy = H * 0.5;

  // Background Energy / Fire Vortex
  const vortexGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseDim * 0.45);
  vortexGrad.addColorStop(0, pal.glow);
  vortexGrad.addColorStop(1, "transparent");
  ctx.fillStyle = vortexGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, baseDim * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // Dragon / Beast Silhouette
  ctx.save();
  ctx.fillStyle = "#0c0812";
  ctx.strokeStyle = pal.accent;
  ctx.lineWidth = 2;

  // Dynamic Wings
  const drawWing = (dir) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(dir, 1);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(baseDim * 0.2, -baseDim * 0.35, baseDim * 0.45, -baseDim * 0.4, baseDim * 0.5, -baseDim * 0.15);
    ctx.bezierCurveTo(baseDim * 0.35, -baseDim * 0.05, baseDim * 0.25, baseDim * 0.15, 0, baseDim * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };
  drawWing(1);
  drawWing(-1);

  // Arched Neck and Dragon Head
  ctx.beginPath();
  ctx.moveTo(cx - baseDim * 0.08, cy + baseDim * 0.2);
  ctx.quadraticCurveTo(cx - baseDim * 0.12, cy - baseDim * 0.15, cx, cy - baseDim * 0.25);
  ctx.lineTo(cx + baseDim * 0.12, cy - baseDim * 0.22); // Snout
  ctx.lineTo(cx + baseDim * 0.06, cy - baseDim * 0.32); // Horn
  ctx.lineTo(cx + baseDim * 0.02, cy - baseDim * 0.2);
  ctx.quadraticCurveTo(cx + baseDim * 0.08, cy + baseDim * 0.05, cx + baseDim * 0.08, cy + baseDim * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Glowing Eye
  ctx.fillStyle = pal.highlight;
  ctx.shadowColor = pal.accent;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(cx + baseDim * 0.04, cy - baseDim * 0.23, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();

  // Fiery / Elemental Breath Plume
  const breathGrad = ctx.createLinearGradient(cx + baseDim * 0.12, cy - baseDim * 0.22, W, cy - baseDim * 0.15);
  breathGrad.addColorStop(0, pal.accent);
  breathGrad.addColorStop(0.5, "rgba(255, 100, 0, 0.75)");
  breathGrad.addColorStop(1, "transparent");
  ctx.fillStyle = breathGrad;
  ctx.beginPath();
  ctx.moveTo(cx + baseDim * 0.12, cy - baseDim * 0.22);
  ctx.bezierCurveTo(cx + baseDim * 0.3, cy - baseDim * 0.3, W * 0.85, cy - baseDim * 0.4, W, cy - baseDim * 0.15);
  ctx.lineTo(cx + baseDim * 0.12, cy - baseDim * 0.20);
  ctx.fill();

  // Flying Embers
  for (let i = 0; i < 70; i++) {
    const ex = rnd() * W;
    const ey = rnd() * H;
    ctx.fillStyle = pal.accent;
    ctx.beginPath();
    ctx.arc(ex, ey, rnd() * 2.5 + 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 5. PORTRAIT / WARRIOR RENDERER
function renderPortraitScene(ctx, W, H, baseDim, pal, rnd) {
  // Atmospheric Studio Background
  const bgGrad = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.5, baseDim * 0.65);
  bgGrad.addColorStop(0, pal.top);
  bgGrad.addColorStop(1, pal.bot);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  const cx = W * 0.5;
  const cy = H * 0.42;

  // Rim Light Glow
  ctx.save();
  ctx.strokeStyle = pal.accent;
  ctx.lineWidth = 3;
  ctx.shadowColor = pal.accent;
  ctx.shadowBlur = 24;

  // Silhouette Torso and Head
  ctx.fillStyle = "#0a0c14";
  ctx.beginPath();
  ctx.arc(cx, cy, baseDim * 0.11, 0, Math.PI * 2); // Head
  ctx.moveTo(cx - baseDim * 0.18, H);
  ctx.quadraticCurveTo(cx - baseDim * 0.15, cy + baseDim * 0.18, cx - baseDim * 0.08, cy + baseDim * 0.12);
  ctx.lineTo(cx + baseDim * 0.08, cy + baseDim * 0.12);
  ctx.quadraticCurveTo(cx + baseDim * 0.15, cy + baseDim * 0.18, cx + baseDim * 0.18, H);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Glowing Katana / Weapon Blade
  ctx.beginPath();
  ctx.moveTo(cx + baseDim * 0.18, H * 0.85);
  ctx.lineTo(cx + baseDim * 0.32, H * 0.15);
  ctx.strokeStyle = pal.highlight;
  ctx.lineWidth = 3.5;
  ctx.stroke();
  ctx.restore();

  // Floating Atmospheric Dust
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = pal.accent;
    ctx.beginPath();
    ctx.arc(rnd() * W, rnd() * H, rnd() * 2 + 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 6. MECHANICAL & VEHICLE RENDERER
function renderMechanicalScene(ctx, W, H, baseDim, pal, rnd) {
  // Speedway Horizon
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.6);
  skyGrad.addColorStop(0, "#080b18");
  skyGrad.addColorStop(1, pal.top);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // Tarmac with Perspective Lines
  const roadGrad = ctx.createLinearGradient(0, H * 0.6, 0, H);
  roadGrad.addColorStop(0, "#121422");
  roadGrad.addColorStop(1, "#030408");
  ctx.fillStyle = roadGrad;
  ctx.fillRect(0, H * 0.6, W, H * 0.4);

  // Perspective Speed Lines
  ctx.strokeStyle = "rgba(0, 240, 255, 0.35)";
  ctx.lineWidth = 1.5;
  for (let i = -5; i <= 5; i++) {
    ctx.beginPath();
    ctx.moveTo(W * 0.5, H * 0.6);
    ctx.lineTo(W * 0.5 + i * (W * 0.15), H);
    ctx.stroke();
  }

  // Aerodynamic Car Silhouette
  const carX = W * 0.5;
  const carY = H * 0.72;
  const carW = baseDim * 0.45;
  const carH = baseDim * 0.16;

  ctx.save();
  ctx.fillStyle = "#0c0d16";
  ctx.strokeStyle = pal.accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(carX - carW * 0.5, carY + carH * 0.4);
  ctx.lineTo(carX - carW * 0.35, carY - carH * 0.3);
  ctx.lineTo(carX + carW * 0.25, carY - carH * 0.35);
  ctx.lineTo(carX + carW * 0.5, carY + carH * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Dual Headlight Volumetric Cones
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.beginPath();
  ctx.moveTo(carX + carW * 0.45, carY + carH * 0.1);
  ctx.lineTo(W * 0.95, H * 0.55);
  ctx.lineTo(W, H * 0.95);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// 7. ANGELIC & CELESTIAL RENDERER
function renderAngelicScene(ctx, W, H, baseDim, pal, rnd) {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
  skyGrad.addColorStop(0, pal.top);
  skyGrad.addColorStop(1, pal.bot);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // Volumetric Mie God Rays
  const lightX = W * 0.5;
  ctx.fillStyle = pal.glow;
  for (let i = -14; i <= 14; i++) {
    ctx.beginPath();
    ctx.moveTo(lightX, -40);
    const spread = i * (W * 0.045);
    ctx.lineTo(lightX + spread - 40, H);
    ctx.lineTo(lightX + spread + 40, H);
    ctx.closePath();
    ctx.fill();
  }

  // Concentric Sacred Geometry Halo
  const headX = W * 0.5;
  const headY = H * 0.38;
  const haloR = baseDim * 0.11;

  ctx.save();
  ctx.strokeStyle = pal.accent;
  ctx.lineWidth = 4;
  ctx.shadowColor = pal.accent;
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.arc(headX, headY, haloR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(headX, headY, haloR * 1.35, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.stroke();

  // Multi-tier Feathered Wings
  const drawWing = (dir) => {
    ctx.save();
    ctx.translate(headX, headY + baseDim * 0.06);
    ctx.scale(dir, 1);
    for (let l = 0; l < 5; l++) {
      ctx.beginPath();
      ctx.moveTo(baseDim * 0.03, 0);
      const spanX = baseDim * (0.32 + l * 0.05);
      const spanY = -baseDim * (0.12 + l * 0.04);
      ctx.bezierCurveTo(baseDim * 0.12, -baseDim * 0.18, spanX - baseDim * 0.04, spanY, spanX, spanY);
      ctx.bezierCurveTo(spanX + baseDim * 0.04, spanY + baseDim * 0.08, spanX - baseDim * 0.08, spanY + baseDim * 0.28, baseDim * 0.05, baseDim * 0.2);
      ctx.closePath();
      ctx.fillStyle = l === 0 ? "#ffffff" : pal.highlight;
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  };
  drawWing(1);
  drawWing(-1);

  // Flowing Robes & Silhouette
  ctx.fillStyle = "#f8f9fa";
  ctx.beginPath();
  ctx.arc(headX, headY, baseDim * 0.048, 0, Math.PI * 2); // Head
  ctx.moveTo(headX - baseDim * 0.04, headY + baseDim * 0.04);
  ctx.bezierCurveTo(headX - baseDim * 0.08, headY + baseDim * 0.18, headX - baseDim * 0.22, H * 0.85, headX - baseDim * 0.25, H);
  ctx.lineTo(headX + baseDim * 0.25, H);
  ctx.bezierCurveTo(headX + baseDim * 0.22, H * 0.85, headX + baseDim * 0.08, headY + baseDim * 0.18, headX + baseDim * 0.04, headY + baseDim * 0.04);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Divine Embers
  for (let i = 0; i < 90; i++) {
    ctx.fillStyle = pal.accent;
    ctx.beginPath();
    ctx.arc(rnd() * W, rnd() * H, rnd() * 2.2 + 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 8. ABSTRACT & FRACTAL RENDERER
function renderAbstractScene(ctx, W, H, baseDim, pal, rnd) {
  // Void
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, pal.top);
  bgGrad.addColorStop(1, pal.bot);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  const cx = W * 0.5;
  const cy = H * 0.5;

  // Harmonograph / Mandala Curves
  ctx.save();
  ctx.translate(cx, cy);
  ctx.shadowColor = pal.accent;
  ctx.shadowBlur = 20;

  const numPetals = 8;
  for (let i = 0; i < numPetals; i++) {
    ctx.rotate((Math.PI * 2) / numPetals);
    ctx.strokeStyle = i % 2 === 0 ? pal.accent : pal.highlight;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(baseDim * 0.2, 0, baseDim * 0.18, baseDim * 0.06, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Central Crystal Prism Core
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(cx, cy, baseDim * 0.06, 0, Math.PI * 2);
  ctx.fill();
}

// ACES Tone Curve & Vignette
function applyFilmicVignette(ctx, W, H, pal) {
  const vigGrad = ctx.createRadialGradient(W * 0.5, H * 0.5, Math.min(W, H) * 0.35, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
  vigGrad.addColorStop(0, "transparent");
  vigGrad.addColorStop(1, "rgba(0, 0, 0, 0.55)");
  ctx.fillStyle = vigGrad;
  ctx.fillRect(0, 0, W, H);
}

// -------------------------------------------------------------
// AI GENERATED IMAGE LIBRARY SYSTEM
// -------------------------------------------------------------

function loadStoredLibrary() {
  try {
    const saved = localStorage.getItem(LIBRARY_STORAGE_KEY);
    if (saved) {
      imageLibrary = JSON.parse(saved);
    }
  } catch (e) {
    imageLibrary = [];
  }

  if (!imageLibrary || imageLibrary.length === 0) {
    imageLibrary = SHOWCASE_SAMPLES.map((s, idx) => ({
      id: "showcase_" + idx,
      filename: `AI_generated_image_library_${s.url.split("/").pop()}`,
      folder: "AI generated image library",
      url: s.url,
      prompt: s.prompt,
      seed: s.seed,
      width: s.width || 1024,
      height: s.height || 1024,
      aspect: s.aspect || "square",
      timestamp: "Showcase"
    }));
  }

  renderLibrarySidebar();
}

function addToLibrary(item) {
  imageLibrary.unshift(item);
  if (imageLibrary.length > 40) imageLibrary.pop();

  try {
    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(imageLibrary.slice(0, 20)));
  } catch (e) {}

  renderLibrarySidebar();

  if (localDirectoryHandle) {
    saveToLocalDirectory(item);
  }
}

function renderLibrarySidebar() {
  if (!sidebarLibraryList) return;
  sidebarLibraryList.innerHTML = "";

  if (sidebarCountBadge) {
    sidebarCountBadge.textContent = `${imageLibrary.length} Files`;
  }

  imageLibrary.forEach(item => {
    const el = document.createElement("div");
    el.className = "sidebar-library-item";
    el.innerHTML = `
      <img src="${item.url}" class="sidebar-item-thumb" alt="Thumbnail">
      <div class="sidebar-item-info">
        <span class="sidebar-item-prompt" title="${item.prompt}">${item.prompt}</span>
        <div class="sidebar-item-meta">
          <span>${item.aspect.toUpperCase()}</span>
          <span>${item.timestamp}</span>
        </div>
      </div>
    `;

    el.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-library-item").forEach(i => i.classList.remove("active"));
      el.classList.add("active");

      welcomeContainer.classList.add("hidden");
      canvasStage.classList.remove("hidden");

      resultImage.src = item.url;
      resultImage.classList.remove("hidden");
      browserCanvas.classList.add("hidden");
      promptInput.value = item.prompt;
    });

    sidebarLibraryList.appendChild(el);
  });
}

function handleDownloadCurrentArtwork() {
  const link = document.createElement("a");
  const res = getSelectedResolution();
  link.download = `AI_generated_image_library_angel_${res.aspect}_${Date.now()}.png`;

  if (!resultImage.classList.contains("hidden") && resultImage.src) {
    link.href = resultImage.src;
  } else {
    link.href = browserCanvas.toDataURL("image/png");
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Bulk ZIP Download
async function handleDownloadLibraryZip() {
  if (!imageLibrary || imageLibrary.length === 0) {
    alert("Library is empty!");
    return;
  }

  if (typeof JSZip === "undefined") {
    alert("Downloading recent items into 'AI generated image library'...");
    imageLibrary.slice(0, 5).forEach((item, idx) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.download = item.filename;
        a.href = item.url;
        a.click();
      }, idx * 400);
    });
    return;
  }

  try {
    btnSidebarDownloadZip.textContent = "⏳ Zipping...";
    const zip = new JSZip();
    const folder = zip.folder("AI generated image library");

    for (let i = 0; i < imageLibrary.length; i++) {
      const item = imageLibrary[i];
      const filename = `angel_${item.aspect}_seed${item.seed}_${i + 1}.png`;
      if (item.url.startsWith("data:image")) {
        folder.file(filename, item.url.split(",")[1], { base64: true });
      } else {
        try {
          const resp = await fetch(item.url);
          folder.file(filename, await resp.blob());
        } catch (e) {}
      }
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "AI_generated_image_library.zip";
    link.click();

    btnSidebarDownloadZip.textContent = "✓ Saved ZIP";
    setTimeout(() => btnSidebarDownloadZip.textContent = "📦 Save ZIP", 2000);
  } catch (err) {
    alert("Error creating ZIP: " + err.message);
    btnSidebarDownloadZip.textContent = "📦 Save ZIP";
  }
}

// Sync to local PC Folder via File System Access API
async function handleSyncLocalFolder() {
  if (!("showDirectoryPicker" in window)) {
    alert("Your browser doesn't support direct local directory picker. Use '📦 Save ZIP' instead!");
    return;
  }

  try {
    localDirectoryHandle = await window.showDirectoryPicker();
    btnSidebarSync.textContent = "✓ Synced";
    btnSidebarSync.style.color = "var(--gold-light)";

    for (const item of imageLibrary) {
      await saveToLocalDirectory(item);
    }

    alert(`Successfully synced ${imageLibrary.length} files into folder "${localDirectoryHandle.name}"!`);
  } catch (err) {
    if (err.name !== "AbortError") console.warn(err);
  }
}

async function saveToLocalDirectory(item) {
  if (!localDirectoryHandle) return;
  try {
    const fileHandle = await localDirectoryHandle.getFileHandle(item.filename, { create: true });
    const writable = await fileHandle.createWritable();
    const resp = await fetch(item.url);
    await writable.write(await resp.blob());
    await writable.close();
  } catch (e) {}
}

function handleClearLibrary() {
  if (confirm("Are you sure you want to clear your AI Generated Image Library?")) {
    imageLibrary = [];
    try { localStorage.removeItem(LIBRARY_STORAGE_KEY); } catch (e) {}
    renderLibrarySidebar();
  }
}

function openLightbox() {
  const src = !resultImage.classList.contains("hidden") && resultImage.src
    ? resultImage.src
    : browserCanvas.toDataURL("image/png");
  lightboxImg.src = src;
  lightboxModal.classList.remove("hidden");
}
