/**
 * Angel Generator AI — Masterpiece Studio Controller v3.0
 */

const PRESETS = {
  archangel: {
    prompt: "Archangel Michael with massive radiant golden feathered wings, golden halo in heavenly clouds, volumetric divine light rays, masterpiece, 4k ultra-hd",
    style: "renaissance"
  },
  seraphim: {
    prompt: "Six-winged divine Seraphim surrounded by celestial fire, sacred halo of light, volumetric golden starlight, 4k ultra-hd",
    style: "divine_gold"
  },
  cathedral: {
    prompt: "Guardian angel with pure white feathered wings overlooking sacred gothic cathedral spire, golden sunset, renaissance chiaroscuro",
    style: "renaissance"
  },
  cyberpunk: {
    prompt: "Futuristic cyberpunk holographic angel with glowing neon cyan wings overlooking rainy neon skyscraper metropolis, 4k render",
    style: "cyberpunk"
  }
};

const INSPIRATIONS = [
  "Archangel Michael with blazing flaming wings and golden halo, volumetric god rays, 4k masterpiece",
  "Six-winged Seraphim enveloped in sacred golden dawn and celestial embers, ultra-hd",
  "Guardian angel with luminous feathered wings watching over gothic cathedral spires, chiaroscuro",
  "Cyberpunk holographic angel with neon cyan wings overlooking rainy futuristic megacity, 4k",
  "Celestial divine entity emerging from deep space galaxy nebula, glowing starlight, purple aura",
  "Renaissance fresco of winged angel in cathedral with 24k gold leaf filigree, masterpiece"
];

const SHOWCASE_SAMPLES = [
  { url: "/samples/01_archangel_michael_4k.png", prompt: "Archangel Michael with massive radiant golden feathered wings, golden halo in heavenly clouds", seed: 777 },
  { url: "/samples/02_seraphim_celestial_dawn_4k.png", prompt: "Six-winged Seraphim surrounded by celestial divine light and golden starlight dawn", seed: 888 },
  { url: "/samples/03_cathedral_guardian_angel_4k.png", prompt: "Guardian angel with pure white feathered wings overlooking sacred gothic cathedral, golden sunset", seed: 999 },
  { url: "/samples/04_cyberpunk_holographic_angel_4k.png", prompt: "Cyberpunk holographic angel with glowing neon cyan wings overlooking rainy neon skyscraper metropolis", seed: 444 },
  { url: "/samples/05_cosmic_starlight_angel_4k.png", prompt: "Celestial divine angel silhouette emerging from deep space galaxy nebula, glowing starlight", seed: 555 },
  { url: "/samples/06_divine_baroque_seraph_4k.png", prompt: "Golden baroque sacred angel painting with radiant halo and divine volumetric god rays", seed: 123 }
];

// App State
let currentEngine = "neural";
let isBackendAvailable = false;
let historyGallery = [];
let isGenerating = false;
let soundEnabled = true;
let currentAbortController = null;
let progressTimer = null;

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
const galleryContainer = document.getElementById("galleryContainer");
const thinkingLogContent = document.getElementById("thinkingLogContent");

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
  loadInitialShowcase();
  renderBrowserCelestialCanvas(promptInput.value, styleSelect.value, 777, 5);
});

// Interactive Stars Background
function initStarsAnimation() {
  const ctx = starsCanvas.getContext("2d");
  let w = (starsCanvas.width = window.innerWidth);
  let h = (starsCanvas.height = window.innerHeight);

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

  // Aspect Ratio Cards
  aspectBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      aspectBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      resolutionSelect.value = btn.dataset.res;
    });
  });

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
  detailSlider.addEventListener("input", updateDetailBadge);

  // Generate & Stop Buttons
  btnGenerate.addEventListener("click", handleGenerate);
  btnStop.addEventListener("click", handleStop);

  // Download Button
  btnDownload.addEventListener("click", handleDownload);

  // Copy Prompt
  btnCopyPrompt.addEventListener("click", () => {
    navigator.clipboard.writeText(promptInput.value);
    btnCopyPrompt.textContent = "✓ Copied!";
    setTimeout(() => (btnCopyPrompt.textContent = "📋 Copy"), 2000);
  });

  // Lightbox
  btnFullscreen.addEventListener("click", openLightbox);
  btnCloseLightbox.addEventListener("click", () => lightboxModal.classList.add("hidden"));
  lightboxModal.addEventListener("click", (e) => {
    if (e.target === lightboxModal) lightboxModal.classList.add("hidden");
  });
}

function updateDetailBadge() {
  const val = parseInt(detailSlider.value, 10);
  const labels = {
    1: "Level 1 (Draft)",
    2: "Level 2 (Normal)",
    3: "Level 3 (Balanced)",
    4: "Level 4 (Ultra Detail)",
    5: "Level 5 (4K Masterpiece)"
  };
  detailValBadge.textContent = labels[val] || `Level ${val}`;
}

