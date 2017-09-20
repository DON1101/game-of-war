var Player = function(position, color, health) {
    Soldier.call(this, position, color, health);
};

Player.prototype = Object.create(Soldier.prototype);

Player.prototype.nextAction = function() {
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
};