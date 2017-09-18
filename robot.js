var Robot = function(position, color, health) {
    Soldier.call(this, position, color, health);
};

Robot.prototype = Object.create(Soldier.prototype);

Robot.prototype.randomAction = function() {
    var i = Math.floor(Math.random() * 4);
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
}

Robot.prototype.moveToward = function(soldier) {
    var xDelta = soldier.pos.x - this.pos.x;
    var yDelta = soldier.pos.y - this.pos.y;
    if (Math.abs(xDelta) > Math.abs(yDelta)) {
        xDelta > 0? this.moveRight() : this.moveLeft();
    } else {
        yDelta > 0? this.moveDown() : this.moveUp();
    }
}

Robot.prototype.nextAction = function() {
    // var foundEnemy = false;
    // var lastFoundFriend = null;
    // for (var i = -SIGHT_RANGE_UNIT; i <= SIGHT_RANGE_UNIT; i++) {
    //     for (var j = -SIGHT_RANGE_UNIT; j <= SIGHT_RANGE_UNIT; j++) {
    //         var soldier = this.probePosition(i, j);
    //         if (soldier == null || soldier.id == this.id) {
    //             continue;
    //         }
    //         if (soldier.color != this.color) {
    //             foundEnemy = true;
    //             if (Math.random() < 0.5) {
    //                 this.moveToward(soldier);
    //             } else {
    //                 this.shoot(i, j);
    //             }
    //             break;
    //         } else {
    //             lastFoundFriend = soldier;
    //         }
    //         if (foundEnemy) {
    //             break;
    //         }
    //     }
    //     if (foundEnemy) {
    //         break;
    //     }
    // }
    // if (!foundEnemy) {
    //     if (lastFoundFriend != null) {
    //         this.moveToward(lastFoundFriend);
    //     } else {
    //         this.randomAction();
    //     }
    // }
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
};