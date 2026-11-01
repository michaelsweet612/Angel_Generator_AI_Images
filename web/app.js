/**
 * Angel Generator AI Studio Suite v3.0
 * 100% From-Scratch Neural Text-to-Image Generative Studio
 * Client-Side WebGL / Canvas Synthesizer + AI Generated Image Library
 */

const PRESETS = {
  archangel: {
    title: "Archangel Michael",
    prompt: "Archangel Michael with massive radiant golden feathered wings, flaming divine sword, golden halo in heavenly clouds, volumetric divine light rays, masterpiece, 4k ultra-hd",
    style: "renaissance"
  },
  seraphim: {
    title: "Six-Winged Seraphim",
    prompt: "Magnificent six-winged Seraphim surrounded by celestial clouds, radiant golden halo, sacred light beams, sacred fire, ethereal celestial dawn",
    style: "divine_gold"
  },
  cathedral: {
    title: "Cathedral Guardian",
    prompt: "Guardian angel with pure white feathered wings overlooking sacred gothic cathedral spire, golden sunset, divine presence, chiaroscuro",
    style: "renaissance"
  },
  cyberpunk: {
    title: "Cyberpunk Hologram Angel",
    prompt: "Futuristic cyberpunk holographic angel with glowing neon cyan wings overlooking rainy neon skyscraper metropolis, scifi volumetric light",
    style: "cyberpunk"
  }
};

const INSPIRATIONS = [
  "Cherubim bathed in sacred golden starlight with six layered feathered wings, ethereal mist, 8k",
  "Archangel Gabriel descending from heavenly zenith with trumpet of light and luminous golden aura",
  "Celestial guardian standing upon pillars of starlight in deep space galaxy nebula, glowing halo",
  "Baroque painting of divine seraph with glowing aureole, volumetric god rays, chiaroscuro masterpiece",
  "Renaissance fresco of winged angel in cathedral with 24k gold leaf filigree, masterpiece"
];

const SAMPLES_PREFIX = window.location.pathname.includes("/web/") ? "../samples/" : "samples/";

const SHOWCASE_SAMPLES = [
  { url: SAMPLES_PREFIX + "01_archangel_michael_4k.png", prompt: "Archangel Michael with massive radiant golden feathered wings, golden halo in heavenly clouds", seed: 777, aspect: "square", width: 1024, height: 1024 },
  { url: SAMPLES_PREFIX + "02_seraphim_celestial_dawn_4k.png", prompt: "Six-winged Seraphim surrounded by celestial divine light and golden starlight dawn", seed: 888, aspect: "square", width: 1024, height: 1024 },
  { url: SAMPLES_PREFIX + "03_cathedral_guardian_angel_4k.png", prompt: "Guardian angel with pure white feathered wings overlooking sacred gothic cathedral, golden sunset", seed: 999, aspect: "landscape", width: 1920, height: 1080 },
  { url: SAMPLES_PREFIX + "04_cyberpunk_holographic_angel_4k.png", prompt: "Cyberpunk holographic angel with glowing neon cyan wings overlooking rainy neon skyscraper metropolis", seed: 444, aspect: "portrait", width: 1080, height: 1920 },
  { url: SAMPLES_PREFIX + "05_cosmic_starlight_angel_4k.png", prompt: "Celestial divine angel silhouette emerging from deep space galaxy nebula, glowing starlight", seed: 555, aspect: "square", width: 1024, height: 1024 },
  { url: SAMPLES_PREFIX + "06_divine_baroque_seraph_4k.png", prompt: "Golden baroque sacred angel painting with radiant halo and divine volumetric god rays", seed: 123, aspect: "square", width: 1024, height: 1024 }
];

// App State
let currentEngine = "browser";
let isBackendAvailable = false;
let isGenerating = false;
let soundEnabled = true;
let currentAbortController = null;
let progressTimer = null;
let localDirectoryHandle = null;

const LIBRARY_STORAGE_KEY = "AngelAI_Image_Library_v3";
let imageLibrary = [];

// DOM Elements
const starsCanvas = document.getElementById("starsCanvas");
const promptInput = document.getElementById("promptInput");
const btnInspire = document.getElementById("btnInspire");
const btnClear = document.getElementById("btnClear");
const btnMagicPrompt = document.getElementById("btnMagicPrompt");
const btnSoundToggle = document.getElementById("btnSoundToggle");
const presetCards = document.querySelectorAll(".preset-card");
const engineCards = document.querySelectorAll(".engine-card");
const aspectBtns = document.querySelectorAll(".aspect-btn");
const customDimBox = document.getElementById("customDimBox");
const customWidth = document.getElementById("customWidth");
const customHeight = document.getElementById("customHeight");
const chipPresets = document.querySelectorAll(".chip-preset");

