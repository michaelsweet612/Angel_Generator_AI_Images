/**
 * Angel Generator AI — Web Studio Controller & Client-Side Synthesizer
 */

// Presets database
const PRESETS = {
  archangel: {
    prompt: "Archangel Michael with massive glowing white feathered wings and golden halo in heavenly clouds, divine light rays",
    style: "renaissance"
  },
  seraphim: {
    prompt: "Six-winged divine Seraphim surrounded by celestial fire, glowing sacred halo, volumetric golden starlight",
    style: "divine_gold"
  },
  cathedral: {
    prompt: "Guardian angel with pure white feathered wings overlooking sacred gothic cathedral spire, golden sunset",
    style: "renaissance"
  },
  cyberpunk: {
    prompt: "Futuristic cyberpunk holographic angel with glowing neon cyan wings overlooking rainy neon skyscraper metropolis",
    style: "cyberpunk"
  },
  cosmic: {
    prompt: "Celestial divine angel silhouette emerging from deep space galaxy nebula, glowing starlight, cosmic purple aura",
    style: "celestial"
  }
};

const INSPIRATIONS = [
  "Archangel with flaming golden sword and outstretched radiant wings",
  "Seraphim guardian descending through golden heavenly clouds",
  "Celestial angel with glowing white feathered wings in starlight nebula",
  "Renaissance fresco of guardian angel with golden halo in cathedral",
  "Ethereal winged spirit surrounded by divine volumetric god rays",
  "Cyberpunk neon angel overlooking futuristic rainy city skyline"
];

// App State
let currentEngine = "neural";
let isBackendAvailable = false;
let historyGallery = [];

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
const btnGenerate = document.getElementById("btnGenerate");
const btnDownload = document.getElementById("btnDownload");
const genStats = document.getElementById("genStats");
const loader = document.getElementById("loader");
const loaderText = document.getElementById("loaderText");
const resultImage = document.getElementById("resultImage");
const browserCanvas = document.getElementById("browserCanvas");
const galleryContainer = document.getElementById("galleryContainer");

const pillTorch = document.getElementById("pill-torch");
const pillWebgl = document.getElementById("pill-webgl");
const pillCloud = document.getElementById("pill-cloud");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  checkBackendHealth();
  // Render initial client-side angel artwork so canvas is never blank
  renderBrowserCelestialCanvas(promptInput.value, styleSelect.value, 777);
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

  // Generate Button
  btnGenerate.addEventListener("click", handleGenerate);

  // Download Button
  btnDownload.addEventListener("click", handleDownload);
}

// Check if Python Flask server is responding
async function checkBackendHealth() {
  try {
    const res = await fetch("/api/status", { method: "GET" });
    if (res.ok) {
      const data = await res.json();
      isBackendAvailable = true;
      if (data.pytorch) pillTorch.querySelector(".dot").classList.add("active");
      if (data.cloud) pillCloud.querySelector(".dot").classList.add("active");
      console.log("[Angel AI] Backend connected:", data);
    }
  } catch (err) {
    console.log("[Angel AI] Running in standalone browser mode (Backend not connected)");
    isBackendAvailable = false;
  }
}

