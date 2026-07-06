
// ============================================
//  SKETCH INDIVIDUAL — ESCENA: CADUCIDAD
//  "como lo perdido en el tránsito"
// ============================================

// Colores
const BG          = [8,   3,   2  ];
const ROJO        = [201, 74,  42 ];
const ROSA_OSCURO = [232, 131, 90 ];
const ROSA_CLARO  = [242, 196, 168];

// Estado global
let fadeTransicion = 1;
let posMouseX = 0, posMouseY = 0;

function azar(a, b) {
  return random(a, b);
}

function azarInt(n) {
  return floor(random(n));
}

function interpolar(a, b, tAns) {
  return lerp(a, b, tAns);
}

function colorBorde(col, a = 1) {
  stroke(col[0], col[1], col[2], a * 255);
}

function colorRelleno(col, a = 1) {
  fill(col[0], col[1], col[2], a * 255);
}

function sinLinea() {
  noStroke();
}

function sinRelleno() {
  noFill();
}

function dibujarCirc(x, y, r, colBorde, colRelleno, a = 1) {
  if (r <= 0) return;
  push();

  if (colBorde) {
    colorBorde(colBorde, a);
  } else {
    sinLinea();
  }

  if (colRelleno) {
    colorRelleno(colRelleno, a);
  } else {
    sinRelleno();
  }

  ellipse(x, y, r * 2, r * 2);
  pop();
}

function dibujarRect(x, y, s, colBorde, colRelleno, a = 1) {
  push();

  if (colBorde) {
    colorBorde(colBorde, a);
  } else {
    sinLinea();
  }

  if (colRelleno) {
    colorRelleno(colRelleno, a);
  } else {
    sinRelleno();
  }

  rectMode(CENTER);
  rect(x, y, s, s);
  pop();
}

function dibujarTriang(x, y, r, rotarTriang, colBorde, colRelleno, a = 1) {
  if (r <= 0) return;
  push();

  if (colBorde) {
    colorBorde(colBorde, a);
  } else {
    sinLinea();
  }

  if (colRelleno) {
    colorRelleno(colRelleno, a);
  } else {
    sinRelleno();
  }

  beginShape();
  for (let i = 0; i < 3; i++) {
    let ang = rotarTriang + (i / 3) * TWO_PI - HALF_PI;
    vertex(x + cos(ang) * r, y + sin(ang) * r);
  }
  endShape(CLOSE);
  pop();
}

function dibujarLinea(x1, y1, x2, y2, colBorde, a = 1, w = 1) {
  push();
  colorBorde(colBorde, a);
  strokeWeight(w);
  line(x1, y1, x2, y2);
  pop();
}

// ============================================
// ESCENA — CADUCIDAD
// ============================================

const S_Caducidad = {
  nombreEscena: 'CADUCIDAD',
  subTituloEscena: 'como lo perdido en el tránsito',

  tipoFig: ['circulo', 'cuadrado', 'triangulo', 'linea'],
  figura: null,
  particulas: [],
  arrastrando: false,

  crearFigura: function(x, y) {
    let colOpciones = [ROJO, ROSA_OSCURO, ROSA_CLARO];
    return {
      x: x,
      y: y,
      r: azar(18, 30),
      type: this.tipoFig[azarInt(4)],
      col: colOpciones[azarInt(3)],
      rotarTriang: azar(0, TWO_PI),
      vida: 0,
      vidaMax: azar(65, 110),
      trail: []
    };
  },

  crearParticula: function(x, y, col) {
    let ang = azar(0, TWO_PI);
    let vel = azar(1.2, 4.2);

    return {
      x: x,
      y: y,
      vx: cos(ang) * vel,
      vy: sin(ang) * vel,
      r: azar(3, 9),
      cantFrame: 0,
      fadeTime: azar(20, 45),
      col: col,
      type: this.tipoFig[azarInt(4)],
      rotarTriang: azar(0, TWO_PI)
    };
  },

  iniciar: function() {
    this.figura = this.crearFigura(width / 2, height / 2);
    this.particulas = [];
    this.arrastrando = false;
  },

  alMover: function(x, y) {
    if (!this.figura) return;

    let d = dist(x, y, this.figura.x, this.figura.y);

    // si todavía no la agarraste, al entrar en el radio queda capturada
    if (!this.arrastrando && d < 55) {
      this.arrastrando = true;
    }

    // si ya está capturada, sigue al mouse aunque te alejes
    if (this.arrastrando) {
      this.figura.x = interpolar(this.figura.x, x, 0.34);
      this.figura.y = interpolar(this.figura.y, y, 0.34);
      this.figura.rotarTriang += 0.05;
      this.figura.vida++;

      this.figura.trail.push({
        x: this.figura.x,
        y: this.figura.y
      });

      if (this.figura.trail.length > 42) {
        this.figura.trail.shift();
      }

      if (this.figura.vida >= this.figura.vidaMax) {
        this.explotarFigura();
      }
    }
  },

  alClick: function(x, y) {
    if (!this.figura) return;

    let d = dist(x, y, this.figura.x, this.figura.y);

    // clic cerca = la capturás si no estaba agarrada
    if (!this.arrastrando && d < 70) {
      this.arrastrando = true;
      return;
    }

    // clic mientras arrastrás = acelera el agotamiento
    if (this.arrastrando) {
      this.figura.vida += 12;
      if (this.figura.vida >= this.figura.vidaMax) {
        this.explotarFigura();
      }
    }
  },

  explotarFigura: function() {
    if (!this.figura) return;

    for (let i = 0; i < 18; i++) {
      this.particulas.push(
        this.crearParticula(this.figura.x, this.figura.y, this.figura.col)
      );
    }

    let nx = constrain(this.figura.x + azar(-90, 90), 60, width - 60);
    let ny = constrain(this.figura.y + azar(-90, 90), 60, height - 60);

    this.figura = this.crearFigura(nx, ny);
    this.arrastrando = false;
  },

  actualizar: function() {
    for (let i = 0; i < this.particulas.length; i++) {
      let p = this.particulas[i];
      p.cantFrame++;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.97;
      p.vy *= 0.97;
      p.rotarTriang += 0.04;
    }

    this.particulas = this.particulas.filter(p => p.cantFrame < p.fadeTime);
  },

  dibujarForma: function(type, x, y, r, col, a, rot) {
    if (type === 'circulo') {
      dibujarCirc(x, y, r, col, null, a);

    } else if (type === 'cuadrado') {
      dibujarRect(x, y, r * 2, col, null, a);

    } else if (type === 'triangulo') {
      dibujarTriang(x, y, r, rot, col, null, a);

    } else if (type === 'linea') {
      let cx = cos(rot) * r * 1.4;
      let cy = sin(rot) * r * 1.4;
      dibujarLinea(x - cx, y - cy, x + cx, y + cy, col, a, 1.6);
    }
  },

  dibujar: function() {
    // rastro
    if (this.figura && this.figura.trail.length > 1) {
      for (let i = 1; i < this.figura.trail.length; i++) {
        let p1 = this.figura.trail[i - 1];
        let p2 = this.figura.trail[i];
        let a = (i / this.figura.trail.length) * 0.35;
        dibujarLinea(p1.x, p1.y, p2.x, p2.y, ROSA_OSCURO, a, 1);
      }
    }

    // figura activa
    if (this.figura) {
      let t = this.figura.vida / this.figura.vidaMax;
      let alpha = 0.9 - t * 0.25;
      let rr = this.figura.r + sin(frameCount * 0.12) * t * 3;

      this.dibujarForma(
        this.figura.type,
        this.figura.x,
        this.figura.y,
        rr,
        this.figura.col,
        alpha,
        this.figura.rotarTriang
      );

      dibujarCirc(this.figura.x, this.figura.y, 4, null, ROSA_CLARO, 0.35 + t * 0.25);
    }

    // explosión
    for (let i = 0; i < this.particulas.length; i++) {
      let p = this.particulas[i];
      let a = 1 - p.cantFrame / p.fadeTime;
      this.dibujarForma(p.type, p.x, p.y, p.r * a, p.col, a * 0.8, p.rotarTriang);
    }

    if (!this.arrastrando) {
      textoGuia('acercar y arrastrar la figura hasta agotarla');
    } else {
      textoGuia('seguir arrastrando hasta que caduque');
    }
  }
};