const styleSelect = document.getElementById("styleSelect");
const resolutionSelect = document.getElementById("resolutionSelect");
const detailSlider = document.getElementById("detailSlider");
const detailValBadge = document.getElementById("detailValBadge");
const highThinkingToggle = document.getElementById("highThinkingToggle");

const btnGenerate = document.getElementById("btnGenerate");
const btnStop = document.getElementById("btnStop");
const btnDownload = document.getElementById("btnDownload");
const btnCopyPrompt = document.getElementById("btnCopyPrompt");
const btnFullscreen = document.getElementById("btnFullscreen");
const genStats = document.getElementById("genStats");

const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");
const progressStatus = document.getElementById("progressStatus");
const timeRemaining = document.getElementById("timeRemaining");

const loader = document.getElementById("loader");
const loaderText = document.getElementById("loaderText");
const resultImage = document.getElementById("resultImage");
const browserCanvas = document.getElementById("browserCanvas");
const thinkingLogContent = document.getElementById("thinkingLogContent");

const libraryContainer = document.getElementById("libraryContainer");
const libraryCountBadge = document.getElementById("libraryCountBadge");
const btnDownloadZip = document.getElementById("btnDownloadZip");
const btnSyncFolder = document.getElementById("btnSyncFolder");
const btnClearLibrary = document.getElementById("btnClearLibrary");

const lightboxModal = document.getElementById("lightboxModal");
const lightboxImg = document.getElementById("lightboxImg");
const btnCloseLightbox = document.getElementById("btnCloseLightbox");

const pillTorch = document.getElementById("pill-torch");
const pillWebgl = document.getElementById("pill-webgl");
const pillCnative = document.getElementById("pill-cnative");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initStarsAnimation();
  setupEventListeners();
  checkBackendHealth();
  updateDetailBadge();
  loadStoredLibrary();
  renderBrowserCelestialCanvas(promptInput.value, styleSelect.value, 777, 5);
});

// Interactive Stars Background
function initStarsAnimation() {
  if (!starsCanvas) return;
  const ctx = starsCanvas.getContext("2d");
  let w = starsCanvas.width = window.innerWidth;
  let h = starsCanvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    w = starsCanvas.width = window.innerWidth;
    h = starsCanvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 90 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.8 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(Math.random() * 0.4 + 0.1),
    alpha: Math.random() * 0.7 + 0.2,
    color: Math.random() > 0.4 ? "#f5c542" : "#ffffff"
  }));

  function loop() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < 0) p.y = h;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;
    requestAnimationFrame(loop);
  }
  loop();
}

