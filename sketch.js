var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var changeState,readState;
var bedroomImg,gardenImg,washroomImg;

function preload(){
dogImg=loadImage("images/Dog.png");
happyDog=loadImage("images/happyDog.png");
bedroomImg = loadImage("images/Bedroom.png");
gardenImg = loadImage("images/Garden.png");
washroomImg = loadImage("images/Wash Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  function readState(){
  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  });
}
    function update(state){
    database.ref('/').update({
      gameState:state
    });
  }
}


function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  
 
  fill(255,255,254);
  textSize(15);

  if(gameState !== "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(happyDog);
  }

  currentTime = hour();
  if(currentTime==(lastFed + 1)){
    update("playing");
    foodObj.garden();
   }else if(currentTime == (lastFed + 2)){
    update("sleeping");
    foodObj.bedroom();
   }else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
     update("bathing");
     foodObj.washroom();
   }else{
     update("hungry");
     foodObj.display();
   }
 
  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}