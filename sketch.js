var clefSol;
var clefFa;
var clefUt;

//var buttonColours = generateColours(7);
var gris = '#7a9cac';
//'rgb(122,156,171)';//'#55666e';//225;//

var noir = '#000000';

var colButtons = '#ffffff';

//var buttonsDimensions = [[]];

var mode = 0;

var marge = 10;
var pas = 10;
var factor;

var dy;

var tonas;
var nbrt = 0;

var nbrl = 0;

var vitesse;

var tonas01 = ['sol','ré','la','mi','si','fa#','do#'];
var tonas02 = ['fa','sib','mib','lab','réb','solb','dob'];

var tonas11 = ['mi','si','fa#','do#','sol#','ré#','la#'];
var tonas12 = ['ré','sol','do','fa','sib','mib','lab'];

var degres  = ['do','ré','mi','fa','sol','la','si'];

var buttons2 = ['y','a','q','x','s','w','c','d','e','v','f','r','b','g','t','n','h','z','m','j','u'];

                //var buttons3 = ['a','s','d','f','g','h','j'];
//var buttons4 = ['y','x','c','v','b','n','m'];

var buttons = [];
var button = -1;

var time = 0;

var hasLost = false;
var hasBegun = false;
var help = false;

var highscore = 251;
var newRecord = false;
var pseudo = 'Mozart';
var pseudoOk = false;

var lostMessage = '';

window.sessionStorage.removeItem('temp');

class Tona {
  constructor(arm, x) {
    if (help) {
      this.armature = arm;
      this.x = x;
    } else {
      var a = floor(random(-7,7));
      if(a >= 0) {
        a++;
      }
      this.armature = a;
      this.x = width-1.5*marge;
    }
    this.adjustY();
    this.colour = noir;
  }

  adjustY() {
    this.y = height / 2 + 1.6 * dy;
  }

  setColour(c) {
    this.colour = c;
  }

  draw() {
    noStroke();
    fill(this.colour);
    textFont(font);
    textSize(5.1*marge);
    var pitch; // fa = 0
    if(this.armature > 0) {
      for(let d = 0; d < this.armature; d++) {
        switch(d) {
          case 0:
            pitch = 7;
            break;
          case 1:
            pitch = 4;
            break;
          case 2:
            pitch = 8;
            break;
          case 3:
            pitch = 5;
            break;
          case 4:
            pitch = 2;
            break;
          case 5:
            pitch = 6;
            break;
          case 6:
            pitch = 3;
            break;
        }
        text('<',this.x+(d-this.armature)*marge,
                 this.y+(1.075-pitch/2)*marge);
      }
    } else {
      for(let d = 0; d < -this.armature; d++) {
        switch(d) {
          case 0:
            pitch = 3;
            break;
          case 1:
            pitch = 6;
            break;
          case 2:
            pitch = 2;
            break;
          case 3:
            pitch = 5;
            break;
          case 4:
            pitch = 1;
            break;
          case 5:
            pitch = 4;
            break;
          case 6:
            pitch = 0;
            break;
        }
        text('>',this.x+(d+this.armature)*marge,
                 this.y+(0.95-pitch/2)*marge);
      }
    }
    textFont(fontL);
  }

  move(v) {
    this.x -= v;
  }

  position() {
    return this.x-abs(this.armature)*marge;
  }

  getY() {
    return this.y - 0.35 * marge;
  }
}

class Button
{
  constructor(texte)
  {
    this.texte = texte;
    var f;
    switch(texte)
    {
      case 'dob':
      case 'do':
      case 'do#':
        f = 0.05;   break;
      case 'réb':
      case 'ré':
      case 'ré#':
        f = 0.1; break;
      case 'mib':
      case 'mi':
      case 'mi#':
        f = 0.23; break;
      case 'fab':
      case 'fa':
      case 'fa#':
        f = 0.34; break;
      case 'solb':
      case 'sol':
      case 'sol#':
        f = 0.45; break;
      case 'lab':
      case 'la':
      case 'la#':
        f = 0.275;break;
      case 'sib':
      case 'si':
      case 'si#':
        f = 0.1; break;
    }
    
    this.rY = random(-5, -3.5)*(0.2+f/0.2);
    this.rW = random(0.42, 0.7)*(0.7+f/0.75);
    this.rH = random(0.45, 0.6)*(0.6+f/0.6);
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y + pas * this.rY;
  }

