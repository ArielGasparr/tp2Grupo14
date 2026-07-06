// Colores
const BG          = [8, 3, 2];
const ROJO        = [201, 74, 42];
const ROSA_OSCURO = [232, 131, 90];
const ROSA_CLARO  = [242, 196, 168];

// ---------------- FUNCIONES AUXILIARES ----------------

function azar(a, b) {
  return random(a, b);
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

  if (colBorde) colorBorde(colBorde, a);
  else sinLinea();

  if (colRelleno) colorRelleno(colRelleno, a);
  else sinRelleno();

  ellipse(x, y, r * 2, r * 2);

  pop();
}

function dibujarRect(x, y, s, colBorde, colRelleno, a = 1) {
  push();

  if (colBorde) colorBorde(colBorde, a);
  else sinLinea();

  if (colRelleno) colorRelleno(colRelleno, a);
  else sinRelleno();

  rectMode(CENTER);
  rect(x, y, s, s);

  pop();
}

function dibujarLinea(x1, y1, x2, y2, col, a = 1, w = 1) {
  push();
  colorBorde(col, a);
  strokeWeight(w);
  line(x1, y1, x2, y2);
  pop();
}

function textoGuia(msg) {
  push();
  textFont("Courier New");
  textAlign(CENTER);
  textSize(12);
  noStroke();
  fill(ROJO[0], ROJO[1], ROJO[2], 60);
  text(msg, width / 2, height / 2);
  pop();
}

// ---------------- MEMORIA ----------------

let rastroPuntitos = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(BG);

  strokeWeight(0.5);

  // unir últimos puntos
  let agrupacion = rastroPuntitos.slice(-45);

  for (let i = 1; i < agrupacion.length; i++) {
    let p1 = agrupacion[i - 1];
    let p2 = agrupacion[i];

    let alpha = (1 - p2.cantFrame / p2.fadeTime) * 0.12;

    dibujarLinea(
      p1.x,
      p1.y,
      p2.x,
      p2.y,
      ROSA_OSCURO,
      alpha,
      0.5
    );
  }

  // actualizar y dibujar partículas
  for (let i = rastroPuntitos.length - 1; i >= 0; i--) {

    let t = rastroPuntitos[i];

    t.cantFrame++;

    if (t.cantFrame >= t.fadeTime) {
      rastroPuntitos.splice(i, 1);
      continue;
    }

    let a = 1 - t.cantFrame / t.fadeTime;
    let r = t.r * (0.45 + a * 0.55);

    if (t.esCuadrado) {
      dibujarRect(t.x, t.y, r * 2, ROSA_OSCURO, null, a * 0.52);
    } else {
      dibujarCirc(t.x, t.y, r, ROJO, null, a * 0.62);
    }

    dibujarCirc(t.x, t.y, r * 0.22, null, ROSA_CLARO, a * 0.28);
  }

  if (rastroPuntitos.length == 0) {
    textoGuia("Mover el mouse para dejar registro");
  }
}

function mouseMoved() {
  agregarPunto(mouseX, mouseY);
}

function mouseDragged() {
  agregarPunto(mouseX, mouseY);
}

function agregarPunto(x, y) {

  if (rastroPuntitos.length < 500) {

    rastroPuntitos.push({
      x: x,
      y: y,
      r: azar(5, 26),
      cantFrame: 0,
      fadeTime: azar(180, 520),
      esCuadrado: random() > 0.72
    });

  }

}

function mousePressed() {

  for (let i = 0; i < 18; i++) {

    let a = TWO_PI * i / 18;
    let d = azar(18, 65);

    rastroPuntitos.push({
      x: mouseX + cos(a) * d,
      y: mouseY + sin(a) * d,
      r: azar(3, 13),
      cantFrame: 0,
      fadeTime: azar(120, 280),
      esCuadrado: i % 5 == 0
    });

  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}