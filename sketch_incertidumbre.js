// ===================================================
// INCERTIDUMBRE
// Cuadrados + deslizar
// ===================================================


// ---------------- VARIABLES ----------------

let ranuras = [];

let estadoGiro = false;
let tiempoInicioGiro = 0;

let idRanuraArrastrada = -1;

let mouseYInicial = 0;


// ---------------- COLORES ----------------

let colorFondo;
let colorContenedor;

let coloresFiguras = [];

let tiposFiguras = [
  'cuadrado',
  'circulo'
];


// ===================================================
// SETUP
// ===================================================

function setup() {

  pixelDensity(1);

  createCanvas(
    windowWidth,
    windowHeight
  );

  rectMode(CENTER);


  colorFondo =
    color('#080302');


  // Cuadrados grandes rojos
  colorContenedor =
    color(255, 72, 55, 170);


  coloresFiguras = [

    color(
      222,
      112,
      68,
      210
    ),

    color(
      242,
      196,
      168,
      200
    )
  ];


  crearRanuras();
}


// ===================================================
// CREAR RANURAS
// ===================================================

function crearRanuras() {

  ranuras = [];


  for (
    let i = 0;
    i < 3;
    i++
  ) {

    ranuras.push({

      x:
        width / 2 +
        (i - 1) * 160,

      yCentral:
        height / 2,

      tipo:
        random(
          tiposFiguras
        ),

      color:
        random(
          coloresFiguras
        ),

      dragOffset:
        0
    });
  }


  evitarGanador();
}


// ===================================================
// DRAW
// ===================================================

function draw() {

  background(
    colorFondo
  );


  // -----------------------------------------------
  // TERMINAR GIRO
  // -----------------------------------------------

  let tiempoActual =
    millis();


  if (
    estadoGiro &&
    tiempoActual >
    tiempoInicioGiro + 3000
  ) {

    estadoGiro =
      false;


    // Garantizamos que nunca quede
    // una combinación ganadora
    evitarGanador();
  }


  // -----------------------------------------------
  // FLOTACIÓN
  // -----------------------------------------------

  let offsetFlote =
    0;


  if (
    !estadoGiro &&
    idRanuraArrastrada === -1
  ) {

    offsetFlote =
      sin(
        frameCount * 0.05
      ) * 8;
  }


  // -----------------------------------------------
  // DIBUJAR RANURAS
  // -----------------------------------------------

  for (
    let i = 0;
    i < 3;
    i++
  ) {

    let r =
      ranuras[i];


    let yActual =
      r.yCentral;


    if (
      idRanuraArrastrada === i &&
      !estadoGiro
    ) {

      yActual +=
        r.dragOffset;

    } else if (
      !estadoGiro
    ) {

      yActual +=
        offsetFlote;
    }


    // ---------------------------------------------
    // SNAP BACK
    // ---------------------------------------------

    if (
      idRanuraArrastrada !== i &&
      !estadoGiro &&
      abs(r.dragOffset) > 0.5
    ) {

      r.dragOffset =
        lerp(
          r.dragOffset,
          0,
          0.15
        );

    } else if (
      estadoGiro
    ) {

      r.dragOffset =
        0;
    }


    drawSlotGroup(

      r,
      yActual,
      i,
      estadoGiro,
      tiempoInicioGiro
    );
  }
}


// ===================================================
// DIBUJAR BLOQUE
// ===================================================

function drawSlotGroup(
  r,
  drawY,
  index,
  isSpinning,
  startTime
) {

  if (
    isSpinning
  ) {

    let tiempoActual =
      millis();


    let tiempoParaDetener =
      startTime +
      1000 *
      (index + 1);


    if (
      tiempoActual <
      tiempoParaDetener
    ) {

      if (
        frameCount % 4 === 0
      ) {

        r.tipo =
          random(
            tiposFiguras
          );

        r.color =
          random(
            coloresFiguras
          );
      }


      // Vibración
      drawY +=
        random(
          -15,
          15
        );
    }
  }


  // -----------------------------------------------
  // CUADRADO GRANDE
  // -----------------------------------------------

  noStroke();


  fill(
    colorContenedor
  );


  rect(
    r.x,
    drawY,
    130,
    130
  );


  // -----------------------------------------------
  // FIGURA INTERIOR
  // -----------------------------------------------

  fill(
    r.color
  );


  if (
    r.tipo ===
    'cuadrado'
  ) {

    rect(
      r.x,
      drawY,
      80,
      80
    );

  } else {

    circle(
      r.x,
      drawY,
      85
    );
  }
}


// ===================================================
// EVITAR GANADOR
// ===================================================

function evitarGanador() {

  if (ranuras.length < 3) {
    return;
  }

  let mismoTipo =
    ranuras[0].tipo === ranuras[1].tipo &&
    ranuras[1].tipo === ranuras[2].tipo;

  // Si las 3 figuras son iguales,
  // cambiamos obligatoriamente la última
  if (mismoTipo) {

    if (ranuras[2].tipo === 'circulo') {
      ranuras[2].tipo = 'cuadrado';
    } else {
      ranuras[2].tipo = 'circulo';
    }

  }
}


// ===================================================
// INICIAR DESLIZAMIENTO
// ===================================================

function iniciarDeslizamiento(
  x,
  y
) {

  if (
    estadoGiro
  ) {
    return;
  }


  for (
    let i = 0;
    i < 3;
    i++
  ) {

    let r =
      ranuras[i];


    if (

      x >
      r.x - 65 &&

      x <
      r.x + 65 &&

      y >
      r.yCentral - 65 &&

      y <
      r.yCentral + 65

    ) {

      idRanuraArrastrada =
        i;


      mouseYInicial =
        y;


      r.dragOffset =
        0;


      break;
    }
  }
}


// ===================================================
// MOVER DESLIZAMIENTO
// ===================================================

function moverDeslizamiento(
  x,
  y
) {

  if (
    idRanuraArrastrada === -1 ||
    estadoGiro
  ) {

    return;
  }


  let r =
    ranuras[
      idRanuraArrastrada
    ];


  r.dragOffset =
    y -
    mouseYInicial;


  // -----------------------------------------------
  // UMBRAL DEL DESLIZAMIENTO
  // -----------------------------------------------

  if (
    abs(
      r.dragOffset
    ) > 120
  ) {

    estadoGiro =
      true;


    idRanuraArrastrada =
      -1;


    tiempoInicioGiro =
      millis();
  }
}


// ===================================================
// TERMINAR
// ===================================================

function terminarDeslizamiento() {

  idRanuraArrastrada =
    -1;
}


// ===================================================
// MOUSE
// ===================================================

function mousePressed() {

  iniciarDeslizamiento(
    mouseX,
    mouseY
  );
}


function mouseDragged() {

  moverDeslizamiento(
    mouseX,
    mouseY
  );
}


function mouseReleased() {

  terminarDeslizamiento();
}


// ===================================================
// TOUCH
// ===================================================

function touchStarted() {

  if (
    touches.length > 0
  ) {

    iniciarDeslizamiento(

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

    moverDeslizamiento(

      touches[0].x,
      touches[0].y
    );
  }


  return false;
}


function touchEnded() {

  terminarDeslizamiento();

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


  for (
    let i = 0;
    i < 3;
    i++
  ) {

    ranuras[i].x =

      width / 2 +
      (i - 1) * 160;


    ranuras[i].yCentral =
      height / 2;
  }
}