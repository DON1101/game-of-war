import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dashboard-player',
  templateUrl: './dashboard_player.component.html',
  styleUrls: [
      '../app.component.css',
      "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
  ],
})
export class DashboardPlayerComponent {
    @Input() playerCode: string;
    @Output() onCodeApplied = new EventEmitter<string>();

    public applyCode() {
        this.onCodeApplied.emit(this.playerCode);
    }
}