  setColour(c) {
    switch (c) {
      case 0:
        this.colour = noir;
        this.texCol = '#ffffff';
        break;
      case 1:
        this.colour = '#108fd2';
        this.texCol = '#ffffff';
        break;
      case 2:
        this.colour = '#e53917';
        this.texCol = '#ffffff';
        break;
      case 3:
        this.colour = '#fedf00';
        this.texCol = noir;
        break;
      case 4:
        this.colour = '#e00079';
        this.texCol = '#ffffff';
        break;
      default:
        this.colour = '#55666e';
        this.texCol = '#ffffff';
        break;
    }
  }

  draw(b) {
    noStroke();

    this.w = 3.5 * marge * (1 + this.rW);
    
    this.h = 10 * pas * (1 + this.rH);

    fill(255);
    rect(this.x - this.w / 2 - 0.5 * marge, this.y - this.h / 2 - pas,
      this.w + marge, this.h + 2 * pas);

    fill(b ? noir : this.colour);

    rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);

    textAlign(CENTER, CENTER);
    textSize(2.6 * marge);
    fill(b ? this.colour : this.texCol);
    
    let a = this.texte.slice(-1);
    switch(a)
    {
      case 'b':
        textAlign(RIGHT,CENTER);
        text(this.texte.slice(0,-1), this.x+(factorAlt(this.texte.slice(0,-1)))*4*marge, this.y - pas);
        textAlign(LEFT,CENTER);
        textFont(font);
        textSize(5.1*marge);
        text('>', this.x+(factorAlt(this.texte.slice(0,-1)))*4*marge, this.y-pas+ 0.26*marge);
        textFont(fontL);
        textAlign(CENTER,CENTER);
        break;
      case '#':
        textAlign(RIGHT,CENTER);
        text(this.texte.slice(0,-1), this.x+(factorAlt(this.texte.slice(0,-1)))*4*marge, this.y - pas);
        textAlign(LEFT,CENTER);
        textFont(font);
        textSize(5.1*marge);
        text('<', this.x+(factorAlt(this.texte.slice(0,-1)))*4*marge, this.y - 1*pas);
        textFont(fontL);
        textAlign(CENTER,CENTER);
        break;
      default :
        text(this.texte, this.x, this.y - pas);
        break;
    }
  }

  getX() {
    return this.x - this.w / 2;
  }

  getY() {
    return this.y - this.h / 2;
  }
}

function factorAlt(note)
{
  switch(note)
  {
    case 'do' : return 0.25;
    case 'ré' : return 0.17;
    case 'mi' : return 0.25;
    case 'fa' : return 0.17;
    case 'sol': return 0.3;
    case 'la' : return 0.12;
    case 'si' : return 0.12;
    default   : return 0.25;
  }
}

function drawHelpButton() {
  noStroke();
  //fill(225);
  fill(colButtons);
  let x = width / 2;
  let y = height / 15;
  let r = 2.2 * factor;

  circle(x, y, r);

  noStroke();
  fill(noir);
  textAlign(CENTER, CENTER);
  textSize(3.8 * factor);
  text(help ? '' : '?', x, y - 0.5 * factor);

  if (help) {
    let taille = factor;
    stroke(noir);
    strokeWeight(factor / 4.6);
    line(x - taille, y - taille, x + taille, y + taille);
    line(x - taille, y + taille, x + taille, y - taille);
    noStroke();
  }
}

function fact(num)
{
    var rval=1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}

