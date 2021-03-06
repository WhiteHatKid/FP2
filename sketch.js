var player, truck, truck2, truck3, truck4, truckDelay, scrBackg, scrBackg2, fuel, fuelRandomX;
var playerSpeed = 20;
var playerYSpeed = 20;
var truckMaxSpeed = 10;
var truckMinSpeed = 5;
var playerMaxHealth = 50;
var playerHealth = playerMaxHealth;
var playerMaxFuel = 250;
var playerFuel = playerMaxFuel;
var speedDistanceCovered = 0;
var distanceCovered = 0;
var BackgY = 380;
var BackgY2 = 380;
var fuelDelay = 0;
var randomSetFuel = 0;
var fuelRandomNum = [6, 8, 10];
var playerImg, truckImg, roadImg, fuelImg, policeCImg, coolCar1Img, car2Img;
var truckRandomImg;
var truck1Img, truck2Img, truck3Img, truck4Img;
var carWidth, carHeight;
var backgSpeed = 15;
var glugSound, scrapeSound;
var truckDamage = 50;
var SD = null;
var PLAY = 1;
var END = 0;
var MENU = 2
var gameState = MENU;
var startButton, soundButton;
var menuRect, titleText, msText;
var metersSaved = 0;
var database, highScore, highS;
var canW;
var canH;

function setup() {

  playerImg = loadImage('Images/Car.png')
  truckImg = loadImage('Images/Ambulance2.png')
  roadImg = loadImage('Images/RoadImg.png')
  fuelImg = loadImage('Images/Fuel.png')
  policeCImg = loadImage('Images/Police2.png')
  coolCar1Img  = loadImage('Images/audi2.png')
  car2Img = loadImage('Images/Black_viper2.png')

  glugSound = loadSound('glug.mp3')
  scrapeSound = loadSound('scrape.mp3')

  canW = displayWidth - 800;
  canH = displayHeight - 200;

  carWidth = canW / 9.6;
  carHeight = canH / 6;

  var truckRandomY = random(700, 900);

  truckRandomImg = [policeCImg, coolCar1Img, car2Img, truckImg];

  truck1Img = random(truckRandomImg) 
  truck2Img = random(truckRandomImg) 
  truck3Img = random(truckRandomImg) 
  truck4Img = random(truckRandomImg) 

  createCanvas(canW, canH);

  player = createSprite((displayWidth - 900)/2, 300, carWidth, carHeight);
  truck = new Truck((displayWidth - 1100)/2, truckRandomY, carWidth, carHeight, random(truckMinSpeed, truckMaxSpeed), truck1Img);
  truck2 = new Truck((displayWidth - 900)/2, truckRandomY + random(200, 400), carWidth, carHeight, random(truckMinSpeed, truckMaxSpeed), truck2Img);
  truck3 = new Truck((displayWidth - 700)/2, truckRandomY + random(100, 200), carWidth, carHeight, random(truckMinSpeed, truckMaxSpeed), truck3Img);
  truck4 = new Truck((displayWidth - 500)/2, truckRandomY + random(500, 600), carWidth, carHeight, random(truckMinSpeed, truckMaxSpeed), truck4Img);
  fuel = new Fuel((displayWidth - (Math.round(random(fuelRandomNum))) * 100)/2, -truckRandomY, 40, 60, 10, fuelImg);
  
  startButton = createButton('Start Game')
  startButton.position((displayWidth - 900)/2, 300)

  database = firebase.database();

  highScore = database.ref('HighScore')
  highScore.on('value', readScore)

  player.setCollider('circle',0, 0, 30)
}

