export class Constant {
    public static UNIT_SIZE = 3; // px
    public static UNIT_FRAME = 100; // ms
    public static MAP_WIDTH_UNIT = 200;
    public static MAP_HEIGHT_UNIT = 200;
    public static HEALTH_BAR_LENGTH_UNIT = 5;
    public static SOLDIER_NUM_EACH = 200;
    public static COLOR_NUM = 2;
    public static COLOR_LIST = ["red", "blue", "green", "black", "purple"];
    public static SIGHT_RANGE_UNIT = 50; // how far can a soldier can see in sight
    public static SHOOT_RANGE_UNIT = 50; // how far can a bullet can shoot
    public static GAME_TOTAL_TIME = -1; // in seconds
    public static HARM_INDEX = 10;

    public static PLAYER_CODE_DEFAULT = `

Player.prototype.playerFunc = function(self) {
    /* 
    Each soldier is looping for actions.
    During each loop, a soldier can have ONLY ONE action.
    Available actions including:
    self.moveUp()
        Move 1 unit distance up.
        Consuming 1 action count.
    self.moveDown()
        Move 1 unit distance down.
        Consuming 1 action count.
    self.moveLeft()
        Move 1 unit distance to left.
        Consuming 1 action count.
    self.moveRight()
        Move 1 unit distance to right.
        Consuming 1 action count.
    self.shoot(relativeX, relativeY)
        Shoot to the relative direction.
        Consuming 1 action count.
    self.probePosition(relativeX, relativeY)
        Probe a relative position, 
        if there's a soldier standing on that position, return that soldier,
        else, return null.
        Consuming 0 action count.
    */
    let i = Math.floor(Math.random() * 5);
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