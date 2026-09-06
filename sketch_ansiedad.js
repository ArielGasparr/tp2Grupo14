
// ============================================
// ANSIEDAD
// Acción: DESLIZAR / SWIPE
// ============================================


// ---------------- COLORES ----------------

const BG = [8, 3, 2];

// ROJO = zona de ansiedad
const ROJO = [210, 58, 48];

// NARANJA = zona normal
const NARANJA = [242, 196, 168];

// Pelota
const ROJO_OSCURO = [105, 32, 28];


// ---------------- GEOMETRÍA ----------------

let centroX;
let centroY;

let ladoExterior;
let ladoMedio;
let ladoInterior;


// ---------------- CÍRCULOS ----------------

let fijo = {
  x: 0,
  y: 0,
  radio: 20
};

let movil = {
  x: 0,
  y: 0,

  vx: 0,
  vy: 0,

  radio: 24
};


// ---------------- SWIPE ----------------

let inicioX = 0;
let inicioY = 0;
let inicioTiempo = 0;

let gestoActivo = false;

const DISTANCIA_MIN = 45;
const TIEMPO_MAX = 450;


// ---------------- MOVIMIENTO NORMAL ----------------

const FUERZA_SWIPE = 0.045;
const FRICCION = 0.965;

const FUERZA_RETORNO = 0.003;


// ---------------- DOBLE SWIPE ----------------

let cantidadSwipes = 0;

let ultimoSwipe = 0;

const VENTANA_DOBLE_SWIPE = 1200;


// ============================================
// ANSIEDAD
// ============================================

// ¿La pelota está actualmente en ansiedad?
let ansiedadActiva = false;

// Momento en que comenzó la ansiedad
let inicioAnsiedad = 0;

// Duración máxima
const DURACION_ANSIEDAD = 3000;

// Intensidad de vibración
let intensidadVibracion = 0;


// ============================================
// SETUP
// ============================================

function setup() {
  
  pixelDensity(1);

  createCanvas(
    windowWidth,
    windowHeight
  );

  rectMode(CENTER);

  recalcularGeometria();

  reiniciarCirculos();
}


// ============================================
// GEOMETRÍA
// ============================================

function recalcularGeometria() {

  centroX = width / 2;
  centroY = height / 2;

  ladoExterior =
    min(width, height) * 0.62;

  ladoMedio =
    ladoExterior * 0.70;

  ladoInterior =
    ladoExterior * 0.43;
}


// ============================================
// POSICIONES INICIALES
// ============================================

function reiniciarCirculos() {

  fijo.x =
    centroX - ladoInterior * 0.18;

  fijo.y =
    centroY;


  movil.x =
    centroX + ladoInterior * 0.18;

  movil.y =
    centroY;


  movil.vx = 0;
  movil.vy = 0;

  cantidadSwipes = 0;

  ansiedadActiva = false;

  intensidadVibracion = 0;
}


// ============================================
// DRAW
// ============================================

function draw() {

  background(
    BG[0],
    BG[1],
    BG[2]
  );


  // Actualizar movimiento
  actualizarMovil();


  // ------------------------------------------
  // VIBRACIÓN
  // ------------------------------------------

  let vibracionX = 0;
  let vibracionY = 0;


  if (ansiedadActiva) {

    vibracionX =
      random(
        -intensidadVibracion,
        intensidadVibracion
      );

    vibracionY =
      random(
        -intensidadVibracion,
        intensidadVibracion
      );
  }


  // ------------------------------------------
  // CUADRADOS
  // ------------------------------------------

  dibujarCuadrados(
    vibracionX,
    vibracionY
  );


  // La línea y los círculos NO vibran
  dibujarConexion();

  dibujarCirculos();
}


// ============================================
// CUADRADOS
// ============================================

function dibujarCuadrados(
  vibracionX,
  vibracionY
) {

  push();


  translate(
    vibracionX,
    vibracionY
  );


  noStroke();


  // ------------------------------------------
  // CUADRADO EXTERIOR
  // ZONA DE ANSIEDAD
  // ------------------------------------------

  fill(
    ROJO[0],
    ROJO[1],
    ROJO[2],
    150
  );

  rect(
    centroX,
    centroY,
    ladoExterior,
    ladoExterior
  );


  // ------------------------------------------
  // CUADRADO MEDIO
  // NORMAL
  // ------------------------------------------

  fill(
    NARANJA[0],
    NARANJA[1],
    NARANJA[2],
    125
  );

  rect(
    centroX,
    centroY,
    ladoMedio,
    ladoMedio
  );


  // ------------------------------------------
  // CUADRADO INTERIOR
  // TAMBIÉN NARANJA
  // ------------------------------------------

  fill(
    NARANJA[0],
    NARANJA[1],
    NARANJA[2],
    80
  );

  rect(
    centroX,
    centroY,
    ladoInterior,
    ladoInterior
  );


  pop();
}


// ============================================
// MOVIMIENTO DE LA PELOTA
// ============================================

