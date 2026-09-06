// Colores
const BG          = [8,   3,   2  ];
const ROJO        = [201, 74,  42 ];
const ROSA_OSCURO = [232, 131, 90 ];
const ROSA_CLARO  = [242, 196, 168];

// Estado global
let numEscena = 0;
let fadeTransicion  = 1;   // 0=negro, 1=visible
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

//  ESCENA 1 MEMORIA

const S_Memoria = {
  nombreEscena: 'MEMORIA', 
  subTituloEscena: 'como registro',
  rastroPuntitos: [],

  iniciar: function() { 
    this.rastroPuntitos = []; 
  },
  
  alMover: function(x, y) {
    if (this.rastroPuntitos.length < 500) {
      this.rastroPuntitos.push({ 
        x: x, 
        y: y, 
        r: azar(5, 26), 
        cantFrame: 0, 
        fadeTime: azar(180, 520), 
        esCuadrado: random() > 0.72 
      });
    }
  },
  
  alClick: function(x, y) {
    for (let i = 0; i < 18; i++) {
      let a = (i / 18) * TWO_PI;
      let d = azar(18, 65);
      
      let esCuad = false;
      if (i % 5 === 0) {
        esCuad = true;
      }

      this.rastroPuntitos.push({ 
        x: x + cos(a) * d, 
        y: y + sin(a) * d,
        r: azar(3, 13), 
        cantFrame: 0, 
        fadeTime: azar(120, 280), 
        esCuadrado: esCuad
      });
    }
  },
  
  actualizar: function() {
    for (let i = 0; i < this.rastroPuntitos.length; i++) {
      this.rastroPuntitos[i].cantFrame++;
    }
    
    this.rastroPuntitos = this.rastroPuntitos.filter(t => t.cantFrame < t.fadeTime);
  },
  
  dibujar: function() {
    strokeWeight(0.5);
    let agrupacion = this.rastroPuntitos.slice(-45);
    
    for (let i = 1; i < agrupacion.length; i++) {
      let p1 = agrupacion[i - 1];
      let p2 = agrupacion[i];
      let alphaLinea = (1 - p2.cantFrame / p2.fadeTime) * 0.12;
      
      dibujarLinea(p1.x, p1.y, p2.x, p2.y, ROSA_OSCURO, alphaLinea, 0.5);
    }
    
    for (let i = 0; i < this.rastroPuntitos.length; i++) {
      let t = this.rastroPuntitos[i];
      let a = 1 - t.cantFrame / t.fadeTime;
      let r = t.r * (0.45 + a * 0.55);
      
      if (t.esCuadrado) {
        dibujarRect(t.x, t.y, r * 2, ROSA_OSCURO, null, a * 0.52);
      } else {
        dibujarCirc(t.x, t.y, r, ROJO, null, a * 0.62);
      }
      dibujarCirc(t.x, t.y, r * 0.22, null, ROSA_CLARO, a * 0.28);
    }
    
    if (this.rastroPuntitos.length === 0) {
      textoGuia('mover para dejar registro');
    }
  }
};