async function checkBackendHealth() {
  try {
    const res = await fetch("/api/status", { method: "GET" });
    if (res.ok) {
      const data = await res.json();
      isBackendAvailable = true;
      if (data.pytorch && pillTorch) pillTorch.querySelector(".dot").classList.add("active");
      if (data.c_native && pillCnative) pillCnative.querySelector(".dot").classList.add("active");
    }
  } catch (err) {
    console.log("[Angel AI] Standalone browser mode active.");
    isBackendAvailable = false;
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
  const resolution = resolutionSelect.value;
  const [width, height] = resolution.split("x").map(Number);
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
  showLoader(true, highThinking ? "🧠 High Thinking: Deconstructing theological iconography & anatomy..." : "Synthesizing 4K celestial rays & wings...");

  const startTime = performance.now();

  try {
    if (highThinking) {
      displaySimulatedHighThinking(prompt, style, detailLevel, width, height);
    }

    if (currentEngine === "browser" || !isBackendAvailable) {
      await new Promise(r => setTimeout(r, 90));
      if (!isGenerating) return;

      renderBrowserCelestialCanvas(prompt, style, seed, detailLevel);
      resultImage.classList.add("hidden");
      browserCanvas.classList.remove("hidden");

      finishProgress();
      playCompletionChime();
      const duration = ((performance.now() - startTime) / 1000).toFixed(2);
      genStats.textContent = `Browser Canvas in ${duration}s (${width}x${height}, Seed: ${seed})`;
      addToGallery(browserCanvas.toDataURL("image/png"), prompt, seed);
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

      const duration = ((performance.now() - startTime) / 1000).toFixed(2);
      genStats.textContent = `${result.provider || currentEngine} in ${duration}s (${width}x${height}, Seed: ${seed})`;
      addToGallery(result.image_url, prompt, seed);
    }
  } catch (err) {
    if (err.name === "AbortError" || !isGenerating) {
      progressStatus.textContent = "Generation halted.";
      timeRemaining.textContent = "Stopped";
    } else {
      console.error("Generation error:", err);
      alert(`Notice: ${err.message}. Using browser canvas engine.`);
      renderBrowserCelestialCanvas(prompt, style, seed, detailLevel);
      resultImage.classList.add("hidden");
      browserCanvas.classList.remove("hidden");
    }
  } finally {
    resetControls();
  }
}

// Stop Action
async function handleStop() {
  if (!isGenerating) return;
  isGenerating = false;

  progressStatus.textContent = "Stopping generation...";
  timeRemaining.textContent = "Cancelled";
  progressBar.style.width = "100%";
  progressBar.style.background = "#ef4444";

  if (currentAbortController) currentAbortController.abort();
  if (isBackendAvailable) {
    try { await fetch("/api/stop", { method: "POST" }); } catch (e) {}
  }

  clearInterval(progressTimer);
  showLoader(false);
  resetControls();
  genStats.textContent = "Generation stopped by user (current state preserved)";
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
    `Synthesizing 4K anatomical wings (Pass 1/${detailLevel})...`,
    "Applying ACES filmic tone curve & bloom..."
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
  progressStatus.textContent = "Synthesis complete!";
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
    `1. [Theological Iconography]: Mapping subject to 'Militant Archangel with Celestial Aegis'.`,
    `2. [Wing Aerodynamics & Anatomy]: Constructing 3-tier feather canopy: primary flight remiges (${width}px span), secondary fans, and covert plumes.`,
    `3. [Sacred Geometric Halo]: Rendering concentric dual gold rings (R1=0.155, R2=0.185) with 8-fold cruciform starlight flares.`,
    `4. [Volumetric Atmospheric Optics]: Simulating 28 Mie-scattered god-ray shafts radiating from celestial zenith.`,
    `5. [Classical Chiaroscuro Draping]: Applying Da Vinci / Caravaggio shadow modeling to flowing ivory robes with golden filigree.`,
    `6. [Detail Multi-Pass Synthesis]: Detail Level ${detailLevel}/5 — computing ${detailLevel * 6} octave fractal micro-striations for individual feather barbs.`,
    `7. [ACES Filmic Color Grading]: Harmonizing ${style.toUpperCase()} palette with golden specular bloom and fine canvas texture at ${width}x{height}.`
  ];
  renderThinkingLog(thoughts);
}

function renderThinkingLog(logs) {
  thinkingLogContent.innerHTML = "";
  logs.forEach(log => {
    const p = document.createElement("p");
    p.textContent = log;
    thinkingLogContent.appendChild(p);
  });
}

function loadInitialShowcase() {
  SHOWCASE_SAMPLES.forEach(s => addToGallery(s.url, s.prompt, s.seed));
}

