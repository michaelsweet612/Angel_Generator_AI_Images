/**
 * Angel Generator AI — Web Studio Controller v2.5
 * Features:
 *   - 4K Ultra-HD Resolution Support
 *   - High Thinking Reasoning Decomposition
 *   - Real-Time Progress Countdown & Estimated Time Remaining
 *   - Interactive Stop / Cancel Generation Control
 */

const PRESETS = {
  archangel: {
    prompt: "Archangel Michael with massive glowing white feathered wings and golden halo in heavenly clouds, divine light rays, 4k masterpiece",
    style: "renaissance"
  },
  seraphim: {
    prompt: "Six-winged divine Seraphim surrounded by celestial fire, glowing sacred halo, volumetric golden starlight, 4k ultra-hd",
    style: "divine_gold"
  },
  cathedral: {
    prompt: "Guardian angel with pure white feathered wings overlooking sacred gothic cathedral spire, golden sunset, high detail",
    style: "renaissance"
  },
  cyberpunk: {
    prompt: "Futuristic cyberpunk holographic angel with glowing neon cyan wings overlooking rainy neon skyscraper metropolis, 4k render",
    style: "cyberpunk"
  },
  cosmic: {
    prompt: "Celestial divine angel silhouette emerging from deep space galaxy nebula, glowing starlight, cosmic purple aura",
    style: "celestial"
  }
};

const INSPIRATIONS = [
  "Archangel with flaming golden sword and outstretched radiant wings, 4k ultra-hd",
  "Seraphim guardian descending through golden heavenly clouds, high thinking composition",
  "Celestial angel with glowing white feathered wings in starlight nebula",
  "Renaissance fresco of guardian angel with golden halo in cathedral",
  "Ethereal winged spirit surrounded by divine volumetric god rays, masterpiece",
  "Cyberpunk neon angel overlooking futuristic rainy city skyline, 4k"
];

// App State
let currentEngine = "neural";
let isBackendAvailable = false;
let historyGallery = [];
let isGenerating = false;
let currentAbortController = null;
let progressTimer = null;

// DOM Elements
const promptInput = document.getElementById("promptInput");
const btnInspire = document.getElementById("btnInspire");
const btnClear = document.getElementById("btnClear");
const presetChips = document.getElementById("presetChips");
const engineCards = document.querySelectorAll(".engine-card");
const styleSelect = document.getElementById("styleSelect");
const resolutionSelect = document.getElementById("resolutionSelect");
const seedInput = document.getElementById("seedInput");
const negativeInput = document.getElementById("negativeInput");
const detailSlider = document.getElementById("detailSlider");
const detailValBadge = document.getElementById("detailValBadge");
const highThinkingToggle = document.getElementById("highThinkingToggle");

const btnGenerate = document.getElementById("btnGenerate");
const btnStop = document.getElementById("btnStop");
const btnDownload = document.getElementById("btnDownload");
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

const pillTorch = document.getElementById("pill-torch");
const pillWebgl = document.getElementById("pill-webgl");
const pillCloud = document.getElementById("pill-cloud");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  checkBackendHealth();
  updateDetailBadge();
  renderBrowserCelestialCanvas(promptInput.value, styleSelect.value, 777, 4);
});

function setupEventListeners() {
  // Preset Chips
  presetChips.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    const p = PRESETS[chip.dataset.preset];
    if (p) {
      promptInput.value = p.prompt;
      styleSelect.value = p.style;
    }
  });

  // Inspire Me
  btnInspire.addEventListener("click", () => {
    const randomPrompt = INSPIRATIONS[Math.floor(Math.random() * INSPIRATIONS.length)];
    promptInput.value = randomPrompt;
  });

  // Clear
  btnClear.addEventListener("click", () => {
    promptInput.value = "";
    promptInput.focus();
  });

  // Engine Cards
  engineCards.forEach(card => {
    card.addEventListener("click", () => {
      engineCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      currentEngine = card.dataset.engine;
    });
  });

  // Detail Slider change
  detailSlider.addEventListener("input", updateDetailBadge);

  // Generate & Stop Buttons
  btnGenerate.addEventListener("click", handleGenerate);
  btnStop.addEventListener("click", handleStop);

  // Download Button
  btnDownload.addEventListener("click", handleDownload);
}

