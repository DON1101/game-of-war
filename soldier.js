var Position = function(x, y) {
    this.x = x!=null? x : 0;
    this.y = y!=null? y : 0;
};

var Soldier = function(position, color, health) {
    this.id = nextSoldierId++;
    this.pos = position!=null? position : new Position();
    this.color = color!=null? color : "#000000";
    this.hp = health!=null? health : 100;
    this.bullet = null;
    this.actionQuota = 1;
};

Soldier.prototype.alive = function() {
    return this.hp > 0;
}

Soldier.prototype.resetAction = function() {
    this.actionQuota = 1;
}

// Probe a position relative to self, e.g (1, 1), (-1, -1)
// Return the soldier in the probed position if any
Soldier.prototype.probePosition = function(relativeX, relativeY) {
    if (Math.abs(relativeX) > SIGHT_RANGE_UNIT || 
        Math.abs(relativeY) > SIGHT_RANGE_UNIT) {
        return null;
    }
    var x = this.pos.x + relativeX;
    var y = this.pos.y + relativeY;
    x = Math.max(x, 0);
    x = Math.min(x, MAP_WIDTH_UNIT-1);
    y = Math.max(y, 0);
    y = Math.min(y, MAP_HEIGHT_UNIT-1);
    return map[x][y];
}

Soldier.prototype.distWithSoldier = function(soldier) {
    return Math.sqrt(
        Math.pow(this.pos.x-soldier.pos.x, 2) +
        Math.pow(this.pos.y-soldier.pos.y, 2)
    );
}

Soldier.prototype.shootableBy = function(shooter) {
    if (shooter.hp <= 0 || shooter.bullet == null) {
        return false;
    }
    var x = this.pos.x;
    var y = this.pos.y;
    var xShooter = shooter.pos.x;
    var yShooter = shooter.pos.y;
    var xBullet = shooter.bullet.x;
    var yBullet = shooter.bullet.y;
    if (xBullet == 0) {
        return x == xShooter;
    }
    var kBullut = yBullet/(xBullet+0.0);
    var dist = Math.abs(kBullut*x - y + yShooter - kBullut*xShooter) / Math.sqrt(Math.pow(kBullut, 2) + 1);
    return dist <= UNIT_SIZE/2.0;
}

Soldier.prototype.shotBy = function(shooter) {
    this.hp -= 1;
}

Soldier.prototype.moveUp = function() {
    if (this.actionQuota < 1) {
        return;
    }
    var y = Math.max(this.pos.y-1, 0);
    if (map[this.pos.x][y] == null) {
        this.pos.y = y;
    }
    this.bullet = null;
    this.actionQuota--;
};

Soldier.prototype.moveDown = function() {
    if (this.actionQuota < 1) {
        return;
    }
    var y = Math.min(this.pos.y+1, MAP_HEIGHT_UNIT-1);
    if (map[this.pos.x][y] == null) {
        this.pos.y = y;
    }
    this.bullet = null;
    this.actionQuota--;
};

Soldier.prototype.moveLeft = function() {
    if (this.actionQuota < 1) {
        return;
    }
    var x = Math.max(this.pos.x-1, 0);
    if (map[x][this.pos.y] == null) {
        this.pos.x = x;
    }
    this.bullet = null;
    this.actionQuota--;
};

Soldier.prototype.moveRight = function() {
    if (this.actionQuota < 1) {
        return;
    }
    var x = Math.min(this.pos.x+1, MAP_WIDTH_UNIT-1);
    if (map[x][this.pos.y] == null) {
        this.pos.x = x;
    }
    this.bullet = null;
    this.actionQuota--;
};

Soldier.prototype.shoot = function(x, y) {
    if (this.actionQuota < 1) {
        return;
    }
    this.bullet = new Position(x, y);
    this.actionQuota--;
};

Soldier.prototype.nextAction = function() {
    // to be implemented
};