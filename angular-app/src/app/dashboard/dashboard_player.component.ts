import { Component, Input } from '@angular/core';

@Component({
  selector: 'dashboard-player',
  templateUrl: './dashboard_player.component.html'
})
export class DashboardPlayerComponent {
    @Input() playerCodeEditting: boolean = false;
    @Input() playerCode: string;
}