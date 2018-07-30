import { Context } from './context';
import { Constant } from '../app/constant';

export class Position {
    constructor(private x:number = 0, private y:number = 0) {}
};

export class Soldier {
    protected id;
    protected pos;
    protected color = "#000000";
    protected hp = 100;
    protected alive = true;
    protected bullet = null;
    protected actionQuota = 1;
    protected shooter: Soldier = null;
    protected lastAction = "";
    protected lastActionParam = [];

    constructor(position:Position, color:string) {
        this.id = Context.getContext().nextSoldierId++;
        this.pos = position;
        this.color = color;
    }

    public refresh() {
        this.bullet = null;
        this.shooter = null;
        this.actionQuota = 1;
        this.alive = (this.hp > 0);
        this.lastAction = "";
        this.lastActionParam = [];
    }

    public getId() {
        return this.id;
    }

    public getHp() {
        return this.hp;
    }

    public getColor() {
        return this.color;
    }

    public getAlive() {
        return this.alive;
    }

    public getLastAction() {
        return this.lastAction;
    }

    public getLastActionParam() {
        return this.lastActionParam;
    }

    // Probe a position relative to self, e.g (1, 1), (-1, -1)
    // Return the soldier in the probed position if any
    public probePosition(relativeX:number, relativeY:number): Soldier {
        if (Math.abs(relativeX) > Constant.SIGHT_RANGE_UNIT || 
            Math.abs(relativeY) > Constant.SIGHT_RANGE_UNIT) {
            return null;
        }
        let x = this.pos.x + relativeX;
        let y = this.pos.y + relativeY;
        x = Math.max(x, 0);
        x = Math.min(x, Constant.MAP_WIDTH_UNIT-1);
        y = Math.max(y, 0);
        y = Math.min(y, Constant.MAP_HEIGHT_UNIT-1);
        let soldier = Context.getContext().map[x][y];
        if (soldier != null && soldier.alive) {
            return soldier;
        } else {
            return null;
        }
    }

    private distWithSoldier(soldier:Soldier) {
        return Math.sqrt(
            Math.pow(this.pos.x-soldier.pos.x, 2) +
            Math.pow(this.pos.y-soldier.pos.y, 2)
        );
    }

    private shootableBy(shooter:Soldier) {
        if (!shooter.alive || shooter.bullet == null) {
            return false;
        }
        let x = this.pos.x;
        let y = this.pos.y;
        let xShooter = shooter.pos.x;
        let yShooter = shooter.pos.y;
        let xBullet = shooter.bullet.x;
        let yBullet = shooter.bullet.y;
        if (xBullet == 0) {
            return x == xShooter;
        }
        let kBullut = yBullet/(xBullet+0.0);
        let dist = Math.abs(kBullut*x - y + yShooter - kBullut*xShooter) / Math.sqrt(Math.pow(kBullut, 2) + 1);
        return dist <= Constant.UNIT_SIZE/2.0;
    }

    private shotBy(shooter:Soldier, distance:number) {
        let harm = Math.max(1 - distance/Constant.SHOOT_RANGE_UNIT, 0) * Constant.HARM_INDEX;
        this.hp -= harm;
        this.shooter = shooter;
    }

    public moveUp() {
        if (this.actionQuota < 1) {
            return;
        }
        let y = Math.max(this.pos.y-1, 0);
        if (Context.getContext().map[this.pos.x][y] == null) {
            this.pos.y = y;
        }
        this.actionQuota--;
        this.lastAction = "up";
    };

    public moveDown() {
        if (this.actionQuota < 1) {
            return;
        }
        let y = Math.min(this.pos.y+1, Constant.MAP_HEIGHT_UNIT-1);
        if (Context.getContext().map[this.pos.x][y] == null) {
            this.pos.y = y;
        }
        this.actionQuota--;
        this.lastAction = "down";
    };

    public moveLeft() {
        if (this.actionQuota < 1) {
            return;
        }
        let x = Math.max(this.pos.x-1, 0);
        if (Context.getContext().map[x][this.pos.y] == null) {
            this.pos.x = x;
        }
        this.actionQuota--;
        this.lastAction = "left";
    };

    public moveRight() {
        if (this.actionQuota < 1) {
            return;
        }
        let x = Math.min(this.pos.x+1, Constant.MAP_WIDTH_UNIT-1);
        if (Context.getContext().map[x][this.pos.y] == null) {
            this.pos.x = x;
        }
        this.actionQuota--;
        this.lastAction = "right";
    };

    public shoot(x:number, y:number) {
        if (this.actionQuota < 1) {
            return;
        }
        this.bullet = new Position(x, y);
        this.actionQuota--;
        this.lastAction = "shoot";
        this.lastActionParam = [x, y];
    };

    public nextAction() {
        // to be implemented
    };
};
