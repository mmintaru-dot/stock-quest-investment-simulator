/*
 * Canvas width/height attributes are drawing-buffer sizes, not layout sizes.
 * Always derive the buffer from the fixed CSS box so repeated renders cannot
 * feed the previous DPR-scaled buffer height back into the page layout.
 */
drawLine = function drawLineFixed(canvas, values, color = '#08785d', fill = true) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  const context = canvas.getContext('2d');
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);

  const min = Math.min(...values) * 0.98;
  const max = Math.max(...values) * 1.02;
  const range = max - min || 1;
  const padding = 12;

  context.strokeStyle = '#e8ede9';
  context.lineWidth = 1;
  for (let index = 1; index < 4; index += 1) {
    context.beginPath();
    context.moveTo(0, height * index / 4);
    context.lineTo(width, height * index / 4);
    context.stroke();
  }

  const points = values.map((value, index) => [
    padding + (width - padding * 2) * (index / Math.max(1, values.length - 1)),
    padding + (height - padding * 2) * (1 - (value - min) / range)
  ]);

  if (fill) {
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `${color}33`);
    gradient.addColorStop(1, `${color}00`);
    context.beginPath();
    context.moveTo(points[0][0], height);
    points.forEach(point => context.lineTo(...point));
    context.lineTo(points.at(-1)[0], height);
    context.fillStyle = gradient;
    context.fill();
  }

  context.beginPath();
  points.forEach((point, index) => {
    if (index) context.lineTo(...point);
    else context.moveTo(...point);
  });
  context.strokeStyle = color;
  context.lineWidth = 2.5;
  context.stroke();
};

// Repair canvases that may already have expanded during the initial render.
renderDetail();
renderPerformance();
