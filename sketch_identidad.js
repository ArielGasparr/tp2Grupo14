// ===================================================
// IDENTIDAD
// Círculo + arrastrar
//
// ETAPA 1:
// - completar 5 círculos
// - cada círculo completo queda en pantalla
//   con menos alpha
//
// ETAPA 2:
// - aparece un sexto círculo
// - los 5 anteriores se achican
// - el sexto debe atraparlos
// ===================================================


// ===================================================
// PALETA
// ===================================================

const FONDO = [8, 3, 2];

const ROJO = [180, 72, 55];

const NARANJA = [205, 100, 60];


// ===================================================
// CÍRCULO PRINCIPAL
// ===================================================

let centroX;
let centroY;

const RADIO_CIRCULO = 145;

let arrastrando = false;

let offsetX = 0;
let offsetY = 0;


// Alpha del círculo actual

let alphaCirculo = 75;

const ALPHA_MAX = 220;

const AUMENTO_ALPHA = 28;


// ===================================================
// PIEZAS CHICAS
// ===================================================

const CANTIDAD_PIEZAS = 5;

const RADIO_PIEZA = 27;

let piezas = [];


// ===================================================
// HUECOS
// ===================================================

let huecos = [];


// ===================================================
// CÍRCULOS COMPLETADOS
// ===================================================

let circulosCompletados = [];

const MAX_IDENTIDADES = 5;

const ALPHA_RECUERDO = 45;

const RADIO_FINAL_CHICO = 38;


// ===================================================
// ESTADO GENERAL
// ===================================================

let etapa = 1;


// control de finalización
let completado = false;

let tiempoCompletado = 0;

const ESPERA_REINICIO = 1200;


// etapa final

let sextoActivo = false;

let finalTerminado = false;


// ===================================================
// SETUP
// ===================================================

function setup() {

  pixelDensity(1);

  createCanvas(
    windowWidth,
    windowHeight
  );


  centroX =
    width / 2;

  centroY =
    height / 2;


  crearHuecos();

  crearPiezas();
}


// ===================================================
// DRAW
// ===================================================

function draw() {

  background(
    FONDO[0],
    FONDO[1],
    FONDO[2]
  );


  // =================================================
  // ETAPA 1
  // =================================================

  if (
    etapa === 1
  ) {

    dibujarCirculosCompletados();

    actualizarPiezas();

    dibujarPiezasSueltas();

    dibujarCirculoPrincipal();

    comprobarCapturas();

    comprobarCompletado();
  }


  // =================================================
  // ETAPA 2
  // =================================================

  else if (
    etapa === 2
  ) {

    actualizarCirculosFinales();

    dibujarCirculosFinales();

    dibujarSextoCirculo();

    comprobarCapturaFinal();

    comprobarFinal();
  }
}


// ===================================================
// CREAR HUECOS
// ===================================================

function crearHuecos() {

  huecos = [

    {
      x: -52,
      y: -42,
      ocupado: false
    },

    {
      x: 38,
      y: -58,
      ocupado: false
    },

    {
      x: 62,
      y: 18,
      ocupado: false
    },

    {
      x: -30,
      y: 56,
      ocupado: false
    },

    {
      x: -70,
      y: 15,
      ocupado: false
    }
  ];
}


// ===================================================
// CREAR PIEZAS
// ===================================================

function crearPiezas() {

  piezas = [];


  for (
    let i = 0;
    i < CANTIDAD_PIEZAS;
    i++
  ) {

    let x;
    let y;

    let intentos = 0;


    do {

      x =
        random(
          60,
          width - 60
        );


      y =
        random(
          60,
          height - 60
        );


      intentos++;

    } while (

      dist(
        x,
        y,
        centroX,
        centroY
      ) <
      RADIO_CIRCULO + 120

      &&

      intentos < 200
    );


    piezas.push({

      x: x,

      y: y,

      estado:
        "suelta",

      huecoObjetivo:
        null,

      alphaIntegrado:
        0
    });
  }
}


// ===================================================
// ACTUALIZAR PIEZAS
// ===================================================

function actualizarPiezas() {

  for (
    let pieza of piezas
  ) {

    if (
      pieza.estado !==
      "viajando"
    ) {

      continue;
    }


    let h =
      pieza.huecoObjetivo;


    let destinoX =
      centroX +
      h.x;


    let destinoY =
      centroY +
      h.y;


    pieza.x =
      lerp(
        pieza.x,
        destinoX,
        0.11
      );


    pieza.y =
      lerp(
        pieza.y,
        destinoY,
        0.11
      );


    let d =
      dist(
        pieza.x,
        pieza.y,
        destinoX,
        destinoY
      );


    if (
      d < 3
    ) {

      pieza.estado =
        "integrada";


      pieza.x =
        destinoX;


      pieza.y =
        destinoY;
    }
  }
}


