var robotJs = `
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

Robot.prototype.shootToward = function(soldier) {
    var xDelta = soldier.pos.x - this.pos.x;
    var yDelta = soldier.pos.y - this.pos.y;
    this.shoot(xDelta, yDelta);
}

Robot.prototype.hasFriendNearby = function(xRelative, yRelative) {
    var soldier = null;
    soldier = this.probePosition(xRelative, yRelative-1);
    if (soldier != null && soldier.color == this.color) {
        return true;
    }
    soldier = this.probePosition(xRelative, yRelative+1);
    if (soldier != null && soldier.color == this.color) {
        return true;
    }
    soldier = this.probePosition(xRelative+1, yRelative);
    if (soldier != null && soldier.color == this.color) {
        return true;
    }
    soldier = this.probePosition(xRelative+1, yRelative+1);
    if (soldier != null && soldier.color == this.color) {
        return true;
    }
    soldier = this.probePosition(xRelative+1, yRelative-1);
    if (soldier != null && soldier.color == this.color) {
        return true;
    }
    soldier = this.probePosition(xRelative-1, yRelative+1);
    if (soldier != null && soldier.color == this.color) {
        return true;
    }
    soldier = this.probePosition(xRelative-1, yRelative+1);
    if (soldier != null && soldier.color == this.color) {
        return true;
    }
    soldier = this.probePosition(xRelative-1, yRelative);
    if (soldier != null && soldier.color == this.color) {
        return true;
    }
    return false;
}

Robot.prototype.shootNearestEnemy = function() {
    var nearestFriend = null;
    var nearestEnemy = null;
    for (var dist = 1; dist < SIGHT_RANGE_UNIT; dist++) {
        for (var i = -dist; i <= dist; i++) {
            var soldier = this.probePosition(dist, i);
            if (soldier != null) {
                if (soldier.color == this.color) {
                    if (nearestFriend == null) {
                        nearestFriend = soldier;
                    }
                } else {
                    if (nearestEnemy == null && !this.hasFriendNearby(dist, i)) {
                        nearestEnemy = soldier;
                        break;
                    }
                }
            }
            soldier = this.probePosition(-dist, i);
            if (soldier != null) {
                if (soldier.color == this.color) {
                    if (nearestFriend == null) {
                        nearestFriend = soldier;
                    }
                } else {
                    if (nearestEnemy == null && !this.hasFriendNearby(-dist, i)) {
                        nearestEnemy = soldier;
                        break;
                    }
                }
            }
            soldier = this.probePosition(i, dist);
            if (soldier != null) {
                if (soldier.color == this.color) {
                    if (nearestFriend == null) {
                        nearestFriend = soldier;
                    }
                } else {
                    if (nearestEnemy == null && !this.hasFriendNearby(i, dist)) {
                        nearestEnemy = soldier;
                        break;
                    }
                }
            }
            soldier = this.probePosition(i, -dist);
            if (soldier != null) {
                if (soldier.color == this.color) {
                    if (nearestFriend == null) {
                        nearestFriend = soldier;
                    }
                } else {
                    if (nearestEnemy == null && !this.hasFriendNearby(i, -dist)) {
                        nearestEnemy = soldier;
                        break;
                    }
                }
            }
        }
        if (nearestEnemy != null) {
            break;
        }
    }
    if (nearestEnemy != null) {
        if (Math.random() < 0.5) {
            this.moveToward(nearestEnemy);
        } else {
            this.shootToward(nearestEnemy);
        }
        return;
    }
    if (nearestFriend != null) {
        this.moveToward(nearestFriend);
        return;
    }
    this.randomAction();
}

Robot.prototype.nextAction = function() {
    this.shootNearestEnemy();
};
`;