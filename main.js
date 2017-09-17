var UNIT_SIZE = 3; // px
var MAP_WIDTH_UNIT = 200;
var MAP_HEIGHT_UNIT = 200;
var SOLDIER_NUM_EACH = 500;
var COLOR_NUM = 2;
var SIGHT_RANGE_UNIT = 10; // how far can a soldier can see in sight

var canvas = null;
var context = null;
var gameStop = undefined;
var distMatrix = null;
var map = null;
var soldierList = null;
var dictSoldierNum = {};
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
        var x = Math.floor(Math.random() * MAP_WIDTH_UNIT) - Math.floor(MAP_WIDTH_UNIT/2);
        var y = Math.floor(Math.random() * MAP_HEIGHT_UNIT) - Math.floor(MAP_HEIGHT_UNIT/2);
        this.shoot(x, y);
        break;
}
`;