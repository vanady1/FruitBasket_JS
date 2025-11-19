let img;
let points = [];
let dragging = null;
let hovered = null;
let bigPoint;
let collectedFruits = [];
let hoveredFruit = null;
let imageFiles = [
  { name: "Zitrone", file: "zitrone.png" },
  { name: "Apfel", file: "apfel.png" },
  { name: "Qiwi", file: "qiwi.png" },
  { name: "Gurke", file: "gurke.png" },
  { name: "Orange", file: "orange.png" },
  { name: "Zimt", file: "zimt.png" },
  { name: "Banane", file: "banane.png" },
  { name: "Blaubeere", file: "blaubeere.png" },
  { name: "Himbeere", file: "himbeere.png" },
  { name: "Lime", file: "lime.png" },
  { name: "Minze", file: "minze.png" },
  { name: "Birne", file: "birne.png" }
];

let images = [];
let fruitPositions = [
  { x: 440, y: 320, img: "zitrone.png", individualSize: 140 },
  { x: 350, y: 350, img: "orange.png", individualSize: 180 },
  { x: 280, y: 380, img: "zimt.png", individualSize: 140 },
  { x: 280, y: 320, img: "gurke.png", individualSize: 110 },
  { x: 352, y: 300, img: "qiwi.png", individualSize: 160 },
  { x: 412, y: 280, img: "apfel.png", individualSize: 170 },
  { x: 240, y: 350, img: "banane.png", individualSize: 150 },
  { x: 240, y: 400, img: "blaubeere.png", individualSize: 100 },
  { x: 330, y: 400, img: "himbeere.png", individualSize: 100 },
  { x: 400, y: 380, img: "lime.png", individualSize: 120 },
  { x: 470, y: 380, img: "minze.png", individualSize: 60 },
  { x: 500, y: 300, img: "birne.png", individualSize: 130 }
];

let baseWidth = 709;
let baseHeight = 569;
let bgWidth = 1440;
let bgHeight = 850;

function preload() {
  img = loadImage("background.jpg");
  for (let entry of imageFiles) {
    images.push({ name: entry.name, img: loadImage("fruits/" + entry.file), file: entry.file });
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  bigPoint = { x: windowWidth * (295 / baseWidth), y: windowHeight * (240 / baseHeight), size: 120,color: red , alpha: 100 };
  generatePoints();
}

function generatePoints() {
  points = [];
  let scaleX = windowWidth / baseWidth;
  let scaleY = windowHeight / baseHeight;

  for (let i = 0; i < fruitPositions.length; i++) {
    let fruit = fruitPositions[i];
    let imgData = images.find(img => img.file === fruit.img);
    points.push({
      x: fruit.x * scaleX,
      y: fruit.y * scaleY,
      size: fruit.individualSize * min(scaleX, scaleY),
      img: imgData.img,
      name: imgData.name,
      hitboxSize: 70,
      alpha: 255
    });
  }
}

function draw() {
  background(0);
  let imgAspect = bgWidth / bgHeight;
  let screenAspect = windowWidth / windowHeight;
  let scaleFactor = screenAspect > imgAspect ? windowWidth / bgWidth : windowHeight / bgHeight;

  let imgWidth = bgWidth * scaleFactor;
  let imgHeight = bgHeight * scaleFactor;

  image(img, width / 2, height / 2, imgWidth, imgHeight);

  noStroke();
  for (let point of points) {
    let aspectRatio = point.img.width / point.img.height;
    let newWidth = point.size * aspectRatio;
    let newHeight = point.size;

    if (newWidth > newHeight) {
      newWidth = point.size;
      newHeight = point.size / aspectRatio;
    }

    let isHoveredOrDragging = (point === dragging || point === hovered);
    fill(255, 255, 255, isHoveredOrDragging ? 100 : 0);
    ellipse(point.x, point.y, point.hitboxSize);

    let d = dist(point.x, point.y, bigPoint.x, bigPoint.y);
    if (d < bigPoint.size / 2) {
      point.alpha = 0;
    } else {
      point.alpha = 255;
    }

    fill(255, 255, 255, point.alpha);
    image(point.img, point.x, point.y, newWidth, newHeight);
  }

  drawFruitList();
}

function drawFruitList() {
  textSize(24);
  textAlign(LEFT, CENTER);
  let xStart = 30;
  let yStart = 150;
  let spacing = 30;

  fill(255);
  text("In The Basket", xStart, yStart);

  for (let i = 0; i < imageFiles.length; i++) {
    let fruit = imageFiles[i];
    let yOffset = yStart + (i + 1) * spacing;

    let isInBasket = collectedFruits.includes(fruit.name);
    let status = isInBasket ? "✅" : "❌";

    if (hoveredFruit === fruit.name) {
      status = isInBasket ? "❌" : "✅";
    }

    fill(hoveredFruit === fruit.name ? color(200, 200, 200) : 255);
    textSize(20);
    text(status + " " + fruit.name, xStart, yOffset);
  }
}

function mouseMoved() {
  hovered = null;
  hoveredFruit = null;
  
  let xStart = windowWidth - 220;
  let yStart = 150;
  let spacing = 30;
  
  for (let i = 0; i < imageFiles.length; i++) {
    let fruit = imageFiles[i];
    let yOffset = yStart + (i + 1) * spacing;
    let hitboxX = 30;
    let hitboxY = yOffset - 10;
    let hitboxW = 150;
    let hitboxH = 25;

    if (mouseX > hitboxX && mouseX < hitboxX + hitboxW && mouseY > hitboxY && mouseY < hitboxY + hitboxH) {
      hoveredFruit = fruit.name;
      break;
    }
  }

  for (let point of points) {
    let d = dist(mouseX, mouseY, point.x, point.y);
    if (d < point.hitboxSize / 2) {
      hovered = point;
      break;
    }
  }
}

function mousePressed() {
  if (hoveredFruit) {
    let index = collectedFruits.indexOf(hoveredFruit);
    if (index !== -1) {
      collectedFruits.splice(index, 1);
      let originalPos = fruitPositions.find(fruit => fruit.img.includes(hoveredFruit.toLowerCase()));
      let imgData = images.find(img => img.name === hoveredFruit);

      if (originalPos) {
        let scaleX = windowWidth / baseWidth;
        let scaleY = windowHeight / baseHeight;
        points.push({
          x: originalPos.x * scaleX,
          y: originalPos.y * scaleY,
          size: originalPos.individualSize * min(scaleX, scaleY),
          img: imgData.img,
          name: imgData.name,
          hitboxSize: 70,
          alpha: 255
        });
      }
    } else {
      collectedFruits.push(hoveredFruit);
      points = points.filter(p => p.name !== hoveredFruit);
    }
    return;
  }

  for (let point of points) {
    let d = dist(mouseX, mouseY, point.x, point.y);
    if (d < point.hitboxSize / 2) {
      dragging = point;
      break;
    }
  }
}

function mouseDragged() {
  if (dragging) {
    dragging.x = mouseX;
    dragging.y = mouseY;
  }
}

function mouseReleased() {
  if (dragging) {
    let d = dist(dragging.x, dragging.y, bigPoint.x, bigPoint.y);
    if (d < bigPoint.size / 2) {
      collectedFruits.push(dragging.name);
      points = points.filter(p => p !== dragging);
    }
  }
  dragging = null;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  bigPoint.x = windowWidth * (273 / baseWidth);
  bigPoint.y = windowHeight * (220 / baseHeight);
  generatePoints();
}