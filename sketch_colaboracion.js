// ===============================
// PALETA
// ===============================

const BG = [8, 3, 2];

const ROJO = [215, 60, 48];
const NARANJA = [232, 131, 90];

const ALPHA_FORMA = 160;


// ===============================
// SISTEMA
// ===============================

let jugador;
let objetivos = [];

let arrastrando = false;

let offsetX = 0;
let offsetY = 0;

let esperandoNuevos = false;
let tiempoUltimaUnion = 0;


// ===============================
// CONFIGURACIÓN
// ===============================

const CANTIDAD_INICIAL = 4;

const TAM_JUGADOR = 60;
const TAM_OBJETIVO = 48;

const TIEMPO_NUEVOS = 1800;

let usuarioInteractuo = false;

const TIEMPO_DEMO = 1200;
const VELOCIDAD_DEMO = 0.8;

let tiempoInicio;
// ===============================
// SETUP
// ===============================

function setup() {
  tiempoInicio = millis();

  pixelDensity(1);

  createCanvas(
    windowWidth,
    windowHeight
  );

  jugador = {
    x: width / 2,
    y: height / 2,

    tamano: TAM_JUGADOR,
    tamanoObjetivo: TAM_JUGADOR
  };

  crearObjetivosIniciales();
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


  // -------------------------------
  // CRECIMIENTO SUAVE
  // -------------------------------

  jugador.tamano =
    lerp(
      jugador.tamano,
      jugador.tamanoObjetivo,
      0.08
    );

dibujarConexiones();

for (let o of objetivos) {
  dibujarObjetivo(o);
}

  // -------------------------------
  // DIBUJAR OBJETIVOS
  // -------------------------------

  for (let o of objetivos) {

    dibujarObjetivo(o);
  }


  // -------------------------------
  // COMPROBAR SI COME
  // -------------------------------
  movimientoAutomatico();
  comprobarComidas();


  // -------------------------------
  // CREAR NUEVOS
  // -------------------------------

  if (esperandoNuevos) {

    if (
      millis() - tiempoUltimaUnion >
      TIEMPO_NUEVOS
    ) {

      crearDosNuevos();

      esperandoNuevos = false;
    }
  }


  // -------------------------------
  // DIBUJAR JUGADOR
  // -------------------------------

  dibujarJugador();
}


// ===============================
// OBJETIVOS INICIALES
// ===============================

function crearObjetivosIniciales() {

  objetivos = [];

  for (
    let i = 0;
    i < CANTIDAD_INICIAL;
    i++
  ) {

    crearObjetivo();
  }
}


// ===============================
// CREAR OBJETIVO
// ===============================

function crearObjetivo() {

  let margen = 70;

  let x;
  let y;

  let intentos = 0;


  do {

    x =
      random(
        margen,
        width - margen
      );

    y =
      random(
        margen,
        height - margen
      );

    intentos++;

  } while (

    dist(
      x,
      y,
      jugador.x,
      jugador.y
    ) < 180 &&

    intentos < 100
  );


  objetivos.push({

    x: x,
    y: y,

    tamano:
      random(
        38,
        55
      ),

    escala: 0
  });
}


// ===============================
// CREAR DOS NUEVOS
// ===============================

function crearDosNuevos() {

  crearObjetivo();
  crearObjetivo();
}


// ===============================
// COMPROBAR COMIDAS
// ===============================

function comprobarComidas() {

  for (
    let i = objetivos.length - 1;
    i >= 0;
    i--
  ) {

    let o =
      objetivos[i];


    let d =
      dist(
        jugador.x,
        jugador.y,
        o.x,
        o.y
      );


    let limite =
      jugador.tamano / 2 +
      o.tamano / 2;


    if (
      d < limite
    ) {

      objetivos.splice(
        i,
        1
      );


      // Crece un poco cada vez
      let crecimiento =
        map(
          jugador.tamanoObjetivo,
          60,
          180,
          12,
          4,
          true
        );


      jugador.tamanoObjetivo +=
        crecimiento;
    }
  }


  // Si ya no quedan círculos
  if (
    objetivos.length === 0 &&
    !esperandoNuevos
  ) {

    esperandoNuevos = true;

    tiempoUltimaUnion =
      millis();
  }
}


