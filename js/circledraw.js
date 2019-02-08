const canvas = document.querySelector('.graph');
const ctx = canvas.getContext('2d');

const inputPoints = document.getElementById('points');
const inputSpeed  = document.getElementById('speed');

const resetMultip = document.getElementById('reset');
const plusTen = document.getElementById('plusTen');
const plusOne = document.getElementById('plusOne');


const rangeLabels = document.querySelectorAll('.slideContainer h4');
rangeLabels.forEach((label) => {
  const word = [...label.textContent];
  label.innerHTML = '';
  word.forEach((letter) => {
    const spannedLetter = document.createElement('span');
    spannedLetter.textContent = letter;
    label.appendChild(spannedLetter);
  });
});

function mValue(value) {
  document.getElementById('mValue').textContent = value;
}

function distance(x1, y1, x2, y2) {
  let xDist = x2 - x1;
  let yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function map(value, minA, maxA, minB, maxB) {
  return (1 - (value - minA) / (maxA - minA)) * minB + (value - minA) / (maxA - minA) * maxB;
}

let size = {
  s: 8,
  w: 60,
  h: 60,
  o: 1
};

size.sw = size.w * size.s;
size.sh = size.h * size.s;

size.mw = Math.floor(size.sw / 2);
size.mh = Math.floor(size.sh / 2);

size.lw = size.sw - size.s;
size.lh = size.sh - size.s;

canvas.width  = size.sw;
canvas.height = size.sh;

let m = 1;
let drawGraph = function drawGraph() {
  let root = document.documentElement;
  let n = inputPoints.value;

  if (m >= 999) {
    m = 0;
  } else {
    m += +inputSpeed.value;
  }

  let r = Math.floor((size.w - 2 * size.o) * size.s / 2);

  rect({ x: 0, y: 0, w: size.sw, h: size.sh }, '#222');
  circle({ x: size.mw, y: size.mh, r: r }, '#333');

  let x, y, e, ex, ey, start, end, lineLength, alpha, hue;
  for (let i = 0; i < n; i++) {
    x = Math.sin(pi2 / n * i - pi2 / 4) * r;
    y = Math.sin(pi2 / n * i) * r;
    circle({ x: size.mw + x, y: size.mh + y, r: 2 }, '#fff');
    e = m * i;
    ex = Math.sin(pi2 / n * e - pi2 / 4) * r;
    ey = Math.sin(pi2 / n * e) * r;
    start = { x: size.mw + x, y: size.mh + y };
    end = { x: size.mw + ex, y: size.mh + ey };
    lineLength = distance( size.mw + x, size.mh + y, size.mw + ex, size.mh + ey );
    alpha = map(lineLength, 0, 400, 1, 0.3);
    alpha = (alpha > 1 ? 1 : alpha).toFixed(2);
    hue = m * 100 % 360;
    line(start, end, `hsla(${hue}, 100%, 85%, ${alpha})`);
  }

  let parsM = parseFloat(Math.round(m * 100) / 100).toFixed(2);
  mValue(parsM);
  Hsl = ( + m * 100 % 360 );

  requestAnimationFrame(drawGraph);

  root.style.setProperty('--Hsl', Hsl);
};

let rect = function rect(r, color) {
  ctx.fillStyle = color;
  ctx.fillRect(r.x, r.y, r.w, r.h);
};

let line = function line(s, e, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(s.x, s.y);
  ctx.lineTo(e.x, e.y);
  ctx.stroke();
};

let pi2 = Math.PI * 2;
let circle = function circle(c, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(c.x, c.y, c.r, 0, pi2);
  ctx.stroke();
};

function patterns(value) {
  m = value;
  inputSpeed.value  = 0;
  inputPoints.value = 200;
};

window.addEventListener('load', drawGraph);

document.querySelectorAll('.controlBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const btnValue = btn.getAttribute('data-value');
    if (btnValue == 0) {
      m = 0;
    } else {
      m += +btnValue;
    }
  });
});