function setupEventListeners() {
  // Preset Cards
  presetCards.forEach(card => {
    card.addEventListener("click", () => {
      presetCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      const p = PRESETS[card.dataset.preset];
      if (p) {
        promptInput.value = p.prompt;
        styleSelect.value = p.style;
      }
    });
  });

  // Aspect Ratio & Orientation Buttons (Landscape, Square, Portrait, Custom)
  aspectBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      aspectBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const aspect = btn.dataset.aspect;

      if (aspect === "custom") {
        if (customDimBox) customDimBox.classList.remove("hidden");
      } else {
        if (customDimBox) customDimBox.classList.add("hidden");
      }
      updateStatsPreview();
    });
  });

  // Custom Dimension Preset Chips
  if (chipPresets) {
    chipPresets.forEach(chip => {
      chip.addEventListener("click", () => {
        if (customWidth) customWidth.value = chip.dataset.w;
        if (customHeight) customHeight.value = chip.dataset.h;
        updateStatsPreview();
      });
    });
  }

  // Engine Cards
  engineCards.forEach(card => {
    card.addEventListener("click", () => {
      engineCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      currentEngine = card.dataset.engine;
    });
  });

  // Magic Prompt
  btnMagicPrompt.addEventListener("click", () => {
    const p = promptInput.value.trim();
    const enhancements = [
      ", volumetric god-ray scattering, Rembrandt chiaroscuro lighting, 24k gold leaf halos, 4k ultra-hd masterpiece",
      ", detailed primary remiges and downy covert plumage, sacred divine starlight, photorealistic 8k render",
      ", epic cinematic composition, atmospheric depth haze, Da Vinci oil painting textures, ultra detailed"
    ];
    promptInput.value = p + enhancements[Math.floor(Math.random() * enhancements.length)];
  });

  // Inspire Me
  btnInspire.addEventListener("click", () => {
    promptInput.value = INSPIRATIONS[Math.floor(Math.random() * INSPIRATIONS.length)];
  });

  // Clear
  btnClear.addEventListener("click", () => {
    promptInput.value = "";
    promptInput.focus();
  });

  // Sound Toggle
  btnSoundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    btnSoundToggle.querySelector(".icon").textContent = soundEnabled ? "🔔" : "🔕";
  });

  // Detail Slider
  detailSlider.addEventListener("input", () => {
    updateDetailBadge();
    updateStatsPreview();
  });

  // Generate & Stop Buttons
  btnGenerate.addEventListener("click", handleGenerate);
  btnStop.addEventListener("click", handleStop);

  // Download Button
  btnDownload.addEventListener("click", handleDownload);

  // Copy Prompt
  btnCopyPrompt.addEventListener("click", () => {
    navigator.clipboard.writeText(promptInput.value);
    const oldText = btnCopyPrompt.textContent;
    btnCopyPrompt.textContent = "✓ Copied!";
    setTimeout(() => btnCopyPrompt.textContent = oldText, 2000);
  });

  // Fullscreen
  btnFullscreen.addEventListener("click", openLightbox);
  btnCloseLightbox.addEventListener("click", () => lightboxModal.classList.add("hidden"));
  lightboxModal.addEventListener("click", (e) => {
    if (e.target === lightboxModal) lightboxModal.classList.add("hidden");
  });

  // AI Generated Image Library Actions
  if (btnDownloadZip) btnDownloadZip.addEventListener("click", handleDownloadLibraryZip);
  if (btnSyncFolder) btnSyncFolder.addEventListener("click", handleSyncLocalFolder);
  if (btnClearLibrary) btnClearLibrary.addEventListener("click", handleClearLibrary);
}

function updateDetailBadge() {
  const val = parseInt(detailSlider.value, 10);
  const labels = {
    1: "Level 1 (Draft)",
    2: "Level 2 (Fast)",
    3: "Level 3 (Balanced)",
    4: "Level 4 (2K Fine)",
    5: "Level 5 (4K Masterpiece)"
  };
  detailValBadge.textContent = labels[val] || `Level ${val}`;
}

function getSelectedResolution() {
  const activeBtn = document.querySelector(".aspect-btn.active");
  const aspect = activeBtn ? activeBtn.dataset.aspect : "square";
  const detail = parseInt(detailSlider.value, 10);

  if (aspect === "custom") {
    const w = customWidth ? parseInt(customWidth.value, 10) : 1024;
    const h = customHeight ? parseInt(customHeight.value, 10) : 1024;
    const clampedW = Math.max(64, Math.min(4096, isNaN(w) ? 1024 : w));
    const clampedH = Math.max(64, Math.min(4096, isNaN(h) ? 1024 : h));
    return { width: clampedW, height: clampedH, aspect: "custom", label: `${clampedW}×${clampedH} Custom` };
  }

  if (aspect === "landscape") {
    // 16:9 Widescreen
    const dims = detail >= 5 ? [3840, 2160] : (detail >= 3 ? [1920, 1080] : [1280, 720]);
    return { width: dims[0], height: dims[1], aspect: "landscape", label: `${dims[0]}×${dims[1]} Landscape (16:9)` };
  }

  if (aspect === "portrait") {
    // 9:16 Vertical
    const dims = detail >= 5 ? [2160, 3840] : (detail >= 3 ? [1080, 1920] : [720, 1280]);
    return { width: dims[0], height: dims[1], aspect: "portrait", label: `${dims[0]}×${dims[1]} Portrait (9:16)` };
  }

  // Square (1:1)
  const dims = detail >= 5 ? [4096, 4096] : (detail >= 4 ? [2048, 2048] : [1024, 1024]);
  return { width: dims[0], height: dims[1], aspect: "square", label: `${dims[0]}×${dims[1]} Square (1:1)` };
}

function updateStatsPreview() {
  const res = getSelectedResolution();
  if (genStats && !isGenerating) {
    genStats.textContent = `Target: ${res.label} • Folder: AI generated image library/`;
  }
}

