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
  { url: SAMPLES_PREFIX + "06_divine_baroque_seraph_4k.png", prompt: "Golden baroque sacred angel painting with radiant halo and volumetric god rays", seed: 123, aspect: "square", width: 1024, height: 1024 },
  { url: SAMPLES_PREFIX + "07_celestial_wolf_guardian_4k.png", prompt: "Majestic anthropomorphic wolf warrior in glowing celestial gold armor with pointed ears and luminous amber eyes", seed: 777, aspect: "square", width: 1024, height: 1024 }
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
  initFakeUpgradeEasterEgg();
  initNswFilterAndGoodBoy();
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

  
  // Toast & Exit Warning Event Listeners
  if (btnCloseToast) btnCloseToast.addEventListener("click", hideImageReadyToast);

  if (btnToastDownload) {
    btnToastDownload.addEventListener("click", () => {
      if (currentToastItem) {
        handleDownloadCurrentArtwork();
        btnToastDownload.innerHTML = "<span>✓</span> Downloaded!";
        setTimeout(() => {
          btnToastDownload.innerHTML = "<span>💾</span> Download Image";
          hideImageReadyToast();
        }, 1200);
      }
    });
  }

  if (btnToastLibrary) {
    btnToastLibrary.addEventListener("click", () => {
      hideImageReadyToast();
      if (sidebar && sidebar.classList.contains("collapsed")) {
        sidebar.classList.remove("collapsed");
      }
      const firstItem = sidebarLibraryList ? sidebarLibraryList.querySelector(".sidebar-library-item") : null;
      if (firstItem) {
        firstItem.scrollIntoView({ behavior: "smooth", block: "center" });
        firstItem.classList.add("active");
      }
    });
  }

  if (btnExitDownloadZip) {
    btnExitDownloadZip.addEventListener("click", () => {
      handleDownloadLibraryZip();
    });
  }

  if (btnExitStay) {
    btnExitStay.addEventListener("click", () => {
      hideExitWarningModal();
    });
  }

  if (btnExitLeave) {
    btnExitLeave.addEventListener("click", () => {
      const url = pendingExitUrl;
      hideExitWarningModal();
      if (url) {
        window.location.href = url;
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

  // NSW Filter Safety Gate
  if (nswFilterActive && /\b(furry|anthro|anthropomorphic|good boy|nsfw|18\+|fursona)\b/i.test(prompt)) {
    showNswSafetyModal(true);
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
    showImageReadyToast(libraryItem);

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
  if (/\b(furry|anthro|anthropomorphic|good boy|wolf warrior|fox warrior|fursona|canine|feline)\b/.test(p)) return "furry";
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

// =============================================================
// NEXT-GEN PROCEDURAL NEURAL SYNTHESIS ENGINE (1000X FIDELITY)
// =============================================================

class FastNoise {
  constructor(seed = 1337) {
    this.p = new Uint8Array(512);
    const perm = new Uint8Array(256);
    for (let i = 0; i < 256; i++) perm[i] = i;
    let s = (seed ^ 0x6a09e667) >>> 0;
    for (let i = 255; i > 0; i--) {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      const j = s % (i + 1);
      const tmp = perm[i];
      perm[i] = perm[j];
      perm[j] = tmp;
    }
    for (let i = 0; i < 512; i++) this.p[i] = perm[i & 255];
  }

  fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  lerp(t, a, b) { return a + t * (b - a); }
  grad(hash, x, y) {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -2.0 * v : 2.0 * v);
  }

  noise2D(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = this.fade(xf);
    const v = this.fade(yf);

    const aa = this.p[this.p[X] + Y];
    const ab = this.p[this.p[X] + Y + 1];
    const ba = this.p[this.p[X + 1] + Y];
    const bb = this.p[this.p[X + 1] + Y + 1];

    const x1 = this.lerp(u, this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf));
    const x2 = this.lerp(u, this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1));
    return (this.lerp(v, x1, x2) + 1.0) * 0.5;
  }

  fbm(x, y, octaves = 5, lacunarity = 2.0, gain = 0.5) {
    let sum = 0, amp = 1.0, freq = 1.0, max = 0;
    for (let i = 0; i < octaves; i++) {
      sum += this.noise2D(x * freq, y * freq) * amp;
      max += amp;
      freq *= lacunarity;
      amp *= gain;
    }
    return sum / max;
  }

  warpedFbm(x, y, octaves = 5) {
    const qx = this.fbm(x, y, octaves);
    const qy = this.fbm(x + 5.2, y + 1.3, octaves);
    const rx = this.fbm(x + 3.0 * qx + 1.7, y + 3.0 * qy + 9.2, octaves);
    const ry = this.fbm(x + 3.0 * qx + 8.3, y + 3.0 * qy + 2.8, octaves);
    return this.fbm(x + 3.0 * rx, y + 3.0 * ry, octaves);
  }
}

function renderUniversalSynthesizer(ctx, W, H, prompt, style, seed) {
  const baseDim = Math.min(W, H);
  const theme = detectPromptTheme(prompt);
  const palette = extractColorPalette(prompt, style);

  let s = (seed || 12345) % 2147483647;
  for (let i = 0; i < prompt.length; i++) {
    s = (s * 31 + prompt.charCodeAt(i)) % 2147483647;
  }
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  const noise = new FastNoise(s);

  if (theme === "landscape") {
    renderLandscapeScene(ctx, W, H, baseDim, palette, rnd, noise);
  } else if (theme === "cyberpunk") {
    renderCyberpunkScene(ctx, W, H, baseDim, palette, rnd, noise);
  } else if (theme === "cosmic") {
    renderCosmicScene(ctx, W, H, baseDim, palette, rnd, noise);
  } else if (theme === "creature") {
    renderCreatureScene(ctx, W, H, baseDim, palette, rnd, noise, prompt);
  } else if (theme === "portrait") {
    renderPortraitScene(ctx, W, H, baseDim, palette, rnd, noise);
  } else if (theme === "mechanical") {
    renderMechanicalScene(ctx, W, H, baseDim, palette, rnd, noise);
  } else if (theme === "furry") {
    renderFurryScene(ctx, W, H, baseDim, palette, rnd, noise, prompt);
  } else if (theme === "angelic") {
    renderAngelicScene(ctx, W, H, baseDim, palette, rnd, noise);
  } else {
    renderAbstractScene(ctx, W, H, baseDim, palette, rnd, noise);
  }

  // Universal Film Grade & Vignette
  applyFilmicVignette(ctx, W, H, palette);
}

// -------------------------------------------------------------
// 1. MASTERPIECE LANDSCAPE & ALPINE NATURE
// -------------------------------------------------------------
function renderLandscapeScene(ctx, W, H, baseDim, pal, rnd, noise) {
  // Golden hour sunset sky with Rayleigh atmospheric scattering
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.7);
  skyGrad.addColorStop(0, "#1c1033");
  skyGrad.addColorStop(0.35, "#5b2c58");
  skyGrad.addColorStop(0.65, "#d95f43");
  skyGrad.addColorStop(0.85, "#fdb252");
  skyGrad.addColorStop(1, "#fff2b2");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // Low Setting Sun with Volumetric Radial Glow
  const sunX = W * (0.35 + rnd() * 0.3);
  const sunY = H * 0.48;
  const sunR = baseDim * 0.085;

  ctx.save();
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 3.5);
  sunGlow.addColorStop(0, "rgba(255, 255, 240, 1.0)");
  sunGlow.addColorStop(0.2, "rgba(255, 220, 120, 0.75)");
  sunGlow.addColorStop(0.6, "rgba(255, 120, 60, 0.25)");
  sunGlow.addColorStop(1, "transparent");
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR * 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4 Parallax Mountain Ridges with Fractal Crags
  const ridges = [
    { baseY: H * 0.46, amp: H * 0.18, color: "#3a254c", snow: true, freq: 0.0022 },
    { baseY: H * 0.53, amp: H * 0.22, color: "#2b193d", snow: true, freq: 0.0035 },
    { baseY: H * 0.60, amp: H * 0.25, color: "#191129", snow: false, freq: 0.005 },
    { baseY: H * 0.67, amp: H * 0.16, color: "#0c0917", snow: false, freq: 0.008 }
  ];

  ridges.forEach((r, idx) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, r.baseY);

    const steps = 180;
    const peakPoints = [];
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * W;
      const n = noise.fbm(x * r.freq + idx * 10, idx * 5, 5);
      const y = r.baseY - (n * r.amp);
      ctx.lineTo(x, y);
      peakPoints.push({ x, y });
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = r.color;
    ctx.fill();

    // Snowcaps on sunward faces
    if (r.snow) {
      ctx.fillStyle = "rgba(255, 245, 230, 0.65)";
      ctx.beginPath();
      for (let i = 0; i < peakPoints.length - 1; i++) {
        const pt = peakPoints[i];
        if (pt.y < r.baseY - r.amp * 0.55) {
          ctx.lineTo(pt.x, pt.y);
          ctx.lineTo(pt.x + 3, pt.y + 14 + noise.noise2D(pt.x * 0.05, 0) * 8);
        }
      }
      ctx.fill();
    }
    ctx.restore();
  });

  // Valley Mist & Atmospheric Fog
  ctx.save();
  const mistGrad = ctx.createLinearGradient(0, H * 0.58, 0, H * 0.68);
  mistGrad.addColorStop(0, "transparent");
  mistGrad.addColorStop(0.5, "rgba(255, 220, 180, 0.25)");
  mistGrad.addColorStop(1, "transparent");
  ctx.fillStyle = mistGrad;
  ctx.fillRect(0, H * 0.58, W, H * 0.10);
  ctx.restore();

  // Dense Evergreen Pine Forest Canopy
  ctx.save();
  const forestY = H * 0.66;
  const numTrees = Math.floor(W / 7);
  for (let i = 0; i < numTrees; i++) {
    const tx = i * 7 + (noise.noise2D(i, 0) * 5);
    const th = 28 + noise.fbm(tx * 0.02, 0, 3) * 35;
    const ty = forestY + (noise.noise2D(i * 0.5, 5) * 16);

    ctx.fillStyle = "#07060f";
    ctx.beginPath();
    ctx.moveTo(tx, ty - th);
    ctx.lineTo(tx + 5, ty);
    ctx.lineTo(tx - 5, ty);
    ctx.closePath();
    ctx.fill();

    // Branch notches
    ctx.beginPath();
    ctx.moveTo(tx, ty - th * 0.65);
    ctx.lineTo(tx + 4, ty - th * 0.35);
    ctx.lineTo(tx - 4, ty - th * 0.35);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Mirror Alpine Lake Surface with Fresnel Reflections
  const lakeTop = H * 0.70;
  const lakeH = H - lakeTop;
  const lakeGrad = ctx.createLinearGradient(0, lakeTop, 0, H);
  lakeGrad.addColorStop(0, "#080614");
  lakeGrad.addColorStop(0.4, "#2b1433");
  lakeGrad.addColorStop(0.85, "#803c3a");
  lakeGrad.addColorStop(1, "#c27442");
  ctx.fillStyle = lakeGrad;
  ctx.fillRect(0, lakeTop, W, lakeH);

  // Specular Sun Pillar Reflection Trail
  ctx.save();
  for (let y = lakeTop; y < H; y += 3) {
    const progress = (y - lakeTop) / lakeH;
    const spread = (progress * baseDim * 0.45) + 12;
    const rw = (noise.noise2D(y * 0.08, sunX * 0.01) * spread);
    const alpha = (1.0 - progress * 0.45) * 0.6;
    ctx.fillStyle = `rgba(255, 235, 160, ${alpha})`;
    ctx.fillRect(sunX - rw * 0.5, y, rw, 2);
  }
  ctx.restore();
}