// ===================================================
// COMPROBAR CAPTURAS
// ===================================================

function comprobarCapturas() {

  if (
    completado
  ) {

    return;
  }


  for (
    let pieza of piezas
  ) {

    if (
      pieza.estado !==
      "suelta"
    ) {

      continue;
    }


    let d =
      dist(
        pieza.x,
        pieza.y,
        centroX,
        centroY
      );


    if (
      d <
      RADIO_CIRCULO +
      RADIO_PIEZA
    ) {

      capturarPieza(
        pieza
      );
    }
  }
}


// ===================================================
// CAPTURAR PIEZA
// ===================================================

function capturarPieza(
  pieza
) {

  let huecosLibres =
    huecos.filter(
      h =>
        !h.ocupado
    );


  if (
    huecosLibres.length ===
    0
  ) {

    return;
  }


  let mejorHueco =
    null;

  let mejorDistancia =
    Infinity;


  for (
    let h of huecosLibres
  ) {

    let hx =
      centroX +
      h.x;


    let hy =
      centroY +
      h.y;


    let d =
      dist(
        pieza.x,
        pieza.y,
        hx,
        hy
      );


    if (
      d <
      mejorDistancia
    ) {

      mejorDistancia =
        d;

      mejorHueco =
        h;
    }
  }


  if (
    mejorHueco === null
  ) {

    return;
  }


  // Guarda el alpha actual
  // del círculo grande

  pieza.alphaIntegrado =
    alphaCirculo;


  mejorHueco.ocupado =
    true;


  pieza.huecoObjetivo =
    mejorHueco;


  pieza.estado =
    "viajando";


  // El círculo se vuelve
  // progresivamente más visible

  alphaCirculo +=
    AUMENTO_ALPHA;


  alphaCirculo =
    min(
      alphaCirculo,
      ALPHA_MAX
    );
}


// ===================================================
// DIBUJAR CÍRCULO PRINCIPAL
// ===================================================

function dibujarCirculoPrincipal() {

  push();


  // cuerpo principal

  noStroke();


  fill(
    ROJO[0],
    ROJO[1],
    ROJO[2],
    alphaCirculo
  );


  circle(
    centroX,
    centroY,
    RADIO_CIRCULO * 2
  );


  // =================================================
  // HUECOS
  // =================================================

  for (
    let h of huecos
  ) {

    if (
      h.ocupado
    ) {

      continue;
    }


    let x =
      centroX +
      h.x;


    let y =
      centroY +
      h.y;


    noStroke();


    fill(
      FONDO[0],
      FONDO[1],
      FONDO[2],
      255
    );


    circle(
      x,
      y,
      RADIO_PIEZA * 2
    );


    noFill();


    stroke(
      NARANJA[0],
      NARANJA[1],
      NARANJA[2],
      70
    );


    strokeWeight(2);


    circle(
      x,
      y,
      RADIO_PIEZA * 2
    );
  }


  // =================================================
  // PIEZAS INTEGRADAS
  // =================================================

  for (
    let pieza of piezas
  ) {

    if (
      pieza.estado !==
      "integrada"
    ) {

      continue;
    }


    let h =
      pieza.huecoObjetivo;


    let x =
      centroX +
      h.x;


    let y =
      centroY +
      h.y;


    noStroke();


    fill(
      ROJO[0],
      ROJO[1],
      ROJO[2],
      pieza.alphaIntegrado
    );


    circle(
      x,
      y,
      RADIO_PIEZA * 2
    );
  }


  pop();
}


// ===================================================
// PIEZAS EXTERNAS
// ===================================================

function dibujarPiezasSueltas() {

  for (
    let pieza of piezas
  ) {

    if (
      pieza.estado ===
      "integrada"
    ) {

      continue;
    }


    push();


    noStroke();


    fill(
      NARANJA[0],
      NARANJA[1],
      NARANJA[2],
      180
    );


    circle(
      pieza.x,
      pieza.y,
      RADIO_PIEZA * 2
    );


    pop();
  }
}


// ===================================================
// COMPROBAR SI SE COMPLETÓ
// ===================================================