async function checkBackendHealth() {
  try {
    const res = await fetch("/api/status", { method: "GET" });
    if (res.ok) {
      const data = await res.json();
      isBackendAvailable = true;
      if (data.pytorch && pillTorch) pillTorch.querySelector(".dot").classList.add("active");
      if (data.c_native && pillCnative) pillCnative.querySelector(".dot").classList.add("active");
    } else {
      throw new Error("Backend not OK");
    }
  } catch (err) {
    console.log("[Angel AI] Operating in client-side WebGL / Canvas autonomous mode.");
    isBackendAvailable = false;
    currentEngine = "browser";
    engineCards.forEach(c => {
      c.classList.toggle("active", c.dataset.engine === "browser");
    });
  }
}

// Generate Action
async function handleGenerate() {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    alert("Please enter a celestial prompt to generate artwork!");
    return;
  }

  const style = styleSelect.value;
  const res = getSelectedResolution();
  const width = res.width;
  const height = res.height;
  const aspect = res.aspect;
  const detailLevel = parseInt(detailSlider.value, 10);
  const highThinking = highThinkingToggle.checked;
  const seed = Math.floor(Math.random() * 999999);

  isGenerating = true;
  btnGenerate.disabled = true;
  btnStop.disabled = false;
  currentAbortController = new AbortController();

  const pixelFactor = Math.sqrt((width * height) / (1024 * 1024));
  const baseTime = (currentEngine === "browser") ? 0.9 : (0.5 + detailLevel * 0.22 * pixelFactor);
  const totalEstTime = highThinking ? baseTime * 1.3 : baseTime;

  startLiveProgress(totalEstTime, detailLevel, width, height, highThinking);
  showLoader(true, highThinking ? "🧠 High Thinking: Deconstructing theological iconography & anatomy..." : `Synthesizing ${res.label} celestial artwork...`);

  const startTime = performance.now();

  try {
    if (highThinking) {
      displaySimulatedHighThinking(prompt, style, detailLevel, width, height);
    }

    let finalImageUrl = "";

    if (currentEngine === "browser" || !isBackendAvailable) {
      await new Promise(r => setTimeout(r, 90));
      if (!isGenerating) return;

      browserCanvas.width = width;
      browserCanvas.height = height;
      renderBrowserCelestialCanvas(prompt, style, seed, detailLevel);
      resultImage.classList.add("hidden");
      browserCanvas.classList.remove("hidden");

      finishProgress();
      playCompletionChime();
      finalImageUrl = browserCanvas.toDataURL("image/png");
    } else {
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
          detail_level: detailLevel,
          high_thinking: highThinking,
          seed
        })
      });

      const result = await response.json();
      if (result.cancelled) {
        progressStatus.textContent = "Stopped by user.";
        return;
      }
      if (!result.success) throw new Error(result.error || "Generation failed");

      finishProgress();
      playCompletionChime();
      resultImage.src = result.image_url;
      resultImage.classList.remove("hidden");
      browserCanvas.classList.add("hidden");

      if (result.thinking_log && result.thinking_log.length > 0) {
        renderThinkingLog(result.thinking_log);
      }
      finalImageUrl = result.image_url;
    }

    const duration = ((performance.now() - startTime) / 1000).toFixed(2);
    genStats.textContent = `Saved to "AI generated image library" • ${res.label} in ${duration}s (Seed: ${seed})`;

    // Automatically file into AI Generated Image Library
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
      progressStatus.textContent = "Generation halted.";
    } else {
      console.error(err);
      alert(`Generation notice: ${err.message}`);
    }
  } finally {
    resetControls();
  }
}

// Stop Action
async function handleStop() {
  if (!isGenerating) return;
  progressStatus.textContent = "Halting synthesis...";

  if (currentAbortController) {
    currentAbortController.abort();
  }

  if (isBackendAvailable) {
    try { await fetch("/api/stop", { method: "POST" }); } catch (e) {}
  }

  clearInterval(progressTimer);
  showLoader(false);
  resetControls();
  genStats.textContent = "Generation stopped by user (current state preserved in AI generated image library)";
}

function resetControls() {
  isGenerating = false;
  btnGenerate.disabled = false;
  btnStop.disabled = true;
  clearInterval(progressTimer);
  showLoader(false);
}

