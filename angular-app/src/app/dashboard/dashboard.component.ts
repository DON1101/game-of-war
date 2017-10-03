import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Constant } from '../constant';
import { Message, MessageType } from '../../base/message';
import { View } from '../../base/view';
import { BattleFieldComponent } from './battle_field.component';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
    @ViewChild(BattleFieldComponent)
    private compBattleField: BattleFieldComponent;

    private View = View;
    private playerCode = Constant.PLAYER_CODE_DEFAULT;
    private view: View = View.PREPARING;

    public onCodeApplied(playerCode: string) {
        this.view = View.PREPARING;
        this.playerCode = playerCode;
    }

    public changeViewCoding() {
        this.view = View.CODING;
    }

    public changeViewPreparing() {
        this.view = View.PREPARING;
    }

    public startBattle() {
        this.compBattleField.resetGame();
        this.view = View.FIGHTING;
    }
}