// ===============================
// DIBUJAR OBJETIVO
// ===============================

function dibujarObjetivo(o) {

  o.escala =
    lerp(
      o.escala,
      1,
      0.08
    );


  push();

  translate(
    o.x,
    o.y
  );

  scale(
    o.escala
  );


  noStroke();


  // OBJETIVOS NARANJAS
  fill(
    NARANJA[0],
    NARANJA[1],
    NARANJA[2],
    145
  );


  circle(
    0,
    0,
    o.tamano
  );


  pop();
}


// ===============================
// DIBUJAR JUGADOR
// ===============================

function dibujarJugador() {

  push();

  noStroke();


  // CÍRCULO PRINCIPAL ROJO
  fill(
    ROJO[0],
    ROJO[1],
    ROJO[2],
    200
  );


  circle(
    jugador.x,
    jugador.y,
    jugador.tamano
  );


  pop();
}


// ===============================
// INTERACCIÓN
// ===============================

function iniciarArrastre(
  x,
  y
) {
  usuarioInteractuo = true;
  let d =
    dist(
      x,
      y,
      jugador.x,
      jugador.y
    );


  if (
    d <
    jugador.tamano / 2 + 15
  ) {

    arrastrando =
      true;


    offsetX =
      jugador.x - x;

    offsetY =
      jugador.y - y;
  }
}


function moverArrastre(
  x,
  y
) {

  if (
    !arrastrando
  ) {
    return;
  }


  jugador.x =
    x + offsetX;

  jugador.y =
    y + offsetY;


  // Mantener dentro de pantalla

  jugador.x =
    constrain(
      jugador.x,
      jugador.tamano / 2,
      width - jugador.tamano / 2
    );


  jugador.y =
    constrain(
      jugador.y,
      jugador.tamano / 2,
      height - jugador.tamano / 2
    );
}


function terminarArrastre() {

  arrastrando =
    false;
}


// ===============================
// MOUSE
// ===============================

function mousePressed() {

  iniciarArrastre(
    mouseX,
    mouseY
  );
}


function mouseDragged() {

  moverArrastre(
    mouseX,
    mouseY
  );
}


function mouseReleased() {

  terminarArrastre();
}


// ===============================
// TOUCH
// ===============================

function touchStarted() {

  if (
    touches.length > 0
  ) {

    iniciarArrastre(
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

    moverArrastre(
      touches[0].x,
      touches[0].y
    );
  }

  return false;
}


function touchEnded() {

  terminarArrastre();

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
}
function dibujarConexiones() {

  push();

  strokeWeight(4);

  for (let o of objetivos) {

    let d =
      dist(
        jugador.x,
        jugador.y,
        o.x,
        o.y
      );


    // Cuanto más cerca está,
    // más visible se vuelve la línea
    let alpha =
      map(
        d,
        0,
        500,
        300,
        150,
        true
      );


    stroke(
      NARANJA[0],
      NARANJA[1],
      NARANJA[2],
      alpha
    );


    line(
      jugador.x,
      jugador.y,
      o.x,
      o.y
    );
  }

  pop();
}
function movimientoAutomatico() {

  // Si el usuario ya interactuó,
  // no hacemos nada automático
  if (usuarioInteractuo) {
    return;
  }


  // Esperamos un poco al inicio
  if (
    millis() - tiempoInicio <
    TIEMPO_DEMO
  ) {
    return;
  }


  // Si no hay objetivos,
  // no hay hacia dónde ir
  if (objetivos.length === 0) {
    return;
  }


  // Elegimos el primer objetivo
  let objetivo =
    objetivos[0];


  let dx =
    objetivo.x -
    jugador.x;

  let dy =
    objetivo.y -
    jugador.y;


  let distancia =
    dist(
      jugador.x,
      jugador.y,
      objetivo.x,
      objetivo.y
    );


  if (distancia > 1) {

    let direccionX =
      dx / distancia;

    let direccionY =
      dy / distancia;


    jugador.x +=
      direccionX *
      VELOCIDAD_DEMO;

    jugador.y +=
      direccionY *
      VELOCIDAD_DEMO;
  }
}