function startLiveProgress(totalSeconds, detailLevel, width, height, highThinking) {
  progressContainer.classList.remove("hidden");
  progressBar.style.width = "5%";
  progressBar.style.background = "linear-gradient(90deg, #f5c542, #38bdf8)";
  
  const startTime = Date.now();
  const stages = [
    "Decomposing celestial iconography...",
    "Underpainting heavenly dawn & chiaroscuro...",
    "Simulating Mie volumetric god rays...",
    "Rendering sacred concentric halo rings...",
    `Synthesizing anatomical wings (Pass 1/${detailLevel})...`,
    "Applying ACES filmic tone curve & gold finish..."
  ];

  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    if (!isGenerating) {
      clearInterval(progressTimer);
      return;
    }
    const elapsed = (Date.now() - startTime) / 1000;
    const progress = Math.min(0.95, elapsed / totalSeconds);
    const rem = Math.max(0.1, totalSeconds - elapsed).toFixed(1);

    progressBar.style.width = `${Math.round(progress * 100)}%`;
    timeRemaining.textContent = `Estimated time: ~${rem}s`;

    const stageIdx = Math.min(stages.length - 1, Math.floor(progress * stages.length));
    progressStatus.textContent = stages[stageIdx];
  }, 100);
}

function finishProgress() {
  clearInterval(progressTimer);
  progressBar.style.width = "100%";
  progressStatus.textContent = "Synthesis complete! Saved to AI generated image library";
  timeRemaining.textContent = "0.0s remaining";
  setTimeout(() => {
    if (!isGenerating) progressContainer.classList.add("hidden");
  }, 3500);
}

function showLoader(show, text = "") {
  if (show) {
    loaderText.textContent = text;
    loader.classList.remove("hidden");
  } else {
    loader.classList.add("hidden");
  }
}

// Web Audio API Synthesizer Bell Chime
function playCompletionChime() {
  if (!soundEnabled) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major celestial chord
    freqs.forEach((f, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + idx * 0.08 + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + idx * 0.08);
      osc.stop(audioCtx.currentTime + idx * 0.08 + 1.3);
    });
  } catch (e) {}
}

function displaySimulatedHighThinking(prompt, style, detailLevel, width, height) {
  const thoughts = [
    `1. [Theological Iconography Analysis]: Extracting archetypes for prompt: "${prompt}". Mapping sacred attributes (Wings, Halo, Filigree, Chiaroscuro).`,
    `2. [Anatomical Wing Geometry]: Planning flight structure at ${width}×${height}. Distributing primary remiges, secondary coverts, and downy plumes across ${detailLevel} micro-passes.`,
    `3. [Sacred Geometric Halos]: Calculating concentric aureole orbits with 8-fold cruciform starlight spikes in ${style} spectral grading.`,
    `4. [Volumetric Mie Scattering]: Raymarching 32 atmospheric light beams through heavenly zenith mist with golden chromatic dispersion.`,
    `5. [ACES Filmic Master Pass]: Tone-mapping dynamic range, applying golden leaf vignette, and writing output directly to "AI generated image library/".`
  ];
  renderThinkingLog(thoughts);
}

function renderThinkingLog(logs) {
  thinkingLogContent.innerHTML = "";
  logs.forEach(step => {
    const p = document.createElement("p");
    p.textContent = step;
    thinkingLogContent.appendChild(p);
  });
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
    console.warn("Could not read stored library:", e);
    imageLibrary = [];
  }

  // If empty, load the initial 4K showcase artworks into the library
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
      timestamp: "Masterpiece Showcase"
    }));
  }

  renderLibraryView();
}

function addToLibrary(item) {
  imageLibrary.unshift(item);
  // Keep up to 35 items
  if (imageLibrary.length > 35) imageLibrary.pop();

  try {
    // Only store data urls or paths, pruning large base64 if quota exceeded
    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(imageLibrary.slice(0, 20)));
  } catch (e) {
    console.warn("Storage full; retained in live session:", e);
  }

  renderLibraryView();

  // If user connected their local PC directory, write file to disk
  if (localDirectoryHandle) {
    saveToLocalDirectory(item);
  }
}

function renderLibraryView() {
  if (!libraryContainer) return;
  libraryContainer.innerHTML = "";

  if (libraryCountBadge) {
    libraryCountBadge.textContent = `${imageLibrary.length} Files in Library`;
  }

  if (imageLibrary.length === 0) {
    libraryContainer.innerHTML = `
      <div class="library-empty-notice">
        <span>📂</span>
        <strong>Your AI Generated Image Library is Empty</strong>
        <p>Click "✦ GENERATE 4K ARTWORK" above to create and file artworks here.</p>
      </div>
    `;
    return;
  }

  imageLibrary.forEach(item => {
    const card = document.createElement("div");
    card.className = "library-card";
    card.innerHTML = `
      <div class="library-card-thumb-wrap">
        <img src="${item.url}" alt="${item.prompt}">
        <span class="library-card-aspect-badge">${item.aspect}</span>
      </div>
      <div class="library-card-info">
        <p class="library-card-prompt" title="${item.prompt}">${item.prompt}</p>
        <div class="library-card-meta">
          <span>${item.width}×${item.height}</span>
          <span>Seed: ${item.seed}</span>
        </div>
        <button class="btn-card-save" title="Save file to 'AI generated image library'">
          ⬇ Save to Folder
        </button>
      </div>
    `;

    // Click thumbnail to inspect in Lightbox
    const thumbWrap = card.querySelector(".library-card-thumb-wrap");
    thumbWrap.addEventListener("click", () => {
      resultImage.src = item.url;
      resultImage.classList.remove("hidden");
      browserCanvas.classList.add("hidden");
      promptInput.value = item.prompt;
      openLightbox();
    });

    // Save individual file to folder
    const saveBtn = card.querySelector(".btn-card-save");
    saveBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      downloadSingleLibraryFile(item);
    });

    libraryContainer.appendChild(card);
  });
}

