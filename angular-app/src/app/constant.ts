export class Constant {
    public static UNIT_SIZE = 3; // px
    public static MAP_WIDTH_UNIT = 200;
    public static MAP_HEIGHT_UNIT = 200;
    public static SOLDIER_NUM_EACH = 500;
    public static COLOR_NUM = 2;
    public static COLOR_LIST = ["red", "blue", "green", "black", "purple"];
    public static SIGHT_RANGE_UNIT = 50; // how far can a soldier can see in sight
    public static SHOOT_RANGE_UNIT = 50; // how far can a bullet can shoot
    public static GAME_TOTAL_TIME = -1; // in seconds

    public static PLAYER_CODE_DEFAULT = `
importScripts("http://chancejs.com/chance.min.js");

Player.prototype.playerFunc = function(self) {
    /* 每一轮行动中，士兵最多可以消耗1个行动数，士兵可以有如下行动指令：
    self.moveUp()
        向上移动一个单位。
        该指令消耗1个行动数。
    self.moveDown()
        向下移动一个单位。
        该指令消耗1个行动数。
    self.moveLeft()
        向左移动一个单位。
        该指令消耗1个行动数。
    self.moveRight()
        向右移动一个单位。
        该指令消耗1个行动数。
    self.shoot(relativeX, relativeY)
        向某个相对方向开枪射击。
        该指令消耗1个行动数。
    self.probePosition(relativeX, relativeY)
        侦查某个相对位置，如果该位置有士兵，则返回该士兵对象，否则返回null。
        该指令消耗0个行动数。
    */
    let chance = new Chance();
    let i = chance.integer({min: 0, max: 4});
    switch(i) {
        case 0:
            self.moveUp();
            break;
        case 1:
            self.moveDown();
            break;
        case 2:
            self.moveLeft();
            break;
        case 3:
            self.moveRight();
            break;
        case 4:
            let x = Math.random();
            let y = Math.random();
            self.shoot(x, y);
            break;
    }
}
    `;
}