function actualizarMovil() {

  // ==========================================
  // SI ESTÁ EN ANSIEDAD
  // ==========================================

  if (ansiedadActiva) {

    actualizarAnsiedad();

    return;
  }


  // ==========================================
  // MOVIMIENTO NORMAL
  // ==========================================

  movil.x += movil.vx;
  movil.y += movil.vy;


  movil.vx *= FRICCION;
  movil.vy *= FRICCION;


  // ------------------------------------------
  // LÍMITES DEL CUADRADO EXTERIOR
  // ------------------------------------------

  let mitad =
    ladoExterior / 2;


  let limiteIzq =
    centroX - mitad + movil.radio;

  let limiteDer =
    centroX + mitad - movil.radio;

  let limiteSup =
    centroY - mitad + movil.radio;

  let limiteInf =
    centroY + mitad - movil.radio;


  if (movil.x < limiteIzq) {

    movil.x = limiteIzq;

    movil.vx *= -0.35;
  }


  if (movil.x > limiteDer) {

    movil.x = limiteDer;

    movil.vx *= -0.35;
  }


  if (movil.y < limiteSup) {

    movil.y = limiteSup;

    movil.vy *= -0.35;
  }


  if (movil.y > limiteInf) {

    movil.y = limiteInf;

    movil.vy *= -0.35;
  }


  // ==========================================
  // COMPROBAR ZONA ROJA
  // ==========================================

  let distanciaX =
    abs(movil.x - centroX);

  let distanciaY =
    abs(movil.y - centroY);

  let mitadExterior =
    ladoExterior / 2;

  let mitadMedio =
    ladoMedio / 2;


  // Está dentro del cuadrado rojo exterior
  // cuando salió del cuadrado naranja medio.

  let estaEnRojo =

    distanciaX >
    mitadMedio - movil.radio * 0.5 ||

    distanciaY >
    mitadMedio - movil.radio * 0.5;


  if (estaEnRojo) {

    iniciarAnsiedad();
  }
}


// ============================================
// INICIAR ANSIEDAD
// ============================================

function iniciarAnsiedad() {

  if (ansiedadActiva) {
    return;
  }


  ansiedadActiva = true;

  inicioAnsiedad = millis();


  // ------------------------------------------
  // DAR IMPULSO CAÓTICO
  // ------------------------------------------

  let velocidadActual =
    sqrt(
      movil.vx * movil.vx +
      movil.vy * movil.vy
    );


  // Si la pelota ya tenía velocidad,
  // conserva parte de ella.
  // Si estaba casi quieta, recibe impulso.

  if (velocidadActual < 2) {

    let angulo =
      random(TWO_PI);

    let fuerza =
      random(5, 9);

    movil.vx =
      cos(angulo) * fuerza;

    movil.vy =
      sin(angulo) * fuerza;

  } else {

    movil.vx *= 1.5;
    movil.vy *= 1.5;
  }


  // Vibración inicial fuerte
  intensidadVibracion = 8;
}


// ============================================
// MOVIMIENTO DURANTE ANSIEDAD
// ============================================

function actualizarAnsiedad() {

  let tiempoAnsiedad =
    millis() - inicioAnsiedad;


  // ==========================================
  // PRIMEROS 3 SEGUNDOS
  // ==========================================

  if (
    tiempoAnsiedad <
    DURACION_ANSIEDAD
  ) {

    // Movimiento
    movil.x += movil.vx;
    movil.y += movil.vy;


    // ----------------------------------------
    // PÉRDIDA DE VELOCIDAD
    // ----------------------------------------

    movil.vx *= 0.985;
    movil.vy *= 0.985;


    // ----------------------------------------
    // PEQUEÑAS VARIACIONES CAÓTICAS
    // ----------------------------------------

    movil.vx += random(-0.12, 0.12);
    movil.vy += random(-0.12, 0.12);


    // ----------------------------------------
    // LÍMITES
    // ----------------------------------------

    let mitad =
      ladoExterior / 2;


    let limiteIzq =
      centroX - mitad + movil.radio;

    let limiteDer =
      centroX + mitad - movil.radio;

    let limiteSup =
      centroY - mitad + movil.radio;

    let limiteInf =
      centroY + mitad - movil.radio;


    // Rebote izquierdo
    if (movil.x <= limiteIzq) {

      movil.x = limiteIzq;

      movil.vx =
        abs(movil.vx) * 0.82;
    }


    // Rebote derecho
    if (movil.x >= limiteDer) {

      movil.x = limiteDer;

      movil.vx =
        -abs(movil.vx) * 0.82;
    }


    // Rebote superior
    if (movil.y <= limiteSup) {

      movil.y = limiteSup;

      movil.vy =
        abs(movil.vy) * 0.82;
    }


    // Rebote inferior
    if (movil.y >= limiteInf) {

      movil.y = limiteInf;

      movil.vy =
        -abs(movil.vy) * 0.82;
    }


    // ----------------------------------------
    // VIBRACIÓN
    // ----------------------------------------

    let progreso =
      tiempoAnsiedad /
      DURACION_ANSIEDAD;


    // La vibración también disminuye
    intensidadVibracion =
      lerp(
        8,
        1.5,
        progreso
      );


    return;
  }


  // ==========================================
  // TERMINÓ LA ANSIEDAD
  // ==========================================

  volverAlCentro();
}


