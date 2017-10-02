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
        this.view = View.FIGHTING;
        this.playerCode = playerCode;
        this.compBattleField.resetGame();
    }

    public onCodeEdit() {
        this.view = View.CODING;
    }

    public onCancelCodeEdit() {
        this.view = View.FIGHTING;
    }
}