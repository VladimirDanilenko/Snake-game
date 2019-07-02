var model = {
 gameStarted:false,
 gameMode: "medium",
 eatenBerrys:0,
 eatenSuperBerrys:0,
 eatenPseudoThorns:0,
 tailCuttings:0,
 passedHoles:0,

 score: 0,
 record:0,
 y:10,
 x:10,
 h:4,
berryCoords:"",
superBerryCoords: "",
superBerrySpawnTimeout:"",
superBerryDeleteTimeout:"",
thornCoords:"",
thornsArr:[],
pseudoThornsArr:[],
thornSpawnSpeed:5000,
thornDeleteSpeed:7000,
thornActivateSpeed: 5000,
setThornSpawnTimeout:"",
setThornDeleteTimeout:"",
thornActivateTimeot:[],
thornSpawnStarted: false,

snakeDirection:"",
snakeY:0,
snakeX:0,
snakeH:0,
snake:[],
snakeCoords: function(){
	return this.snakeH + "" + this.snakeY + "" + this.snakeX;
},
direction: "",
moving: "",
gameSpeed: 300,
gameOver:false,
freeCells:[],
cell: {
	free: true
},
cellsArrWasCreated:false,
holes:[],
holesOnTheTable: false,
holesSpawnTimeout:"",
holesDeleteTimeout:"",
freeCellsArrCreate: function(){
	var cells = document.getElementsByClassName("td");
	function newObject(coords){
		this.coords = coords;
	}
	newObject.prototype = model.cell;
	for(var i = 0; i < cells.length; i++){
		var obj = new newObject(cells[i].id);
		model.freeCells.push(obj);
	}
	model.cellsArrWasCreated = true;
},
checkCoordsFunction: function(coords){
	var result  = function(){
	if(model.cellsArrWasCreated){
		var index;
		for(var i = 0; i < model.freeCells.length; i++){
			if(model.freeCells[i].coords === coords){
				index = i;
			} 
		}
			if(model.freeCells[index].free){
				return true;
			} else {
				return false;
			}
		}
	}
	return result();
},

checkIndex: function(coords){
	var index;
		for(var i = 0; i < model.freeCells.length; i++){
			if(model.freeCells[i].coords === coords){
				index = i;
			} 
		}
		return index;
},

berrySpawn: function(){
	var berryRandomCoords =	function(){
		  var x = Math.floor(Math.random() * model.x);
		  var y = Math.floor(Math.random() * model.y);
		  var h = Math.floor(Math.random() * model.h);
		  model.berryCoords = h + "" + y + "" + x ;
		};
	berryRandomCoords();
	if(!model.checkCoordsFunction(model.berryCoords)){
		model.berrySpawn();
		return;
	}
	model.freeCells[model.checkIndex(model.berryCoords)].free = false;
	document.getElementById(this.berryCoords).setAttribute("class","berry");
},

berryEat: function(){
	if(this.berryCoords === this.snakeCoords()){
		this.eatenBerrys++;
		this.berrySpawn();
		this.score+=100;
		view.berryAte();
		return true;
	} else {
		return false;
	}
},
holesSpawn: function(){
	var holesRandomCoords = function(){
		this.x = Math.floor(Math.random() * model.x);
		this.y = Math.floor(Math.random() * model.y);
		this.h = Math.floor(Math.random() * model.h);
		this.coords = this.h + "" + this.y + "" + this.x ;
	};
	var hole1,hole2;

	var firstHoleCoords = function(){
		hole1 = new holesRandomCoords();
		if(!model.checkCoordsFunction(hole1.coords)){
			firstHoleCoords();
			return;
		}
		model.holes.push(hole1);
		model.freeCells[model.checkIndex(hole1.coords)].free = false;
	};
	var secondHoleCoords = function(){
		hole2 = new holesRandomCoords();	
		if(!model.checkCoordsFunction(hole2.coords)){
			secondHoleCoords();
			return;
		}
		model.holes.push(hole2);
		model.freeCells[model.checkIndex(hole2.coords)].free = false;
	};

	firstHoleCoords();
	secondHoleCoords();
	model.holesOnTheTable = true;

	model.holesDeleteTimeout = setTimeout(model.holesDelete,5000);
	model.holesDeleteTimeout;

	for(var i = 0; i < model.holes.length; i++){
		document.getElementById(model.holes[i].coords).setAttribute("class","holes");
	}

},

inSecondHole:false,

goingThroghHole: function(){
	
	if(!model.inSecondHole){
		switch(model.snakeCoords()){
			case model.holes[0].coords :
				model.snakeX = model.holes[1].x;
				model.snakeY = model.holes[1].y;
				model.snakeH = model.holes[1].h;
				view.snakeHead(model.snakeCoords());
				model.snake.push(model.snakeCoords());
				model.snakeGrowing();
				model.inSecondHole = true;
				setTimeout(function(){model.inSecondHole = false;},model.gameSpeed * 2);

				model.passedHoles++;
				view.passesThroughHoleOutput();
				return true;
			break;
			case model.holes[1].coords :
				model.snakeX = model.holes[0].x;
				model.snakeY = model.holes[0].y;
				model.snakeH = model.holes[0].h;
				view.snakeHead(model.snakeCoords());
				model.snake.push(model.snakeCoords());
				model.snakeGrowing();
				model.inSecondHole = true;
				setTimeout(function(){model.inSecondHole = false;},model.gameSpeed * 2);

				model.passedHoles++;
				view.passesThroughHoleOutput();

				return true;
			break;
			default:
			break;
		}
	}
	for(var i = 0; i < model.holes.length; i++){
		for(var j = 0; j < model.snake.length; j++){
			if(model.snake[j] !== model.holes[i].coords){
				document.getElementById(model.holes[i].coords).setAttribute("class","holes");
			} else {
				document.getElementById(model.holes[i].coords).setAttribute("class","snake");
				return;
			}
		}
	}
},

holesDelete: function(){
	for(var i = 0; i < model.snake.length;i++){
		for(var j = 0; j < model.holes.length; j++){
			if(model.snake[i] === model.holes[j].coords){
				setTimeout(model.holesDelete,4000);
				return;
			}
		}
	}

	for(var i = 0; i < model.holes.length; i++){
		//model.freeCells[model.checkIndex(model.holes[i].coords)].free = true;
		delete model.freeCells[model.checkIndex(model.holes[i].coords)].free;
		view.regularCell(model.holes[i].coords);
	}
	model.holes = [];
	model.holesOnTheTable = false;
	clearTimeout(model.holesSpawnTimeout);
	model.holesSpawnTimeout = setTimeout(model.holesSpawn,3000);
	model.holesSpawnTimeout;
},

superBerrySpawn: function(){
 	var coords = function() {
 		var x = Math.floor(Math.random() * model.x);
		var y = Math.floor(Math.random() * model.y);
		var h = Math.floor(Math.random() * model.h);
		return h + "" + y + "" + x ;
 	};
 	model.superBerryCoords = coords();
 	if(!model.checkCoordsFunction(model.superBerryCoords)){
		model.superBerrySpawn();
		return;
	}
	document.getElementById(model.superBerryCoords).setAttribute("class","superBerry");
	model.superBerryDeleteTimeout = setTimeout(model.superBerryDelete,3000);
	model.superBerryDeleteTimeout;

},
superBerryDelete: function(){
	model.superBerrySpawnTimeout = setTimeout(model.superBerrySpawn,10000);
	model.superBerrySpawnTimeout;
	clearTimeout(model.superBerryDeleteTimeout);
	if(model.snakeCoords() !== model.superBerryCoords){
	view.regularCell(model.superBerryCoords);
	}
	//model.freeCells[model.checkIndex(model.superBerryCoords)].free = true;
	delete model.freeCells[model.checkIndex(model.superBerryCoords)].free;
	model.superBerryCoords = "";
},
superBerryEat: function(){
	if(model.snakeCoords() === model.superBerryCoords){
		clearTimeout(model.superBerryDelete.setTimeout);
		model.superBerryDelete();
		model.score+=500;
		model.eatenSuperBerrys++;
		view.superBerryAte();
	}
},

thornSpawn: function(){
	var thornRandCoords = function(){
		var x = Math.floor(Math.random() * model.x);
		var y = Math.floor(Math.random() * model.y);
		var h = Math.floor(Math.random() * model.h);
		model.thornCoords = h + "" + y + "" + x ;
	};
	thornRandCoords();

	if(!model.checkCoordsFunction(model.thornCoords)){
		model.thornSpawn();
		return;
	}
	model.freeCells[model.checkIndex(model.thornCoords)].free = false;
	
	model.pseudoThornsArr.push(model.thornCoords);
	document.getElementById(model.thornCoords).setAttribute("class","pseudoThorn");
	model.thornActivateTimeot.push(setTimeout(model.thornActivate,model.thornActivateSpeed));
	if(model.thornActivateTimeot[model.thornActivateTimeot.length - 1]){
		model.thornActivateTimeot[model.thornActivateTimeot.length - 1];
	} 
	model.setThornSpawnTimeout = setTimeout(model.thornSpawn,model.thornSpawnSpeed);
	model.setThornSpawnTimeout;
},

thornActivate: function(){
	if(model.pseudoThornsArr[0]){
	model.thornsArr.push(model.pseudoThornsArr[0]);
	if(model.gameMode === "hard"){
	model.snakeTailCutting();
	}
	document.getElementById(model.thornsArr[model.thornsArr.length-1]).setAttribute("class","thorn");
	} else {
		model.pseudoThornsArr.shift();
		return;
	}
	model.pseudoThornsArr.shift();
	
	
},



thornDelete: function(){
	model.setThornDeleteTimeout = setTimeout(function(){
		if(model.thornsArr[0]){
		view.regularCell(model.thornsArr[0]);
		//model.freeCells[model.checkIndex(model.thornsArr[0])].free = true;
		delete model.freeCells[model.checkIndex(model.thornsArr[0])].free;
		model.thornsArr.shift();
		model.thornDelete();
		}
	},model.thornDeleteSpeed);
	model.setThornDeleteTimeout;
},

clearThornActivateTimeout: function(){
	for(var i = 0; i < model.thornActivateTimeot.length; i++){
		clearTimeout(model.thornActivateTimeot[i]);
	}
},

everyThornDelete:function(){
	for(var i = 0; i < model.thornsArr.length; i++){
		view.regularCell(model.thornsArr[i]);
	}
	for(var i = 0; i < model.thornsArr.length; i++){
		//model.freeCells[model.checkIndex(model.thornsArr[i])].free = true;
		delete model.freeCells[model.checkIndex(model.thornsArr[i])].free;
	}
	model.thornsArr = [];
},


snakeGrowing: function(){
	if(this.berryCoords === this.snakeCoords() || this.superBerryCoords === this.snakeCoords()){
		return;
	} else {
		if(model.snake[0]){
		view.regularCell(model.snake[0]);
		//model.freeCells[model.checkIndex(model.snake[0])].free = true;
		delete model.freeCells[model.checkIndex(model.snake[0])].free;
	    model.snake.shift();
		} else { 
			model.snake.shift();
			//model.freeCells[model.checkIndex(model.snake[0])].free = true;
			delete model.freeCells[model.checkIndex(model.snake[0])].free;
		}
	}
},

snakeSelfEtaing: function(){
	for(var i = 0; i < model.snake.length; i++){
		if(model.snake[i] === model.snakeCoords()){
			return true;
		} 
	} 
	return false;
},

snakeTailCutting: function(){
	for( var j = 0; j < model.snake.length; j++){
		if(model.thornsArr[model.thornsArr.length-1] === model.snake[j]){
			model.tailCuttings++;
			view.losesTailOutput();
			for(;j >=0 ; j--){
				view.regularCell(model.snake[0]);
				model.snake.shift();
			}
		}
	}
},

pseudoThornEating:function(){
	 if(model.gameMode === "medium"){
	 	for(var i = 0; i < model.pseudoThornsArr.length; i++){
	 		if(model.snakeCoords() === model.pseudoThornsArr[i]){
	 			//model.freeCells[model.checkIndex(model.pseudoThornsArr[i])].free = true;
	 			delete model.freeCells[model.checkIndex(model.pseudoThornsArr[i])].free;
	 			delete model.thornActivateTimeot[i];
	 			delete model.pseudoThornsArr[i];
	 			model.score+=50;
	 			model.eatenPseudoThorns++;
	 			view.pseudoThornAte();
	 		}
	 	}
	}
},

pseudoThornReset: function(){
	if(model.gameMode === "hard"){
		for(var i = 0; i < model.pseudoThornsArr.length; i++){
			for(var j = 0; j < model.snake.length; j++){
				if(model.pseudoThornsArr[i] === model.snake[j]){
					return false;;
				} 
			}
		}
		return true;
	}
},


gameOverCheckFunction: function(){
	if(this.snakeSelfEtaing() || this.goingBeyondField()){
	 	model.gameOver = true;
	 	view.gameOver();
		return true;
	}
	for(var i = 0; i < model.thornsArr.length; i++){
		if(model.thornsArr[i] === model.snakeCoords()){
	 	  	model.gameOver = true;
	 	  	view.gameOver();
			return true;
		} 
	}
},


snakeSpawn: function(){
	var coords;
	var snakeStartRandCoords = function(){
		model.snakeX = Math.floor(Math.random() * model.x);
	    model.snakeY = Math.floor(Math.random() * model.y);
	    model.snakeH = Math.floor(Math.random() * model.h);
	    coords = model.snakeH + "" + model.snakeY + "" + model.snakeX;
	    	if(!model.checkCoordsFunction(coords)){
			snakeStartRandCoords();
			return;
			}
	model.freeCells[model.checkIndex(coords)].free = false;
	model.snake.push(coords);
	};
	snakeStartRandCoords();
		document.getElementById(coords).setAttribute("class","snakeHead");
},



moveFunction: function(){
 		 clearTimeout(model.moving);
 
if(!model.gameOver){
 		 view.snakeCell(model.snakeCoords());

 		 if(model.holesOnTheTable && model.goingThroghHole()){
	 	clearTimeout(model.moving);
	 	model.moving = setTimeout(model.moveFunction, model.gameSpeed);
		model.moving;
		return;
	 	  }
 		
	switch(model.snakeDirection){
	 	 case "up" :
	 	 		model.snakeY-=2;
	 	 	switch(model.snakeY){
	 	 		case -1:
	 	 			model.snakeH--;
	 	 			model.snakeY = 9;
	 	 		break;
	 	 		case -2 :
	 	 			model.snakeH--;
	 	 			model.snakeY = 8;
	 	 		break;
	 	 		default:
	 	 		break;
	 	 		}
	 	break;
	 	 	
	 	case "down" :
	 	 		model.snakeY+=2;
	 	 	switch(model.snakeY){
	 	 		case 10:
	 	 			model.snakeH++;
	 	 			model.snakeY = 0;
	 	 		break;
	 	 		case 11:
		 	 		model.snakeH++;
		 	 		model.snakeY = 1;
		 	 	break;
		 	 	default:
		 	 	break;
				}
	 	
	 	break;
	 	 	
	 	 	case "right" :
	 	 	if(model.goingBeyondFieldRightSide()){
	 	 		return;
	 	 	}
	 	 	model.snakeX++;
	 	 	if(model.snakeX === 10){
	 	 		model.snakeY++;
	 	 		model.snakeX = 0;
	 	 	}
	 	 		break;
	 	 	case "left" :
	 	 	if(model.goingBeyondFieldLeftSide()){
	 	 		return;
	 	 	}
	 	 	model.snakeX--;
	 	 	if(model.snakeX === -1){
	 	 		 
	 	 		model.snakeY--;
	 	 		model.snakeX = 9;
	 	 		
	 	 	}
	 	 		break;
	 	 	
	 	 	default:
	 	 	console.log(model.snakeDirection);
	 	 }

	 	  if(model.gameOverCheckFunction()){
	 	  	return;
	 	  }
	
	 	 view.snakeHead(model.snakeCoords());
	 	 model.snake.push(model.snakeCoords());
	 	 model.snakeGrowing();
	 	  
		 model.berryEat();
		 model.superBerryEat();
		 if(model.pseudoThornReset()){
		 	 for(var i = 0; i < model.pseudoThornsArr.length; i++){
		 	 	if(model.pseudoThornsArr[i]){
		 	 		document.getElementById(model.pseudoThornsArr[i]).setAttribute("class","pseudoThorn");
		 		 }
		 	 }
		 }
		model.pseudoThornEating();
		model.freeCells[model.checkIndex(model.snakeCoords())].free = false;
	 	model.moving = setTimeout(model.moveFunction, model.gameSpeed);
		model.moving;
	}	 		
},

goingBeyondFieldLeftSide:function(){
		if(model.snakeCoords()%20 === 0){
	 	 	view.gameOver();
	 	 	model.gameOver = true;
	 	 //	model.gameStop = true;
	 	 	return true;
	 	} else {
	 		return false;
	 	}
},
goingBeyondFieldRightSide: function(){
		if((model.snakeCoords() - 19) % 20 === 0){
			view.gameOver();
			model.gameOver = true;
			return true;
		} else {
			return false;
		}

},

goingBeyondField:function(){
	if(model.snakeCoords() < 0 || model.snakeCoords() > 399 || isNaN(model.snakeCoords())){
		model.gameOver = true;
	    return true;
	} else {
		return false;
	}
},




};