// Generate Action
async function handleGenerate() {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    alert("Please enter a prompt to generate artwork!");
    return;
  }

  const style = styleSelect.value;
  const resolution = resolutionSelect.value;
  const seed = seedInput.value ? parseInt(seedInput.value, 10) : Math.floor(Math.random() * 999999);
  const negative = negativeInput.value.trim();

  showLoader(true, "Synthesizing celestial rays & wings...");
  const startTime = performance.now();

  try {
    if (currentEngine === "browser" || !isBackendAvailable) {
      // Fast client-side WebGL / Canvas synthesis
      await new Promise(r => setTimeout(r, 60)); // Smooth UI transition
      renderBrowserCelestialCanvas(prompt, style, seed);
      resultImage.classList.add("hidden");
      browserCanvas.classList.remove("hidden");
      
      const duration = ((performance.now() - startTime) / 1000).toFixed(2);
      genStats.textContent = `Browser Canvas in ${duration}s (Seed: ${seed})`;
      addToGallery(browserCanvas.toDataURL("image/png"), prompt, seed);
    } else {
      // Request generation from Python Backend API
      loaderText.textContent = `Executing ${currentEngine.toUpperCase()} engine...`;
      const [width, height] = resolution.split("x").map(Number);
      
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          engine: currentEngine,
          style,
          width,
          height,
          seed,
          negative
        })
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Generation failed");

      resultImage.src = result.image_url;
      resultImage.classList.remove("hidden");
      browserCanvas.classList.add("hidden");

      const duration = ((performance.now() - startTime) / 1000).toFixed(2);
      genStats.textContent = `${result.provider || currentEngine} in ${duration}s (Seed: ${seed})`;
      addToGallery(result.image_url, prompt, seed);
    }
  } catch (err) {
    console.error("Generation error:", err);
    alert(`Generation error: ${err.message}. Falling back to browser canvas.`);
    renderBrowserCelestialCanvas(prompt, style, seed);
    resultImage.classList.add("hidden");
    browserCanvas.classList.remove("hidden");
  } finally {
    showLoader(false);
  }
}

function showLoader(show, text = "") {
  if (show) {
    loaderText.textContent = text;
    loader.classList.remove("hidden");
    btnGenerate.disabled = true;
  } else {
    loader.classList.add("hidden");
    btnGenerate.disabled = false;
  }
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
  link.download = `angel_art_${Date.now()}.png`;
  if (!resultImage.classList.contains("hidden") && resultImage.src) {
    link.href = resultImage.src;
  } else {
    link.href = browserCanvas.toDataURL("image/png");
  }
  link.click();
}

/**
 * Procedural Client-Side Celestial Canvas Synthesizer
 * Draws winged celestial figures, volumetric god rays, glowing halo, and cloud mist
 */