//  ESCENA 2 HERENCIA
const S_Herencia = {
  nombreEscena: 'HERENCIA', 
  subTituloEscena: 'como legado',
  listaTriangulos: [], 
  triangID: 0,
  maxGen: 4,

  spawn: function(x, y, r, genTriang, padreX, padreY) {
    if (genTriang > this.maxGen || r < 4) return;
    
    this.listaTriangulos.push({ 
      id: this.triangID++, 
      x: x, 
      y: y, 
      r: r, 
      genTriang: genTriang, 
      padreX: padreX, 
      padreY: padreY, 
      cantFrame: 0,
      spawnProx: 48 + genTriang * 32, 
      fadeTime: 370 - genTriang * 38,
      yaSpawneo: false, 
      rotarTriang: azar(0, TWO_PI) 
    });
  },

  iniciar: function() { 
    this.listaTriangulos = []; 
    this.triangID = 0; 
  },
  
  alMover: function() {},
  
  alClick: function(x, y) { 
    this.spawn(x, y, 44, 0, null, null); 
  },
  
  actualizar: function() {
    for (let i = 0; i < this.listaTriangulos.length; i++) {
      let n = this.listaTriangulos[i];
      n.cantFrame++; 
      n.rotarTriang += 0.007 * (1 + n.genTriang * 0.25);
      
      if (!n.yaSpawneo && n.cantFrame >= n.spawnProx && n.genTriang < this.maxGen) {
        n.yaSpawneo = true;
        let ba = azar(0, TWO_PI);
        let sp = PI * 0.48 + azar(0, PI * 0.35);
        let d = n.r * 2.35;
        
        this.spawn(n.x + cos(ba) * d, n.y + sin(ba) * d, n.r * 0.57, n.genTriang + 1, n.x, n.y);
        this.spawn(n.x + cos(ba + sp) * d, n.y + sin(ba + sp) * d, n.r * 0.57, n.genTriang + 1, n.x, n.y);
      }
    }
    this.listaTriangulos = this.listaTriangulos.filter(n => n.cantFrame < n.fadeTime);
  },
  
  dibujar: function() {
    for (let i = 0; i < this.listaTriangulos.length; i++) {
      let n = this.listaTriangulos[i];
      if (n.padreX !== null) {
        let alphaLinea = (1 - n.cantFrame / n.fadeTime) * 0.22;
        dibujarLinea(n.padreX, n.padreY, n.x, n.y, ROSA_OSCURO, alphaLinea, 0.5);
      }
    }
    
    for (let i = 0; i < this.listaTriangulos.length; i++) {
      let n = this.listaTriangulos[i];
      let a = (1 - n.cantFrame / n.fadeTime) * (1 - n.genTriang * 0.17);
      
      let col;
      if (n.genTriang === 0) {
        col = ROSA_CLARO;
      } else if (n.genTriang === 1) {
        col = ROSA_OSCURO;
      } else {
        col = ROJO;
      }
      
      strokeWeight(max(0.4, 1.8 - n.genTriang * 0.3));
      dibujarTriang(n.x, n.y, n.r, n.rotarTriang, col, null, a * 0.85);
      
      if (n.genTriang < 3) {
        dibujarTriang(n.x, n.y, n.r * 0.35, -n.rotarTriang * 1.6, ROJO, null, a * 0.3);
      }
    }
    
    if (this.listaTriangulos.length === 0) {
      textoGuia('clic para iniciar el linaje');
    }
  }
};

//  ESCENA 3 CADUCIDAD

const S_Caducidad = {
  nombreEscena: 'CADUCIDAD', 
  subTituloEscena: 'como lo perdido en el tránsito',
  listaCaducidad: [],
  tipoFig: ['circulo', 'cuadrado', 'triangulo', 'linea'],
  
  crearForma: function(x, y, fadeVerif = false) {
    let colOpciones = [ROJO, ROSA_OSCURO, ROSA_CLARO];
    let fade;
    if (fadeVerif) {
      fade = azar(18, 50);
    } else {
      fade = azar(38, 115);
    }

    return { 
      x: x, 
      y: y, 
      r: azar(5, 32), 
      type: this.tipoFig[azarInt(4)],
      cantFrame: 0, 
      fadeTime: fade,
      rotarTriang: azar(0, TWO_PI), 
      col: colOpciones[azarInt(3)] 
    };
  },

  iniciar: function() { 
    this.listaCaducidad = []; 
  },
  
  alMover: function(x, y) { 
    if (random() < 0.55) {
      this.listaCaducidad.push(this.crearForma(x, y, true)); 
    }
  },
  
  alClick: function(x, y) { 
    for(let i = 0; i < 10; i++) {
      this.listaCaducidad.push(this.crearForma(x + azar(-50, 50), y + azar(-50, 50), true));
    }
  },
  
  actualizar: function() {
    if (this.listaCaducidad.length < 70 && random() < 0.28) {
      this.listaCaducidad.push(this.crearForma(azar(60, width - 60), azar(60, height - 60)));
    }
    for (let i = 0; i < this.listaCaducidad.length; i++) {
      this.listaCaducidad[i].cantFrame++;
    }
    this.listaCaducidad = this.listaCaducidad.filter(s => s.cantFrame < s.fadeTime);
  },
  
  dibujar: function() {
    for (let i = 0; i < this.listaCaducidad.length; i++) {
      let s = this.listaCaducidad[i];
      let a = pow(1 - s.cantFrame / s.fadeTime, 1.6);
      let r = s.r * (0.28 + a * 0.72);
      
      if (s.type === 'circulo') {
        dibujarCirc(s.x, s.y, r, s.col, null, a * 0.68);
      } else if (s.type === 'cuadrado') {
        dibujarRect(s.x, s.y, r * 2, s.col, null, a * 0.62);
      } else if (s.type === 'triangulo') {
        dibujarTriang(s.x, s.y, r, s.rotarTriang, s.col, null, a * 0.62);
      } else if (s.type === 'linea') {
        let cx = cos(s.rotarTriang) * r * 1.4;
        let cy = sin(s.rotarTriang) * r * 1.4;
        dibujarLinea(s.x - cx, s.y - cy, s.x + cx, s.y + cy, s.col, a * 0.65, 1.2);
      }
    }
  }
};