var view ={ 

 infoOutputTimeout: "",

 infoOutputFunction: function(message){
 	var infoOutput = function(message){
  	document.getElementById("infoPanel").innerHTML = message; };
    infoOutput(message);
 	clearTimeout(this.infoOutputTimeout);
  	this.infoOutputTimeout = setTimeout(infoOutput,2000,"");
  	this.infoOutputTimeout;
  },
  snakeHead: function(coords){
  	document.getElementById(coords).setAttribute("class","snakeHead");
  },

  berryAte:function(){
  	this.changeScore(model.score);
  	this.infoOutputFunction("You ate the berry!");
  	this.eatenBerrysOutput();
  },
  pseudoThornAte:function(){
  	this.changeScore(model.score);
  	this.infoOutputFunction("You ate the pseudo thorn!");
  	this.eatenPseudoThornOutput();
  },
  superBerryAte: function(){
  	this.changeScore(model.score);
  	this.infoOutputFunction("You ate the super berry!");
  	this.eatenSuperBerrysOutput();
  },

  gameOver: function(){
  	var gameOverSpan = document.getElementById("gameOver");
    gameOverSpan.innerHTML = "GAME OVER!";
    this.infoOutputFunction("you lose");
    view.snakeHead(model.snake[model.snake.length - 1]);

    clearTimeout(model.setThornSpawnTimeout);
	clearTimeout(model.setThornDeleteTimeout);
	clearTimeout(model.holesSpawnTimeout);
	clearTimeout(model.holesDeleteTimeout);
	clearTimeout(model.superBerrySpawnTimeout);
	clearTimeout(model.superBerryDeleteTimeout);
	model.clearThornActivateTimeout();
  },
  eatenBerrysOutput:function(){
  	document.getElementById("berrysEaten").innerHTML = model.eatenBerrys;
  },
  eatenSuperBerrysOutput:function(){
  	document.getElementById("superBerrysEaten").innerHTML = model.eatenSuperBerrys;
  },
  eatenPseudoThornOutput:function(){
  	document.getElementById("pseudoThornsEaten").innerHTML = model.eatenPseudoThorns;
  },
  passesThroughHoleOutput:function(){
  	document.getElementById("passesThroughHole").innerHTML = model.passedHoles;
  },
  losesTailOutput:function(){
  	document.getElementById("tailLoses").innerHTML = model.tailCuttings;
  },

  snakeCell: function(coords){
  	document.getElementById(coords).setAttribute("class","snake");
  },
  regularCell:function(coords){
  	document.getElementById(coords).setAttribute("class","td");
  },

  changeScore: function(){
  	document.getElementById("score").innerHTML = model.score;
  	view.recordChange();
  }, 

  recordChange: function(){
  	if(model.record < model.score){
  		model.record = model.score;
  		document.getElementById("record").innerHTML = model.record;
  	 }
  }


 



};

