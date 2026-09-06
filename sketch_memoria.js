// ===============================
// MEMORIA
// Triángulos + tocar
// ===============================


// ===============================
// PALETA
// ===============================

const BG = [8, 3, 2];

const ROJO = [180, 72, 55];
const NARANJA = [205, 100, 60];

const ALPHA_PUNTO = 150;
const ALPHA_ACTIVO = 210;

const ALPHA_TRIANGULO_ACTIVO = 110;

// Alpha de las memorias que quedan
// permanentemente en el fondo
const ALPHA_REGISTRO = 35;


// ===============================
// SISTEMA
// ===============================

let puntos = [];
let seleccionados = [];

let registros = [];

let esperandoReinicio = false;
let tiempoCompletado = 0;

const CANTIDAD_PUNTOS = 3;

// Tamaño de los pequeños triángulos
const TAM_PUNTO = 46;

const TIEMPO_REGISTRO = 1200;

// Para no acumular infinitas formas
const MAX_REGISTROS = 80;


// ===============================
// SETUP
// ===============================

function setup() {

  pixelDensity(1);

  createCanvas(
    windowWidth,
    windowHeight
  );

  crearNuevaMemoria();
}


// ===============================
// DRAW
// ===============================

function draw() {

  background(
    BG[0],
    BG[1],
    BG[2]
  );


  // --------------------------------
  // MEMORIAS ANTERIORES
  // --------------------------------

  dibujarRegistros();


  // --------------------------------
  // CONEXIONES ACTUALES
  // --------------------------------

  dibujarConexionesActuales();


  // --------------------------------
  // TRIÁNGULO ACTUAL
  // --------------------------------

  dibujarTrianguloActual();


  // --------------------------------
  // PUNTOS / TRIÁNGULOS
  // --------------------------------

  for (let p of puntos) {

    dibujarPunto(p);
  }


  // --------------------------------
  // REINICIO
  // --------------------------------

  if (esperandoReinicio) {

    if (
      millis() - tiempoCompletado >
      TIEMPO_REGISTRO
    ) {

      guardarRegistro();

      crearNuevaMemoria();

      esperandoReinicio = false;
    }
  }
}


// ===============================
// CREAR NUEVA MEMORIA
// ===============================

function crearNuevaMemoria() {

  puntos = [];
  seleccionados = [];

  let margen = 100;

  let intentos = 0;


  while (
    puntos.length < CANTIDAD_PUNTOS &&
    intentos < 500
  ) {

    intentos++;


    let nuevo = {

      x: random(
        margen,
        width - margen
      ),

      y: random(
        margen,
        height - margen
      ),

      seleccionado: false,

      escala: 0,

      // ligera variación visual
      rotacion: random(TWO_PI)
    };


    // Evitar que aparezcan
    // demasiado juntos
    let demasiadoCerca = false;


    for (let p of puntos) {

      if (
        dist(
          nuevo.x,
          nuevo.y,
          p.x,
          p.y
        ) < 170
      ) {

        demasiadoCerca = true;

        break;
      }
    }


    if (!demasiadoCerca) {

      puntos.push(nuevo);
    }
  }
}


// ===============================
// INTERACCIÓN
// ===============================

function interactuar(x, y) {

  if (esperandoReinicio) {
    return;
  }


  for (let p of puntos) {

    if (p.seleccionado) {
      continue;
    }


    let d =
      dist(
        x,
        y,
        p.x,
        p.y
      );


    // Área táctil mayor
    // que el triángulo visible
    if (
      d <
      TAM_PUNTO * 0.8
    ) {

      p.seleccionado = true;

      seleccionados.push(p);


      if (
        seleccionados.length === 3
      ) {

        esperandoReinicio = true;

        tiempoCompletado =
          millis();
      }


      break;
    }
  }
}


// ===============================
// DIBUJAR TRIÁNGULO PEQUEÑO
// ===============================

function dibujarTrianguloPequeno(
  x,
  y,
  tam,
  rotacion,
  col,
  alpha
) {

  push();

  translate(
    x,
    y
  );

  rotate(
    rotacion
  );

  stroke(
  BG[0],
  BG[1],
  BG[2],
  220
);

strokeWeight(3);

fill(
  col[0],
  col[1],
  col[2],
  alpha
);


  let radio =
    tam * 0.58;


  beginShape();


  for (
    let i = 0;
    i < 3;
    i++
  ) {

    let ang =
      -HALF_PI +
      i * TWO_PI / 3;


    vertex(
      cos(ang) * radio,
      sin(ang) * radio
    );
  }


  endShape(CLOSE);

  pop();
}