function renderBrowserCelestialCanvas(prompt, style, seed) {
  const ctx = browserCanvas.getContext("2d");
  const W = browserCanvas.width;
  const H = browserCanvas.height;

  // Simple deterministic PRNG
  let s = seed % 2147483647;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;

  // Style Palette Configuration
  let topColor = "#fbf5e6", botColor = "#2b1820", haloColor = "#ffd700", rayColor = "rgba(255, 225, 120, 0.25)";
  let wingColor = "#ffffff", robeColor = "#f8f4eb";

  if (style === "renaissance") {
    topColor = "#edd7a8"; botColor = "#21150c"; haloColor = "#f5c542"; rayColor = "rgba(245, 197, 66, 0.3)";
    wingColor = "#faf3e0"; robeColor = "#ede2c8";
  } else if (style === "divine_gold") {
    topColor = "#fff3cc"; botColor = "#3d2208"; haloColor = "#ffbf00"; rayColor = "rgba(255, 200, 0, 0.4)";
    wingColor = "#fff8e7"; robeColor = "#fceed0";
  } else if (style === "cyberpunk") {
    topColor = "#0d1b2a"; botColor = "#050811"; haloColor = "#00f0ff"; rayColor = "rgba(0, 240, 255, 0.25)";
    wingColor = "#70f3ff"; robeColor = "#1e293b";
  } else if (style === "celestial") {
    topColor = "#2e1065"; botColor = "#030712"; haloColor = "#c084fc"; rayColor = "rgba(192, 132, 252, 0.3)";
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
  for (let i = 0; i < 28; i++) {
    const cx = rnd() * W;
    const cy = H * 0.45 + rnd() * H * 0.55;
    const cr = 60 + rnd() * 110;
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
  const lightY = -30;
  ctx.fillStyle = rayColor;
  for (let i = -7; i <= 7; i++) {
    ctx.beginPath();
    ctx.moveTo(lightX, lightY);
    const spread = (i * 45) + (rnd() * 20);
    ctx.lineTo(lightX + spread - 30, H);
    ctx.lineTo(lightX + spread + 30, H);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 4. Glowing Radiant Halo
  const headX = W * 0.5;
  const headY = H * 0.38;
  const haloR = 48;

  ctx.save();
  // Outer Glow
  const haloGrad = ctx.createRadialGradient(headX, headY, haloR - 15, headX, headY, haloR + 35);
  haloGrad.addColorStop(0, haloColor);
  haloGrad.addColorStop(0.5, "rgba(255, 215, 0, 0.45)");
  haloGrad.addColorStop(1, "rgba(255, 215, 0, 0)");
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(headX, headY, haloR + 35, 0, Math.PI * 2);
  ctx.fill();

  // Crisp Golden Ring
  ctx.strokeStyle = haloColor;
  ctx.lineWidth = 5;
  ctx.shadowColor = haloColor;
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(headX, headY, haloR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 5. Feathered Angel Wings
  ctx.save();
  ctx.shadowColor = haloColor;
  ctx.shadowBlur = 25;

  const drawWing = (dir) => {
    ctx.save();
    ctx.translate(headX, headY + 30);
    ctx.scale(dir, 1);

    // Layered Feather Arcs
    for (let layer = 0; layer < 4; layer++) {
      ctx.beginPath();
      ctx.moveTo(15, 10);
      const spanX = 140 + layer * 28;
      const spanY = -60 - layer * 22;
      ctx.bezierCurveTo(60, -80 - layer * 20, spanX - 20, spanY - 15, spanX, spanY);
      ctx.bezierCurveTo(spanX + 15, spanY + 40, spanX - 40, spanY + 120, 25, 90 + layer * 18);
      ctx.closePath();

      const wingGrad = ctx.createLinearGradient(0, spanY, spanX, spanY + 120);
      wingGrad.addColorStop(0, wingColor);
      wingGrad.addColorStop(0.7, "rgba(255, 255, 255, 0.85)");
      wingGrad.addColorStop(1, "rgba(245, 197, 66, 0.2)");
      ctx.fillStyle = wingGrad;
      ctx.fill();

      // Feather striations
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.restore();
  };

  drawWing(1);  // Right wing
  drawWing(-1); // Left wing
  ctx.restore();

  // 6. Angel Figure Robes & Silhouette
  ctx.save();
  ctx.beginPath();
  // Head
  ctx.arc(headX, headY, 24, 0, Math.PI * 2);
  // Flowing Robes
  ctx.moveTo(headX - 22, headY + 18);
  ctx.bezierCurveTo(headX - 35, headY + 80, headX - 85, H * 0.85, headX - 110, H);
  ctx.lineTo(headX + 110, H);
  ctx.bezierCurveTo(headX + 85, H * 0.85, headX + 35, headY + 80, headX + 22, headY + 18);
  ctx.closePath();

  const robeGrad = ctx.createLinearGradient(headX - 60, headY, headX + 60, H);
  robeGrad.addColorStop(0, robeColor);
  robeGrad.addColorStop(0.5, "rgba(240, 240, 250, 0.95)");
  robeGrad.addColorStop(1, "rgba(180, 160, 140, 0.85)");
  ctx.fillStyle = robeGrad;
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 18;
  ctx.fill();

  // Soft Robe Folds
  ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
  ctx.lineWidth = 2;
  for (let f = -2; f <= 2; f++) {
    ctx.beginPath();
    ctx.moveTo(headX + f * 10, headY + 45);
    ctx.quadraticCurveTo(headX + f * 25, H * 0.7, headX + f * 35, H);
    ctx.stroke();
  }
  ctx.restore();

  // 7. Celestial Golden Particles / Embers
  ctx.save();
  ctx.fillStyle = haloColor;
  for (let i = 0; i < 90; i++) {
    const px = rnd() * W;
    const py = rnd() * H;
    const pr = rnd() * 2.2 + 0.6;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