function drawHelp() {
  noStroke();
  fill(255);

  rect(0, 0, width, 0.4 * height);

  drawHelpButton();

  let y = dy;
  dy = -0.31 * height;
  factor /= 1.4;
  drawModes();
  factor *= 1.4;
  dy = y;
  
  if(height > width)
  {
    dy = -0.1 * height;
    marge /= 2.6;
  }
  
  drawPortee();
  
  for (let a = -7; a < 7; a++) {
    let x = 7*marge+(8+a)*(width-12*marge)/14;
    let tona = new Tona(a+(a>=0?1:0), x);
    let t = tonaToButton(a+(a>=0?1:0));

    let y = tona.getY();

    if (t == button) {
      let c = buttons[t].colour;
      tona.setColour(c);
      fill(c);
    } else {
      fill(noir);
    }

    noStroke();
    
    textAlign(CENTER, CENTER);
    textSize(2 * marge);
    
    let texte = (mode==0?(a>=0?tonas01[a]:tonas02[-a-1]):
                  (a>=0?tonas11[a]:tonas12[-a-1]));
    
    let posX = x-marge*abs(a+(a>=0?1:0))/2-marge/2;
    let posY = y+4*marge;
    
    let alt = texte.slice(-1);
    switch(alt)
    {
      case 'b':
        textAlign(RIGHT,CENTER);
        text(texte.slice(0,-1), posX+(factorAlt(texte.slice(0,-1)))*2*marge, posY);
        textAlign(LEFT,CENTER);
        textFont(font);
        textSize(3.9*marge);
        text('>', posX+(factorAlt(texte.slice(0,-1)))*2*marge, posY+0.2*marge);
        textAlign(CENTER,CENTER);
        break;
      case '#':
        textAlign(RIGHT,CENTER);
        text(texte.slice(0,-1), posX+(factorAlt(texte.slice(0,-1)))*2*marge, posY);
        textAlign(LEFT,CENTER);
        textFont(font);
        textSize(3.9*marge);
        text('<', posX+(factorAlt(texte.slice(0,-1)))*2*marge, posY);
        textFont(fontL);
        textAlign(CENTER,CENTER);
        break;
      default :
        text(texte, posX, posY);
        break;
    }

    tona.draw();
  }
  
  if(height > width)
  {
    marge *= 2.6;
    dy = y;
  }// ici

  textAlign(CENTER, CENTER);
  textSize(1.7 * marge);
  
  for (let d = 0; d < 21; d++) {
    let x = buttons[d].x;
    let y = buttons[d].y + buttons[d].h / 2;
    noStroke();
    fill(255);
    rect(x - buttons[d].w / 2, y, buttons[d].w, 2.5 * pas);
    if (d == button) {
      fill(buttons[d].colour);
    } else {
      fill(noir);
    }
    text(buttons2[d], x, y+1.5*pas);
  }
}

function drawModes() {

  textAlign(CENTER,CENTER);

  strokeWeight(factor / 4);
  textSize(2*factor);
  
  let x, y, r;
  
  x = width / 2 - 5 * factor;
  y = height / 2 - 1.5 * factor + dy;
  r = 4.2 * factor;
  
  fill(colButtons);
  circle(x, y, r);
  fill(0);
  text('Majeur',x, y);
  
  if (help && mode == 0) {
    stroke(noir);
    line(x-r,y-r,x+r,y-r);
    noStroke();
  }
  
  x = width/2 + 5 * factor;
  
  fill(colButtons);
  circle(x, y, r);
  fill(0);
  text('Mineur', x, y);
  
  if (help && mode == 1) {
    stroke(noir);
    line(x-r,y-r,x+r,y-r);
    noStroke();
  }
  
  if (!help) {
    noStroke();
    textAlign(CENTER, CENTER);
    fill(gris);
    textSize(2 * factor);
    text('Choisis le mode pour commencer :',
      width / 2, 17 * height / 40 - 6 * pas + dy);
  }
}

function drawPortee() {
  noStroke();
  fill(255);

  let y = height / 2 + 1.6 * dy;

  rect(0, y - 5 * marge, width, 10 * marge);

  stroke(noir);
  strokeWeight(marge / 10);
  line(marge, y - 2 * marge,
    width - marge, y - 2 * marge);
  line(marge, y - marge,
    width - marge, y - marge);
  line(marge, y,
    width - marge, y);
  line(marge, y + marge,
    width - marge, y + marge);
  line(marge, y + 2 * marge,
    width - marge, y + 2 * marge);

  imageMode(CENTER);
  image(clefSol, 3 * marge, y + marge / 6,
        117 / 25 * marge, 200 / 25 * marge);
}