// ============================================
// HUD
// ============================================

function drawHUD() {
  let sc = S_Caducidad;

  push();
  textFont('Courier New');
  sinLinea();

  colorRelleno(ROSA_CLARO, 0.88);
  textSize(22);
  textAlign(LEFT);
  text(sc.nombreEscena, 32, 52);

  colorRelleno(ROJO, 0.5);
  textSize(10);
  text(sc.subTituloEscena, 32, 68);

  colorRelleno(ROJO, 0.18);
  textAlign(CENTER);
  textSize(7.5);
  text('escena única', width / 2, height - 28);

  pop();
}

function textoGuia(msg) {
  push();
  textFont('Courier New');
  textAlign(CENTER);
  textSize(10);
  sinLinea();
  colorRelleno(ROJO, 0.22);
  text('— ' + msg + ' —', width / 2, height / 2);
  pop();
}

// ============================================
// SETUP / DRAW
// ============================================

function setup() {
  createCanvas(windowWidth, windowHeight);
  posMouseX = width / 2;
  posMouseY = height / 2;
  S_Caducidad.iniciar();
  fadeTransicion = 0;
}

function draw() {
  background(BG[0], BG[1], BG[2]);

  // marco doble
  push();
  sinRelleno();
  colorBorde(ROJO, 0.11);
  strokeWeight(1);
  rect(17, 17, width - 34, height - 34);

  colorBorde(ROJO, 0.05);
  strokeWeight(1);
  rect(22, 22, width - 44, height - 44);
  pop();

  S_Caducidad.actualizar();
  S_Caducidad.dibujar();

  drawHUD();

  fadeTransicion = min(1, fadeTransicion + 0.04);

  if (fadeTransicion < 1) {
    push();
    sinLinea();
    fill(BG[0], BG[1], BG[2], (1 - fadeTransicion) * 255);
    rect(0, 0, width, height);
    pop();
  }
}

// ============================================
// EVENTOS
// ============================================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseMoved() {
  posMouseX = mouseX;
  posMouseY = mouseY;
  S_Caducidad.alMover(posMouseX, posMouseY);
}

function mouseDragged() {
  posMouseX = mouseX;
  posMouseY = mouseY;
  S_Caducidad.alMover(posMouseX, posMouseY);
}

function mousePressed() {
  S_Caducidad.alClick(mouseX, mouseY);
}

function touchMoved() {
  if (touches.length > 0) {
    posMouseX = touches[0].x;
    posMouseY = touches[0].y;
  } else {
    posMouseX = mouseX;
    posMouseY = mouseY;
  }

  S_Caducidad.alMover(posMouseX, posMouseY);
  return false;
}

function touchStarted() {
  if (touches.length > 0) {
    posMouseX = touches[0].x;
    posMouseY = touches[0].y;
  } else {
    posMouseX = mouseX;
    posMouseY = mouseY;
  }

  S_Caducidad.alClick(posMouseX, posMouseY);
  return false;
}