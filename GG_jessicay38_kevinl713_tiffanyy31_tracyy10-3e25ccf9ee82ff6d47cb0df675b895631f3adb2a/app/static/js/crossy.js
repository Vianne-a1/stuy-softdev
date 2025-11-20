//Gets the game element/box
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let LaneSize = Math.floor(canvas.height/12);
let carW = Math.floor(canvas.width / 15);
let score = 0;
let playing = true;
let animationId;
let Chicken;
let onLog = 0;
let gameMode = "CLASSIC";
let chickenColor = "white";
function Lane(ycor){
  this.type = Math.random()*3;
  if(gameMode == "Highway"){
    this.type = 0;
  }
  if(gameMode == "Ocean"){
    this.type = 1.5;
  }
  this.direction = Math.random();
  this.y = ycor;
  this.cars = [];
  if(this.direction > 0.5){
    this.speed = -(Math.random() * (6 - 3) + 3);
  }
  else{
    this.speed = (Math.random() * (6 - 3) + 3);
  }
  if(gameMode == "Ocean"){
    this.speed *= 1.5;
  }
  if(this.type > 2){
    this.carInterval = null;
  }
  else{
    if(gameMode == "Highway"){
      this.carInterval = setInterval(() => makeCar(this.cars,new car(this,this.speed)),(Math.random() * (2400 - 1500) + 1500));
      this.speed *= 1.5;
    }
    else{
      this.carInterval = setInterval(() => makeCar(this.cars,new car(this,this.speed)),(Math.random() * (2000 - 1200) + 1200));
    }
  }
}
function car(lane,speed){
  if(lane.direction > 0.5){
    this.x = canvas.width + carW*1.5;
  }
  else{
    this.x = - carW*2;
  }
  this.speed = speed;
  this.y = lane.y;
}
function main(){
  var lanes = [];
  setup(lanes);
}
function startText(){
  ctx.font = "64px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Crossy Road", canvas.width/2, canvas.height/4);
  ctx.font = "32px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(gameMode, canvas.width/2, canvas.height/3);
}
function setup(arr){
  startText();
  var start = document.createElement("BUTTON");
  var rect = canvas.getBoundingClientRect();
  start.style.position = "absolute";
  start.style.left = rect.left + (rect.width - canvas.width / 4) / 2 +(rect.width - canvas.width / 4)/9 + "px";
  start.style.top = rect.top + 4*(rect.height - canvas.height / 4) / 5 + "px";
  start.style.width = canvas.width/8+"px";
  start.style.height = canvas.height/8+"px";
  start.style.background = "white";
  start.textContent = "START";
  start.style.border = "4px solid black";
  start.onclick = function(){document.body.removeChild(ocean);document.body.removeChild(highway);document.body.removeChild(start);document.body.removeChild(classic);initialize(arr);};
  var highway = document.createElement("BUTTON");
  highway.style.position = "absolute";
  highway.style.left = rect.left + (rect.width - canvas.width / 4) / 2 +(rect.width - canvas.width / 4)/9 -canvas.width/16 + "px";
  highway.style.top = rect.top + 2*(rect.height - canvas.height / 4) / 3 + "px";
  highway.style.width = canvas.width/16+"px";
  highway.style.height = canvas.height/16+"px";
  highway.style.background = "white";
  highway.textContent = "HIGHWAY";
  highway.style.border = "4px solid black";
  highway.onclick = function(){gameMode="Highway";ctx.clearRect(0, 0, canvas.width, canvas.height);startText();setMusic();};
  var ocean = document.createElement("BUTTON");
  ocean.style.position = "absolute";
  ocean.style.left = rect.left + (rect.width - canvas.width / 4) / 2 +(rect.width - canvas.width / 4)/9 + 2*canvas.width/16+"px";
  ocean.style.top = rect.top + 2*(rect.height - canvas.height / 4) / 3 + "px";
  ocean.style.width = canvas.width/16+"px";
  ocean.style.height = canvas.height/16+"px";
  ocean.style.background = "white";
  ocean.textContent = "OCEAN";
  ocean.style.border = "4px solid black";
  ocean.onclick = function(){gameMode="Ocean";ctx.clearRect(0, 0, canvas.width, canvas.height);startText();setMusic();};
  var classic = document.createElement("BUTTON");
  classic.style.position = "absolute";
  classic.style.left = rect.left + (rect.width - canvas.width / 4) / 2 +(rect.width - canvas.width / 4)/9 + canvas.width/32+ "px";
  classic.style.top = rect.top + 2*(rect.height - canvas.height / 4) / 3 + "px";
  classic.style.width = canvas.width/16+"px";
  classic.style.height = canvas.height/16+"px";
  classic.style.background = "white";
  classic.textContent = "CLASSIC";
  classic.style.border = "4px solid black";
  classic.onclick = function(){gameMode="Classic";ctx.clearRect(0, 0, canvas.width, canvas.height);startText();setMusic();};
  document.body.append(start);
  document.body.append(highway);
  document.body.append(ocean);
  document.body.append(classic);
}
function makeCar(arr, car){
  arr.push(car);
}
function initialize(arr){
  Chicken = new chicken();
  for(var i = 0; i < Math.ceil(canvas.height/LaneSize) + 8;i ++){
    arr.push(new Lane(canvas.height-LaneSize*(i+1)));
  }
  for(var a = 0; a < 5; a ++){
    arr[a].type = 2.9;
    clearInterval(arr[a].carInterval);
    arr[a].carInterval = null;
  }
  document.addEventListener("keydown", keyPress);
  animate(arr);
}
function keyPress(event){
  if(playing){
    if((event.key === "w" || event.key === "ArrowUp") && Chicken.y - LaneSize > 0) {
      Chicken.y -= LaneSize;
      score ++;
    }
    if((event.key === "a" || event.key === "ArrowLeft") && Chicken.x - LaneSize > 0) {
      Chicken.x -= LaneSize;
    }
    if((event.key === "d" || event.key === "ArrowRight") && Chicken.x + LaneSize < canvas.width) {
      Chicken.x += LaneSize;
    }
    if((event.key === "s" || event.key === "ArrowDown") && Chicken.y + LaneSize < canvas.height) {
      Chicken.y += LaneSize;
      score --;
    }
  }
}
function drawBackground(arr){
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].type > 2) {
      ctx.fillStyle = "lightgreen";
    } else if (arr[i].type > 1) {
      ctx.fillStyle = "lightblue";
    } else {
      ctx.fillStyle = "gray";
    }
    ctx.fillRect(0, arr[i].y, canvas.width, LaneSize);
  }
}
//Increments the lane y-cor and updates the actual element on html
function backgroundMove(arr){
  for(var i = 0; i < arr.length; i ++){
    arr[i].y ++;
    modCars(arr[i].cars);
  }
  Chicken.y ++;
  if(Chicken.x + onLog < canvas.width && Chicken.x + onLog > 0){
    Chicken.x += onLog;
  }
}
function modCars(arr){
  if (arr.length === 0 || !playing) return;
  if(arr[0].speed < 0){
    var bound = 0;
    for (var i = arr.length - 1; i >= 0; i--){
      if(arr[i].x+carW < bound){
        arr.splice(i,1);
      }
      else{
        arr[i].x += arr[i].speed;
        arr[i].y += 1;
      }
    }
  }
  else{
    var bound = canvas.right;
    for (var i = arr.length - 1; i >= 0; i--){
      if(arr[i].x > bound){
        arr.splice(i,1);
      }
      else{
        arr[i].x += arr[i].speed;
        arr[i].y += 1;
      }
    }
  }
}
//Adds and removes lanes
function modLanes(arr){
  if(arr[arr.length-1].y >= 0){
    arr.push(new Lane(arr[arr.length-1].y-LaneSize));
  }
  if(arr[0].y>= canvas.height){
    clearInterval(arr[0].carInterval);
    arr[0].cars = [];
    arr.shift();
  }
}
//Basically a loop that animates the screen
function animate(arr){
  if (!playing) {
    cancelAnimationFrame(animationId);
    for(var i = 0; i < arr.length; i ++){
      clearInterval(arr[i].carInterval);
    }
    restart();
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(var i = 0; i < arr.length; i ++){
    if(arr[i].y == Chicken.y){
      collision(arr[i].cars,arr[i].type);
    }
  }
  backgroundMove(arr);
  modLanes(arr);
  drawAll(arr);
  onLog = 0;
  if(Chicken.y > canvas.height){
    playing = false;
  }
  animationId = requestAnimationFrame(function() { animate(arr); });
}
function chicken(){
  this.x = canvas.width/2 - LaneSize/4;
  this.y = canvas.height - LaneSize*5;
}
function drawChicken() {
  ctx.fillStyle = chickenColor;
  ctx.fillRect(Chicken.x, Chicken.y, LaneSize / 2, LaneSize / 2);
}
function drawCars(arr) {
  ctx.fillStyle = "purple";
  for (let lane of arr) {
    for (let car of lane.cars) {
      if(lane.type > 1 && lane.type < 2){
        ctx.fillStyle = "brown";
      }
      else{
        ctx.fillStyle = "purple";
      }
      ctx.fillRect(car.x, car.y, carW, LaneSize);
    }
  }
}
function collision(arr,type){
  if(type > 1 && type < 2){
    for(var i = 0; i < arr.length; i ++){
      if((Chicken.x > arr[i].x && Chicken.x < arr[i].x + carW) || (Chicken.x + LaneSize/2 > arr[i].x && Chicken.x + LaneSize/2 < arr[i].x + carW)){
        onLog = arr[i].speed;
        return;
      }
    }
    if(onLog == 0){
      playing = false;
    }
  }
  else{
    for(var i = 0; i < arr.length; i ++){
      if((Chicken.x > arr[i].x && Chicken.x < arr[i].x + carW) || (Chicken.x + LaneSize/2 > arr[i].x && Chicken.x + LaneSize/2 < arr[i].x + carW)){
        playing = false;
        return;
      }
    }
  }
}
function restart(){
  ctx.font = "64px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GAME OVER", canvas.width/2, canvas.height/3);
  var restart = document.createElement("BUTTON");
  var rect = canvas.getBoundingClientRect();
  restart.style.position = "absolute";
  restart.style.left = rect.left + (rect.width - canvas.width / 4) / 2 +(rect.width - canvas.width / 4)/12.5 + "px";
  restart.style.top = rect.top + 5*(rect.height - canvas.height / 4) / 6 + "px";
  restart.style.width = canvas.width / 6 + "px";
  restart.style.height = canvas.height / 10 + "px";
  restart.style.background = "white";
  restart.textContent = "RESTART";
  restart.style.border = "4px solid black";
  restart.onclick = function () {
    returnScore();
    document.body.removeChild(restart);
    score = 0;
    playing = true;
    onLog = 0;
    Chicken = null;
    document.removeEventListener("keydown", keyPress);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    main();
  };
  document.body.append(restart);
}
function drawAll(arr){
  drawBackground(arr);
  drawCars(arr);
  drawChicken();
  ctx.font = "24px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Score: " + score, canvas.width/2, canvas.height/16);
}
function returnScore() {
  fetch('/submitScore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score })
  });
}
//Maybe an implementation of store where you can pick colors for your chicken
/*function store(){
  var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0.15, 'red');
  gradient.addColorStop(0.3, 'orange');
  gradient.addColorStop(0.45, 'yellow');
  gradient.addColorStop(0.6, 'green');
  gradient.addColorStop(0.75, 'blue');
  gradient.addColorStop(0.9, 'indigo');
  gradient.addColorStop(1, 'violet');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, LaneSize);
}*/
function setMusic(){
    if(gameMode == "Highway"){
        document.getElementById("source").setAttribute("src", "../static/music/highway.mp3");
        document.getElementById("moosic").load();
    }
    if(gameMode == "Classic"){
        document.getElementById("source").setAttribute("src", "../static/music/classic.mp3");
        document.getElementById("moosic").load();
    }
    if(gameMode == "Ocean"){
        document.getElementById("source").setAttribute("src", "../static/music/ocean.mp3");
        document.getElementById("moosic").load();
    }
}
main()