function drawButtons() {
  noStroke();
  fill(255);
  rect(0, 3 * height / 4 - 10 * pas, width, height / 4 + 10 * pas);

  colours = [1, 1, 2, 2, 3, 3, 4, 4];
  var c;
  var cAct;

  for (let d = 0; d < 21; d++) {
    let degr = floor(d/3);
    buttons.push(new Button(degres[degr]+
                            (d-3*degr==0?'b':
                             (d-3*degr==1?'':'#'))));

    if(3*degr == d)
    {
      c = floor(random(0, colours.length));
      while (colours[c] == cAct) {
        c = floor(random(0, colours.length));
      }
      cAct = colours[c];
      colours.splice(c, 1);
    }

    buttons[buttons.length - 1].setColour(cAct);

    /*noStroke();
    fill(d==button?0:200);
    circle(x,y,3*marge);
    
    textAlign(CENTER,CENTER);
    textSize(2.6*marge);
    fill(d==button?200:0);
    text(degres[d],width/2-(21-7*d)*marge,3*height/4);*/
  }

  adjustButtons();
}

function adjustButtons()
{
  for (let d = 0; d < 21; d++) {
    let degr = floor(d/3);
    let esp;
    switch(degr)
    {
      case 0: esp = 1.6; break;
      case 1: esp = 1.85; break;
      case 2: esp = 2; break;
      case 3: esp = 2.07; break;
      case 4: esp = 2.07; break;
      case 5: esp = 2.05; break;
      case 6: esp = 2; break;
    }
    let x = width / 2 - (21 - 7 * degr) * marge;
    let y = 2 * height / 3 + (esp*(3*degr-d)+3.2)*12*pas;

    buttons[d].setPosition(x, y);
    buttons[d].draw(d == button);
  }
}

function drawPseudoButton()
{
  noStroke();
  fill(255);
  rect(0, height / 2 - 6 * factor - 9 * pas + dy, width, 12 * factor + 9 * pas);

  textAlign(CENTER, CENTER);
  /*fill(gris);
  textSize(2 * factor);
  text('Presse ENTER pour recommencer',
    width / 2, 17 * height / 40 - 6 * pas + dy);*/

  let decalage = 1.3;
  
  //fill(225);
  fill(colButtons);
  ellipse(width / 2, height / 2 + decalage*dy, 18 * factor , 9 * factor);

  fill(noir);
  textSize(2 * factor);
  text('Inscris ton nom', width / 2, height / 2 - pas / 2 + decalage*dy);
}

function drawLostButtons() {

  noStroke();
  fill(255);
  rect(0, height / 2 - 6 * factor - 9 * pas + dy, width, 12 * factor + 9 * pas);

  textAlign(CENTER, CENTER);
  /*fill(gris);
  textSize(2 * factor);
  text('Presse ENTER pour recommencer',
    width / 2, 17 * height / 40 - 6 * pas + dy);*/

  let decalage = 1.3;
  
  //fill(225);
  fill(colButtons);
  circle(width / 2 - 6 * factor, height / 2 + decalage*dy, 4.5 * factor);
  circle(width / 2 + 6 * factor, height / 2 + decalage*dy, 4.5 * factor);

  fill(noir);
  textSize(1.8 * factor);
  text('Nouvelle\npartie', width / 2 - 6 * factor, height / 2 - pas / 2 + decalage*dy);
  textSize(1.8 * factor);
  text('Changer\nde mode',
    width / 2 + 6 * factor, height / 2 - pas / 2 + decalage*dy);
}

function tonaToButton(t) {
  if(mode == 0) { // majeur
    switch(t) {
      case -7:
        return 0;
      case -6:
        return 12;
      case -5:
        return 3;
      case -4:
        return 15;
      case -3:
        return 6;
      case -2:
        return 18;
      case -1:
        return 10;
      case 1:
        return 13;
      case 2:
        return 4;
      case 3:
        return 16;
      case 4:
        return 7;
      case 5:
        return 19;
      case 6:
        return 11;
      case 7:
        return 2;
    }
  } else { // mineur
    switch(t) {
      case -7:
        return 15;
      case -6:
        return 6;
      case -5:
        return 18;
      case -4:
        return 10;
      case -3:
        return 1;
      case -2:
        return 13;
      case -1:
        return 4;
      case 1:
        return 7;
      case 2:
        return 19;
      case 3:
        return 11;
      case 4:
        return 2;
      case 5:
        return 14;
      case 6:
        return 5;
      case 7:
        return 17;
    }
  }
}

