import { Constant } from '../app/constant';
import { Position, Soldier } from './soldier';

export class Player extends Soldier {
    constructor(position:Position, color:string) {
        super(position, color);
    }

    public static copy(soldier: Player) {
        let newSoldier = new Player(null, null);
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

    public static resetPlayer(playerCode:string) {
        Constant.PLAYER_CODE_DEFAULT; // We should keep this here, otherwise "constant_1" cannot be found
        let finalCode = playerCode.replace(new RegExp("Constant\.", 'g'), "constant_1.Constant.");
        eval(finalCode);
    }

    public nextAction() {
        Player.prototype["playerFunc"](this);
    }
};