function comprobarCompletado() {

  if (
    completado
  ) {

    if (
      millis() -
      tiempoCompletado >
      ESPERA_REINICIO
    ) {

      guardarCirculoCompletado();
    }


    return;
  }


  let cantidadIntegradas =
    0;


  for (
    let pieza of piezas
  ) {

    if (
      pieza.estado ===
      "integrada"
    ) {

      cantidadIntegradas++;
    }
  }


  if (
    cantidadIntegradas ===
    CANTIDAD_PIEZAS
  ) {

    completado =
      true;


    tiempoCompletado =
      millis();


    arrastrando =
      false;
  }
}


// ===================================================
// GUARDAR CÍRCULO COMPLETO
// ===================================================

function guardarCirculoCompletado() {

  circulosCompletados.push({

    x:
      centroX,

    y:
      centroY,

    radio:
      RADIO_CIRCULO,

    alpha:
      ALPHA_RECUERDO,

    radioObjetivo:
      RADIO_CIRCULO,

    estado:
      "fondo",

    capturado:
      false
  });


  // =================================================
  // SI TODAVÍA NO HAY 5
  // =================================================

  if (
    circulosCompletados.length <
    MAX_IDENTIDADES
  ) {

    crearNuevaIdentidad();
  }


  // =================================================
  // SI YA LLEGAMOS A 5
  // =================================================

  else {

    iniciarEtapaFinal();
  }
}


// ===================================================
// CREAR NUEVA IDENTIDAD
// ===================================================

function crearNuevaIdentidad() {

  buscarPosicionNueva();


  alphaCirculo =
    75;


  crearHuecos();

  crearPiezas();


  completado =
    false;


  tiempoCompletado =
    0;


  arrastrando =
    false;
}


// ===================================================
// BUSCAR POSICIÓN PARA NUEVO CÍRCULO
// ===================================================

function buscarPosicionNueva() {

  let intentos =
    0;


  let nuevaX;
  let nuevaY;


  do {

    nuevaX =
      random(
        RADIO_CIRCULO,
        width -
        RADIO_CIRCULO
      );


    nuevaY =
      random(
        RADIO_CIRCULO,
        height -
        RADIO_CIRCULO
      );


    intentos++;

  } while (

    posicionMuyCerca(
      nuevaX,
      nuevaY
    )

    &&

    intentos < 200
  );


  centroX =
    nuevaX;


  centroY =
    nuevaY;
}


// ===================================================
// EVITAR QUE LOS CÍRCULOS SE SUPERPONGAN MUCHO
// ===================================================

function posicionMuyCerca(
  x,
  y
) {

  for (
    let c of circulosCompletados
  ) {

    let d =
      dist(
        x,
        y,
        c.x,
        c.y
      );


    if (
      d <
      RADIO_CIRCULO * 1.35
    ) {

      return true;
    }
  }


  return false;
}


// ===================================================
// DIBUJAR CÍRCULOS YA COMPLETADOS
// ===================================================

function dibujarCirculosCompletados() {

  for (
    let c of circulosCompletados
  ) {

    push();


    noStroke();


    fill(
      ROJO[0],
      ROJO[1],
      ROJO[2],
      c.alpha
    );


    circle(
      c.x,
      c.y,
      c.radio * 2
    );


    pop();
  }
}


// ===================================================
// ETAPA FINAL
// ===================================================

function iniciarEtapaFinal() {

  etapa =
    2;


  sextoActivo =
    true;


  completado =
    false;


  piezas =
    [];


  huecos =
    [];


  // El sexto empieza en el centro

  centroX =
    width / 2;


  centroY =
    height / 2;


  alphaCirculo =
    90;


  // Los cinco anteriores
  // comienzan a achicarse

  for (
    let c of circulosCompletados
  ) {

    c.radioObjetivo =
      RADIO_FINAL_CHICO;


    c.alpha =
      150;


    c.estado =
      "esperando";


    c.capturado =
      false;
  }
}


// ===================================================
// ACTUALIZAR CÍRCULOS FINALES
// ===================================================