//  ESCENA 4 IDENTIDAD proceso

const S_Identidad = {
  nombreEscena: 'IDENTIDAD', 
  subTituloEscena: 'como afirmación de sí',
  tAns: 0,
  
  iniciar: function() { this.tAns = 0; },
  alClick: function() {},
  alMover: function() {},
  
  actualizar: function() {
    this.tAns += 0.05;
  },
  
  dibujar: function() {
    push();
    textFont('Courier New');
    textAlign(CENTER, CENTER);
    sinLinea();
    
    colorRelleno(ROSA_CLARO);
    textSize(24);
    text('[ EN PROCESO ]', width / 2, height / 2 - 10);
    pop();
  }
};

//  ESCENA 5 EMPATÍA

const S_Empatia = {
  nombreEscena: 'EMPATÍA', 
  subTituloEscena: 'como comprensión del otro',
  historialEmpatia: [], 
  fx: 0, 
  fy: 0,
  delayFrame: 90,
  
  iniciar: function() { 
    this.historialEmpatia = []; 
    this.fx = width / 2 + 110; 
    this.fy = height / 2; 
  },
  
  alClick: function() {},
  
  alMover: function(x, y) { 
    this.historialEmpatia.push({ x: x, y: y }); 
    if (this.historialEmpatia.length > 600) {
      this.historialEmpatia.shift(); 
    }
  },
  
  actualizar: function() {
    let ti = max(0, this.historialEmpatia.length - this.delayFrame);
    if (this.historialEmpatia[ti]) { 
      this.fx = interpolar(this.fx, this.historialEmpatia[ti].x, 0.08); 
      this.fy = interpolar(this.fy, this.historialEmpatia[ti].y, 0.08); 
    }
  },
  
  dibujar: function() {
    let cantHisto = this.historialEmpatia.length;
    let last = this.historialEmpatia[cantHisto - 1];
    
    let lx = width / 2;
    let ly = height / 2;
    if (last) {
      lx = last.x;
      ly = last.y;
    }
    
    let inicioLoop1 = max(0, cantHisto - 60);
    for (let i = inicioLoop1; i < cantHisto - 1; i++) {
      let alphaL = ((i - (cantHisto - 60)) / 60) * 0.32;
      dibujarLinea(this.historialEmpatia[i].x, this.historialEmpatia[i].y, this.historialEmpatia[i+1].x, this.historialEmpatia[i+1].y, ROJO, alphaL, 1);
    }
    
    let fS = max(0, cantHisto - this.delayFrame - 60);
    let fE = max(0, cantHisto - this.delayFrame);
    for (let i = fS; i < fE - 1; i++) {
      let alphaL2 = ((i - fS) / 60) * 0.24;
      dibujarLinea(this.historialEmpatia[i].x, this.historialEmpatia[i].y, this.historialEmpatia[i+1].x, this.historialEmpatia[i+1].y, ROSA_OSCURO, alphaL2, 1);
    }
    
    if (last) {
      dibujarLinea(lx, ly, this.fx, this.fy, ROSA_CLARO, 0.1, 0.5);
      let d = dist(lx, ly, this.fx, this.fy);
      if (d < 90) {
        dibujarCirc((lx + this.fx) / 2, (ly + this.fy) / 2, d * 0.38, ROSA_CLARO, null, (1 - d / 90) * 0.38);
      }
    }
    
    strokeWeight(2);  
    dibujarCirc(lx, ly, 21, ROJO, null, 0.88); 
    dibujarCirc(lx, ly, 7, null, ROJO, 0.48);
    
    strokeWeight(1.5);
    dibujarCirc(this.fx, this.fy, 21, ROSA_OSCURO, null, 0.7);  
    dibujarCirc(this.fx, this.fy, 7, null, ROSA_OSCURO, 0.35);
    
    if (this.historialEmpatia.length === 0) {
      textoGuia('mover para activar la empatía');
    }
  }
};

//  ESCENA 6 COLABORACIÓN

