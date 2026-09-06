let triangulos = [];


// ---------------------------------------------
// PALETA
// ---------------------------------------------

const FONDO = [8, 3, 2];

const ROJO = [210, 58, 48];
const NARANJA = [222, 112, 68];


// ---------------------------------------------
// CONFIGURACIÓN
// ---------------------------------------------

// Triángulos decorativos que aparecen al comenzar.
// Son solamente visuales y NO se pueden interactuar.
const TRIANGULOS_INICIALES = 6;

// Opacidad inicial de cada triángulo.
// Cada nuevo click resta 10 puntos porcentuales
// de opacidad a los triángulos que ya estaban.
const OPACIDAD_INICIAL = 170;
const PERDIDA_POR_CLICK = OPACIDAD_INICIAL * 0.10;


// ---------------------------------------------
// SETUP
// ---------------------------------------------

function setup() {

  pixelDensity(1);

  createCanvas(
    windowWidth,
    windowHeight
  );

  crearTriangulosIniciales();
}


// ---------------------------------------------
// DRAW
// ---------------------------------------------

function draw() {

  background(
    FONDO[0],
    FONDO[1],
    FONDO[2]
  );


  for (
    let i = triangulos.length - 1;
    i >= 0;
    i--
  ) {

    let t = triangulos[i];

    t.actualizar();
    t.mostrarEstela();
    t.mostrar();


    if (t.muerto) {

      triangulos.splice(i, 1);
    }
  }
}


// ---------------------------------------------
// TRIÁNGULOS INICIALES
// ---------------------------------------------

function crearTriangulosIniciales() {

  for (
    let i = 0;
    i < TRIANGULOS_INICIALES;
    i++
  ) {

    let tamano = random(55, 85);

    let x = random(
      tamano,
      width - tamano
    );

    let y = random(
      tamano,
      height - tamano
    );

    let col =
      random() > 0.5
        ? ROJO
        : NARANJA;


    triangulos.push(

      new TrianguloCaducidad(
        x,
        y,
        tamano,
        col,
        false
      )
    );
  }
}


// ---------------------------------------------
// CREAR TRIÁNGULO CON CLICK
// ---------------------------------------------

function crearTriangulo(x, y) {

  // Primero todos los triángulos que ya existían
  // pierden un 10% de su opacidad.
  for (let t of triangulos) {

    t.perderOpacidad();
  }


  // Después aparece el nuevo con opacidad completa.
  let tamano = random(55, 85);

  let col =
    random() > 0.5
      ? ROJO
      : NARANJA;


  triangulos.push(

    new TrianguloCaducidad(
      x,
      y,
      tamano,
      col,
      true
    )
  );
}


// ---------------------------------------------
// INTERACCIÓN
// ---------------------------------------------

function interactuar(x, y) {

  crearTriangulo(x, y);
}


// ---------------------------------------------
// MOUSE
// ---------------------------------------------

function mousePressed() {

  interactuar(
    mouseX,
    mouseY
  );

  return false;
}


// ---------------------------------------------
// TOUCH
// ---------------------------------------------

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


// ---------------------------------------------
// CLASE
// ---------------------------------------------

class TrianguloCaducidad {

  constructor(
    x,
    y,
    tamano,
    col,
    interactuable
  ) {

    this.x = x;
    this.y = y;

    this.tamano = tamano;

    this.col = col;

    // Sirve para distinguir los triángulos
    // decorativos iniciales de los creados por click.
    this.interactuable = interactuable;

    this.muerto = false;

    this.alpha = OPACIDAD_INICIAL;

    this.escala = 0;

    this.estela = [];
  }


  // -------------------------------------------
  // ACTUALIZAR
  // -------------------------------------------

  actualizar() {

    this.escala =
      lerp(
        this.escala,
        1,
        0.1
      );


    // Los triángulos permanecen quietos.
    // La posición solamente cambia si en el futuro
    // se quiere agregar movimiento.


    // Si llegó a 0, desaparece.
    if (this.alpha <= 0) {

      this.alpha = 0;

      this.muerto = true;
    }
  }


  // -------------------------------------------
  // PERDER OPACIDAD
  // -------------------------------------------

  perderOpacidad() {

    this.alpha -=
      PERDIDA_POR_CLICK;


    if (this.alpha <= 0) {

      this.alpha = 0;

      this.muerto = true;
    }
  }


  // -------------------------------------------
  // ESTELA
  // -------------------------------------------

  mostrarEstela() {

    // Los triángulos de esta versión no se mueven,
    // por lo que no necesitan estela.
  }


  // -------------------------------------------
  // MOSTRAR TRIÁNGULO
  // -------------------------------------------

  mostrar() {

    if (this.alpha <= 0) {
      return;
    }


    push();


    translate(
      this.x,
      this.y
    );


    scale(
      this.escala
    );


    noStroke();


    fill(
      this.col[0],
      this.col[1],
      this.col[2],
      this.alpha
    );


    let t =
      this.tamano;


    triangle(

      t / 2,
      0,

      -t / 2,
      -t / 2,

      -t / 2,
      t / 2
    );


    pop();
  }
}


// ---------------------------------------------
// RESPONSIVE
// ---------------------------------------------

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );
}