// -------------------------------------------------------------
// 2. MASTERPIECE CYBERPUNK NEON METROPOLIS
// -------------------------------------------------------------
function renderCyberpunkScene(ctx, W, H, baseDim, pal, rnd, noise) {
  // Midnight Smog Sky with Violet Horizon
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
  skyGrad.addColorStop(0, "#030408");
  skyGrad.addColorStop(0.5, "#0b081a");
  skyGrad.addColorStop(0.85, "#1f0c2e");
  skyGrad.addColorStop(1, "#0a0c14");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // Distant Searchlights & Vertical Laser Columns
  ctx.save();
  for (let b = 0; b < 7; b++) {
    const bx = W * (0.12 + b * 0.13);
    const beamGrad = ctx.createLinearGradient(bx, H * 0.75, bx + (b - 3) * 60, 0);
    const isCyan = b % 2 === 0;
    beamGrad.addColorStop(0, isCyan ? "rgba(0, 240, 255, 0.28)" : "rgba(255, 0, 128, 0.25)");
    beamGrad.addColorStop(1, "transparent");
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(bx - 12, H * 0.75);
    ctx.lineTo(bx + (b - 3) * 60 - 45, 0);
    ctx.lineTo(bx + (b - 3) * 60 + 45, 0);
    ctx.lineTo(bx + 12, H * 0.75);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Tiered Mega-Skyscrapers in 3 Parallax Layers
  const layers = [
    { count: 16, baseY: H * 0.35, minW: 35, maxW: 65, color: "#0c0d18", winAlpha: 0.35 },
    { count: 12, baseY: H * 0.48, minW: 55, maxW: 95, color: "#141524", winAlpha: 0.65 },
    { count: 8,  baseY: H * 0.58, minW: 80, maxW: 140, color: "#1a192e", winAlpha: 0.95 }
  ];

  layers.forEach((layer, lIdx) => {
    let curX = -20;
    while (curX < W + 40) {
      const bW = layer.minW + (noise.noise2D(curX * 0.01, lIdx) * (layer.maxW - layer.minW));
      const bH = (H * 0.78) - layer.baseY + (noise.noise2D(curX * 0.02, lIdx * 5) * H * 0.22);
      const bY = (H * 0.78) - bH;

      ctx.fillStyle = layer.color;
      ctx.fillRect(curX, bY, bW, bH);

      // Antenna Spires with Pulsing Aviation Beacon
      if (noise.noise2D(curX * 0.05, 9) > 0.45) {
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(curX + bW * 0.5, bY);
        ctx.lineTo(curX + bW * 0.5, bY - 28);
        ctx.stroke();

        ctx.fillStyle = lIdx === 2 ? "#ff0055" : "#00f0ff";
        ctx.beginPath();
        ctx.arc(curX + bW * 0.5, bY - 28, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Procedural Window Grid
      const rows = Math.floor(bH / 14);
      const cols = Math.floor(bW / 10);
      for (let r = 1; r < rows - 1; r++) {
        for (let c = 1; c < cols - 1; c++) {
          const winSeed = noise.noise2D(curX + c * 8, bY + r * 12);
          if (winSeed > 0.48) {
            const winColor = winSeed > 0.78 ? "#00f0ff" : (winSeed > 0.65 ? "#ff007f" : "#ffd166");
            ctx.fillStyle = winColor;
            ctx.globalAlpha = layer.winAlpha * (0.4 + winSeed * 0.6);
            ctx.fillRect(curX + c * 10, bY + r * 14, 5, 7);
          }
        }
      }
      ctx.globalAlpha = 1.0;

      // Holographic Neon Billboards on foreground towers
      if (lIdx === 2 && bW > 100 && noise.noise2D(curX * 0.03, 3) > 0.5) {
        ctx.fillStyle = "rgba(0, 240, 255, 0.2)";
        ctx.fillRect(curX + 12, bY + 30, bW - 24, 45);
        ctx.strokeStyle = "#00f0ff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(curX + 12, bY + 30, bW - 24, 45);

        ctx.fillStyle = "#ff007f";
        ctx.fillRect(curX + 20, bY + 45, bW - 40, 12);
      }

      curX += bW + (lIdx === 0 ? 10 : 18);
    }
  });

  // Elevated Highway Sky-Bridge with Light Streaks
  ctx.save();
  const bridgeY = H * 0.68;
  ctx.fillStyle = "#080a12";
  ctx.fillRect(0, bridgeY, W, 14);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 1;
  ctx.strokeRect(0, bridgeY, W, 14);

  // Speed Traffic Trails (Cyan & Crimson streaks)
  for (let s = 0; s < 18; s++) {
    const sx = (s * (W / 18) + (rnd() * 20)) % W;
    const isForward = s % 2 === 0;
    ctx.strokeStyle = isForward ? "#00f0ff" : "#ff0044";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(sx, bridgeY + (isForward ? 4 : 10));
    ctx.lineTo(sx + (isForward ? 45 : -45), bridgeY + (isForward ? 4 : 10));
    ctx.stroke();
  }
  ctx.restore();

  // Wet Asphalt Street Level & Reflective Puddles
  const groundY = H * 0.78;
  const groundH = H - groundY;
  const groundGrad = ctx.createLinearGradient(0, groundY, 0, H);
  groundGrad.addColorStop(0, "#080911");
  groundGrad.addColorStop(1, "#020305");
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, groundY, W, groundH);

  // Diffuse Neon Street Reflections
  ctx.save();
  for (let y = groundY; y < H; y += 4) {
    const progress = (y - groundY) / groundH;
    for (let x = 20; x < W; x += 60) {
      const nRef = noise.noise2D(x * 0.02, y * 0.05);
      if (nRef > 0.45) {
        ctx.fillStyle = nRef > 0.65 ? "rgba(0, 240, 255, 0.22)" : "rgba(255, 0, 128, 0.18)";
        ctx.fillRect(x, y, 40 + nRef * 30, 2.5);
      }
    }
  }
  ctx.restore();

  // Cinematic Directional Rain Streaks
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 180; i++) {
    const rx = rnd() * W;
    const ry = rnd() * H;
    const rLen = 14 + rnd() * 20;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 4, ry + rLen);
    ctx.stroke();
  }
  ctx.restore();
}

