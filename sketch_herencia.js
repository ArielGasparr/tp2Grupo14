// ============================================
// HERENCIA
// Triángulos + apretar
// ============================================


// ---------------------------------------------
// PALETA
// ---------------------------------------------

const FONDO = [8, 3, 2];

const ROJO = [210, 58, 48];
const NARANJA = [222, 112, 68];

const OPACIDAD_TRIANGULO = 180;


// ---------------------------------------------
// SISTEMA
// ---------------------------------------------

let triangulos = [];
let conexiones = [];


// ---------------------------------------------
// TAMAÑOS
// ---------------------------------------------

const TAM_INICIAL = 85;
const TAM_MINIMO = 28;


// ---------------------------------------------
// CONEXIÓN
// ---------------------------------------------

const DURACION_LINEA = 1500;

const GROSOR_LINEA = 2.5;


// ============================================
// SETUP
// ============================================

function setup() {

  pixelDensity(1);

  createCanvas(
    windowWidth,
    windowHeight
  );


  // TRIÁNGULO ROJO

  triangulos.push(

    new Triangulo(

      width * 0.30,
      height * 0.50,

      TAM_INICIAL,

      ROJO,

      0
    )
  );


  // TRIÁNGULO NARANJA

  triangulos.push(

    new Triangulo(

      width * 0.70,
      height * 0.50,

      TAM_INICIAL,

      NARANJA,

      0
    )
  );
}


// ============================================
// DRAW
// ============================================

function draw() {

  background(
    FONDO[0],
    FONDO[1],
    FONDO[2]
  );


  // -----------------------------------------
  // CONEXIONES
  // -----------------------------------------

  actualizarConexiones();


  // -----------------------------------------
  // TRIÁNGULOS
  // -----------------------------------------

  for (let t of triangulos) {

    t.actualizar();

    t.mostrar();
  }
}


// ============================================
// CREAR DESCENDIENTE
// ============================================

function crearHijo(padre) {

  // -----------------------------------------
  // TAMAÑO
  // -----------------------------------------

  let nuevoTamano =
    padre.tamano *
    random(
      0.68,
      0.86
    );


  nuevoTamano =
    max(
      nuevoTamano,
      TAM_MINIMO
    );


  // -----------------------------------------
  // POSICIÓN RANDOM
  // -----------------------------------------

  let margen =
    nuevoTamano + 30;


  let nuevoX =
    random(
      margen,
      width - margen
    );


  let nuevoY =
    random(
      margen,
      height - margen
    );


  // -----------------------------------------
  // CREAR HIJO
  // -----------------------------------------

  let hijo =
    new Triangulo(

      nuevoX,
      nuevoY,

      nuevoTamano,

      // hereda color
      padre.col,

      padre.generacion + 1
    );


  triangulos.push(
    hijo
  );


  // -----------------------------------------
  // CREAR CONEXIÓN
  // -----------------------------------------

  conexiones.push({

    padre: padre,

    hijo: hijo,

    inicio:
      millis(),

    duracion:
      DURACION_LINEA,

    col:
      padre.col
  });
}


// ============================================
// CONEXIONES
// ============================================

function actualizarConexiones() {

  for (
    let i =
      conexiones.length - 1;

    i >= 0;

    i--
  ) {

    let c =
      conexiones[i];


    let transcurrido =
      millis() -
      c.inicio;


    // ---------------------------------------
    // si terminó, eliminarla
    // ---------------------------------------

    if (
      transcurrido >
      c.duracion
    ) {

      conexiones.splice(
        i,
        1
      );

      continue;
    }


    // ---------------------------------------
    // ALPHA
    // ---------------------------------------

    let alpha =
      map(
        transcurrido,
        0,
        c.duracion,
        150,
        0
      );


    push();


    stroke(
      c.col[0],
      c.col[1],
      c.col[2],
      alpha
    );


    strokeWeight(
      GROSOR_LINEA
    );


    line(

      c.padre.x,
      c.padre.y,

      c.hijo.x,
      c.hijo.y
    );


    pop();
  }
}


// ============================================
// INTERACCIÓN
// ============================================

function interactuar(x, y) {

  // recorremos desde el último
  // para priorizar los más nuevos

  for (
    let i =
      triangulos.length - 1;

    i >= 0;

    i--
  ) {

    let t =
      triangulos[i];


    let d =
      dist(
        x,
        y,
        t.x,
        t.y
      );


    // zona táctil ligeramente mayor
    // que el triángulo

    if (
      d <
      t.tamano * 0.75
    ) {

      crearHijo(t);

      break;
    }
  }
}


// ============================================
// TRIÁNGULO
// ============================================

class Triangulo {

  constructor(
    x,
    y,
    tamano,
    col,
    generacion
  ) {

    this.x = x;
    this.y = y;

    this.tamano =
      tamano;

    this.col =
      col;

    this.generacion =
      generacion;


    // animación de aparición

    this.escala = 0;


    // pequeña rotación aleatoria
    // para que no sean idénticos

    this.rotacion =
      random(
        -0.25,
        0.25
      );
  }


  // -----------------------------------------
  // ACTUALIZAR
  // -----------------------------------------

  actualizar() {

    this.escala =
      lerp(
        this.escala,
        1,
        0.12
      );
  }


  // -----------------------------------------
  // MOSTRAR
  // -----------------------------------------

  mostrar() {

    push();


    translate(
      this.x,
      this.y
    );


    rotate(
      this.rotacion
    );


    scale(
      this.escala
    );


    noStroke();


    fill(
      this.col[0],
      this.col[1],
      this.col[2],
      OPACIDAD_TRIANGULO
    );


    let t =
      this.tamano;


    triangle(

      0,
      -t / 2,

      -t / 2,
      t / 2,

      t / 2,
      t / 2
    );


    pop();
  }
}


// ============================================
// MOUSE
// ============================================

function mousePressed() {

  interactuar(
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

    interactuar(

      touches[0].x,

      touches[0].y
    );
  }


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
}