const S_Colaboracion = {
  nombreEscena: 'COLABORACIÓN', 
  subTituloEscena: 'como coexistencia de lo diverso',
  tipoFig: ['circulo', 'cuadrado', 'triangulo', 'linea'],
  COLS: [ROJO, ROSA_OSCURO, ROSA_CLARO, ROSA_OSCURO],
  listaColab: [],
  unionFig: false,
  
  iniciar: function() {
    this.unionFig = false;
    this.listaColab = [];
    
    // Crea las 4 fig
    for (let i = 0; i < 4; i++) {
      let a = (i / 4) * TWO_PI;
      this.listaColab.push({
        type: this.tipoFig[i],
        col: this.COLS[i],
        x: width / 2 + cos(a) * 180,
        y: height / 2 + sin(a) * 180,
        vx: 0,
        vy: 0,
        rotarTriang: azar(0, TWO_PI),
        size: azar(19, 27)
      });
    }
  },
  
  alMover: function(x, y) {
    if (this.unionFig) {

      for (let i = 0; i < this.listaColab.length; i++) {
        let e = this.listaColab[i];
        e.vx += (x - e.x) * 0.0006;
        e.vy += (y - e.y) * 0.0006;
      }
      return;
    }
    
    // pastoreo
    for (let i = 0; i < this.listaColab.length; i++) {
      let e = this.listaColab[i];
      let d = dist(x, y, e.x, e.y);
      if (d < 140) {
        let force = (140 - d) * 0.003;
        e.vx += (e.x - x) * force;
        e.vy += (e.y - y) * force;
      }
    }
  },
  
  alClick: function(x, y) {
    if (this.unionFig) {

      this.unionFig = false;
      for (let i = 0; i < this.listaColab.length; i++) {
        let e = this.listaColab[i];
        e.vx = azar(-15, 15);
        e.vy = azar(-15, 15);
      }
    }
  },
  
  actualizar: function() {
    let conexiones = 0;
    
    // Contar cuantas conexiones hay
    for (let i = 0; i < this.listaColab.length; i++) {
      for (let j = i + 1; j < this.listaColab.length; j++) {
        if (dist(this.listaColab[i].x, this.listaColab[i].y, this.listaColab[j].x, this.listaColab[j].y) < 140) {
          conexiones++;
        }
      }
    }
    
    // Si hay 6 conexiones entre las 4 fig, se unen
    if (!this.unionFig && conexiones === 6) {
      this.unionFig = true; 
    }

    let sumX = 0, sumY = 0;
    for (let i = 0; i < this.listaColab.length; i++) {
      sumX += this.listaColab[i].x;
      sumY += this.listaColab[i].y;
    }
    let cx = sumX / 4;
    let cy = sumY / 4;

    for (let i = 0; i < this.listaColab.length; i++) {
      let e = this.listaColab[i];
      
      if (!this.unionFig) {
        e.vx += (width / 2 - e.x) * 0.0004;
        e.vy += (height / 2 - e.y) * 0.0004;
      } else {
        e.vx += (cx - e.x) * 0.008;
        e.vy += (cy - e.y) * 0.008;
      }

      for (let j = 0; j < this.listaColab.length; j++) {
        let o = this.listaColab[j];
        if (o === e) continue;
        
        let d = dist(e.x, e.y, o.x, o.y);
        if (d < 130 && d > 10) {
          let fuerzaDeAtraccion;
          if (this.unionFig) {
            fuerzaDeAtraccion = 0.004;
          } else {
            fuerzaDeAtraccion = 0.0015;
          }
          e.vx += (o.x - e.x) * fuerzaDeAtraccion;
        }
      }

      if (this.unionFig) {
        e.vx *= 0.85;
        e.vy *= 0.85;
        e.rotarTriang += 0.03;
      } else {
        e.vx *= 0.91;
        e.vy *= 0.91;
        e.rotarTriang += 0.015;
      }
      
      e.x += e.vx;
      e.y += e.vy;
      
// limite de pantalla
      e.x = constrain(e.x, 30, width - 30);
      e.y = constrain(e.y, 30, height - 30);
    }
  },
  
  dibujar: function() {
    strokeWeight(1.5);
    
    // líneas de conexión
    for (let i = 0; i < this.listaColab.length; i++) {
      for (let j = i + 1; j < this.listaColab.length; j++) {
        let d = dist(this.listaColab[i].x, this.listaColab[i].y, this.listaColab[j].x, this.listaColab[j].y);
        if (d < 140) {
          let grosorLinea;
          if (this.unionFig) {
            grosorLinea = 2.5;
          } else {
            grosorLinea = 1.5;
          }
          dibujarLinea(this.listaColab[i].x, this.listaColab[i].y, this.listaColab[j].x, this.listaColab[j].y, ROSA_CLARO, (1 - d / 140) * 0.8, grosorLinea);
        }
      }
    }

    if (this.unionFig) { 
      let sumX = 0, sumY = 0;
      for (let i = 0; i < this.listaColab.length; i++) {
        sumX += this.listaColab[i].x;
        sumY += this.listaColab[i].y;
      }
      let cx = sumX / 4;
      let cy = sumY / 4;
      
      dibujarCirc(cx, cy, 70 + sin(millis() * 0.005) * 15, null, ROSA_OSCURO, 0.15);
    }

    for (let i = 0; i < this.listaColab.length; i++) {
      let e = this.listaColab[i];
      if (e.type === 'circulo') {
        dibujarCirc(e.x, e.y, e.size, e.col, null, 0.9);
      } else if (e.type === 'cuadrado') {
        dibujarRect(e.x, e.y, e.size * 2, e.col, null, 0.9);
      } else if (e.type === 'triangulo') {
        dibujarTriang(e.x, e.y, e.size, e.rotarTriang, e.col, null, 0.9);
      } else if (e.type === 'linea') {
        let cx = cos(e.rotarTriang) * e.size * 1.4;
        let cy = sin(e.rotarTriang) * e.size * 1.4;
        dibujarLinea(e.x - cx, e.y - cy, e.x + cx, e.y + cy, e.col, 0.9, 2);
      }
    }
    
    if (!this.unionFig) {
      textoGuia('pastorear con el cursor para reunirlas');
    } else {
      textoGuia('coexistencia lograda · clic para dispersar');
    }
  }
};