var controller = {
 restartFunctionStarted: false,

 playing: function(eventObject){
	model.gameStarted = true;
	if(!model.thornSpawnStarted && model.gameMode !== "easy"){
	model.thornSpawn();
	setTimeout(model.thornDelete,model.thornDeleteSpeed + model.thornActivateSpeed);
	model.thornSpawnStarted = true;
		}


	if(model.gameOver && !controller.restartFunctionStarted){
		controller.restartFunctionStarted = true;
		setTimeout(controller.restartFunction,500);
	} else {
		if(eventObject.code === "KeyW" || eventObject.code === "ArrowUp" || eventObject.code === "Numpad8"){
			model.snakeDirection = "up";
			model.moveFunction();
		} else if(eventObject.code === "KeyS" || eventObject.code === "ArrowDown" || eventObject.code === "Numpad2"){
			model.snakeDirection = "down";
			model.moveFunction();
		} else if(eventObject.code === "KeyA" || eventObject.code === "ArrowLeft" || eventObject.code === "Numpad4"){
			model.snakeDirection = "left";
			model.moveFunction();
		} else if(eventObject.code === "KeyD" || eventObject.code === "ArrowRight" || eventObject.code === "Numpad6"){
			model.snakeDirection = "right";
			model.moveFunction();
		} else{
			console.log("default");
			console.log(eventObject);
		}
	}
},

restartFunction: function(){
	view.regularCell(model.berryCoords);
	model.berryCoords = "";

	for(var i = 0; i < model.thornsArr.length; i++){
		view.regularCell(model.thornsArr[i]);
	}
	model.thornsArr = [];
	for(var i = 0; i < model.snake.length; i++){
		view.regularCell(model.snake[i]);
	}
	model.snake = [];
	for(var i = 0; i < model.pseudoThornsArr.length; i++){
		if(model.pseudoThornsArr[i]){
			view.regularCell(model.pseudoThornsArr[i]);
		}
	}
	model.pseudoThornsArr = [];
	for(var i = 0; i < model.freeCells.length; i++){
		delete model.freeCells[i].free;
	}
	for(var i = 0; i < model.holes.length; i++){
		view.regularCell(model.holes[i].coords);
	}
	model.holes = [];
 	model.score = 0;
 	if(model.superBerryCoords){
 	view.regularCell(model.superBerryCoords);
 	model.superBerryCoords = "";
	 }
 	view.changeScore();

 	model.eatenBerrys=0;
 	model.eatenSuperBerrys=0;
 	model.eatenPseudoThorns=0;
 	model.passedHoles=0;
 	model.tailCuttings=0;

 	view.eatenBerrysOutput();
 	view.eatenSuperBerrysOutput();
 	view.eatenPseudoThornOutput();
 	view.passesThroughHoleOutput();
 	view.losesTailOutput();

 	document.getElementById("gameOver").innerHTML = "";
 	clearTimeout(model.setThornSpawnTimeout);
 	clearTimeout(model.setThornDeleteTimeout);
 	clearTimeout(model.holesSpawnTimeout);
 	clearTimeout(model.holesDeleteTimeout);
 	clearTimeout(model.superBerrySpawnTimeout);
	clearTimeout(model.superBerryDeleteTimeout);
	clearTimeout(model.moving);
 	model.thornSpawnStarted = false;
 	model.gameOver = false;
 	model.holesOnTheTable = false;
 	model.holesSpawn();
 	model.superBerrySpawn();
 	model.berrySpawn();
 	model.snakeSpawn();
 	controller.restartFunctionStarted = false;
 	

}



};






	
window.onkeydown = controller.playing;

