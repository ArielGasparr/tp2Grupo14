// Colores
const BG = [8, 3, 2];
const ROJO = [201, 74, 42];
const ROSA_OSCURO = [232, 131, 90];
const ROSA_CLARO = [242, 196, 168];

//---------------- FUNCIONES ----------------

function azar(a, b) {
  return random(a, b);
}

function colorBorde(col, a = 1) {
  stroke(col[0], col[1], col[2], a * 255);
}

function sinLinea() {
  noStroke();
}

function sinRelleno() {
  noFill();
}

function dibujarLinea(x1, y1, x2, y2, col, a = 1, w = 1) {
  push();
  colorBorde(col, a);
  strokeWeight(w);
  line(x1, y1, x2, y2);
  pop();
}

function dibujarTriang(x, y, r, rot, colBorde, colRelleno, a = 1) {
  if (r <= 0) return;

  push();

  if (colBorde)
    colorBorde(colBorde, a);
  else
    sinLinea();

  if (colRelleno)
    fill(colRelleno[0], colRelleno[1], colRelleno[2], a * 255);
  else
    sinRelleno();

  beginShape();

  for (let i = 0; i < 3; i++) {
    let ang = rot + (i / 3) * TWO_PI - HALF_PI;
    vertex(
      x + cos(ang) * r,
      y + sin(ang) * r
    );
  }

  endShape(CLOSE);
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

//---------------- HERENCIA ----------------

let listaTriangulos = [];
let triangID = 0;
let maxGen = 4;

function spawn(x, y, r, gen, padreX, padreY) {

  if (gen > maxGen || r < 4) return;

  listaTriangulos.push({
    id: triangID++,
    x: x,
    y: y,
    r: r,
    genTriang: gen,
    padreX: padreX,
    padreY: padreY,
    cantFrame: 0,
    spawnProx: 48 + gen * 32,
    fadeTime: 370 - gen * 38,
    yaSpawneo: false,
    rotarTriang: azar(0, TWO_PI)
  });

}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {

  background(BG);

  // actualizar
  for (let n of listaTriangulos) {

    n.cantFrame++;
    n.rotarTriang += 0.007 * (1 + n.genTriang * 0.25);

    if (!n.yaSpawneo &&
        n.cantFrame >= n.spawnProx &&
        n.genTriang < maxGen) {

      n.yaSpawneo = true;

      let ba = azar(0, TWO_PI);
      let sp = PI * 0.48 + azar(0, PI * 0.35);
      let d = n.r * 2.35;

      spawn(
        n.x + cos(ba) * d,
        n.y + sin(ba) * d,
        n.r * 0.57,
        n.genTriang + 1,
        n.x,
        n.y
      );

      spawn(
        n.x + cos(ba + sp) * d,
        n.y + sin(ba + sp) * d,
        n.r * 0.57,
        n.genTriang + 1,
        n.x,
        n.y
      );

    }
  }

  listaTriangulos = listaTriangulos.filter(
    n => n.cantFrame < n.fadeTime
  );

  // líneas
  for (let n of listaTriangulos) {

    if (n.padreX != null) {

      let alpha =
        (1 - n.cantFrame / n.fadeTime) * 0.5;

      dibujarLinea(
        n.padreX,
        n.padreY,
        n.x,
        n.y,
        ROSA_OSCURO,
        alpha,
        2
      );

    }

  }

  // triángulos
  for (let n of listaTriangulos) {

    let a =
      (1 - n.cantFrame / n.fadeTime) *
      (1 - n.genTriang * 0.17);

    let col;

    if (n.genTriang == 0)
      col = ROSA_CLARO;
    else if (n.genTriang == 1)
      col = ROSA_OSCURO;
    else
      col = ROJO;

    strokeWeight(max(0.4, 1.8 - n.genTriang * 0.3));

    dibujarTriang(
      n.x,
      n.y,
      n.r,
      n.rotarTriang,
      col,
      null,
      a * 0.85
    );

    if (n.genTriang < 3) {

      dibujarTriang(
        n.x,
        n.y,
        n.r * 0.35,
        -n.rotarTriang * 1.6,
        ROJO,
        null,
        a * 0.3
      );

    }

  }

  if (listaTriangulos.length == 0) {
    textoGuia("Clic para iniciar el linaje");
  }

}

function mousePressed() {

  spawn(
    mouseX,
    mouseY,
    44,
    0,
    null,
    null
  );

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}