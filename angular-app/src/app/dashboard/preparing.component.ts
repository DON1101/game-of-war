import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dashboard-preparing',
  templateUrl: './preparing.component.html',
})
export class DashboardPreparingComponent {
    @Input() playerCode: string;
    @Output() onTrain = new EventEmitter<string>();
    @Output() onFight = new EventEmitter<string>();

    public train() {
      this.onTrain.emit(this.playerCode);
    }

    public fight() {
      this.onFight.emit(this.playerCode);
    }
}