function fff(){
	var tds = document.getElementsByClassName("td");
	for(var i = 0; i < tds.length; i++){
		tds[i].innerHTML = i;
	}
}








function init(){
	//fff();
	model.freeCellsArrCreate();
	model.holesSpawn();
 model.snakeSpawn();
 model.berrySpawn();
 model.superBerrySpawn();
}

window.onload = init;


document.getElementById("easy").onclick = function(){ 
    model.gameSpeed = 500;
    model.gameMode = "easy";
    model.thornSpawnStarted = false;
	clearTimeout(model.setThornSpawnTimeout);
	clearTimeout(model.setThornDeleteTimeout);
	model.clearThornActivateTimeout();
	model.everyThornDelete();
	for(var i = 0; i < model.pseudoThornsArr.length; i++){
		view.regularCell(model.pseudoThornsArr[i]);
	}
	model.pseudoThornsArr = [];};
document.getElementById("medium").onclick = function(){ 
    model.gameSpeed = 300;
    model.gameMode = "medium";
    model.thornSpawnSpeed = 5000;
	model.thornDeleteSpeed = 7000;};
document.getElementById("hard").onclick = function(){ 
    model.gameSpeed = 100;
     model.gameMode = "hard";
	model.thornSpawnSpeed = 1000;
	model.thornDeleteSpeed = 1500;};

document.getElementById("restart").onclick = controller.restartFunction;
