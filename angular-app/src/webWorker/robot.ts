import { Constant } from '../app/constant';
import { Position, Soldier } from './soldier';

export class Robot extends Soldier {
    constructor(position:Position, color:string) {
        super(position, color);
    }

    public static copy(soldier: Robot) {
        let newSoldier = new Robot(null, null);
        newSoldier.id = soldier.id;
        newSoldier.pos = soldier.pos;
        newSoldier.color = soldier.color;
        newSoldier.hp = soldier.hp;
        newSoldier.alive = soldier.alive;
        newSoldier.bullet = soldier.bullet;
        newSoldier.actionQuota = soldier.actionQuota;
        newSoldier.shooter = soldier.shooter;
        newSoldier.lastAction = soldier.lastAction;
        newSoldier.lastActionParam = soldier.lastActionParam;
        return newSoldier;
    }

    private randomAction() {
        let i = Math.floor(Math.random() * 4);
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
        }
    }

    private moveToward(soldier) {
        let xDelta = soldier.pos.x - this.pos.x;
        let yDelta = soldier.pos.y - this.pos.y;
        if (Math.abs(xDelta) > Math.abs(yDelta)) {
            xDelta > 0? this.moveRight() : this.moveLeft();
        } else {
            yDelta > 0? this.moveDown() : this.moveUp();
        }
    }

    private shootToward(soldier) {
        let xDelta = soldier.pos.x - this.pos.x;
        let yDelta = soldier.pos.y - this.pos.y;
        this.shoot(xDelta, yDelta);
    }

    private hasFriendNearby(xRelative, yRelative) {
        let soldier = null;
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

    private shootNearestEnemy() {
        let nearestFriend = null;
        let nearestEnemy = null;
        for (let dist = 1; dist < Constant.SIGHT_RANGE_UNIT; dist++) {
            for (let i = -dist; i <= dist; i++) {
                let soldier = null;
                soldier = this.probePosition(dist, i);
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

    public nextAction() {
        this.shootNearestEnemy();
    };
};
