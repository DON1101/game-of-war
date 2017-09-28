import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dashboard-player',
  templateUrl: './dashboard_player.component.html'
})
export class DashboardPlayerComponent {
    @Input() playerCodeEditting: boolean = false;
    @Input() playerCode: string;
    @Output() onCodeApplied = new EventEmitter<string>();

    public applyCode() {
        this.onCodeApplied.emit(this.playerCode);
    }
}