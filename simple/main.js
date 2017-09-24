// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var UNIT_SIZE = 3; // px
var MAP_WIDTH_UNIT = 200;
var MAP_HEIGHT_UNIT = 200;
var SOLDIER_NUM_EACH = 500;
var COLOR_NUM = 2;
var COLOR_LIST = ["red", "blue", "green", "black", "purple"];
var SIGHT_RANGE_UNIT = 500; // how far can a soldier can see in sight
var SHOOT_RANGE_UNIT = 50; // how far can a bullet can shoot
var GAME_TOTAL_TIME = 60; // in seconds

var canvas = null;
var context = null;
var gameRunning = true;
var distMatrix = null;
var map = null;
var soldierList = null;
var nextSoldierId = 0;

var userCodeDefault = `
/* 每一轮行动中，士兵最多可以消耗1个行动数，士兵可以有如下行动指令：
this.moveUp()
    向上移动一个单位，该指令消耗1个行动数。
this.moveDown()
    向下移动一个单位，该指令消耗1个行动数。
this.moveLeft()
    向左移动一个单位，该指令消耗1个行动数。
this.moveRight()
    向右移动一个单位，该指令消耗1个行动数。
this.shoot(relativeX, relativeY)
    向某个相对方向开枪射击，该指令消耗1个行动数。
this.probePosition(relativeX, relativeY)
    侦查某个相对位置，如果该位置有士兵，则返回该士兵对象，否则返回null。该指令消耗0个行动数。
*/    
var i = Math.floor(Math.random() * 5);
switch(i) {
    case 0:
        this.moveUp();
        break;
    case 1:
        this.moveDown();
        break;
    case 2:
        this.moveLeft();
        break;
    case 3:
        this.moveRight();
        break;
    case 4:
        var x = Math.floor(Math.random() * SIGHT_RANGE_UNIT) - Math.floor(SIGHT_RANGE_UNIT/2);
        var y = Math.floor(Math.random() * SIGHT_RANGE_UNIT) - Math.floor(SIGHT_RANGE_UNIT/2);
        this.shoot(x, y);
        break;
}
`;