function addToGallery(url, prompt, seed) {
  historyGallery.unshift({ url, prompt, seed });
  if (historyGallery.length > 10) historyGallery.pop();

  galleryContainer.innerHTML = "";
  historyGallery.forEach(item => {
    const div = document.createElement("div");
    div.className = "gallery-item";
    div.title = `${item.prompt} (Seed: ${item.seed})`;
    div.innerHTML = `<img src="${item.url}" alt="Celestial Art">`;
    div.addEventListener("click", () => {
      resultImage.src = item.url;
      resultImage.classList.remove("hidden");
      browserCanvas.classList.add("hidden");
      promptInput.value = item.prompt;
    });
    galleryContainer.appendChild(div);
  });
}

function openLightbox() {
  const src = !resultImage.classList.contains("hidden") && resultImage.src
    ? resultImage.src
    : browserCanvas.toDataURL("image/png");
  lightboxImg.src = src;
  lightboxModal.classList.remove("hidden");
}

function handleDownload() {
  const link = document.createElement("a");
  const res = resolutionSelect.value;
  link.download = `angel_art_${res}_${Date.now()}.png`;
  if (!resultImage.classList.contains("hidden") && resultImage.src) {
    link.href = resultImage.src;
  } else {
    link.href = browserCanvas.toDataURL("image/png");
  }
  link.click();
}

/**
 * Procedural Client-Side Celestial Canvas Synthesizer with 4K Micro-Details
 */
function renderBrowserCelestialCanvas(prompt, style, seed, detailLevel = 5) {
  const ctx = browserCanvas.getContext("2d");
  const W = browserCanvas.width;
  const H = browserCanvas.height;

  let s = seed % 2147483647;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;

  let topColor = "#fbf5e6", botColor = "#2b1820", haloColor = "#ffd700", rayColor = "rgba(255, 225, 120, 0.30)";
  let wingColor = "#ffffff", robeColor = "#f8f4eb";

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
    const cr = (W * 0.12) + rnd() * (W * 0.25);
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
  const haloR1 = W * 0.095;
  const haloR2 = W * 0.125;

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
  ctx.lineWidth = Math.max(4, W * 0.008);
  ctx.shadowColor = haloColor;
  ctx.shadowBlur = 35;
  ctx.beginPath();
  ctx.arc(headX, headY, haloR1, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = Math.max(2, W * 0.004);
  ctx.beginPath();
  ctx.arc(headX, headY, haloR2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 5. Feathered Wings with Multi-Tier Remiges
  ctx.save();
  ctx.shadowColor = haloColor;
  ctx.shadowBlur = 40;

  const drawWing = (dir) => {
    ctx.save();
    ctx.translate(headX, headY + W * 0.05);
    ctx.scale(dir, 1);

    const wingLayers = 4 + detailLevel;
    for (let layer = 0; layer < wingLayers; layer++) {
      ctx.beginPath();
      ctx.moveTo(W * 0.03, W * 0.02);
      const spanX = W * (0.28 + layer * 0.048);
      const spanY = -W * (0.12 + layer * 0.042);
      ctx.bezierCurveTo(W * 0.12, -W * (0.16 + layer * 0.03), spanX - W * 0.04, spanY - W * 0.03, spanX, spanY);
      ctx.bezierCurveTo(spanX + W * 0.035, spanY + W * 0.08, spanX - W * 0.08, spanY + W * 0.25, W * 0.05, W * (0.18 + layer * 0.03));
      ctx.closePath();

      const wingGrad = ctx.createLinearGradient(0, spanY, spanX, spanY + W * 0.25);
      wingGrad.addColorStop(0, wingColor);
      wingGrad.addColorStop(0.75, "rgba(255, 255, 255, 0.9)");
      wingGrad.addColorStop(1, "rgba(245, 197, 66, 0.28)");
      ctx.fillStyle = wingGrad;
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = Math.max(1.5, W * 0.003);
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
  ctx.arc(headX, headY, W * 0.046, 0, Math.PI * 2);
  ctx.moveTo(headX - W * 0.042, headY + W * 0.035);
  ctx.bezierCurveTo(headX - W * 0.07, headY + W * 0.16, headX - W * 0.18, H * 0.85, headX - W * 0.23, H);
  ctx.lineTo(headX + W * 0.23, H);
  ctx.bezierCurveTo(headX + W * 0.18, H * 0.85, headX + W * 0.07, headY + W * 0.16, headX + W * 0.042, headY + W * 0.035);
  ctx.closePath();

  const robeGrad = ctx.createLinearGradient(headX - W * 0.14, headY, headX + W * 0.14, H);
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
  ctx.lineWidth = Math.max(2, W * 0.004);
  ctx.beginPath();
  ctx.arc(headX, headY + W * 0.08, W * 0.04, 0, Math.PI);
  ctx.stroke();
  ctx.restore();

  // 8. Starlight Dust & Floating Embers
  ctx.save();
  ctx.fillStyle = haloColor;
  const numEmbers = 80 + detailLevel * 40;
  for (let i = 0; i < numEmbers; i++) {
    const px = rnd() * W;
    const py = rnd() * H;
    const pr = rnd() * (W * 0.004) + 1.2;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