// ===============================
// DIBUJAR PUNTO
// ===============================

function dibujarPunto(p) {

  p.escala =
    lerp(
      p.escala,
      1,
      0.1
    );


  push();

  translate(
    p.x,
    p.y
  );

  scale(
    p.escala
  );


  let colorActual;

  let alphaActual;


  if (p.seleccionado) {

    colorActual =
      NARANJA;

    alphaActual =
      ALPHA_ACTIVO;

  } else {

    colorActual =
      ROJO;

    alphaActual =
      ALPHA_PUNTO;
  }


  dibujarTrianguloPequeno(
    0,
    0,
    TAM_PUNTO,
    p.rotacion,
    colorActual,
    alphaActual
  );


  pop();
}


// ===============================
// CONEXIONES ACTUALES
// ===============================

function dibujarConexionesActuales() {

  if (
    seleccionados.length < 2
  ) {
    return;
  }


  push();

  noFill();


  stroke(
    NARANJA[0],
    NARANJA[1],
    NARANJA[2],
    115
  );


  strokeWeight(2);


  for (
    let i = 0;
    i <
    seleccionados.length - 1;
    i++
  ) {

    let a =
      seleccionados[i];

    let b =
      seleccionados[i + 1];


    line(
      a.x,
      a.y,
      b.x,
      b.y
    );
  }


  // Cerrar el triángulo
  if (
    seleccionados.length === 3
  ) {

    let primero =
      seleccionados[0];

    let ultimo =
      seleccionados[2];


    line(
      ultimo.x,
      ultimo.y,
      primero.x,
      primero.y
    );
  }


  pop();
}


// ===============================
// TRIÁNGULO ACTUAL RELLENO
// ===============================

function dibujarTrianguloActual() {

  if (
    seleccionados.length !== 3
  ) {
    return;
  }


  push();


  noStroke();


  fill(
    NARANJA[0],
    NARANJA[1],
    NARANJA[2],
    ALPHA_TRIANGULO_ACTIVO
  );


  triangle(

    seleccionados[0].x,
    seleccionados[0].y,

    seleccionados[1].x,
    seleccionados[1].y,

    seleccionados[2].x,
    seleccionados[2].y
  );


  pop();
}


// ===============================
// GUARDAR REGISTRO
// ===============================

function guardarRegistro() {

  if (
    seleccionados.length !== 3
  ) {
    return;
  }


  let colorRegistro =
    random() > 0.5
      ? ROJO
      : NARANJA;


  registros.push({

    puntos: [

      {
        x: seleccionados[0].x,
        y: seleccionados[0].y
      },

      {
        x: seleccionados[1].x,
        y: seleccionados[1].y
      },

      {
        x: seleccionados[2].x,
        y: seleccionados[2].y
      }
    ],

    col:
      colorRegistro
  });


  // Evita que se acumulen
  // infinitamente
  if (
    registros.length >
    MAX_REGISTROS
  ) {

    registros.shift();
  }
}


// ===============================
// DIBUJAR REGISTROS ANTERIORES
// ===============================

function dibujarRegistros() {

  for (let r of registros) {

    push();


    noStroke();


    fill(
      r.col[0],
      r.col[1],
      r.col[2],
      ALPHA_REGISTRO
    );


    triangle(

      r.puntos[0].x,
      r.puntos[0].y,

      r.puntos[1].x,
      r.puntos[1].y,

      r.puntos[2].x,
      r.puntos[2].y
    );


    pop();


    // También dejamos las líneas
    // de esa memoria de manera sutil

    push();

    noFill();

    stroke(
      r.col[0],
      r.col[1],
      r.col[2],
      45
    );

    strokeWeight(1);


    line(
      r.puntos[0].x,
      r.puntos[0].y,
      r.puntos[1].x,
      r.puntos[1].y
    );

    line(
      r.puntos[1].x,
      r.puntos[1].y,
      r.puntos[2].x,
      r.puntos[2].y
    );

    line(
      r.puntos[2].x,
      r.puntos[2].y,
      r.puntos[0].x,
      r.puntos[0].y
    );


    pop();
  }
}


// ===============================
// MOUSE
// ===============================

function mousePressed() {

  interactuar(
    mouseX,
    mouseY
  );
}


// ===============================
// TOUCH
// ===============================

function touchStarted() {

  if (
    touches.length > 0
  ) {

    interactuar(
      touches[0].x,
      touches[0].y
    );
  }


  return false;
}


// ===============================
// RESPONSIVE
// ===============================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );

  crearNuevaMemoria();
}