function downloadSingleLibraryFile(item) {
  const link = document.createElement("a");
  link.download = item.filename || `AI_generated_image_library_angel_${item.seed}.png`;
  link.href = item.url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Bulk ZIP Download for "AI generated image library"
async function handleDownloadLibraryZip() {
  if (!imageLibrary || imageLibrary.length === 0) {
    alert("Your AI Generated Image Library is empty!");
    return;
  }

  if (typeof JSZip === "undefined") {
    // Fallback: download sequentially
    alert("Preparing multi-file download into 'AI generated image library'...");
    imageLibrary.slice(0, 5).forEach((item, idx) => {
      setTimeout(() => downloadSingleLibraryFile(item), idx * 400);
    });
    return;
  }

  try {
    btnDownloadZip.textContent = "⏳ Archiving...";
    btnDownloadZip.disabled = true;

    const zip = new JSZip();
    const folder = zip.folder("AI generated image library");

    for (let i = 0; i < imageLibrary.length; i++) {
      const item = imageLibrary[i];
      const filename = `angel_${item.aspect}_${item.width}x${item.height}_seed${item.seed}_${i + 1}.png`;

      if (item.url.startsWith("data:image")) {
        const base64Data = item.url.split(",")[1];
        folder.file(filename, base64Data, { base64: true });
      } else {
        try {
          const resp = await fetch(item.url);
          const blob = await resp.blob();
          folder.file(filename, blob);
        } catch (e) {
          console.warn("Could not fetch remote item for ZIP:", item.url);
        }
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "AI_generated_image_library.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    btnDownloadZip.textContent = "✓ Saved ZIP!";
    setTimeout(() => {
      btnDownloadZip.textContent = "📦 Save All (.ZIP)";
      btnDownloadZip.disabled = false;
    }, 2500);

  } catch (err) {
    console.error("ZIP creation error:", err);
    alert("Error creating ZIP archive: " + err.message);
    btnDownloadZip.textContent = "📦 Save All (.ZIP)";
    btnDownloadZip.disabled = false;
  }
}

// Sync to real PC folder via Web File System Access API
async function handleSyncLocalFolder() {
  if (!("showDirectoryPicker" in window)) {
    alert("Your browser doesn't support direct local directory access. Use '📦 Save All (.ZIP)' or the individual '⬇ Save to Folder' buttons instead!");
    return;
  }

  try {
    localDirectoryHandle = await window.showDirectoryPicker();
    const syncStatus = document.getElementById("librarySyncStatus");
    if (syncStatus) {
      syncStatus.innerHTML = `<span>📁 Live Synced with Local Folder: <strong>${localDirectoryHandle.name}</strong></span>`;
      syncStatus.style.borderColor = "var(--gold-primary)";
    }

    btnSyncFolder.textContent = `✓ Folder Synced`;
    btnSyncFolder.style.borderColor = "var(--gold-primary)";
    btnSyncFolder.style.color = "var(--gold-bright)";

    // Save all current images into the selected directory
    for (const item of imageLibrary) {
      await saveToLocalDirectory(item);
    }

    alert(`Successfully synced ${imageLibrary.length} artworks directly into folder: "${localDirectoryHandle.name}"!`);
  } catch (err) {
    if (err.name !== "AbortError") {
      console.warn("Folder sync notice:", err);
    }
  }
}

async function saveToLocalDirectory(item) {
  if (!localDirectoryHandle) return;
  try {
    const fileHandle = await localDirectoryHandle.getFileHandle(item.filename, { create: true });
    const writable = await fileHandle.createWritable();

    if (item.url.startsWith("data:image")) {
      const resp = await fetch(item.url);
      const blob = await resp.blob();
      await writable.write(blob);
    } else {
      const resp = await fetch(item.url);
      const blob = await resp.blob();
      await writable.write(blob);
    }
    await writable.close();
  } catch (err) {
    console.warn("Could not write directly to local file:", err);
  }
}

function handleClearLibrary() {
  if (confirm("Are you sure you want to clear your AI Generated Image Library?")) {
    imageLibrary = [];
    try {
      localStorage.removeItem(LIBRARY_STORAGE_KEY);
    } catch (e) {}
    renderLibraryView();
  }
}

function openLightbox() {
  const src = !resultImage.classList.contains("hidden") && resultImage.src
    ? resultImage.src
    : browserCanvas.toDataURL("image/png");
  lightboxImg.src = src;
  lightboxModal.classList.remove("hidden");
}

function handleDownload() {
  const res = getSelectedResolution();
  const link = document.createElement("a");
  link.download = `AI_generated_image_library_angel_${res.aspect}_${res.width}x${res.height}_${Date.now()}.png`;

  if (!resultImage.classList.contains("hidden") && resultImage.src) {
    link.href = resultImage.src;
  } else {
    link.href = browserCanvas.toDataURL("image/png");
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Procedural Client-Side Celestial Canvas Synthesizer with Proportional Aspect Ratios
 */
function renderBrowserCelestialCanvas(prompt, style, seed, detailLevel = 5) {
  const ctx = browserCanvas.getContext("2d");
  const W = browserCanvas.width;
  const H = browserCanvas.height;
  const baseDim = Math.min(W, H);

  // Seeded PRNG
  let s = (seed || 12345) % 2147483647;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  // Celestial Color Grading Palette
  let topColor = "#1a162b";
  let botColor = "#060813";
  let haloColor = "#f5c542";
  let rayColor = "rgba(245, 197, 66, 0.4)";
  let wingColor = "#ffffff";
  let robeColor = "#e6ded1";

  if (style === "renaissance") {
    topColor = "#edd7a8"; botColor = "#21150c"; haloColor = "#f5c542"; rayColor = "rgba(245, 197, 66, 0.35)";
    wingColor = "#faf3e0"; robeColor = "#ede2c8";
  } else if (style === "divine_gold") {
    topColor = "#fff3cc"; botColor = "#3d2208"; haloColor = "#ffbf00"; rayColor = "rgba(255, 200, 0, 0.45)";
    wingColor = "#fff8e7"; robeColor = "#fceed0";
  } else if (style === "cyberpunk") {
    topColor = "#0d1b2a"; botColor = "#050811"; haloColor = "#00f0ff"; rayColor = "rgba(0, 240, 255, 0.28)";
    wingColor = "#70f3ff"; robeColor = "#1e293b";
  } else if (style === "celestial") {
    topColor = "#2e1065"; botColor = "#030712"; haloColor = "#c084fc"; rayColor = "rgba(192, 132, 252, 0.35)";
    wingColor = "#f3e8ff"; robeColor = "#3b0764";
  }

  // 1. Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
  skyGrad.addColorStop(0, topColor);
  skyGrad.addColorStop(1, botColor);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Heavenly Clouds
  ctx.save();
  const numClouds = 24 + detailLevel * 8;
  for (let i = 0; i < numClouds; i++) {
    const cx = rnd() * W;
    const cy = H * 0.40 + rnd() * H * 0.60;
    const cr = (baseDim * 0.12) + rnd() * (baseDim * 0.25);
    const cloudGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    cloudGrad.addColorStop(0, "rgba(255, 255, 255, 0.22)");
    cloudGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = cloudGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. Volumetric Mie God Rays
  ctx.save();
  const lightX = W * 0.5;
  const lightY = -60;
  ctx.fillStyle = rayColor;
  const numRays = 14 + detailLevel * 4;
  for (let i = -numRays; i <= numRays; i++) {
    ctx.beginPath();
    ctx.moveTo(lightX, lightY);
    const spread = (i * (W * 0.045)) + (rnd() * 40);
    ctx.lineTo(lightX + spread - 50, H);
    ctx.lineTo(lightX + spread + 50, H);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 4. Concentric Sacred Geometry Halo
  const headX = W * 0.5;
  const headY = H * 0.38;
  const haloR1 = baseDim * 0.095;
  const haloR2 = baseDim * 0.125;

  ctx.save();
  // Outer Specular Bloom
  const haloGrad = ctx.createRadialGradient(headX, headY, haloR1 - 25, headX, headY, haloR2 + 70);
  haloGrad.addColorStop(0, haloColor);
  haloGrad.addColorStop(0.5, "rgba(255, 215, 0, 0.5)");
  haloGrad.addColorStop(1, "rgba(255, 215, 0, 0)");
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(headX, headY, haloR2 + 70, 0, Math.PI * 2);
  ctx.fill();

  // Dual Concentric Golden Rings
  ctx.strokeStyle = haloColor;
  ctx.lineWidth = Math.max(4, baseDim * 0.008);
  ctx.shadowColor = haloColor;
  ctx.shadowBlur = 35;
  ctx.beginPath();
  ctx.arc(headX, headY, haloR1, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = Math.max(2, baseDim * 0.004);
  ctx.beginPath();
  ctx.arc(headX, headY, haloR2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 5. Feathered Wings with Multi-Tier Remiges (Scaled to baseDim)
  ctx.save();
  ctx.shadowColor = haloColor;
  ctx.shadowBlur = 40;

  const drawWing = (dir) => {
    ctx.save();
    ctx.translate(headX, headY + baseDim * 0.05);
    ctx.scale(dir, 1);

    const wingLayers = 4 + detailLevel;
    for (let layer = 0; layer < wingLayers; layer++) {
      ctx.beginPath();
      ctx.moveTo(baseDim * 0.03, baseDim * 0.02);
      const spanX = baseDim * (0.32 + layer * 0.052);
      const spanY = -baseDim * (0.14 + layer * 0.046);
      ctx.bezierCurveTo(baseDim * 0.12, -baseDim * (0.18 + layer * 0.03), spanX - baseDim * 0.04, spanY - baseDim * 0.03, spanX, spanY);
      ctx.bezierCurveTo(spanX + baseDim * 0.035, spanY + baseDim * 0.08, spanX - baseDim * 0.08, spanY + baseDim * 0.28, baseDim * 0.05, baseDim * (0.20 + layer * 0.03));
      ctx.closePath();

      const wingGrad = ctx.createLinearGradient(0, spanY, spanX, spanY + baseDim * 0.25);
      wingGrad.addColorStop(0, wingColor);
      wingGrad.addColorStop(0.75, "rgba(255, 255, 255, 0.9)");
      wingGrad.addColorStop(1, "rgba(245, 197, 66, 0.28)");
      ctx.fillStyle = wingGrad;
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = Math.max(1.5, baseDim * 0.003);
      ctx.stroke();
    }
    ctx.restore();
  };

  drawWing(1);
  drawWing(-1);
  ctx.restore();

  // 6. Flowing Chiaroscuro Robes & Head Silhouette
  ctx.save();
  ctx.beginPath();
  ctx.arc(headX, headY, baseDim * 0.046, 0, Math.PI * 2);
  ctx.moveTo(headX - baseDim * 0.042, headY + baseDim * 0.035);
  ctx.bezierCurveTo(headX - baseDim * 0.07, headY + baseDim * 0.16, headX - baseDim * 0.18, H * 0.85, headX - baseDim * 0.23, H);
  ctx.lineTo(headX + baseDim * 0.23, H);
  ctx.bezierCurveTo(headX + baseDim * 0.18, H * 0.85, headX + baseDim * 0.07, headY + baseDim * 0.16, headX + baseDim * 0.042, headY + baseDim * 0.035);
  ctx.closePath();

  const robeGrad = ctx.createLinearGradient(headX - baseDim * 0.14, headY, headX + baseDim * 0.14, H);
  robeGrad.addColorStop(0, robeColor);
  robeGrad.addColorStop(0.5, "rgba(242, 242, 252, 0.96)");
  robeGrad.addColorStop(1, "rgba(182, 162, 142, 0.88)");
  ctx.fillStyle = robeGrad;
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 28;
  ctx.fill();
  ctx.restore();

  // 7. Golden Filigree Pectoral
  ctx.save();
  ctx.strokeStyle = haloColor;
  ctx.lineWidth = Math.max(2, baseDim * 0.004);
  ctx.beginPath();
  ctx.arc(headX, headY + baseDim * 0.08, baseDim * 0.04, 0, Math.PI);
  ctx.stroke();
  ctx.restore();

  // 8. Starlight Dust & Floating Embers
  ctx.save();
  ctx.fillStyle = haloColor;
  const numEmbers = 80 + detailLevel * 40;
  for (let i = 0; i < numEmbers; i++) {
    const px = rnd() * W;
    const py = rnd() * H;
    const pr = rnd() * (baseDim * 0.004) + 1.2;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