function actualizarCirculosFinales() {

  for (
    let c of circulosCompletados
  ) {

    // ===============================================
    // ACHICARSE
    // ===============================================

    if (
      c.estado ===
      "esperando"
    ) {

      c.radio =
        lerp(
          c.radio,
          c.radioObjetivo,
          0.08
        );
    }


    // ===============================================
    // VIAJAR HACIA EL SEXTO
    // ===============================================

    if (
      c.estado ===
      "viajando"
    ) {

      c.x =
        lerp(
          c.x,
          centroX,
          0.10
        );


      c.y =
        lerp(
          c.y,
          centroY,
          0.10
        );


      c.radio =
        lerp(
          c.radio,
          4,
          0.08
        );


      c.alpha =
        lerp(
          c.alpha,
          0,
          0.06
        );


      let d =
        dist(
          c.x,
          c.y,
          centroX,
          centroY
        );


      if (
        d < 8
      ) {

        c.estado =
          "integrado";


        c.alpha =
          0;


        c.radio =
          0;
      }
    }
  }
}


// ===================================================
// DIBUJAR LOS 5 CÍRCULOS DE LA ETAPA FINAL
// ===================================================

function dibujarCirculosFinales() {

  for (
    let c of circulosCompletados
  ) {

    if (
      c.estado ===
      "integrado"
    ) {

      continue;
    }


    push();


    noStroke();


    fill(
      ROJO[0],
      ROJO[1],
      ROJO[2],
      c.alpha
    );


    circle(
      c.x,
      c.y,
      c.radio * 2
    );


    pop();
  }
}


// ===================================================
// DIBUJAR SEXTO CÍRCULO
// ===================================================

function dibujarSextoCirculo() {

  push();


  noStroke();


  fill(
    ROJO[0],
    ROJO[1],
    ROJO[2],
    alphaCirculo
  );


  circle(
    centroX,
    centroY,
    RADIO_CIRCULO * 2
  );


  pop();
}


// ===================================================
// CAPTURAR CÍRCULOS ANTERIORES
// ===================================================

function comprobarCapturaFinal() {

  if (
    !sextoActivo
  ) {

    return;
  }


  for (
    let c of circulosCompletados
  ) {

    if (
      c.estado !==
      "esperando"
    ) {

      continue;
    }


    let d =
      dist(
        centroX,
        centroY,
        c.x,
        c.y
      );


    if (
      d <
      RADIO_CIRCULO +
      c.radio
    ) {

      c.estado =
        "viajando";


      c.capturado =
        true;


      // sexto círculo se vuelve
      // más visible

      alphaCirculo +=
        25;


      alphaCirculo =
        min(
          alphaCirculo,
          235
        );
    }
  }
}


// ===================================================
// COMPROBAR FINAL
// ===================================================

function comprobarFinal() {

  if (
    finalTerminado
  ) {

    return;
  }


  let integrados =
    0;


  for (
    let c of circulosCompletados
  ) {

    if (
      c.estado ===
      "integrado"
    ) {

      integrados++;
    }
  }


  if (
    integrados ===
    MAX_IDENTIDADES
  ) {

    finalTerminado =
      true;


    sextoActivo =
      false;


    alphaCirculo =
      235;


    arrastrando =
      false;
  }
}


// ===================================================
// INICIAR ARRASTRE
// ===================================================

function iniciarArrastre(
  x,
  y
) {

  let d =
    dist(
      x,
      y,
      centroX,
      centroY
    );


  if (
    d <
    RADIO_CIRCULO
  ) {

    arrastrando =
      true;


    offsetX =
      centroX -
      x;


    offsetY =
      centroY -
      y;
  }
}


// ===================================================
// MOVER ARRASTRE
// ===================================================

function moverArrastre(
  x,
  y
) {

  if (
    !arrastrando
  ) {

    return;
  }


  centroX =
    x +
    offsetX;


  centroY =
    y +
    offsetY;


  centroX =
    constrain(
      centroX,
      RADIO_CIRCULO * 0.55,
      width -
      RADIO_CIRCULO * 0.55
    );


  centroY =
    constrain(
      centroY,
      RADIO_CIRCULO * 0.55,
      height -
      RADIO_CIRCULO * 0.55
    );
}


// ===================================================
// TERMINAR ARRASTRE
// ===================================================

function terminarArrastre() {

  arrastrando =
    false;
}


// ===================================================
// MOUSE
// ===================================================

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


// ===================================================
// TOUCH
// ===================================================

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


// ===================================================
// RESPONSIVE
// ===================================================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );


  // Si estamos en la primera etapa,
  // reposicionamos solamente
  // el círculo activo.

  if (
    etapa === 1
  ) {

    centroX =
      width / 2;


    centroY =
      height / 2;
  }


  // En la etapa final,
  // el sexto vuelve al centro.

  if (
    etapa === 2
  ) {

    centroX =
      width / 2;


    centroY =
      height / 2;
  }
}