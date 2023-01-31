export function secsToDateTime(secs) {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t;
}

export function writeText(info, style = {}) {
  const { ctx, text, x, y } = info;
  const {
    fontSize = 20,
    fontFamily = "Arial",
    color = "black",
    textAlign = "left",
    textBaseline = "top",
  } = style;

  ctx.beginPath();
  ctx.font = fontSize + "px " + fontFamily;
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.stroke();
}

export function writeTextCentre(info, style = {}) {
  const { ctx, text, x, y, width } = info;
  const {
    fontSize = 20,
    fontFamily = "Arial",
    color = "black",
    textBaseline = "top",
  } = style;

  var textWidth = ctx.measureText(text).width;
  var xx = x + width / 2 - textWidth / 2;

  ctx.beginPath();
  ctx.font = style.fontSize + "px " + fontFamily;
  ctx.textAlign = "centre";
  ctx.textBaseline = textBaseline;
  ctx.fillStyle = color;
  ctx.fillText(text, xx, y);
  ctx.stroke();
}

export function drawGradientRect(info, style = {}) {
  const { ctx, x, y, width, height } = info;
  const {
    colorStops = 4,
    color1 = "red",
    color2 = "green",
    color3 = "blue",
    color4 = "yellow",
  } = style;

  ctx.strokeStyle = "white";
  const xx = width / 6;
  const grad = ctx.createLinearGradient(0, 0, 320, height);
  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);
  ctx.fillStyle = grad;
  if (colorStops === 4) {
    grad.addColorStop(0, color3);
    grad.addColorStop(1, color4);
    ctx.fillStyle = grad;
  }
  ctx.fillRect(x, y, width, height);
}

export function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
  if (fill) {
    ctx.fillStyle = fill
    ctx.fill()
  }
  if (stroke) {
    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = stroke
    ctx.stroke()
  }
  ctx.closePath()
}

export function drawEllipseRectangle(ctx, x, y, width, height, fill, stroke, strokeWidth)
{
  const mx = x + (width / 2)
  const my = y + (height / 2)
  drawCircle(ctx, mx, my, width / 2, fill, stroke, strokeWidth)
}

export function drawPieSegment(ctx, x, y, radius, startangle, endangle, fill, stroke, strokeWidth, clockwise) {
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.arc(x, y, radius, startangle, endangle, clockwise)
  ctx.lineTo(x, y)
  if (fill) {
    ctx.fillStyle = fill
    ctx.fill()
  }
  if (stroke) {
    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = stroke
    ctx.stroke()
  }
  ctx.closePath()
}