//  ESCENA 7 INCERTIDUMBRE proceso

const S_Incertidumbre = {
  nombreEscena: 'INCERTIDUMBRE', 
  subTituloEscena: 'como desconocimiento del devenir',
  tAns: 0,
  
  iniciar: function() { this.tAns = 0; },
  alClick: function() {},
  alMover: function() {},
  
  actualizar: function() {
    this.tAns += 0.05;
  },
  
  dibujar: function() {
    push();
    textFont('Courier New');
    textAlign(CENTER, CENTER);
    sinLinea();
    
    colorRelleno(ROSA_CLARO);
    textSize(24);
    text('[ EN PROCESO ]', width / 2, height / 2 - 10);
    pop();
  }
};


//  ESCENA 8 ANSIEDAD

const S_Ansiedad = {
  nombreEscena: 'ANSIEDAD', 
  subTituloEscena: 'como pre-ocupación sobre el futuro',
  tAns: 0, 
  intensidadAns: 0.1,
  
  iniciar: function() { 
    this.tAns = 0; 
    this.intensidadAns = 0.1; 
  },
  
  alClick: function() {},
  
  alMover: function(x, y) {
    let d = dist(x, y, width / 2, height / 2);
    let limite = min(width, height) * 0.43;
    let objetivo = max(0.05, 1 - d / limite);
    this.intensidadAns = interpolar(this.intensidadAns, objetivo, 0.09);
  },
  
  actualizar: function() { 
    this.tAns++; 
    this.intensidadAns = interpolar(this.intensidadAns, 0.08, 0.012); 
  },
  
  dibujar: function() {
    let spd = 1 + this.intensidadAns * 4.2;
    
    for (let i = 0; i < 24; i++) {
      let p = i / 23;
      let baseY = height * 0.07 + p * height * 0.86;
      let amp = 26 * this.intensidadAns * (1 - abs(p - 0.5) * 1.5);
      
      let col;
      if (i % 3 === 0) {
        col = ROJO;
      } else if (i % 3 === 1) {
        col = ROSA_OSCURO;
      } else {
        col = ROSA_CLARO;
      }
      
      push();
      colorBorde(col, 0.2 + this.intensidadAns * 0.52); 
      sinRelleno(); 
      strokeWeight(0.75);
      beginShape();
      
      for (let j = 0; j <= 30; j++) {
        let bx = width * 0.055 + (j / 30) * width * 0.89;
        let ruido1 = amp * sin(this.tAns * 0.038 * spd + j * 0.62 + i * 1.08);
        let ruido2 = amp * 0.38 * sin(this.tAns * 0.068 * spd + j * 1.28 + i * 0.72);
        let noise = ruido1 + ruido2;
        vertex(bx, baseY + noise);
      }
      
      endShape();
      pop();
    }
    
    let pulse = sin(this.tAns * 0.055 * (1 + this.intensidadAns * 3.5)) * 13 * this.intensidadAns;
    let cR = 34 + pulse;
    
    dibujarCirc(width / 2, height / 2, cR, ROJO, null, this.intensidadAns * 0.62);
    dibujarCirc(width / 2, height / 2, cR * 0.42, null, ROJO, this.intensidadAns * 0.42);
    dibujarCirc(width / 2, height / 2, 5, null, ROSA_CLARO, 0.72);
  }
};