function checkAnswer() {
  let t = tonaToButton(tonas[0].armature);

  if (button == t && !hasLost) {
    tonas.splice(0, 1);
    nbrt++;
    if(nbrt == highscore+1)
    {
      newRecord = true;
    }
    if (tonas.length == 0) {
      tonas = [new Tona()];
    }
  } else if (button == -1) {} else {
    lostMessage = "Perdu ! C'était ".concat(buttons[tonaToButton(tonas[0].armature)].texte,'...');
    
    loose();
    button = -1;
    cursor(ARROW);
  }
}

function loose() {

  hasLost = true;

  if(newRecord && !pseudoOk)
  {
    drawPseudoButton();
    highscore = nbrt;
    pseudo = 'anonyme';
  }
  else
  {
    drawLostButtons();
  }

  noStroke();

  fill(255);

  rect(0, 0, width, height / 3.6);

  drawHelpButton();

  textAlign(CENTER, CENTER);
  fill(noir);
  textSize(4 * factor);
  //textFont(fontM);

  var str;
  if(newRecord) {
    str = 'Record battu !!';
  } else if (lostMessage != '') {
    str = lostMessage;
  } else {
    str = 'Perdu !';
  }
  
  var posX = width / 2;
  var posY = height / 4.2;
  
  if(str.slice(-3) == '...')
  {
    var texte = str.slice(16,-3);
    let alt   = texte.slice(-1);
    switch(alt)
    {
      case 'b':
        str = str.replace('b','  ');
        text(str, posX, posY);
        textFont(font);
        textSize(8*factor);
        text('>', posX+11.5*factor+(factorAlt(texte.slice(0,-1)))*6*factor, posY+0.4*factor);
        break;
      case '#':
        str = str.replace('#','  ');
        text(str, posX, posY);
        textFont(font);
        textSize(7*factor);
        text('<', posX+11.5*factor+(factorAlt(texte.slice(0,-1)))*6*factor, posY+0.1*factor);
        textFont(fontL);
        break;
      default :
        text(str, posX, posY);
        break;
    }
  }
  else
  {
    text(str, posX, posY);
  }
  
  fill(gris);
  textFont(fontL);
  textSize(2 * factor);
  
  textAlign(CENTER, CENTER);
  text('Record :'+' '+highscore+(pseudo=='anonyme'?'':' ( '+pseudo+' )'),
    width / 2 + 0.2*factor, height / 8.2);
  //textAlign(LEFT, CENTER);
  //text(' '+highscore+(pseudo=='anonyme'?'':' ( '+pseudo+' )'),
  //  width / 2 + 0.2*factor, height / 8.2);
  
  //textAlign(RIGHT, CENTER);
  text('Score :'+' '+nbrt,
    width / 2 + 0.2*factor, height / 6.3);
  //textAlign(LEFT, CENTER);
  //text(' '+nbrt,
  //  width / 2 + 0.2*factor, height / 6.3);
  
  //textAlign(CENTER, CENTER);

  button = -1;
  adjustButtons();

  if (nbrt > highscore) {
    //newRecord = true;
  } else {
    noLoop();
  }
}

function restart() {
  noStroke();
  fill(255);
  rect(0, 0, width, height);

  hasLost = false;
  pseudoOk = false;

  adjustButtons();

  tonas = [new Tona()];
  nbrt = 0;
  vitesse = 1.2;
  newRecord = false;
  lostMessage = '';
  window.sessionStorage.removeItem('temp');

  nbrl = 3;

  loop();
}

function refresh()
{
  noStroke();
  fill(255);
  rect(0,0,width,height);
  
  if (help) {
    adjustButtons();
    drawHelp();
  } else if (!hasBegun) {
    setup();
    draw();
  } else if (!hasLost) {
    adjustButtons();
    for (let n = 0; n < tonas.length; n++) {
      tonas[n].adjustY();
    }
  } else {
    loose();
  }
}