function draw() {

  if(gameState === PLAY){

    if(playerFuel <= 0){
      gameState = END
    }

    if(playerHealth <= 0){
      gameState = END
    }

  background(140,190,150);

  imageMode(CENTER)
  scrBackg = image(roadImg, canW/2, BackgY, canW * 1.4, canH * (4/3));
  scrBackg2 = image(roadImg, canW/2, BackgY2 - 800, canW * 1.4, canH * (4/3));

  BackgY += backgSpeed;
  BackgY2 += backgSpeed;

  if(BackgY > displayWidth - 100){
    BackgY = 380;
  }

  if(BackgY2 > displayWidth - 100){
    BackgY2 = 380;
  }

  truck.changeImage(truck1Img)
  truck2.changeImage(truck2Img)
  truck3.changeImage(truck3Img)
  truck4.changeImage(truck4Img)

  truck.display();
  truck2.display();
  truck3.display();
  truck4.display();
  fuel.display();

  speedDistanceCovered += 1;
  distanceCovered = speedDistanceCovered / 20;

  fill('black')
  rect((displayWidth - 1200)/2, 5, 400, 20);

  textSize(20);
  fill('yellow')
  text(distanceCovered.toFixed(1) + ' m', 50, 22);

  fill('black');
  strokeWeight(5);
  rect((displayWidth - 1200)/2, 30, 400, 10)

  fill('red');
  strokeWeight(0);
  if(playerHealth > 0)
  rect((displayWidth - 1200)/2, 30, (playerHealth/playerMaxHealth) * 400, 10)

  fill('black');
  strokeWeight(5);
  rect(((displayWidth - 1200)/2) + 300, 45, 100, 10)

  fill('Grey');
  strokeWeight(0);
  if(playerFuel > 0)
  rect(((displayWidth - 1200)/2) + 300, 45, (playerFuel/playerMaxFuel) * 100, 10)
  
  playerFuel -= 0.5;

  player.addImage(playerImg)
  player.scale = 0.5;
  

  //Player Movements

  if(keyDown(RIGHT_ARROW)){
    if(player.x < canW)
    player.x += playerSpeed;
  }
  if(keyDown(LEFT_ARROW)){
    if(player.x > canH)
    player.x -= playerSpeed;
  }

  if(keyDown(UP_ARROW)){
    if(player.y >= 150)
    player.y -= playerYSpeed - 10;

    if(player.y <= 150)
    SD = false;
  } else {
    SD = true;
  }

  if(player.y < 520 && SD)
  player.y += playerYSpeed - 15;
  
if(isTouching(player, truck)){
  scrapeSound.play();
  playerHealth -= truckDamage;
  truck.y = displayHeight + truckDelay
  } 
if(isTouching(player, truck2)){
  scrapeSound.play();
  playerHealth -= truckDamage;
  truck2.y = displayHeight + truckDelay
  } 
if(isTouching(player, truck3)){
  scrapeSound.play();
  playerHealth -= truckDamage;
  truck3.y = displayHeight + truckDelay
  } 
if(isTouching(player, truck4)){
  scrapeSound.play();
  playerHealth -= truckDamage;
  truck4.y = displayHeight + truckDelay
  }

  truckDelay = random(1200, 1500);

  if(truck.y < displayHeight - truckDelay){

    truck.y = displayHeight
    truck1Img = random(truckRandomImg) 

  }
  truckDelay = random(1200, 1500);

  if(truck2.y < displayHeight - truckDelay){
     
    truck2.y = displayHeight
    truck2Img = random(truckRandomImg) 

  }
  truckDelay = random(1200, 1500);

  if(truck3.y < displayHeight - truckDelay){
     
    truck3.y = displayHeight
    truck3Img = random(truckRandomImg) 

  }
  truckDelay = random(1200, 1500);

  if(truck4.y < displayHeight - truckDelay){
     
    truck4.y = displayHeight
    truck4Img = random(truckRandomImg) 

  }
  truckDelay = random(1200, 1500);

  randomSetFuel = Math.round(random(fuelRandomNum))

  if(fuelNeedRestart()){
    fuelRandomX = randomSetFuel

    fuel.y = -displayHeight - fuelDelay
    fuel.x = (displayWidth - (randomSetFuel * 100))/2;

  }
  fuelDelay = random(1200, 1500)

  drawSprites();

  } else if(gameState = MENU){

    if(distanceCovered > metersSaved){
    metersSaved = distanceCovered;
  }

    updateHighscore(metersSaved)

    fill('black')
    menuRect = rect(0, 0, displayWidth, displayHeight)
    fill('yellow')
    textSize(50)
    titleText = text('Car Crashers', (displayWidth - 1100)/2, 150)
    textSize(20)
    msText = text('High Score: ' + metersSaved + 'm', (displayWidth - 1000)/2, 450)
    startButton.show()
    startButton.mousePressed(()=>{
      gameState = PLAY;
      playerFuel = playerMaxFuel;
      playerHealth = playerMaxHealth;
      speedDistanceCovered = 0;
      startButton.hide();
    })

  } else if(gameState = END){
    gameState = END;

    menuRect = null;
    titleText = null;

    fill('black')
    rect((displayWidth - 1200)/2, 200, 400, 300)
    textSize(50)
    fill('yellow')
    text('GAME OVER', (displayWidth - 1100)/2, 300)
    textSize(30)
    text('Tap the screen to restart', (displayWidth - 1120)/2, 400)
  }
}



function isTouching(object1, object2){
  if (object1.x - object2.x < object2.width/2 + object1.width/2
    && object2.x - object1.x < object2.width/2 + object1.width/2
    && object1.y - object2.y < object2.height/2 + object1.height/2
    && object2.y - object1.y < object2.height/2 + object1.height/2) {
  return true;

    } else {

  return false;
  }
}

function fuelNeedRestart(){

  if(isTouching(player, fuel)){

    glugSound.play()

    if(playerFuel <= 125){
    playerFuel += 125
    }else{
    playerFuel = 250
    }

  }

  if(fuel.y > displayHeight || isTouching(player, fuel)){
    return true
  } else {
    return false
  }
}

function readScore(data){
  metersSaved = data.val()
}

function updateHighscore(x){
  
  database.ref('/').update({
    HighScore:x
  })

}