// -------------------------------------------------------------
// 3. MASTERPIECE DEEP SPACE COSMIC NEBULA
// -------------------------------------------------------------
function renderCosmicScene(ctx, W, H, baseDim, pal, rnd, noise) {
  // Astronomical Void with Interstellar Plasma Base
  ctx.fillStyle = "#020206";
  ctx.fillRect(0, 0, W, H);

  const cx = W * 0.5;
  const cy = H * 0.5;

  // Swirling Ionized Plasma Gas Clouds (warpedFbm)
  const plasmaGrid = 32;
  const cW = W / plasmaGrid;
  const cH = H / plasmaGrid;

  ctx.save();
  for (let py = 0; py < plasmaGrid; py++) {
    for (let px = 0; px < plasmaGrid; px++) {
      const x = px * cW;
      const y = py * cH;
      const n1 = noise.warpedFbm(x * 0.0025, y * 0.0025, 4);
      const n2 = noise.fbm((x + 100) * 0.003, (y + 100) * 0.003, 3);

      if (n1 > 0.38) {
        const rad = cW * (1.5 + n1 * 1.8);
        const pGrad = ctx.createRadialGradient(x, y, 0, x, y, rad);
        const isCyan = n2 > 0.52;
        const alpha = Math.min(0.65, (n1 - 0.38) * 1.5);
        pGrad.addColorStop(0, isCyan ? `rgba(0, 240, 255, ${alpha * 0.55})` : `rgba(220, 38, 127, ${alpha * 0.55})`);
        pGrad.addColorStop(0.6, `rgba(120, 28, 180, ${alpha * 0.25})`);
        pGrad.addColorStop(1, "transparent");

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.restore();

  // Relativistic Black Hole / Accretion Disk
  const diskR = baseDim * 0.28;
  const holeR = baseDim * 0.095;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.25);

  // Outer Glowing Accretion Rings with Doppler Beaming (left side hotter/brighter)
  for (let r = diskR; r > holeR; r -= 3) {
    const frac = (r - holeR) / (diskR - holeR);
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.38, 0, 0, Math.PI * 2);

    const ringGrad = ctx.createLinearGradient(-r, 0, r, 0);
    // Doppler blue-shift left, red-shift right
    ringGrad.addColorStop(0, "rgba(220, 245, 255, 0.85)");
    ringGrad.addColorStop(0.4, "rgba(255, 180, 50, 0.65)");
    ringGrad.addColorStop(1, "rgba(180, 40, 70, 0.15)");
    ctx.strokeStyle = ringGrad;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // Relativistic Photon Sphere Ring
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#00f0ff";
  ctx.shadowBlur = 25;
  ctx.beginPath();
  ctx.arc(0, 0, holeR * 1.08, 0, Math.PI * 2);
  ctx.stroke();

  // Pure Black Event Horizon Void
  ctx.fillStyle = "#000000";
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(0, 0, holeR, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Multi-Magnitude Starfield
  ctx.save();
  for (let s = 0; s < 260; s++) {
    const sx = rnd() * W;
    const sy = rnd() * H;
    const sr = rnd() * 1.8 + 0.4;
    const sAlpha = rnd() * 0.85 + 0.15;

    ctx.fillStyle = `rgba(255, 255, 255, ${sAlpha})`;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();

    // 6 Anchor Stars with 4-Point Cross Diffraction Spikes
    if (s < 6) {
      const spikeLen = 14 + rnd() * 18;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx - spikeLen, sy);
      ctx.lineTo(sx + spikeLen, sy);
      ctx.moveTo(sx, sy - spikeLen);
      ctx.lineTo(sx, sy + spikeLen);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// -------------------------------------------------------------
// 4. MASTERPIECE DRACONIC & MYTHOLOGICAL CREATURE
// -------------------------------------------------------------
function renderCreatureScene(ctx, W, H, baseDim, pal, rnd, noise, prompt) {
  // Volcanic Storm Sky with Violet Lightning
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
  skyGrad.addColorStop(0, "#08050e");
  skyGrad.addColorStop(0.5, "#200922");
  skyGrad.addColorStop(0.85, "#421217");
  skyGrad.addColorStop(1, "#180608");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // Jagged Craggy Volcanic Perch
  ctx.save();
  ctx.fillStyle = "#0f0812";
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, H * 0.72);
  for (let x = 0; x <= W; x += 15) {
    const y = H * 0.72 + (noise.fbm(x * 0.01, 0, 4) * H * 0.18);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  const dragX = W * 0.48;
  const dragY = H * 0.52;

  // Massive Membranous Dragon Wings
  ctx.save();
  const drawDragonWing = (dir) => {
    ctx.save();
    ctx.translate(dragX, dragY);
    ctx.scale(dir, 1);

    // Wing Finger Bones
    const wingPoints = [
      { x: baseDim * 0.18, y: -baseDim * 0.28 },
      { x: baseDim * 0.35, y: -baseDim * 0.34 },
      { x: baseDim * 0.44, y: -baseDim * 0.18 },
      { x: baseDim * 0.38, y: baseDim * 0.04 }
    ];

    // Translucent Leathery Webbing with Vein Gradients
    const webGrad = ctx.createLinearGradient(0, 0, baseDim * 0.4, -baseDim * 0.2);
    webGrad.addColorStop(0, "#2a0e1c");
    webGrad.addColorStop(0.5, "#4a1228");
    webGrad.addColorStop(1, "#7d1e38");
    ctx.fillStyle = webGrad;

    ctx.beginPath();
    ctx.moveTo(baseDim * 0.05, 0);
    ctx.lineTo(wingPoints[0].x, wingPoints[0].y);
    ctx.quadraticCurveTo(baseDim * 0.26, -baseDim * 0.24, wingPoints[1].x, wingPoints[1].y);
    ctx.quadraticCurveTo(baseDim * 0.38, -baseDim * 0.22, wingPoints[2].x, wingPoints[2].y);
    ctx.quadraticCurveTo(baseDim * 0.36, -baseDim * 0.05, wingPoints[3].x, wingPoints[3].y);
    ctx.quadraticCurveTo(baseDim * 0.20, baseDim * 0.06, baseDim * 0.05, baseDim * 0.08);
    ctx.closePath();
    ctx.fill();

    // Articulated Bone Struts
    ctx.strokeStyle = "#160710";
    ctx.lineWidth = 4;
    wingPoints.forEach(pt => {
      ctx.beginPath();
      ctx.moveTo(baseDim * 0.05, 0);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    });

    ctx.restore();
  };

  drawDragonWing(-1);
  drawDragonWing(1);
  ctx.restore();

  // Muscular Serpentine Body & Arched Neck
  ctx.save();
  ctx.fillStyle = "#15091a";
  ctx.beginPath();
  ctx.moveTo(dragX - baseDim * 0.08, dragY + baseDim * 0.18);
  ctx.quadraticCurveTo(dragX - baseDim * 0.14, dragY - baseDim * 0.05, dragX - baseDim * 0.04, dragY - baseDim * 0.22);
  ctx.lineTo(dragX + baseDim * 0.04, dragY - baseDim * 0.22);
  ctx.quadraticCurveTo(dragX - baseDim * 0.02, dragY - baseDim * 0.05, dragX + baseDim * 0.08, dragY + baseDim * 0.18);
  ctx.closePath();
  ctx.fill();

  // Horned Draconic Skull & Snout
  const skullX = dragX - baseDim * 0.04;
  const skullY = dragY - baseDim * 0.24;

  ctx.fillStyle = "#1b0b20";
  ctx.beginPath();
  ctx.moveTo(skullX, skullY);
  ctx.lineTo(skullX - baseDim * 0.14, skullY + baseDim * 0.03); // snout
  ctx.lineTo(skullX - baseDim * 0.08, skullY + baseDim * 0.08); // lower jaw
  ctx.lineTo(skullX + baseDim * 0.04, skullY + baseDim * 0.05);
  ctx.closePath();
  ctx.fill();

  // Curved Scythe Horns
  ctx.strokeStyle = "#2e1236";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(skullX, skullY);
  ctx.quadraticCurveTo(skullX + baseDim * 0.08, skullY - baseDim * 0.12, skullX + baseDim * 0.14, skullY - baseDim * 0.08);
  ctx.stroke();

  // Glowing Serpentine Slit Eye
  ctx.fillStyle = "#ffd166";
  ctx.shadowColor = "#ff9f1c";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.ellipse(skullX - baseDim * 0.05, skullY + baseDim * 0.02, 5, 2.5, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Torrent of Core Plasma Fire Erupting from Maw
  ctx.save();
  const fireX = skullX - baseDim * 0.14;
  const fireY = skullY + baseDim * 0.04;

  for (let f = 0; f < 30; f++) {
    const fx = fireX - (f * 12) + (noise.noise2D(f, 0) * 15);
    const fy = fireY + (f * 6) + (noise.noise2D(f, 5) * 20);
    const fr = 12 + f * 4.5;

    const fireGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr);
    fireGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    fireGrad.addColorStop(0.3, "rgba(255, 200, 50, 0.85)");
    fireGrad.addColorStop(0.7, "rgba(230, 60, 20, 0.45)");
    fireGrad.addColorStop(1, "transparent");

    ctx.fillStyle = fireGrad;
    ctx.beginPath();
    ctx.arc(fx, fy, fr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Rising Volcanic Embers
  for (let e = 0; e < 60; e++) {
    const ex = rnd() * W;
    const ey = rnd() * H;
    ctx.fillStyle = rnd() > 0.5 ? "#ffd166" : "#ff3838";
    ctx.beginPath();
    ctx.arc(ex, ey, rnd() * 2 + 1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// -------------------------------------------------------------
// 5. MASTERPIECE AUTOMOTIVE & MECHANICAL ENGINEERING
// -------------------------------------------------------------
function renderMechanicalScene(ctx, W, H, baseDim, pal, rnd, noise) {
  // Dark Industrial Tunnel / Test Track
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, "#030407");
  bgGrad.addColorStop(0.65, "#0b0e14");
  bgGrad.addColorStop(1, "#020304");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Perspective Speed Tunnel Lines
  ctx.save();
  ctx.strokeStyle = "rgba(0, 240, 255, 0.18)";
  ctx.lineWidth = 1.5;
  const vX = W * 0.5;
  const vY = H * 0.42;
  for (let l = 0; l < 14; l++) {
    const angle = (l / 14) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(vX, vY);
    ctx.lineTo(vX + Math.cos(angle) * W, vY + Math.sin(angle) * H);
    ctx.stroke();
  }
  ctx.restore();

  const carX = W * 0.5;
  const carY = H * 0.62;
  const carW = baseDim * 0.62;
  const carH = baseDim * 0.18;

  // Ground Contact Shadow & Wet Reflection
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.beginPath();
  ctx.ellipse(carX, carY + carH * 0.85, carW * 0.55, carH * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();

  // Aerodynamic Supercar Chassis Silhouette (Low-drag styling)
  const bodyGrad = ctx.createLinearGradient(carX - carW * 0.5, 0, carX + carW * 0.5, 0);
  bodyGrad.addColorStop(0, "#1e293b");
  bodyGrad.addColorStop(0.5, "#0f172a");
  bodyGrad.addColorStop(1, "#334155");
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.moveTo(carX - carW * 0.48, carY + carH * 0.5); // front splitter
  ctx.quadraticCurveTo(carX - carW * 0.42, carY + carH * 0.1, carX - carW * 0.24, carY - carH * 0.15); // hood
  ctx.quadraticCurveTo(carX - carW * 0.05, carY - carH * 0.45, carX + carW * 0.15, carY - carH * 0.35); // windshield/roof
  ctx.quadraticCurveTo(carX + carW * 0.35, carY - carH * 0.18, carX + carW * 0.46, carY + carH * 0.15); // rear deck
  ctx.lineTo(carX + carW * 0.48, carY + carH * 0.45); // rear diffuser
  ctx.lineTo(carX - carW * 0.48, carY + carH * 0.5);
  ctx.closePath();
  ctx.fill();

  // Tinted Cockpit Glass
  ctx.fillStyle = "rgba(0, 240, 255, 0.22)";
  ctx.beginPath();
  ctx.moveTo(carX - carW * 0.22, carY - carH * 0.12);
  ctx.quadraticCurveTo(carX - carW * 0.04, carY - carH * 0.38, carX + carW * 0.14, carY - carH * 0.30);
  ctx.lineTo(carX + carW * 0.12, carY - carH * 0.08);
  ctx.closePath();
  ctx.fill();

  // Multi-Spoke Alloy Wheels & Brake Calipers
  const drawWheel = (wx, wy, wr) => {
    ctx.fillStyle = "#020304";
    ctx.beginPath();
    ctx.arc(wx, wy, wr, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Glowing Carbon-Ceramic Rotor & Red Caliper
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(wx, wy, wr * 0.55, 0.5, 1.8);
    ctx.lineTo(wx, wy);
    ctx.closePath();
    ctx.fill();
  };

  drawWheel(carX - carW * 0.32, carY + carH * 0.52, carH * 0.36);
  drawWheel(carX + carW * 0.32, carY + carH * 0.52, carH * 0.36);

  // Volumetric Headlight Beams (Cutting through asphalt haze)
  const hlX = carX - carW * 0.46;
  const hlY = carY + carH * 0.24;

  const hlGrad = ctx.createRadialGradient(hlX, hlY, 0, hlX - baseDim * 0.4, hlY + baseDim * 0.15, baseDim * 0.5);
  hlGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  hlGrad.addColorStop(0.3, "rgba(0, 240, 255, 0.45)");
  hlGrad.addColorStop(1, "transparent");

  ctx.fillStyle = hlGrad;
  ctx.beginPath();
  ctx.moveTo(hlX, hlY);
  ctx.lineTo(hlX - baseDim * 0.48, hlY - baseDim * 0.08);
  ctx.lineTo(hlX - baseDim * 0.42, hlY + baseDim * 0.25);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// -------------------------------------------------------------
// 6. MASTERPIECE CINEMATIC PORTRAIT
// -------------------------------------------------------------
function renderPortraitScene(ctx, W, H, baseDim, pal, rnd, noise) {
  // Painterly Studio Backdrop with Mottled Vignette
  const bgGrad = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, baseDim * 0.7);
  bgGrad.addColorStop(0, "#3d2a24");
  bgGrad.addColorStop(0.6, "#1a1210");
  bgGrad.addColorStop(1, "#070504");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  const cx = W * 0.5;
  const cy = H * 0.46;

  // Shoulders & Torso Silhouette (Chiaroscuro)
  ctx.save();
  const torsoGrad = ctx.createLinearGradient(cx - baseDim * 0.3, 0, cx + baseDim * 0.3, 0);
  torsoGrad.addColorStop(0, "#1c1412");
  torsoGrad.addColorStop(0.4, "#382924");
  torsoGrad.addColorStop(1, "#0d0a09");
  ctx.fillStyle = torsoGrad;

  ctx.beginPath();
  ctx.moveTo(cx - baseDim * 0.32, H);
  ctx.quadraticCurveTo(cx - baseDim * 0.22, cy + baseDim * 0.25, cx, cy + baseDim * 0.18);
  ctx.quadraticCurveTo(cx + baseDim * 0.22, cy + baseDim * 0.25, cx + baseDim * 0.32, H);
  ctx.closePath();
  ctx.fill();

  // Neck & Jawline
  ctx.fillStyle = "#a88574";
  ctx.beginPath();
  ctx.moveTo(cx - baseDim * 0.065, cy + baseDim * 0.12);
  ctx.lineTo(cx - baseDim * 0.065, cy + baseDim * 0.22);
  ctx.lineTo(cx + baseDim * 0.065, cy + baseDim * 0.22);
  ctx.lineTo(cx + baseDim * 0.065, cy + baseDim * 0.12);
  ctx.closePath();
  ctx.fill();

  // Facial Oval with Rembrandt Lighting (Lit on right, shadow on left)
  const faceGrad = ctx.createRadialGradient(cx + baseDim * 0.04, cy - baseDim * 0.02, 0, cx, cy, baseDim * 0.14);
  faceGrad.addColorStop(0, "#f3d3be");
  faceGrad.addColorStop(0.5, "#d4aa92");
  faceGrad.addColorStop(0.85, "#8a614e");
  faceGrad.addColorStop(1, "#452e24");
  ctx.fillStyle = faceGrad;

  ctx.beginPath();
  ctx.ellipse(cx, cy, baseDim * 0.09, baseDim * 0.13, 0, 0, Math.PI * 2);
  ctx.fill();

  // Expressive Eyes with Specular Catchlights
  const eyeY = cy - baseDim * 0.015;
  [-1, 1].forEach(side => {
    const eyeX = cx + side * (baseDim * 0.038);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, 6, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Iris & Pupil
    ctx.fillStyle = "#2d1f18";
    ctx.beginPath();
    ctx.arc(eyeX + (side * 0.5), eyeY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Specular Catchlight
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(eyeX + 1, eyeY - 1, 1.2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Flowing Textured Hair with Rim Lighting
  ctx.strokeStyle = "#1b110e";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(cx, cy - baseDim * 0.04, baseDim * 0.105, Math.PI * 0.8, Math.PI * 2.2);
  ctx.stroke();

  ctx.restore();
}

// -------------------------------------------------------------
// 7. MASTERPIECE CELESTIAL & SACRED ARCHANGEL
// -------------------------------------------------------------
function renderAngelicScene(ctx, W, H, baseDim, pal, rnd, noise) {
  // Heavenly Dawn Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
  skyGrad.addColorStop(0, pal.top);
  skyGrad.addColorStop(0.45, pal.accent);
  skyGrad.addColorStop(0.75, "#2a1638");
  skyGrad.addColorStop(1, pal.bot);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  const headX = W * 0.5;
  const headY = H * 0.38;

  // Volumetric Fractal Cumulus Clouds (fBm)
  const cloudRows = 24;
  const cloudCols = 32;
  const cellW = W / cloudCols;
  const cellH = (H * 0.65) / cloudRows;
  ctx.save();
  for (let r = 0; r < cloudRows; r++) {
    const cy = H * 0.35 + r * cellH;
    for (let c = 0; c < cloudCols; c++) {
      const cx = c * cellW;
      const n = noise.warpedFbm(cx * 0.003, cy * 0.003, 4);
      if (n > 0.42) {
        const rad = cellW * (1.2 + n * 1.5);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        const alpha = Math.min(0.85, (n - 0.42) * 1.6);
        grad.addColorStop(0, `rgba(255, 235, 190, ${alpha * 0.45})`);
        grad.addColorStop(0.6, `rgba(180, 140, 195, ${alpha * 0.25})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.restore();

  // Volumetric Mie God-Rays from Zenith
  ctx.save();
  const rayOriginX = headX;
  const rayOriginY = -H * 0.15;
  for (let i = -18; i <= 18; i++) {
    const angle = (i / 18) * 0.95 + (rnd() - 0.5) * 0.03;
    const rayLength = H * 1.4;
    const spread = baseDim * (0.025 + Math.abs(i) * 0.004);
    const endX = rayOriginX + Math.sin(angle) * rayLength;
    const endY = rayOriginY + Math.cos(angle) * rayLength;

    const rayGrad = ctx.createLinearGradient(rayOriginX, rayOriginY, endX, endY);
    const rayAlpha = Math.max(0.04, 0.22 - Math.abs(i) * 0.008);
    rayGrad.addColorStop(0, "rgba(255, 245, 200, 0.45)");
    rayGrad.addColorStop(0.4, `rgba(245, 197, 66, ${rayAlpha})`);
    rayGrad.addColorStop(1, "transparent");

    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(rayOriginX, rayOriginY);
    ctx.lineTo(endX - spread, endY);
    ctx.lineTo(endX + spread, endY);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Sacred Geometry Concentric Halo (Metatron / Solar Cross)
  ctx.save();
  const haloRadius = baseDim * 0.13;
  ctx.shadowColor = pal.accent;
  ctx.shadowBlur = 40;

  // Outer golden ring
  ctx.strokeStyle = pal.accent;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(headX, headY, haloRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Inner filigree ring
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(headX, headY, haloRadius * 0.78, 0, Math.PI * 2);
  ctx.stroke();

  // 8-Fold Sacred Radial Starburst Rays
  ctx.lineWidth = 2;
  for (let a = 0; a < 8; a++) {
    const theta = (a / 8) * Math.PI * 2;
    const r1 = haloRadius * 0.82;
    const r2 = haloRadius * (a % 2 === 0 ? 1.35 : 1.15);
    ctx.beginPath();
    ctx.moveTo(headX + Math.cos(theta) * r1, headY + Math.sin(theta) * r1);
    ctx.lineTo(headX + Math.cos(theta) * r2, headY + Math.sin(theta) * r2);
    ctx.stroke();
  }

  // Central Starlight Diamond Flare
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(headX, headY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Multi-Tiered Anatomical Feathered Wings
  const drawArticulatedWing = (dir) => {
    ctx.save();
    ctx.translate(headX, headY + baseDim * 0.06);
    ctx.scale(dir, 1);

    // Tier 1: Primary Flight Remiges (9 long outer feathers)
    const primaries = 9;
    for (let p = 0; p < primaries; p++) {
      const frac = p / (primaries - 1);
      const angle = -0.45 + frac * 0.85;
      const length = baseDim * (0.42 + Math.sin(frac * Math.PI) * 0.18);
      const tipX = Math.cos(angle) * length;
      const tipY = -Math.sin(angle) * length * 0.75 + (frac * baseDim * 0.32);

      // Ambient occlusion drop shadow behind feather
      ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 4 * dir;
      ctx.shadowOffsetY = 6;

      const fGrad = ctx.createLinearGradient(0, 0, tipX, tipY);
      fGrad.addColorStop(0, "#e8d8be");
      fGrad.addColorStop(0.65, "#fff9eb");
      fGrad.addColorStop(1, pal.accent);

      ctx.fillStyle = fGrad;
      ctx.beginPath();
      ctx.moveTo(baseDim * 0.04, baseDim * 0.04);
      ctx.quadraticCurveTo(tipX * 0.45, tipY - baseDim * 0.06, tipX, tipY);
      ctx.quadraticCurveTo(tipX * 0.75, tipY + baseDim * 0.07, baseDim * 0.06, baseDim * 0.12);
      ctx.closePath();
      ctx.fill();

      // Feather Central Shaft (Rachis)
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = "rgba(218, 165, 32, 0.75)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(baseDim * 0.04, baseDim * 0.04);
      ctx.quadraticCurveTo(tipX * 0.5, tipY * 0.5, tipX, tipY);
      ctx.stroke();
    }

    // Tier 2: Secondary Feathers (7 mid-wing curved plumes)
    for (let s = 0; s < 7; s++) {
      const frac = s / 6;
      const sX = baseDim * (0.16 + frac * 0.22);
      const sY = baseDim * (0.02 + frac * 0.24);

      const sGrad = ctx.createLinearGradient(0, 0, sX, sY);
      sGrad.addColorStop(0, "#d5c2a5");
      sGrad.addColorStop(0.7, "#ffffff");
      sGrad.addColorStop(1, "#f5c542");

      ctx.fillStyle = sGrad;
      ctx.beginPath();
      ctx.moveTo(baseDim * 0.03, baseDim * 0.02);
      ctx.quadraticCurveTo(sX * 0.5, sY - baseDim * 0.04, sX, sY);
      ctx.quadraticCurveTo(sX * 0.7, sY + baseDim * 0.06, baseDim * 0.04, sY + baseDim * 0.04);
      ctx.closePath();
      ctx.fill();
    }

    // Tier 3: Downy Greater Coverts (Overlapping Plumes at Wing Base)
    for (let c = 0; c < 6; c++) {
      const cFrac = c / 5;
      const cx = baseDim * (0.08 + cFrac * 0.15);
      const cy = baseDim * (0.06 + cFrac * 0.16);
      ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
      ctx.beginPath();
      ctx.ellipse(cx, cy, baseDim * 0.05, baseDim * 0.025, 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  // Render left and right symmetrical wings
  drawArticulatedWing(-1);
  drawArticulatedWing(1);

  // Classical Chiaroscuro Draped Robes
  ctx.save();
  const robeTopY = headY + baseDim * 0.08;
  const robeBotY = H * 0.98;
  const robeWidth = baseDim * 0.34;

  const robeGrad = ctx.createLinearGradient(headX, robeTopY, headX, robeBotY);
  robeGrad.addColorStop(0, "#f8f5ed");
  robeGrad.addColorStop(0.4, "#ded5c2");
  robeGrad.addColorStop(0.8, "#9e9182");
  robeGrad.addColorStop(1, "#3d342f");

  ctx.fillStyle = robeGrad;
  ctx.beginPath();
  ctx.moveTo(headX - baseDim * 0.05, robeTopY);
  ctx.quadraticCurveTo(headX - baseDim * 0.08, H * 0.65, headX - robeWidth * 0.5, robeBotY);
  ctx.lineTo(headX + robeWidth * 0.5, robeBotY);
  ctx.quadraticCurveTo(headX + baseDim * 0.08, H * 0.65, headX + baseDim * 0.05, robeTopY);
  ctx.closePath();
  ctx.fill();

  // Flowing Drapery Shadow Folds
  ctx.strokeStyle = "rgba(40, 32, 28, 0.35)";
  ctx.lineWidth = 2.5;
  for (let f = -3; f <= 3; f++) {
    const fx = headX + f * (baseDim * 0.035);
    ctx.beginPath();
    ctx.moveTo(fx, robeTopY + baseDim * 0.06);
    ctx.quadraticCurveTo(fx + f * 6, H * 0.7, headX + f * (robeWidth * 0.14), robeBotY);
    ctx.stroke();
  }

  // 24K Gold Embroidered Hemline
  ctx.strokeStyle = pal.accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(headX - robeWidth * 0.5, robeBotY);
  ctx.lineTo(headX + robeWidth * 0.5, robeBotY);
  ctx.stroke();

  // Sacred Sunburst Chest Glyph
  ctx.fillStyle = pal.accent;
  ctx.beginPath();
  ctx.arc(headX, robeTopY + baseDim * 0.045, baseDim * 0.022, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Luminous Head Silhouette with Soft Rim Light
  ctx.save();
  const headGrad = ctx.createRadialGradient(headX, headY, 0, headX, headY, baseDim * 0.055);
  headGrad.addColorStop(0, "#ffffff");
  headGrad.addColorStop(0.7, "#f5ead3");
  headGrad.addColorStop(1, "#dfcca4");
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.arc(headX, headY, baseDim * 0.052, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Floating Golden Starlight Motes
  ctx.save();
  for (let m = 0; m < 70; m++) {
    const mx = rnd() * W;
    const my = rnd() * H;
    const mr = rnd() * 2.5 + 0.8;
    const mAlpha = rnd() * 0.75 + 0.25;

    ctx.fillStyle = `rgba(255, 240, 180, ${mAlpha})`;
    ctx.beginPath();
    ctx.arc(mx, my, mr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}


// -------------------------------------------------------------
// 8. MASTERPIECE ANTHROPOMORPHIC CELESTIAL GUARDIAN (FURRY)
// -------------------------------------------------------------
function renderFurryScene(ctx, W, H, baseDim, pal, rnd, noise, prompt) {
  // Midnight twilight backdrop with warm radial halo
  const bgGrad = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, baseDim * 0.72);
  bgGrad.addColorStop(0, "#2a1538");
  bgGrad.addColorStop(0.5, "#140a1c");
  bgGrad.addColorStop(1, "#060309");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  const cx = W * 0.5;
  const cy = H * 0.45;

  // Luminous Starlight Aura behind character
  ctx.save();
  const auraGrad = ctx.createRadialGradient(cx, cy - baseDim * 0.05, 0, cx, cy - baseDim * 0.05, baseDim * 0.38);
  auraGrad.addColorStop(0, "rgba(245, 197, 66, 0.45)");
  auraGrad.addColorStop(0.5, "rgba(180, 80, 220, 0.20)");
  auraGrad.addColorStop(1, "transparent");
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(cx, cy - baseDim * 0.05, baseDim * 0.38, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Celestial Mantle / Shoulders
  ctx.save();
  const mantleGrad = ctx.createLinearGradient(cx - baseDim * 0.35, 0, cx + baseDim * 0.35, 0);
  mantleGrad.addColorStop(0, "#1a1226");
  mantleGrad.addColorStop(0.5, "#2d1f42");
  mantleGrad.addColorStop(1, "#150e20");
  ctx.fillStyle = mantleGrad;

  ctx.beginPath();
  ctx.moveTo(cx - baseDim * 0.34, H);
  ctx.quadraticCurveTo(cx - baseDim * 0.24, cy + baseDim * 0.22, cx, cy + baseDim * 0.16);
  ctx.quadraticCurveTo(cx + baseDim * 0.24, cy + baseDim * 0.22, cx + baseDim * 0.34, H);
  ctx.closePath();
  ctx.fill();

  // 24K Gold Embroidered Collar Trim
  ctx.strokeStyle = "#f5c542";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - baseDim * 0.16, cy + baseDim * 0.18);
  ctx.quadraticCurveTo(cx, cy + baseDim * 0.24, cx + baseDim * 0.16, cy + baseDim * 0.18);
  ctx.stroke();

  // Fluffy Chest Fur (Ivory / Cream)
  ctx.fillStyle = "#f3ede2";
  ctx.beginPath();
  ctx.moveTo(cx - baseDim * 0.08, cy + baseDim * 0.14);
  ctx.quadraticCurveTo(cx - baseDim * 0.12, cy + baseDim * 0.26, cx, cy + baseDim * 0.32);
  ctx.quadraticCurveTo(cx + baseDim * 0.12, cy + baseDim * 0.26, cx + baseDim * 0.08, cy + baseDim * 0.14);
  ctx.closePath();
  ctx.fill();

  // Anthro Head Base & Cheek Tufts
  const headGrad = ctx.createRadialGradient(cx, cy - baseDim * 0.02, 0, cx, cy, baseDim * 0.18);
  headGrad.addColorStop(0, "#e8d8c3");
  headGrad.addColorStop(0.65, "#c9b397");
  headGrad.addColorStop(1, "#8a745c");
  ctx.fillStyle = headGrad;

  // Head Oval
  ctx.beginPath();
  ctx.ellipse(cx, cy - baseDim * 0.02, baseDim * 0.13, baseDim * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cheek Fur Tufts (Symmetrical)
  [-1, 1].forEach(side => {
    ctx.beginPath();
    ctx.moveTo(cx + side * baseDim * 0.10, cy + baseDim * 0.02);
    ctx.lineTo(cx + side * baseDim * 0.19, cy + baseDim * 0.04);
    ctx.lineTo(cx + side * baseDim * 0.12, cy + baseDim * 0.08);
    ctx.lineTo(cx + side * baseDim * 0.18, cy + baseDim * 0.11);
    ctx.lineTo(cx + side * baseDim * 0.08, cy + baseDim * 0.13);
    ctx.closePath();
    ctx.fill();
  });

  // Tall Pointed Canine / Fox Ears with Inner Fluff
  [-1, 1].forEach(side => {
    const earBaseX = cx + side * (baseDim * 0.085);
    const earBaseY = cy - baseDim * 0.12;
    const earTipX = cx + side * (baseDim * 0.14);
    const earTipY = cy - baseDim * 0.32;

    // Outer Ear
    ctx.fillStyle = "#8a745c";
    ctx.beginPath();
    ctx.moveTo(earBaseX - side * (baseDim * 0.04), earBaseY);
    ctx.quadraticCurveTo(cx + side * (baseDim * 0.06), cy - baseDim * 0.22, earTipX, earTipY);
    ctx.quadraticCurveTo(cx + side * (baseDim * 0.18), cy - baseDim * 0.20, earBaseX + side * (baseDim * 0.05), earBaseY);
    ctx.closePath();
    ctx.fill();

    // Inner Ear Fluff (Soft Pinkish Peach)
    ctx.fillStyle = "#f6c4ba";
    ctx.beginPath();
    ctx.moveTo(earBaseX - side * (baseDim * 0.02), earBaseY);
    ctx.quadraticCurveTo(cx + side * (baseDim * 0.07), cy - baseDim * 0.20, earTipX - side * 4, earTipY + 12);
    ctx.quadraticCurveTo(cx + side * (baseDim * 0.14), cy - baseDim * 0.18, earBaseX + side * (baseDim * 0.03), earBaseY);
    ctx.closePath();
    ctx.fill();

    // White fur wisps in ear
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 1.5;
    for (let w = 0; w < 4; w++) {
      ctx.beginPath();
      ctx.moveTo(earBaseX + side * (baseDim * 0.01), earBaseY - w * 6);
      ctx.quadraticCurveTo(cx + side * (baseDim * 0.08), cy - baseDim * 0.20 + w * 4, earBaseX + side * (baseDim * 0.06), earBaseY - 14 - w * 4);
      ctx.stroke();
    }
  });

  // Muzzle (Snout)
  const muzzleY = cy + baseDim * 0.035;
  ctx.fillStyle = "#f3ede2";
  ctx.beginPath();
  ctx.ellipse(cx, muzzleY, baseDim * 0.065, baseDim * 0.048, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cute Dark Rounded Nose
  ctx.fillStyle = "#2a1f1d";
  ctx.beginPath();
  ctx.ellipse(cx, muzzleY - baseDim * 0.016, baseDim * 0.022, baseDim * 0.014, 0, 0, Math.PI * 2);
  ctx.fill();

  // Gentle Mouth & Whisker Dots
  ctx.strokeStyle = "#4a3b35";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(cx, muzzleY - baseDim * 0.002);
  ctx.lineTo(cx, muzzleY + baseDim * 0.014);
  ctx.quadraticCurveTo(cx - baseDim * 0.025, muzzleY + baseDim * 0.024, cx - baseDim * 0.035, muzzleY + baseDim * 0.016);
  ctx.moveTo(cx, muzzleY + baseDim * 0.014);
  ctx.quadraticCurveTo(cx + baseDim * 0.025, muzzleY + baseDim * 0.024, cx + baseDim * 0.035, muzzleY + baseDim * 0.016);
  ctx.stroke();

  // Large Expressive Eyes (Anime / Celestial Stylized)
  const eyeY = cy - baseDim * 0.032;
  [-1, 1].forEach(side => {
    const eyeX = cx + side * (baseDim * 0.065);
    const eyeW = baseDim * 0.034;
    const eyeH = baseDim * 0.042;

    // White Sclera
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, eyeW, eyeH, side * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Vibrant Amber / Topaz Iris Gradient
    const irisGrad = ctx.createLinearGradient(eyeX, eyeY - eyeH, eyeX, eyeY + eyeH);
    irisGrad.addColorStop(0, "#d97706");
    irisGrad.addColorStop(0.5, "#f59e0b");
    irisGrad.addColorStop(1, "#fef08a");
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, eyeW * 0.78, eyeH * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark Pupil
    ctx.fillStyle = "#1e140a";
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, eyeW * 0.42, eyeH * 0.52, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dual Specular Catchlights (Large primary + small secondary)
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(eyeX - side * (eyeW * 0.22), eyeY - eyeH * 0.25, eyeW * 0.26, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(eyeX + side * (eyeW * 0.20), eyeY + eyeH * 0.20, eyeW * 0.14, 0, Math.PI * 2);
    ctx.fill();

    // Eyelash Contour
    ctx.strokeStyle = "#2b1810";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, eyeW * 1.05, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  });

  // Floating Golden Starlight Sparkles
  for (let s = 0; s < 45; s++) {
    const sx = rnd() * W;
    const sy = rnd() * H;
    const sr = rnd() * 2.2 + 0.6;
    ctx.fillStyle = rnd() > 0.4 ? "rgba(245, 197, 66, 0.8)" : "rgba(255, 255, 255, 0.9)";
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// -------------------------------------------------------------
// 8. MASTERPIECE ABSTRACT SACRED FLUID HARMONICS
// -------------------------------------------------------------
function renderAbstractScene(ctx, W, H, baseDim, pal, rnd, noise) {
  const bgGrad = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, baseDim * 0.75);
  bgGrad.addColorStop(0, pal.accent);
  bgGrad.addColorStop(0.5, pal.top);
  bgGrad.addColorStop(1, pal.bot);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  const cx = W * 0.5;
  const cy = H * 0.5;

  // Sacred Geometric Torus Lattice
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < 28; i++) {
    const angle = (i / 28) * Math.PI * 2;
    const tr = baseDim * 0.22;
    const tx = Math.cos(angle) * tr;
    const ty = Math.sin(angle) * tr;

    ctx.strokeStyle = `rgba(245, 197, 66, ${0.15 + (i % 3) * 0.1})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(tx, ty, baseDim * 0.22, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// -------------------------------------------------------------
// UNIVERSAL ACES FILMIC TONE GRADING & LENS VIGNETTE
// -------------------------------------------------------------
function applyFilmicVignette(ctx, W, H, pal) {
  // ACES Filmic Contrast & Tone Curve Simulation
  const vigGrad = ctx.createRadialGradient(W * 0.5, H * 0.5, Math.min(W, H) * 0.32, W * 0.5, H * 0.5, Math.max(W, H) * 0.76);
  vigGrad.addColorStop(0, "transparent");
  vigGrad.addColorStop(0.7, "rgba(0, 0, 0, 0.25)");
  vigGrad.addColorStop(1, "rgba(0, 0, 0, 0.65)");
  ctx.fillStyle = vigGrad;
  ctx.fillRect(0, 0, W, H);

  // Micro Canvas Fine-Art Grain
  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
  for (let g = 0; g < 400; g++) {
    const gx = Math.random() * W;
    const gy = Math.random() * H;
    ctx.fillRect(gx, gy, 1, 1);
  }
  ctx.restore();
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
  if (sidebarWarningBanner) sidebarWarningBanner.style.display = imageLibrary.length > 0 ? 'flex' : 'none';
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


// ===========================================================
// POPUP NOTIFICATION & EXIT CONFIRMATION
// ===========================================================
const sidebarWarningBanner = document.getElementById("sidebarWarningBanner");
const imageReadyToast = document.getElementById("imageReadyToast");
const toastThumb = document.getElementById("toastThumb");
const btnCloseToast = document.getElementById("btnCloseToast");
const btnToastDownload = document.getElementById("btnToastDownload");
const btnToastLibrary = document.getElementById("btnToastLibrary");

const exitWarningModal = document.getElementById("exitWarningModal");
const exitModalStat = document.getElementById("exitModalStat");
const btnExitDownloadZip = document.getElementById("btnExitDownloadZip");
const btnExitStay = document.getElementById("btnExitStay");
const btnExitLeave = document.getElementById("btnExitLeave");

let toastDismissTimeout = null;
let currentToastItem = null;
let pendingExitUrl = null;

function showImageReadyToast(item) {
  currentToastItem = item;
  if (!imageReadyToast) return;

  if (toastThumb && item && item.url) {
    toastThumb.src = item.url;
  }

  imageReadyToast.style.display = "block";
  imageReadyToast.style.animation = "none";
  imageReadyToast.offsetHeight; // trigger reflow
  imageReadyToast.style.animation = "toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)";

  if (btnToastDownload) {
    btnToastDownload.innerHTML = "<span>💾</span> Download Image";
  }

  if (soundEnabled && typeof audioCtx !== "undefined" && audioCtx) {
    playNotificationChime();
  }

  if (toastDismissTimeout) {
    clearTimeout(toastDismissTimeout);
  }
  toastDismissTimeout = setTimeout(() => {
    hideImageReadyToast();
  }, 12000);
}

function hideImageReadyToast() {
  if (!imageReadyToast) return;
  imageReadyToast.style.display = "none";
  if (toastDismissTimeout) {
    clearTimeout(toastDismissTimeout);
    toastDismissTimeout = null;
  }
}

function playNotificationChime() {
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.36);
  } catch (e) {}
}

function showExitWarningModal(targetUrl) {
  pendingExitUrl = targetUrl;
  if (!exitWarningModal) return;
  if (exitModalStat) {
    exitModalStat.textContent = `You have ${imageLibrary.length} image(s) in your current session that will be deleted!`;
  }
  exitWarningModal.style.display = "flex";
}

function hideExitWarningModal() {
  if (!exitWarningModal) return;
  exitWarningModal.style.display = "none";
  pendingExitUrl = null;
}

// Intercept browser window / tab closure
window.addEventListener("beforeunload", function (e) {
  if (imageLibrary && imageLibrary.length > 0) {
    const msg = "Are you sure you want to close this website? By closing you delete all your images and will have to manually regenerate every single one again!";
    e.preventDefault();
    e.returnValue = msg;
    return msg;
  }
});

// Intercept internal page navigation links when images exist
document.addEventListener("click", function (e) {
  const link = e.target.closest("a");
  if (!link) return;
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

  if (imageLibrary && imageLibrary.length > 0) {
    e.preventDefault();
    showExitWarningModal(href);
  }
});


// -----------------------------------------------------------
// APRIL FOOLS FAKE UPGRADE EASTER EGG
// -----------------------------------------------------------
const btnFakeUpgrade = document.getElementById("btnFakeUpgrade");
const fakeUpgradeModal = document.getElementById("fakeUpgradeModal");
const fakeUpgradeCard = document.getElementById("fakeUpgradeCard");
const upgradeStageInput = document.getElementById("upgradeStageInput");
const upgradeStageGlitch = document.getElementById("upgradeStageGlitch");
const fakePinInput = document.getElementById("fakePinInput");
const btnFakeSubmit = document.getElementById("btnFakeSubmit");
const btnFakeCancel = document.getElementById("btnFakeCancel");
const btnFakeOkDismiss = document.getElementById("btnFakeOkDismiss");
const glitchStream = document.getElementById("glitchStream");

let glitchInterval = null;

function initFakeUpgradeEasterEgg() {
  if (btnFakeUpgrade) {
    btnFakeUpgrade.addEventListener("click", () => {
      if (!fakeUpgradeModal) return;
      fakeUpgradeModal.style.display = "flex";
      if (upgradeStageInput) upgradeStageInput.style.display = "block";
      if (upgradeStageGlitch) upgradeStageGlitch.style.display = "none";
      if (fakeUpgradeCard) fakeUpgradeCard.classList.remove("glitched");
      if (fakePinInput) {
        fakePinInput.value = "";
        fakePinInput.focus();
      }
    });
  }

  const triggerGlitchExplosion = () => {
    if (upgradeStageInput) upgradeStageInput.style.display = "none";
    if (upgradeStageGlitch) upgradeStageGlitch.style.display = "block";
    if (fakeUpgradeCard) fakeUpgradeCard.classList.add("glitched");

    if (glitchInterval) clearInterval(glitchInterval);
    const chars = "01$#@!%&*~_░▒▓█▲▼§±¶ΞΩΨERROR_PAYWALL_DENIED_0xFREE_FOREVER_NO_CARDS_ACCEPTED_";
    if (glitchStream) {
      glitchStream.textContent = "";
      glitchInterval = setInterval(() => {
        let chunk = "";
        for (let i = 0; i < 48; i++) {
          chunk += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        glitchStream.textContent = (chunk + "\n" + glitchStream.textContent).slice(0, 480);
      }, 60);
    }

    if (soundEnabled && typeof audioCtx !== "undefined" && audioCtx) {
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.32);
      } catch (e) {}
    }
  };

  if (btnFakeSubmit) btnFakeSubmit.addEventListener("click", triggerGlitchExplosion);

  if (fakePinInput) {
    fakePinInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") triggerGlitchExplosion();
    });
  }

  const closeFakeUpgrade = () => {
    if (fakeUpgradeModal) fakeUpgradeModal.style.display = "none";
    if (glitchInterval) {
      clearInterval(glitchInterval);
      glitchInterval = null;
    }
    if (fakeUpgradeCard) fakeUpgradeCard.classList.remove("glitched");
  };

  if (btnFakeCancel) btnFakeCancel.addEventListener("click", closeFakeUpgrade);
  if (btnFakeOkDismiss) btnFakeOkDismiss.addEventListener("click", closeFakeUpgrade);
}


// -----------------------------------------------------------
// NSW FILTER & GOOD BOY RANDOM ANTHRO GENERATOR
// -----------------------------------------------------------
let nswFilterActive = true;
let pendingFurryGeneration = false;

const FURRY_PROMPTS = [
  "Majestic anthropomorphic wolf warrior in glowing celestial gold armor with pointed ears and luminous amber eyes",
  "Playful anthropomorphic fox rogue with fluffy tail, celestial cape, expressive emerald eyes and pointed fox ears",
  "Noble anthropomorphic snow leopard guardian with soft rosette fur, pointed feline ears and starry aura",
  "Heroic anthropomorphic canine paladin with golden halo, flowing celestial scarf and soft muzzle",
  "Mystical anthropomorphic fox mage with twin glowing tails, arcane starlight glyphs and soft inner ear fluff",
  "Sleek anthropomorphic shadow wolf with glowing cyan tribal markings, pointed wolf ears and intense gaze"
];

function updateNswFilterUI() {
  const chip = document.getElementById("chipNswFilter");
  const stateText = document.getElementById("nswFilterStateText");
  if (!chip || !stateText) return;

  if (nswFilterActive) {
    chip.classList.add("active");
    chip.classList.remove("unrestricted");
    stateText.textContent = "ON";
  } else {
    chip.classList.remove("active");
    chip.classList.add("unrestricted");
    stateText.textContent = "OFF (18+)";
  }
}

function showNswSafetyModal(forGoodBoy = false) {
  pendingFurryGeneration = forGoodBoy;
  const modal = document.getElementById("nswSafetyModal");
  if (modal) modal.style.display = "flex";
}

function closeNswSafetyModal() {
  const modal = document.getElementById("nswSafetyModal");
  if (modal) modal.style.display = "none";
}

function initNswFilterAndGoodBoy() {
  const chipNsw = document.getElementById("chipNswFilter");
  const btnGoodBoy = document.getElementById("btnGoodBoy");
  const btnNswKeepOn = document.getElementById("btnNswKeepOn");
  const btnNswTurnOff = document.getElementById("btnNswTurnOff");

  if (chipNsw) {
    chipNsw.addEventListener("click", () => {
      if (nswFilterActive) {
        showNswSafetyModal(false);
      } else {
        nswFilterActive = true;
        updateNswFilterUI();
      }
    });
  }

  if (btnNswKeepOn) {
    btnNswKeepOn.addEventListener("click", () => {
      closeNswSafetyModal();
      pendingFurryGeneration = false;
    });
  }

  if (btnNswTurnOff) {
    btnNswTurnOff.addEventListener("click", () => {
      nswFilterActive = false;
      updateNswFilterUI();
      closeNswSafetyModal();

      if (pendingFurryGeneration) {
        pendingFurryGeneration = false;
        triggerGoodBoyFurry();
      }
    });
  }

  if (btnGoodBoy) {
    btnGoodBoy.addEventListener("click", () => {
      if (nswFilterActive) {
        showNswSafetyModal(true);
      } else {
        triggerGoodBoyFurry();
      }
    });
  }
}

function triggerGoodBoyFurry() {
  const rndPrompt = FURRY_PROMPTS[Math.floor(Math.random() * FURRY_PROMPTS.length)];
  if (promptInput) {
    promptInput.value = rndPrompt;
    promptInput.focus();
  }
  handleGenerate();
}
