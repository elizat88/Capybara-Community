let capybaraImgs = {};
let capybaras = [];
let capybaraSound;

let addInterval = 3000;
let lastAddTime = 0;
let maxCapybaras = 20;
let minDistance = 150;

let isResetting = false;
let resetTime = 2000;
let resetStartTime = 0;
let myFont;


function preload() {
  capybaraImgs.base = loadImage('capybara.png');
  capybaraImgs.baby = loadImage('capy-baby.png');
  capybaraImgs.hat = loadImage('capy-hat.png');
  capybaraImgs.sunglasses = loadImage('capy-sunglasses.png');
  capybaraImgs.tangerine = loadImage('capy-tangerine.png');

  soundFormats('m4a', 'mp3'); // Ensure compatibility
  capybaraSound = loadSound('capy-sound.m4a');

  myFont = loadFont('font.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textFont(myFont);

}

function draw() {
  clear();

  if (isResetting) {
    if (millis() - resetStartTime >= resetTime) {
      isResetting = false;
      lastAddTime = millis();
    } else {
      return;
    }
  }

  if (millis() - lastAddTime > addInterval) {
    addCapybara();
    lastAddTime = millis();
  }

  for (let c of capybaras) {
    if (!c.img || !c.img.width || !c.img.height) continue;

    push();
    translate(c.x, c.y);

    if (c.flipped) scale(-1, 1);

    // saturation tint
    let lowSat = color(150, 150, 150);
    let fullSat = color(255, 255, 255);
    let tintColor = lerpColor(lowSat, fullSat, capybaras.length / maxCapybaras);
    tint(tintColor);

    let scaleFactor = c.clicked && millis() - c.clickTime < 300 ? 1.5 : 1;
    let h = 120 * scaleFactor;
    let w = h * (c.img.width / c.img.height);

    image(c.img, 0, 0, w, h);
    noTint();
    pop();
  }
}



function addCapybara() {
  if (capybaras.length >= maxCapybaras) {
    resetCommunity();
    return;
  }

  let tries = 0;
  let newCapybara;
  let imgKeys = Object.keys(capybaraImgs);
  let randomKey = random(imgKeys);

  do {
    newCapybara = {
      x: random(150, width - 150),
      y: random(150, height - 150),
      img: capybaraImgs[randomKey],
      clicked: false,
      clickTime: 0,
      flipped: random() > 0.5
    };
    tries++;
    if (tries > 300) return;
  } while (!isPositionFree(newCapybara.x, newCapybara.y));

  capybaras.push(newCapybara);
}

function isPositionFree(x, y) {
  for (let other of capybaras) {
    if (dist(x, y, other.x, other.y) < minDistance) {
      return false;
    }
  }
  return true;
}

function resetCommunity() {
  capybaras = [];
  isResetting = true;
  resetStartTime = millis();
}

function mousePressed() {
  let clickedAny = false;

  for (let c of capybaras) {
    let d = dist(mouseX, mouseY, c.x, c.y);
    if (d < 80) {
      c.clicked = true;
      c.clickTime = millis();
      clickedAny = true;
      if (capybaraSound && capybaraSound.isLoaded()) {
        capybaraSound.play();
      }
    }
  }

  // Add a new capybara if clicked on empty space
  if (!clickedAny && !isResetting && capybaras.length < maxCapybaras) {
    addCapybara();
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}