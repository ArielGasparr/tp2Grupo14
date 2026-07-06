// Colores
const BG = [8, 3, 2];
const ROJO = [201, 74, 42];
const ROSA_OSCURO = [232, 131, 90];
const ROSA_CLARO = [242, 196, 168];

//---------------- FUNCIONES ----------------

function dibujarCirc(x, y, r, colBorde, colRelleno, a = 1) {
  push();

  if (colBorde) {
    stroke(colBorde[0], colBorde[1], colBorde[2], a * 255);
  } else {
    noStroke();
  }

  if (colRelleno) {
    fill(colRelleno[0], colRelleno[1], colRelleno[2], a * 255);
  } else {
    noFill();
  }

  ellipse(x, y, r * 2, r * 2);

  pop();
}

function dibujarLinea(x1, y1, x2, y2, col, a = 1, w = 1) {
  push();
  stroke(col[0], col[1], col[2], a * 255);
  strokeWeight(w);
  line(x1, y1, x2, y2);
  pop();
}

function textoGuia(msg) {
  push();
  textAlign(CENTER);
  textFont("Courier New");
  textSize(12);
  noStroke();
  fill(ROJO[0], ROJO[1], ROJO[2], 70);
  text(msg, width / 2, height / 2);
  pop();
}

//---------------- EMPATÍA ----------------

let historial = [];

let fx;
let fy;

const delayFrame = 90;

function setup() {

  createCanvas(windowWidth, windowHeight);

  fx = width / 2 + 110;
  fy = height / 2;

}

function draw() {

  background(BG);

  let indice = max(0, historial.length - delayFrame);

  if (historial[indice]) {

    fx = lerp(fx, historial[indice].x, 0.08);
    fy = lerp(fy, historial[indice].y, 0.08);

  }

  let ultimo = historial[historial.length - 1];

  let lx = width / 2;
  let ly = height / 2;

  if (ultimo) {
    lx = ultimo.x;
    ly = ultimo.y;
  }

  // Rastro del usuario

  let inicio = max(0, historial.length - 60);

  for (let i = inicio; i < historial.length - 1; i++) {

    let alpha = ((i - inicio) / 60) * 0.32;

    dibujarLinea(
      historial[i].x,
      historial[i].y,
      historial[i + 1].x,
      historial[i + 1].y,
      ROJO,
      alpha,
      5
    );

  }

  // Rastro del seguidor

  let inicio2 = max(0, historial.length - delayFrame - 60);
  let fin2 = max(0, historial.length - delayFrame);

  for (let i = inicio2; i < fin2 - 1; i++) {

    let alpha = ((i - inicio2) / 60) * 0.24;

    dibujarLinea(
      historial[i].x,
      historial[i].y,
      historial[i + 1].x,
      historial[i + 1].y,
      ROSA_OSCURO,
      alpha,
      5
    );

  }

  // Unión entre ambos

  if (ultimo) {

    dibujarLinea(lx, ly, fx, fy, ROSA_CLARO, 0.5, 5);

    let d = dist(lx, ly, fx, fy);

    if (d < 90) {

      dibujarCirc(
        (lx + fx) / 2,
        (ly + fy) / 2,
        d * 0.38,
        ROSA_CLARO,
        null,
        (1 - d / 90) * 0.38
      );

    }

  }

  // Usuario

  strokeWeight(2);

  dibujarCirc(lx, ly, 21, ROJO, null, 0.88);
  dibujarCirc(lx, ly, 7, null, ROJO, 0.48);

  // Seguidor

  strokeWeight(1.5);

  dibujarCirc(fx, fy, 21, ROSA_OSCURO, null, 0.7);
  dibujarCirc(fx, fy, 7, null, ROSA_OSCURO, 0.35);

  if (historial.length == 0) {

    textoGuia("Mover el mouse para activar la empatía");

  }

}

function mouseMoved() {

  historial.push({
    x: mouseX,
    y: mouseY
  });

  if (historial.length > 600) {
    historial.shift();
  }

}

function mouseDragged() {
  mouseMoved();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}