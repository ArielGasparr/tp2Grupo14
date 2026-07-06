// Colores
const BG = [8, 3, 2];
const ROSA_CLARO = [242, 196, 168];

let tAns = 0;

function colorRelleno(col, a = 1) {
  fill(col[0], col[1], col[2], a * 255);
}

function sinLinea() {
  noStroke();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(BG);

  actualizar();
  dibujar();
}

function actualizar() {
  tAns += 0.05;
}

function dibujar() {

  push();

  textFont("Courier New");
  textAlign(CENTER, CENTER);
  sinLinea();

  colorRelleno(ROSA_CLARO);
  textSize(24);

  text("[ EN PROCESO ]", width / 2, height / 2 - 10);

  pop();
}

function mousePressed() {}
function mouseMoved() {}
function mouseDragged() {}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}