function setMarge() {
  if (width / height > 2.8) {
    marge = width / 250;
  } else if (height > width) {
    marge = width / 53;
  } else {
    //marge = width / 150;
    marge = width / 120;
  }
  pas = height / 150;
  dy = -15 * pas;
  factor = sqrt(pow(marge + pas, 2), pow(marge + pas, 2)) / 1.5;
}

var myUrl = 'https://www.cmne.ch/index.php?id=321&type=101&act=';

var response;

function gotData(data)
{
  if(data != null)
  {
    highscore = data['0'].score;
    pseudo    = data['0'].pseudo;
  } else {
    console.log('erreur lors du chargement du highscore')
    highscore = 249;
    pseudo    = Mozart;
  }
}

function preload()
{
  //loadJSON(myUrl+'listscore&g=2',gotData);
  
  clefSol = loadImage('clef_sol.png');
  //clefFa = loadImage('clef_fa.png');
  //clefUt = loadImage('clef_ut.png');

  fontM = loadFont('medium.otf');
  fontL = loadFont('light.otf');
  
  font  = loadFont('font.ttf');
}

function setup() {  
  createCanvas(windowWidth, windowHeight);
  //createCanvas(400,400);

  textFont(fontL);
  strokeCap(SQUARE);

  setMarge();

  frameRate(60);

  background(255);

  tonas = [new Tona()];
  nbrt = 0;
  vitesse = 1.2;
  newRecord = false;
  pseudoOk = false;

  if (buttons.length == 0) {
    drawButtons();
  } else {
    adjustButtons();
  }

  noStroke();

  fill(gris);
  textSize(2 * factor);
  
  textAlign(CENTER,CENTER);
  text('Record :'+' '+highscore+(pseudo=='anonyme'?'':' ( '+pseudo+' )'),
       width / 2 + 0.2*factor, height / 8.2);
  //textAlign(LEFT,CENTER);
  //text(' '+highscore+(pseudo=='anonyme'?'':' ( '+pseudo+' )'),
  //     width / 2 + 0.2*factor, height / 8.2);
  
  //textAlign(CENTER, CENTER);

  fill(noir);
  textSize(6 * factor);
  //textFont(fontM);
  text('Acceleratons', width / 2, height / 5.3);
  textFont(fontL);

  drawHelpButton();

  drawModes();

  noStroke();
  textSize(1.8 * marge);
  fill(noir);

  for (let d = 0; d < 7; d++) {
    let x = width / 2 - (15 - 5 * d) * marge;
    let y = 3 * height / 4;

    //text(buttons4[d],width/2-(21-7*d)*marge,y-4*marge);
  }

  //text('ou',width/2,25.5*height/40);

  noLoop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  background(255);

  noStroke();
  fill(255);
  rect(0, 0, width, height);

  setMarge();

  /*if (help) {
    drawHelp();
  } else if (!hasBegun) {
    setup();
    draw();
  } else if (!hasLost) {
    for (let n = 0; n < notes.length; n++) {
      notes[n].adjustY();
    }
  } else {
    loose(false);
  }*/
  
  refresh();
}

var fps, difficulty, limit;

function draw() {
  fps = frameRate();
  if (fps > 10) {
    difficulty = (Math.log(nbrt / 5 + 2) + 0.5);
    vitesse = 0.04 * difficulty * (width - 7 * marge) / fps;
  }

  //frameRate(60);
  /*noStroke();
  fill(255);
  rect(0,0,100,100);
  fill(noir);
  textSize(10);
  text(displayDensity(),10,5);*/

  /*if (help) {
    if (button != -1 && millis() - time > 1000) {
      button = -1;
      //adjustButtons();
      refresh();
      //drawHelp();
    }
  } else {
    */if (button != -1 && millis() - time > 200) {
      checkAnswer();
      button = -1;
      adjustButtons();
    }
  //}

  if (hasBegun && !hasLost && !help) {

    noStroke();
    fill(255);
    rect(0, 6 * height / 40 - 2 * marge, width, 4 * marge);
    fill(noir);
    textSize(3 * factor);
    textAlign(CENTER, CENTER);
    text('Score :'+' '+nbrt,
         width / 2, 6 * height / 40);
    /*textAlign(LEFT, CENTER);
    text(' '+nbrt,
         width / 2 + 0.2*factor, 6 * height / 40);*/
  
    //textAlign(CENTER, CENTER);

    drawPortee();

    for (let n = 0; n < tonas.length; n++) {
      tonas[n].move(vitesse);
      tonas[n].draw();
    }
  }

  if (tonas[tonas.length - 1].position() < 5 * marge + 6.5 * (width - 7 * marge) / 10) {
    tonas.push(new Tona());
  }

  if (tonas[0].position() < 5 * marge) { // a atteint la clef
    //notes.splice(0,1);
    if (button != -1) {
      checkAnswer();
    } else if (!hasLost){
      lostMessage = '';
      loose();
      time = millis();
    }
  }

  if (hasLost && newRecord && millis() - time > 300)
  {
    noLoop();
  }
}