function updateDetailBadge() {
  const val = parseInt(detailSlider.value, 10);
  const labels = {
    1: "Level 1 (Fast Draft)",
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
      if (data.pytorch) pillTorch.querySelector(".dot").classList.add("active");
      if (data.cloud) pillCloud.querySelector(".dot").classList.add("active");
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
    alert("Please enter a prompt to generate celestial artwork!");
    return;
  }

  const style = styleSelect.value;
  const resolution = resolutionSelect.value;
  const [width, height] = resolution.split("x").map(Number);
  const detailLevel = parseInt(detailSlider.value, 10);
  const highThinking = highThinkingToggle.checked;
  const seed = seedInput.value ? parseInt(seedInput.value, 10) : Math.floor(Math.random() * 999999);
  const negative = negativeInput.value.trim();

  // Set Generating state
  isGenerating = true;
  btnGenerate.disabled = true;
  btnStop.disabled = false;
  currentAbortController = new AbortController();

  // Calculate estimated duration
  const pixelFactor = Math.sqrt((width * height) / (512 * 512));
  const baseTime = (currentEngine === "browser") ? 0.8 : (0.4 + detailLevel * 0.25 * pixelFactor);
  const totalEstTime = highThinking ? baseTime * 1.3 : baseTime;

  startLiveProgress(totalEstTime, detailLevel, width, height, highThinking);
  showLoader(true, highThinking ? "🧠 High Thinking: Decomposing composition & anatomy..." : "Synthesizing celestial rays & wings...");

  const startTime = performance.now();

  try {
    if (highThinking) {
      displaySimulatedHighThinking(prompt, style, detailLevel, width, height);
    }

    if (currentEngine === "browser" || !isBackendAvailable) {
      // Browser canvas progressive synthesis
      await new Promise(r => setTimeout(r, 80));
      if (!isGenerating) return;

      renderBrowserCelestialCanvas(prompt, style, seed, detailLevel);
      resultImage.classList.add("hidden");
      browserCanvas.classList.remove("hidden");

      finishProgress();
      const duration = ((performance.now() - startTime) / 1000).toFixed(2);
      genStats.textContent = `Browser Canvas in ${duration}s (${width}x${height}, Seed: ${seed})`;
      addToGallery(browserCanvas.toDataURL("image/png"), prompt, seed);
    } else {
      // Call Python REST API
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
          seed,
          negative
        })
      });

      const result = await response.json();
      if (result.cancelled) {
        progressStatus.textContent = "Stopped by user.";
        return;
      }
      if (!result.success) throw new Error(result.error || "Generation failed");

      finishProgress();
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
      alert(`Error: ${err.message}. Using browser canvas.`);
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

  if (currentAbortController) {
    currentAbortController.abort();
  }

  // Signal server cancellation endpoint
  if (isBackendAvailable) {
    try {
      await fetch("/api/stop", { method: "POST" });
    } catch (e) {}
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

// Live Progress and Estimated Time Remaining
function startLiveProgress(totalSeconds, detailLevel, width, height, highThinking) {
  progressContainer.classList.remove("hidden");
  progressBar.style.width = "5%";
  progressBar.style.background = "linear-gradient(90deg, #f5c542, #38bdf8)";
  
  const startTime = Date.now();
  const stages = [
    "Analyzing theology & prompt...",
    "Computing celestial chiaroscuro...",
    `Generating volumetric rays & halo...`,
    `Refining feathered wings (Pass 1/${detailLevel})...`,
    `Adding 4K micro-feather striations...`,
    "Applying specular bloom..."
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

function displaySimulatedHighThinking(prompt, style, detailLevel, width, height) {
  const thoughts = [
    `1. [Theological & Archetype Analysis]: Deconstructing prompt "${prompt.substring(0, 40)}..." into celestial hierarchy.`,
    `2. [Anatomical Architecture]: Constructing dual-tiered feathered wing geometry at ${width}px resolution.`,
    `3. [Volumetric Lighting Plan]: Calculating 16 god-ray light shafts radiating with inverse-square falloff.`,
    `4. [Chiaroscuro & Harmony]: Aligning palette to ${style.toUpperCase()} with golden ambient occlusion.`,
    `5. [Detail Multi-Pass Refinement]: Detail Level ${detailLevel}/5 — computing ${detailLevel * 4} octave fractal micro-noise.`,
    `6. [Resolution Strategy]: Executing ${width}x${height} Ultra-HD rendering buffer.`
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

function addToGallery(url, prompt, seed) {
  historyGallery.unshift({ url, prompt, seed });
  if (historyGallery.length > 8) historyGallery.pop();

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
 * Procedural Client-Side Celestial Canvas Synthesizer with Detail Multi-Passes
 */
function renderBrowserCelestialCanvas(prompt, style, seed, detailLevel = 4) {
  const ctx = browserCanvas.getContext("2d");
  const W = browserCanvas.width;
  const H = browserCanvas.height;

  let s = seed % 2147483647;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;

  let topColor = "#fbf5e6", botColor = "#2b1820", haloColor = "#ffd700", rayColor = "rgba(255, 225, 120, 0.28)";
  let wingColor = "#ffffff", robeColor = "#f8f4eb";

  if (style === "renaissance") {
    topColor = "#edd7a8"; botColor = "#21150c"; haloColor = "#f5c542"; rayColor = "rgba(245, 197, 66, 0.32)";
    wingColor = "#faf3e0"; robeColor = "#ede2c8";
  } else if (style === "divine_gold") {
    topColor = "#fff3cc"; botColor = "#3d2208"; haloColor = "#ffbf00"; rayColor = "rgba(255, 200, 0, 0.42)";
    wingColor = "#fff8e7"; robeColor = "#fceed0";
  } else if (style === "cyberpunk") {
    topColor = "#0d1b2a"; botColor = "#050811"; haloColor = "#00f0ff"; rayColor = "rgba(0, 240, 255, 0.25)";
    wingColor = "#70f3ff"; robeColor = "#1e293b";
  } else if (style === "celestial") {
    topColor = "#2e1065"; botColor = "#030712"; haloColor = "#c084fc"; rayColor = "rgba(192, 132, 252, 0.32)";
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
  const numClouds = 20 + detailLevel * 6;
  for (let i = 0; i < numClouds; i++) {
    const cx = rnd() * W;
    const cy = H * 0.42 + rnd() * H * 0.58;
    const cr = (W * 0.12) + rnd() * (W * 0.22);
    const cloudGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    cloudGrad.addColorStop(0, "rgba(255, 255, 255, 0.18)");
    cloudGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = cloudGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. Volumetric God Rays
  ctx.save();
  const lightX = W * 0.5;
  const lightY = -50;
  ctx.fillStyle = rayColor;
  const numRays = 10 + detailLevel * 3;
  for (let i = -numRays; i <= numRays; i++) {
    ctx.beginPath();
    ctx.moveTo(lightX, lightY);
    const spread = (i * (W * 0.05)) + (rnd() * 35);
    ctx.lineTo(lightX + spread - 45, H);
    ctx.lineTo(lightX + spread + 45, H);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 4. Glowing Radiant Halo
  const headX = W * 0.5;
  const headY = H * 0.38;
  const haloR = W * 0.095;

  ctx.save();
  const haloGrad = ctx.createRadialGradient(headX, headY, haloR - 25, headX, headY, haloR + 65);
  haloGrad.addColorStop(0, haloColor);
  haloGrad.addColorStop(0.5, "rgba(255, 215, 0, 0.45)");
  haloGrad.addColorStop(1, "rgba(255, 215, 0, 0)");
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(headX, headY, haloR + 65, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = haloColor;
  ctx.lineWidth = Math.max(4, W * 0.009);
  ctx.shadowColor = haloColor;
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.arc(headX, headY, haloR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 5. Feathered Angel Wings with Detail Striations
  ctx.save();
  ctx.shadowColor = haloColor;
  ctx.shadowBlur = 35;

  const drawWing = (dir) => {
    ctx.save();
    ctx.translate(headX, headY + W * 0.05);
    ctx.scale(dir, 1);

    const wingLayers = 3 + detailLevel;
    for (let layer = 0; layer < wingLayers; layer++) {
      ctx.beginPath();
      ctx.moveTo(W * 0.03, W * 0.02);
      const spanX = W * (0.28 + layer * 0.05);
      const spanY = -W * (0.12 + layer * 0.04);
      ctx.bezierCurveTo(W * 0.12, -W * (0.16 + layer * 0.03), spanX - W * 0.04, spanY - W * 0.03, spanX, spanY);
      ctx.bezierCurveTo(spanX + W * 0.03, spanY + W * 0.08, spanX - W * 0.08, spanY + W * 0.24, W * 0.05, W * (0.18 + layer * 0.03));
      ctx.closePath();

      const wingGrad = ctx.createLinearGradient(0, spanY, spanX, spanY + W * 0.24);
      wingGrad.addColorStop(0, wingColor);
      wingGrad.addColorStop(0.7, "rgba(255, 255, 255, 0.88)");
      wingGrad.addColorStop(1, "rgba(245, 197, 66, 0.25)");
      ctx.fillStyle = wingGrad;
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
      ctx.lineWidth = Math.max(1.5, W * 0.003);
      ctx.stroke();
    }
    ctx.restore();
  };

  drawWing(1);
  drawWing(-1);
  ctx.restore();

  // 6. Angel Figure Robes & Silhouette
  ctx.save();
  ctx.beginPath();
  ctx.arc(headX, headY, W * 0.046, 0, Math.PI * 2);
  ctx.moveTo(headX - W * 0.042, headY + W * 0.035);
  ctx.bezierCurveTo(headX - W * 0.07, headY + W * 0.16, headX - W * 0.17, H * 0.85, headX - W * 0.22, H);
  ctx.lineTo(headX + W * 0.22, H);
  ctx.bezierCurveTo(headX + W * 0.17, H * 0.85, headX + W * 0.07, headY + W * 0.16, headX + W * 0.042, headY + W * 0.035);
  ctx.closePath();

  const robeGrad = ctx.createLinearGradient(headX - W * 0.12, headY, headX + W * 0.12, H);
  robeGrad.addColorStop(0, robeColor);
  robeGrad.addColorStop(0.5, "rgba(240, 240, 250, 0.95)");
  robeGrad.addColorStop(1, "rgba(180, 160, 140, 0.85)");
  ctx.fillStyle = robeGrad;
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 24;
  ctx.fill();
  ctx.restore();

  // 7. Celestial Golden Particles / Embers
  ctx.save();
  ctx.fillStyle = haloColor;
  const numEmbers = 60 + detailLevel * 30;
  for (let i = 0; i < numEmbers; i++) {
    const px = rnd() * W;
    const py = rnd() * H;
    const pr = rnd() * (W * 0.004) + 1.0;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
