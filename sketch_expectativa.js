// ============================================
// EXPECTATIVA
// "como anticipación"
// Acción: DESLIZAR / SWIPE
// ============================================


// ---------------- COLORES ----------------

const BG = [8, 3, 2];

const ROJO = [210, 58, 48];
const NARANJA = [222, 112, 68];


// ---------------- GESTO ----------------

let inicioX = 0;
let inicioY = 0;
let inicioTiempo = 0;

let gestoActivo = false;

const DISTANCIA_SWIPE = 60;
const TIEMPO_SWIPE = 500;


// ---------------- EXPECTATIVA ----------------

const S_Expectativa = {

  progresoObj: 0,
  progresoActual: 0,

  ladoVentana: 0,


  secuencia: [

    {
      tipo: 'circulo',
      col: ROJO
    },

    {
      tipo: 'triangulo',
      col: NARANJA
    },

    {
      tipo: 'cuadrado',
      col: ROJO
    }

  ],


  iniciar: function() {

    this.recalcularGeometria();

    this.progresoObj = 0;
    this.progresoActual = 0;
  },


  recalcularGeometria: function() {

    this.ladoVentana =
      min(width, height) * 0.60;
  },


  deslizar: function(direccion, intensidad) {

    let fuerza =
      constrain(
        intensidad / 180,
        0.5,
        1.5
      );


    this.progresoObj +=
      direccion * fuerza;
  },


  actualizar: function() {

    this.progresoActual =
      lerp(
        this.progresoActual,
        this.progresoObj,
        0.075
      );
  },


  // ==========================================
  // DIBUJAR FORMA
  // ==========================================

  dibujarForma:
  function(
    tipo,
    cx,
    cy,
    tam,
    col,
    alpha
  ) {

    push();

    noStroke();

    fill(
      col[0],
      col[1],
      col[2],
      alpha
    );


    if (tipo === 'circulo') {

      circle(
        cx,
        cy,
        tam
      );


    } else if (tipo === 'cuadrado') {

      rectMode(CENTER);

      rect(
        cx,
        cy,
        tam,
        tam
      );


    } else if (tipo === 'triangulo') {

      let r =
        tam * 0.52;


      beginShape();

      for (let i = 0; i < 3; i++) {

        let ang =
          (i / 3) *
          TWO_PI -
          HALF_PI;


        vertex(
          cx + cos(ang) * r,
          cy + sin(ang) * r
        );
      }

      endShape(CLOSE);
    }


    pop();
  },


  // ==========================================
  // DIBUJAR ESCENA
  // ==========================================

  dibujar: function() {

    let cx =
      width / 2;

    let cy =
      height / 2;


    let mitad =
      this.ladoVentana / 2;


    // ========================================
    // RECORTE
    // Todo lo que dibujemos ahora
    // queda dentro del cuadrado
    // ========================================

    drawingContext.save();

    drawingContext.beginPath();

    drawingContext.rect(
      cx - mitad,
      cy - mitad,
      this.ladoVentana,
      this.ladoVentana
    );

    drawingContext.clip();


    // ----------------------------------------
    // Fondo interior
    // ----------------------------------------

    push();

    noStroke();

    fill(
      35,
      10,
      8
    );

    rectMode(CENTER);

    rect(
      cx,
      cy,
      this.ladoVentana,
      this.ladoVentana
    );

    pop();


    // ========================================
    // TÚNEL / CAPAS
    // ========================================

    let idxOffset =
      floor(
        this.progresoActual
      );


    let t =
      this.progresoActual -
      idxOffset;


    let baseIdx =

      (
        (
          idxOffset %
          this.secuencia.length
        ) +
        this.secuencia.length
      ) %
      this.secuencia.length;


    for (
      let i = -2;
      i <= 5;
      i++
    ) {

      let escala =
        pow(
          2.15,
          t - i
        );


      let tam =
        this.ladoVentana *
        escala;


      let formaIdx =

        (
          (
            baseIdx + i
          ) %
          this.secuencia.length +
          this.secuencia.length
        ) %
        this.secuencia.length;


      let forma =
        this.secuencia[
          formaIdx
        ];


      // Las formas más lejanas
      // tienen menos presencia

      let alpha =
        map(
          i,
          -2,
          5,
          75,
          190,
          true
        );


      this.dibujarForma(
        forma.tipo,
        cx,
        cy,
        tam,
        forma.col,
        alpha
      );
    }


    // Terminamos el recorte
    drawingContext.restore();


    // ========================================
    // BORDE ÚNICO DEL CUADRADO
    // ========================================

    push();

    noFill();

    stroke(
      ROJO[0],
      ROJO[1],
      ROJO[2],
      180
    );

    strokeWeight(3);

    rectMode(CENTER);

    rect(
      cx,
      cy,
      this.ladoVentana,
      this.ladoVentana
    );

    pop();
  }
};


// ============================================
// SETUP
// ============================================

function setup() {

  pixelDensity(1);

  createCanvas(
    windowWidth,
    windowHeight
  );

  S_Expectativa.iniciar();
}


// ============================================
// DRAW
// ============================================

function draw() {

  // Este negro queda visible
  // alrededor de toda la ventana

  background(
    BG[0],
    BG[1],
    BG[2]
  );


  S_Expectativa.actualizar();

  S_Expectativa.dibujar();
}


// ============================================
// INICIAR SWIPE
// ============================================

function iniciarGesto(x, y) {

  inicioX = x;
  inicioY = y;

  inicioTiempo =
    millis();

  gestoActivo =
    true;
}


// ============================================
// TERMINAR SWIPE
// ============================================

function terminarGesto(x, y) {

  if (!gestoActivo) {
    return;
  }


  let dx =
    x - inicioX;

  let dy =
    y - inicioY;


  let distancia =
    abs(dx);


  let duracion =
    millis() -
    inicioTiempo;


  // Solo swipe horizontal rápido

  if (
    distancia > DISTANCIA_SWIPE &&
    distancia > abs(dy) &&
    duracion < TIEMPO_SWIPE
  ) {

    let direccion =
      dx > 0
        ? 1
        : -1;


    S_Expectativa.deslizar(
      direccion,
      distancia
    );
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

  if (touches.length > 0) {

    iniciarGesto(
      touches[0].x,
      touches[0].y
    );
  }

  return false;
}


function touchMoved() {

  // No ocurre nada mientras mantenés
  // el dedo apoyado.

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

  S_Expectativa.recalcularGeometria();
}