function mousePressed() {
  if ((hasBegun && !hasLost) || help) { // buttons
    if (button != -1 && !help) {
      checkAnswer();
    }
    for (let d = 0; d < 21; d++) {
      let xMin = buttons[d].getX();
      let xMax = buttons[d].w + xMin;
      let yMin = buttons[d].getY();
      let yMax = buttons[d].h + yMin;

      if (mouseX > xMin && mouseX <= xMax &&
        mouseY > yMin && mouseY <= yMax) {
        button = d;
        adjustButtons();
        time = millis();
        if (help) {
          //drawHelp();
          refresh();
        } else {
          tonas[0].setColour(buttons[d].colour);
          //console.log(buttons[d].texte);
        }
      }
    }

    if (help) { // help modes
      var ymem = dy;
      dy = -0.31 * height;
      factor /= 1.4;
      for (let m = 0; m < 2; m++) {
        let x = width / 2 - (5 - 10 * m) * factor;
        let y = height / 2 - 1.5 * factor + dy;
        let dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));

        if (dist <= 4.2 * factor) {
          cursor(ARROW);
          mode = m;
          factor *= 1.4;
          dy = ymem;
          //drawHelp();
          refresh();
          return;
        }
      }
      factor *= 1.4;
      dy = ymem;
    }
  } else if (!hasBegun) { // modes
    for (let m = 0; m < 2; m++) {
      let x = width / 2 - (5 - 10 * m) * factor;
      let y = height / 2 - 1.5 * factor + dy;
      let dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));

      if (dist <= 4.2 * factor) {
        cursor(ARROW);
        mode = m;
        noStroke();
        fill(255);
        rect(0, 0, width, height);
        adjustButtons();
        hasBegun = true;
        loop();
      }
    }
  }
  else if (hasLost) {
    if(!newRecord || pseudoOk) // lost buttons
    {
      let x = width / 2 - 6 * factor;
      let y = height / 2 + 1.3*dy;
      let dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));
      if (dist <= 4.5 * factor) {
        cursor(ARROW);
        restart();
        //refresh();
      }
      
      x = width / 2 + 6 * factor;
      dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));
      if (dist <= 5 * factor) {
        cursor(ARROW);
        hasBegun = false;
        hasLost = false;
        //setup();
        refresh();
      }
    }
    else // pseudo button
    {
      let x = width / 2;
      let y = height / 2 + 1.3*dy;
      let dist = pow(x-mouseX,2)/pow(9*factor,2)+
                 pow(y-mouseY,2)/pow(4.5*factor,2);
      if (dist <= 1)
      {
        cursor(ARROW);
        
        pseudo = window.prompt('Inscris ton nom :');
        
        if (pseudo == null ||
            pseudo == '' ||
            pseudo == 'null') {
          pseudo = 'anonyme';
        }
        else
        {
          pseudoOk = true;
        }
        loose();
      }
      var i;
      
      while(httpGet(myUrl+'setscore&g=2&s='+highscore+'&p='+pseudo) == null)
      {
        i++;
        if(i > 1000)
        {
          console.log("erreur lors de l'upload du highscore");
          break;
        }
      }
      refresh();
    }
  }

  if (!hasBegun || hasLost || help) { // help button
    let x = width / 2;
    let y = height / 15;
    let r = 2.2 * factor;
    let dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));

    if (dist <= r) {
      if (help) {
        help = false;
        //hasBegun = false;
        //hasLost = false;
        //setup();
        button = -1;
        refresh();
      } else {
        help = true;
        //drawHelp();
        refresh();
      }
    }
  }

  return false;
}

