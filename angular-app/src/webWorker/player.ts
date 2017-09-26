import { Constant } from '../app/constant';
import { Position, Soldier } from './soldier';

export class Player extends Soldier {
    constructor(position:Position, color:string) {
        super(position, color);
    }

    public nextAction() {
        let i = Math.floor(Math.random() * 5);
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
                let x = Math.floor(Math.random() * Constant.SIGHT_RANGE_UNIT) - Math.floor(Constant.SIGHT_RANGE_UNIT/2);
                let y = Math.floor(Math.random() * Constant.SIGHT_RANGE_UNIT) - Math.floor(Constant.SIGHT_RANGE_UNIT/2);
                this.shoot(x, y);
                break;
        }
    };
};
