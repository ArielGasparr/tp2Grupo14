// ===================================================
// EMPATÍA
// Círculos + arrastrar
// Un círculo sigue el recorrido del otro con retraso
// ===================================================


// ---------------- COLORES ----------------

const BG = [8, 3, 2];

const ROJO = [215, 60, 48];

const ROSA_OSCURO = [232, 131, 90];

const ROSA_CLARO = [242, 196, 168];


// ---------------- SISTEMA ----------------

let historial = [];

let fx;
let fy;


// Cuánto atraso tiene el seguidor
const delayFrame = 90;


// Radio de los círculos
const RADIO_CIRCULO = 26;

const RADIO_CENTRO = 8;


// Máximo historial
const MAX_HISTORIAL = 600;


// ===================================================
// FUNCIONES VISUALES
// ===================================================

function dibujarCirc(
  x,
  y,
  r,
  colBorde,
  colRelleno,
  a = 1
) {

  push();


  if (colBorde) {

    stroke(
      colBorde[0],
      colBorde[1],
      colBorde[2],
      a * 255
    );

  } else {

    noStroke();
  }


  if (colRelleno) {

    fill(
      colRelleno[0],
      colRelleno[1],
      colRelleno[2],
      a * 255
    );

  } else {

    noFill();
  }


  ellipse(
    x,
    y,
    r * 2,
    r * 2
  );


  pop();
}


// ---------------------------------------------------
// LÍNEA
// ---------------------------------------------------

function dibujarLinea(
  x1,
  y1,
  x2,
  y2,
  col,
  a = 1,
  w = 1
) {

  push();


  stroke(
    col[0],
    col[1],
    col[2],
    a * 255
  );


  strokeWeight(w);


  line(
    x1,
    y1,
    x2,
    y2
  );


  pop();
}


// ===================================================
// SETUP
// ===================================================

function setup() {

pixelDensity(1);

  createCanvas(
    windowWidth,
    windowHeight
  );


  // Seguidor comienza desplazado
  fx =
    width / 2 + 110;

  fy =
    height / 2;
}


// ===================================================
// DRAW
// ===================================================

function draw() {

  background(
    BG[0],
    BG[1],
    BG[2]
  );


  // ------------------------------------------------
  // POSICIÓN DEL SEGUIDOR
  // ------------------------------------------------

  let indice =
    max(
      0,
      historial.length - delayFrame
    );


  if (
    historial[indice]
  ) {

    fx =
      lerp(
        fx,
        historial[indice].x,
        0.08
      );


    fy =
      lerp(
        fy,
        historial[indice].y,
        0.08
      );
  }


  // ------------------------------------------------
  // POSICIÓN DEL CÍRCULO PRINCIPAL
  // ------------------------------------------------

  let ultimo =
    historial[
      historial.length - 1
    ];


  let lx =
    width / 2;

  let ly =
    height / 2;


  if (ultimo) {

    lx =
      ultimo.x;

    ly =
      ultimo.y;
  }


  // =================================================
  // RASTRO DEL CÍRCULO PRINCIPAL
  // =================================================

  let inicio =
    max(
      0,
      historial.length - 60
    );


  for (
    let i = inicio;
    i < historial.length - 1;
    i++
  ) {

    let alpha =
      ((i - inicio) / 60) *
      0.38;


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


  // =================================================
  // RASTRO DEL SEGUIDOR
  // =================================================

  let inicio2 =
    max(
      0,
      historial.length -
      delayFrame -
      60
    );


  let fin2 =
    max(
      0,
      historial.length -
      delayFrame
    );


  for (
    let i = inicio2;
    i < fin2 - 1;
    i++
  ) {

    let alpha =
      ((i - inicio2) / 60) *
      0.30;


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


  // =================================================
  // UNIÓN ENTRE LOS DOS
  // =================================================

  if (ultimo) {

    dibujarLinea(

      lx,
      ly,

      fx,
      fy,

      ROSA_CLARO,

      0.72,

      5
    );


    let d =
      dist(
        lx,
        ly,
        fx,
        fy
      );


    // Cuando se acercan,
    // aparece una zona de unión
    if (
      d < 100
    ) {

      dibujarCirc(

        (lx + fx) / 2,
        (ly + fy) / 2,

        d * 0.38,

        null,

        ROSA_CLARO,

        (1 - d / 100) *
        0.38
      );
    }
  }


  // =================================================
  // CÍRCULO PRINCIPAL
  // =================================================

  dibujarCirc(

    lx,
    ly,

    RADIO_CIRCULO,

    null,

    ROJO,

    0.94
  );


  dibujarCirc(

    lx,
    ly,

    RADIO_CENTRO,

    null,

    ROSA_CLARO,

    0.65
  );


  // =================================================
  // CÍRCULO SEGUIDOR
  // =================================================

  dibujarCirc(

    fx,
    fy,

    RADIO_CIRCULO,

    null,

    ROSA_OSCURO,

    0.84
  );


  dibujarCirc(

    fx,
    fy,

    RADIO_CENTRO,

    null,

    ROSA_CLARO,

    0.50
  );
}


// ===================================================
// GUARDAR MOVIMIENTO
// ===================================================

function guardarPosicion(x, y) {

  historial.push({

    x: x,
    y: y
  });


  if (
    historial.length >
    MAX_HISTORIAL
  ) {

    historial.shift();
  }
}


// ===================================================
// MOUSE
// ===================================================

function mouseMoved() {

  guardarPosicion(
    mouseX,
    mouseY
  );
}


function mouseDragged() {

  guardarPosicion(
    mouseX,
    mouseY
  );
}


// ===================================================
// TOUCH
// ===================================================

function touchStarted() {

  if (
    touches.length > 0
  ) {

    guardarPosicion(

      touches[0].x,
      touches[0].y
    );
  }


  return false;
}


function touchMoved() {

  if (
    touches.length > 0
  ) {

    guardarPosicion(

      touches[0].x,
      touches[0].y
    );
  }


  // Evita que el navegador
  // haga scroll mientras arrastrás
  return false;
}


function touchEnded() {

  return false;
}


// ===================================================
// RESPONSIVE
// ===================================================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );
}