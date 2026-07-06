// ============================================
//  SKETCH INDIVIDUAL — ESCENA: EXPECTATIVA
//  "como anticipación"
// ============================================

// Colores
const BG          = [8,   3,   2  ];
const ROJO        = [201, 74,  42 ];
const ROSA_OSCURO = [232, 131, 90 ];
const ROSA_CLARO  = [242, 196, 168];

// Estado global
let fadeTransicion = 1;   // 0=negro, 1=visible
let posMouseX = 0, posMouseY = 0;

function azar(a, b) {
  return random(a, b);
}

function azarInt(n) {
  return floor(random(n));
}

function interpolar(a, b, tAns) {
  return lerp(a, b, tAns);
}

function colorBorde(col, a = 1) {
  stroke(col[0], col[1], col[2], a * 255);
}

function colorRelleno(col, a = 1) {
  fill(col[0], col[1], col[2], a * 255);
}

function sinLinea() {
  noStroke();
}

function sinRelleno() {
  noFill();
}

function dibujarCirc(x, y, r, colBorde, colRelleno, a = 1) {
  if (r <= 0) return;
  push();

  if (colBorde) {
    colorBorde(colBorde, a);
  } else {
    sinLinea();
  }

  if (colRelleno) {
    colorRelleno(colRelleno, a);
  } else {
    sinRelleno();
  }

  ellipse(x, y, r * 2, r * 2);
  pop();
}

function dibujarRect(x, y, s, colBorde, colRelleno, a = 1) {
  push();

  if (colBorde) {
    colorBorde(colBorde, a);
  } else {
    sinLinea();
  }

  if (colRelleno) {
    colorRelleno(colRelleno, a);
  } else {
    sinRelleno();
  }

  rectMode(CENTER);
  rect(x, y, s, s);
  pop();
}

function dibujarTriang(x, y, r, rotarTriang, colBorde, colRelleno, a = 1) {
  if (r <= 0) return;
  push();

  if (colBorde) {
    colorBorde(colBorde, a);
  } else {
    sinLinea();
  }

  if (colRelleno) {
    colorRelleno(colRelleno, a);
  } else {
    sinRelleno();
  }

  beginShape();
  for (let i = 0; i < 3; i++) {
    let ang = rotarTriang + (i / 3) * TWO_PI - HALF_PI;
    vertex(x + cos(ang) * r, y + sin(ang) * r);
  }
  endShape(CLOSE);
  pop();
}

function dibujarLinea(x1, y1, x2, y2, colBorde, a = 1, w = 1) {
  push();
  colorBorde(colBorde, a);
  strokeWeight(w);
  line(x1, y1, x2, y2);
  pop();
}

//  ESCENA — EXPECTATIVA (proceso)

const S_Expectativa = {
  nombreEscena: 'EXPECTATIVA',
  subTituloEscena: 'como anticipación',
  tAns: 0,

  iniciar: function() { this.tAns = 0; },
  alMover: function() {},
  alClick: function() {},

  actualizar: function() {
    this.tAns += 0.05;
  },

  dibujar: function() {
    push();
    textFont('Courier New');
    textAlign(CENTER, CENTER);
    sinLinea();

    colorRelleno(ROSA_CLARO);
    textSize(24);
    text('[ EN PROCESO ]', width / 2, height / 2 - 10);
    pop();
  }
};

//  HUD

function drawHUD() {
  let sc = S_Expectativa;

  push();
  textFont('Courier New');
  sinLinea();

  // titulo de la escena
  colorRelleno(ROSA_CLARO, 0.88);
  textSize(22);
  textAlign(LEFT);
  text(sc.nombreEscena, 32, 52);

  // Descripcion
  colorRelleno(ROJO, 0.5);
  textSize(10);
  text(sc.subTituloEscena, 32, 68);

  // guia de teclas (abajo centro)
  colorRelleno(ROJO, 0.18);
  textAlign(CENTER);
  textSize(7.5);
  text('escena única', width / 2, height - 28);

  pop();
}

function textoGuia(msg) {
  push();
  textFont('Courier New');
  textAlign(CENTER);
  textSize(10);
  sinLinea();
  colorRelleno(ROJO, 0.22);
  text('— ' + msg + ' —', width / 2, height / 2);
  pop();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  posMouseX = width / 2;
  posMouseY = height / 2;
  S_Expectativa.iniciar();
  fadeTransicion = 0;
}

function draw() {
  // fondo
  background(BG[0], BG[1], BG[2]);

  // marco doble
  push();
  sinRelleno();
  colorBorde(ROJO, 0.11);
  strokeWeight(1);
  rect(17, 17, width - 34, height - 34);

  colorBorde(ROJO, 0.05);
  strokeWeight(1);
  rect(22, 22, width - 44, height - 44);
  pop();

  // escena activa
  S_Expectativa.actualizar();
  S_Expectativa.dibujar();

  // HUD se muestra encima
  drawHUD();

  // fade
  fadeTransicion = min(1, fadeTransicion + 0.04);

  if (fadeTransicion < 1) {
    push();
    sinLinea();
    fill(BG[0], BG[1], BG[2], (1 - fadeTransicion) * 255);
    rect(0, 0, width, height);
    pop();
  }
}

//  EVENTOS

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseMoved() {
  posMouseX = mouseX;
  posMouseY = mouseY;
  S_Expectativa.alMover(posMouseX, posMouseY);
}

function mouseDragged() {
  posMouseX = mouseX;
  posMouseY = mouseY;
  S_Expectativa.alMover(posMouseX, posMouseY);
}

function mousePressed() {
  S_Expectativa.alClick(mouseX, mouseY);
}

function touchMoved() {
  if (touches.length > 0) {
    posMouseX = touches[0].x;
    posMouseY = touches[0].y;
  } else {
    posMouseX = mouseX;
    posMouseY = mouseY;
  }
  S_Expectativa.alMover(posMouseX, posMouseY);
  return false;
}

function touchStarted() {
  if (touches.length > 0) {
    posMouseX = touches[0].x;
    posMouseY = touches[0].y;
  } else {
    posMouseX = mouseX;
    posMouseY = mouseY;
  }
  S_Expectativa.alClick(posMouseX, posMouseY);
  return false;
}