//  ESCENA 9 EXPECTATIVA

const S_Expectativa = {
  nombreEscena: 'EXPECTATIVA', 
  subTituloEscena: 'como anticipación',
  tAns: 0,
  
  iniciar: function() { this.tAns = 0; },
  alMover: function() {},
  alClick: function() {},
  
  actualizar: function() {
    this.tAns += 0.05;
  },
  
  dibujar: function() {
    push();
    textFont('Courier New');
    textAlign(CENTER, CENTER);
    sinLinea();
    
    colorRelleno(ROSA_CLARO);
    textSize(24);
    text('[ EN PROCESO ]', width / 2, height / 2 - 10);
    pop();
  }
};

//  array de las escenas

const ESCENAS = [
  S_Memoria, S_Herencia, S_Caducidad,
  S_Identidad, S_Empatia, S_Colaboracion,
  S_Incertidumbre, S_Ansiedad, S_Expectativa
];

//  HUD

function drawHUD() {
  let sc = ESCENAS[numEscena];
  
  push();
  textFont('Courier New');
  sinLinea();

  // titulo de la escena
  colorRelleno(ROSA_CLARO, 0.88); 
  textSize(22); 
  textAlign(LEFT);
  text(sc.nombreEscena, 32, 52);

  // Descripcion
  colorRelleno(ROJO, 0.5); 
  textSize(10);
  text(sc.subTituloEscena, 32, 68);

  // Numeracion de palabra
  colorRelleno(ROJO, 0.28); 
  textSize(8); 
  textAlign(RIGHT);
  text((numEscena + 1) + ' / 9', width - 32, 42);

  // guia de teclas (abajo centro)
  colorRelleno(ROJO, 0.18); 
  textAlign(CENTER); 
  textSize(7.5);
  text('1–9 cambiar escena  ·  clic interactuar', width / 2, height - 28);

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

function sigEscena(i) {
  numEscena = i;
  posMouseX = width / 2; 
  posMouseY = height / 2;
  ESCENAS[i].iniciar();
  fadeTransicion = 0;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  posMouseX = width / 2; 
  posMouseY = height / 2;
  sigEscena(0);
}

function draw() {
  // fondo
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

  // escena activa
  ESCENAS[numEscena].actualizar();
  ESCENAS[numEscena].dibujar();

  // HUD se muestra encima
  drawHUD();

  // fade
  fadeTransicion = min(1, fadeTransicion + 0.04);
  
  if (fadeTransicion < 1) {
    push();
    sinLinea();
    fill(BG[0], BG[1], BG[2], (1 - fadeTransicion) * 255);
    rect(0, 0, width, height);
    pop();
  }
}

//  EVENTOS

function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); 
}

function mouseMoved() { 
  posMouseX = mouseX; 
  posMouseY = mouseY; 
  ESCENAS[numEscena].alMover(posMouseX, posMouseY); 
}

function mouseDragged() { 
  posMouseX = mouseX; 
  posMouseY = mouseY; 
  ESCENAS[numEscena].alMover(posMouseX, posMouseY); 
}

function mousePressed() { 
  ESCENAS[numEscena].alClick(mouseX, mouseY); 
}

function touchMoved() { 
  if (touches.length > 0) {
    posMouseX = touches[0].x;
    posMouseY = touches[0].y;
  } else {
    posMouseX = mouseX;
    posMouseY = mouseY;
  }
  ESCENAS[numEscena].alMover(posMouseX, posMouseY); 
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
  ESCENAS[numEscena].alClick(posMouseX, posMouseY); 
  return false; 
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    sigEscena((numEscena + 1) % 9);
  }
  if (keyCode === LEFT_ARROW) {
    sigEscena((numEscena + 8) % 9);
  }
  
  let n = int(key);
  if (n >= 1 && n <= 9) {
    sigEscena(n - 1);
  }
}