// ============================================
// VOLVER AL CENTRO
// ============================================

function volverAlCentro() {

  // ------------------------------------------
  // DESACTIVAR VELOCIDAD
  // ------------------------------------------

  movil.vx *= 0.90;
  movil.vy *= 0.90;


  // ------------------------------------------
  // VOLVER GRADUALMENTE
  // ------------------------------------------

  movil.x =
    lerp(
      movil.x,
      centroX,
      0.025
    );

  movil.y =
    lerp(
      movil.y,
      centroY,
      0.025
    );


  // ------------------------------------------
  // VIBRACIÓN DESAPARECE
  // ------------------------------------------

  intensidadVibracion =
    lerp(
      intensidadVibracion,
      0,
      0.08
    );


  // ------------------------------------------
  // CUANDO LLEGÓ AL CENTRO
  // ------------------------------------------

  let distanciaCentro =
    dist(
      movil.x,
      movil.y,
      centroX,
      centroY
    );


  if (
    distanciaCentro < 8
  ) {

    movil.x = centroX;
    movil.y = centroY;

    movil.vx = 0;
    movil.vy = 0;

    ansiedadActiva = false;

    intensidadVibracion = 0;

    cantidadSwipes = 0;
  }
}


// ============================================
// LÍNEA
// ============================================

function dibujarConexion() {

  let d =
    dist(
      fijo.x,
      fijo.y,
      movil.x,
      movil.y
    );


  let alpha =
    map(
      d,
      0,
      ladoExterior,
      75,
      190,
      true
    );


  push();


  stroke(
    NARANJA[0],
    NARANJA[1],
    NARANJA[2],
    alpha
  );


  strokeWeight(2.5);


  line(
    fijo.x,
    fijo.y,
    movil.x,
    movil.y
  );


  pop();
}


// ============================================
// CÍRCULOS
// ============================================

function dibujarCirculos() {

  // ------------------------------------------
  // CÍRCULO FIJO
  // ------------------------------------------

  push();

  noStroke();

  fill(
    NARANJA[0],
    NARANJA[1],
    NARANJA[2],
    215
  );

  circle(
    fijo.x,
    fijo.y,
    fijo.radio * 2
  );

  pop();


  // ------------------------------------------
  // CÍRCULO MÓVIL
  // ------------------------------------------

  push();

  noStroke();

  fill(
    ROJO_OSCURO[0],
    ROJO_OSCURO[1],
    ROJO_OSCURO[2],
    235
  );

  circle(
    movil.x,
    movil.y,
    movil.radio * 2
  );

  pop();
}


// ============================================
// INICIAR GESTO
// ============================================

function iniciarGesto(
  x,
  y
) {

  inicioX = x;
  inicioY = y;

  inicioTiempo =
    millis();

  gestoActivo =
    true;
}


// ============================================
// TERMINAR GESTO
// ============================================

function terminarGesto(
  x,
  y
) {

  if (!gestoActivo) {
    return;
  }


  // Mientras está en ansiedad,
  // el swipe no controla la pelota.
  if (ansiedadActiva) {

    gestoActivo = false;

    return;
  }


  let dx =
    x - inicioX;

  let dy =
    y - inicioY;


  let distancia =
    dist(
      inicioX,
      inicioY,
      x,
      y
    );


  let tiempo =
    millis() -
    inicioTiempo;


  if (
    distancia > DISTANCIA_MIN &&
    tiempo < TIEMPO_MAX
  ) {


    // ----------------------------------------
    // CONTABILIZAR SWIPE
    // ----------------------------------------

    if (
      millis() - ultimoSwipe <
      VENTANA_DOBLE_SWIPE
    ) {

      cantidadSwipes++;

    } else {

      cantidadSwipes = 1;
    }


    cantidadSwipes =
      min(
        cantidadSwipes,
        2
      );


    ultimoSwipe =
      millis();


    // ----------------------------------------
    // IMPULSO
    // ----------------------------------------

    movil.vx +=
      dx *
      FUERZA_SWIPE;

    movil.vy +=
      dy *
      FUERZA_SWIPE;
  }


  gestoActivo =
    false;
}


// ============================================
// MOUSE
// ============================================

function mousePressed() {

  iniciarGesto(
    mouseX,
    mouseY
  );
}


function mouseReleased() {

  terminarGesto(
    mouseX,
    mouseY
  );
}


// ============================================
// TOUCH
// ============================================

function touchStarted() {

  if (
    touches.length > 0
  ) {

    iniciarGesto(
      touches[0].x,
      touches[0].y
    );
  }

  return false;
}


function touchMoved() {

  return false;
}


function touchEnded() {

  terminarGesto(
    mouseX,
    mouseY
  );

  return false;
}


// ============================================
// RESPONSIVE
// ============================================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );

  recalcularGeometria();

  reiniciarCirculos();
}