function mouseMoved() {
  cursor(ARROW);
  if ((hasBegun && !hasLost) || help) { // buttons
    for (let d = 0; d < 21; d++) {
      let xMin = buttons[d].getX();
      let xMax = buttons[d].w + xMin;
      let yMin = buttons[d].getY();
      let yMax = buttons[d].h + yMin;

      if (mouseX > xMin && mouseX <= xMax &&
        mouseY > yMin && mouseY <= yMax) {
        cursor(HAND);
      }
    }

    if (help) { // help modes
      var ymem = dy;
      dy = -0.31 * height;
      factor /= 1.4;
      for (let m = 0; m < 2; m++) {
        let x = width / 2 - (5 - 10 * m) * factor;
        let y = height / 2 - 1.5 * factor + dy;
        let dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));

        if (dist <= 4.2 * factor) {
          factor *= 1.4;
          dy = ymem;
          cursor(HAND);
          return;
        }
      }
      factor *= 1.4;
      dy = ymem;
    }
  } else if (!hasBegun) { // modes
    for (let m = 0; m < 2; m++) {
      let x = width / 2 - (5 - 10 * m) * factor;
      let y = height / 2 - 1.5 * factor + dy;
      let dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));

      if (dist <= 4.2 * factor) {
        cursor(HAND);
      }
    }
  }
    else if (hasLost) {
    if(!newRecord || pseudoOk) // lost buttons
    {
      let x = width / 2 - 6 * factor;
      let y = height / 2 + 1.3*dy;
      let dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));
      if (dist <= 4.5 * factor) {
        cursor(HAND);
      }
      
      x = width / 2 + 6 * factor;
      dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));
      if (dist <= 5 * factor) {
        cursor(HAND);
      }
    }
    else // pseudo button
    {
      let x = width / 2;
      let y = height / 2 + 1.3*dy;
      let dist = pow(x-mouseX,2)/pow(9*factor,2)+
                 pow(y-mouseY,2)/pow(4.5*factor,2);
      if (dist <= 1) {
        cursor(HAND);
      }
    }
  }

  if (!hasBegun || hasLost || help) { // help button
    let x = width / 2;
    let y = height / 15;
    let r = 2.2 * factor;
    let dist = sqrt(pow(x - mouseX, 2) + pow(y - mouseY, 2));

    if (dist <= r) {
      if (help) {
        cursor(HAND);
      } else {
        cursor(HAND);
      }
    }
  }

  return false;
}

function mouseReleased() {
  if (help && button != -1) {
    button = -1;
    refresh();
  }
}

function keyPressed() {

  if (button != -1 && !help) {
    checkAnswer();
  }

  switch (keyCode) {
    case 81 :
      button = 2;
      break;
    case 65 :
      button = 1;
      break;
    case 89 :
      button = 0;
      break;
    case 87 :
      button = 5;
      break;
    case 83 :
      button = 4;
      break;
    case 88 :
      button = 3;
      break;
    case 69 :
      button = 8;
      break;
    case 68 :
      button = 7;
      break;
    case 67 :
      button = 6;
      break;
    case 82 :
      button = 11;
      break;
    case 70 :
      button = 10;
      break;
    case 86 :
      button = 9;
      break;
    case 84 :
      button = 14;
      break;
    case 71 :
      button = 13;
      break;
    case 66 :
      button = 12;
      break;
    case 90 :
      button = 17;
      break;
    case 72 :
      button = 16;
      break;
    case 78 :
      button = 15;
      break;
    case 85 :
      button = 20;
      break;
    case 74 :
      button = 19;
      break;
    case 77 :
      button = 18;
      break;
    case 13 :
      if (hasLost && (!newRecord || pseudoOk)) {
        restart();
        //refresh();
      }
  }

  if (((!hasLost && hasBegun) || help) && button != -1) {
    adjustButtons();
    time = millis();
    if (help) {
      //drawHelp();
      refresh();
    } else {
      notes[0].setColour(buttons[button].colour);
    }
  } else {
    button = -1;
  }

  return false;
}

function keyReleased() {
  if (help && button != -1) {
    button = -1;
    refresh();
  }
}