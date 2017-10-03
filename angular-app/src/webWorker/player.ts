import { Constant } from '../app/constant';
import { Position, Soldier } from './soldier';

export class Player extends Soldier {
    constructor(position:Position, color:string) {
        super(position, color);
    }

    public static resetPlayer(playerCode:string) {
        Constant.PLAYER_CODE_DEFAULT; // We should keep this here, otherwise "constant_1" cannot be found
        let finalCode = playerCode.replace(new RegExp("Constant\.", 'g'), "constant_1.Constant.");
        finalCode = "Player.prototype.playerFunc = function(self) {" + finalCode + "}";
        eval(finalCode);
    }

    public nextAction() {
        Player.prototype["playerFunc"](this);
    }
};
