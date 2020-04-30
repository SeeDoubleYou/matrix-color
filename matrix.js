const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");
const w = canvas.width;
const h = canvas.height;
const hueOffsetUpdateInterval = 50;
let hueOffset = 0;
let lastHueOffsetUpdateTime = Date.now();

const pointSize = 10;
const pointSpacing = 5;
const pointSpace = pointSize + pointSpacing;
const pointsPerRow = Math.floor(w / pointSpace);
const pointsPerCol = Math.floor(h / pointSpace);
const pointOffsetRow = (pointSpace + w - pointsPerRow * pointSpace) / 2;
const pointOffsetCol = (pointSpace + h - pointsPerCol * pointSpace) / 2;

const rotationSlider = document.getElementById("rotationSlider");
const rotationSliderValue = document.getElementById("rotationSliderValue");
let θ = rotationSlider.value * Math.PI / 180; // θ = matrix rotation
rotationSlider.addEventListener("input", () => {
  θ = rotationSlider.value * Math.PI / 180;
  rotationSliderValue.innerText = rotationSlider.value;
});

const velocitySlider = document.getElementById("velocitySlider");
const velocitySliderValue = document.getElementById("velocitySliderValue");
let hueOffsetUpdateStep = parseInt(velocitySlider.value);
velocitySlider.addEventListener("input", () => {
  hueOffsetUpdateStep = parseInt(velocitySlider.value);
  velocitySliderValue.innerText = velocitySlider.value;
});

const bandWidthSlider = document.getElementById("bandWidthSlider");
const bandWidthSliderValue = document.getElementById("bandWidthSliderValue");
let hueBand = parseInt(bandWidthSlider.value);
bandWidthSlider.addEventListener("input", () => {
  hueBand = parseInt(bandWidthSlider.value);
  bandWidthSliderValue.innerText = bandWidthSlider.value;
});

function animate() {
  for(let r=0; r<pointsPerRow; r++) {

    const y = r * (pointSize + pointSpacing) + pointOffsetRow;
    for(let c=0; c<pointsPerCol; c++) {
      const x = c * (pointSize + pointSpacing) + pointOffsetCol;
      const r_ =  -r * Math.sin(θ) + c * Math.cos(θ);

      const hue = ((r_ * hueBand) / pointsPerRow + hueOffset) % 360;
      const color = `hsl(${hue}, 100%, 50%)`

      drawCircle(x, y, color);
    }
  }
}

function drawCircle(x, y, color) {
  ctx.beginPath();
    ctx.arc(x, y, pointSize / 2, 0, 2 * Math.PI, true);
    ctx.fillStyle = color;
    ctx.fill();
}

function updateOffsetColor() {
  const now = Date.now();
  if(now - lastHueOffsetUpdateTime >= hueOffsetUpdateInterval) {
    hueOffset = (hueOffset + hueOffsetUpdateStep + 360) % 360;
    lastHueOffsetUpdateTime = now;
  }
}

(function render() {
  updateOffsetColor();
  animate();
  window.requestAnimationFrame(render);
})();