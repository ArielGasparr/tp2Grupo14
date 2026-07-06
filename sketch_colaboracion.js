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

function dibujarCirc(x, y, r, borde, relleno, a = 1) {
  push();

  if (borde) colorBorde(borde, a);
  else sinLinea();

  if (relleno)
    fill(relleno[0], relleno[1], relleno[2], a * 255);
  else
    sinRelleno();

  ellipse(x, y, r * 2);

  pop();
}

function dibujarRect(x, y, s, borde, relleno, a = 1) {
  push();

  if (borde) colorBorde(borde, a);
  else sinLinea();

  if (relleno)
    fill(relleno[0], relleno[1], relleno[2], a * 255);
  else
    sinRelleno();

  rectMode(CENTER);
  rect(x, y, s, s);

  pop();
}

function dibujarTriang(x, y, r, rot, borde, relleno, a = 1) {

  push();

  if (borde) colorBorde(borde, a);
  else sinLinea();

  if (relleno)
    fill(relleno[0], relleno[1], relleno[2], a * 255);
  else
    sinRelleno();

  beginShape();

  for (let i = 0; i < 3; i++) {

    let ang = rot + i * TWO_PI / 3 - HALF_PI;

    vertex(
      x + cos(ang) * r,
      y + sin(ang) * r
    );

  }

  endShape(CLOSE);

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

  textAlign(CENTER);
  textFont("Courier New");
  textSize(11);

  noStroke();
  fill(ROJO[0], ROJO[1], ROJO[2], 60);

  text(msg, width / 2, height / 2);

  pop();

}

//---------------- COLABORACIÓN ----------------

const tipos = ["circulo", "cuadrado", "triangulo", "linea"];
const colores = [ROJO, ROSA_OSCURO, ROSA_CLARO, ROSA_OSCURO];

let figuras = [];
let unidas = false;

function setup() {

  createCanvas(windowWidth, windowHeight);

  iniciar();

}

function iniciar() {

  figuras = [];
  unidas = false;

  for (let i = 0; i < 4; i++) {

    let ang = TWO_PI * i / 4;

    figuras.push({

      type: tipos[i],
      col: colores[i],

      x: width / 2 + cos(ang) * 180,
      y: height / 2 + sin(ang) * 180,

      vx: 0,
      vy: 0,

      rot: azar(0, TWO_PI),
      size: azar(19, 27)

    });

  }

}

function draw() {

  background(BG);

  let conexiones = 0;

  for (let i = 0; i < figuras.length; i++) {

    for (let j = i + 1; j < figuras.length; j++) {

      if (dist(figuras[i].x, figuras[i].y,
               figuras[j].x, figuras[j].y) < 140)

        conexiones++;

    }

  }

  if (!unidas && conexiones == 6)
    unidas = true;

  let cx = 0;
  let cy = 0;

  for (let f of figuras) {

    cx += f.x;
    cy += f.y;

  }

  cx /= 4;
  cy /= 4;

  for (let f of figuras) {

    if (!unidas) {

      f.vx += (width / 2 - f.x) * 0.0004;
      f.vy += (height / 2 - f.y) * 0.0004;

    }

    else {

      f.vx += (cx - f.x) * 0.008;
      f.vy += (cy - f.y) * 0.008;

    }

    for (let o of figuras) {

      if (o == f) continue;

      let d = dist(f.x, f.y, o.x, o.y);

      if (d < 130 && d > 10) {

        f.vx += (o.x - f.x) * (unidas ? 0.004 : 0.0015);
        f.vy += (o.y - f.y) * (unidas ? 0.004 : 0.0015);

      }

    }

    f.vx *= unidas ? 0.85 : 0.91;
    f.vy *= unidas ? 0.85 : 0.91;

    f.rot += unidas ? 0.03 : 0.015;

    f.x += f.vx;
    f.y += f.vy;

    f.x = constrain(f.x, 30, width - 30);
    f.y = constrain(f.y, 30, height - 30);

  }

  // conexiones

  for (let i = 0; i < figuras.length; i++) {

    for (let j = i + 1; j < figuras.length; j++) {

      let d = dist(figuras[i].x, figuras[i].y,
                   figuras[j].x, figuras[j].y);

      if (d < 140) {

        dibujarLinea(
          figuras[i].x,
          figuras[i].y,
          figuras[j].x,
          figuras[j].y,
          ROSA_CLARO,
          (1 - d / 140) * 0.8,
          unidas ? 2.5 : 1.5
        );

      }

    }

  }

  if (unidas) {

    dibujarCirc(
      cx,
      cy,
      70 + sin(frameCount * 0.08) * 15,
      null,
      ROSA_OSCURO,
      0.15
    );

  }

  for (let f of figuras) {

    if (f.type == "circulo")
      dibujarCirc(f.x, f.y, f.size, f.col, null, 0.9);

    else if (f.type == "cuadrado")
      dibujarRect(f.x, f.y, f.size * 2, f.col, null, 0.9);

    else if (f.type == "triangulo")
      dibujarTriang(f.x, f.y, f.size, f.rot, f.col, null, 0.9);

    else {

      let cx = cos(f.rot) * f.size * 1.4;
      let cy = sin(f.rot) * f.size * 1.4;

      dibujarLinea(
        f.x - cx,
        f.y - cy,
        f.x + cx,
        f.y + cy,
        f.col,
        0.9,
        2
      );

    }

  }

  if (!unidas)
    textoGuia("Mover el cursor para reunir las figuras");

  else
    textoGuia("Colaboración lograda · Clic para dispersar");

}

function mouseMoved() {

  if (unidas) {

    for (let f of figuras) {

      f.vx += (mouseX - f.x) * 0.0006;
      f.vy += (mouseY - f.y) * 0.0006;

    }

    return;

  }

  for (let f of figuras) {

    let d = dist(mouseX, mouseY, f.x, f.y);

    if (d < 140) {

      let fuerza = (140 - d) * 0.003;

      f.vx += (f.x - mouseX) * fuerza;
      f.vy += (f.y - mouseY) * fuerza;

    }

  }

}

function mouseDragged() {
  mouseMoved();
}

function mousePressed() {

  if (!unidas) return;

  unidas = false;

  for (let f of figuras) {

    f.vx = azar(-15, 15);
    f.vy = azar(-15, 15);

  }

}

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

}