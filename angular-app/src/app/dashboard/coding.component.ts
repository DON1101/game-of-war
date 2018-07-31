import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Constant } from '../constant';

@Component({
  selector: 'dashboard-coding',
  templateUrl: './coding.component.html',
})
export class DashboardCodingComponent {
    @Input() playerCode: string;
    @Output() onCodeApplied = new EventEmitter<string>();
    @Output() onCancel = new EventEmitter<string>();

    MAP_WIDTH_UNIT = Constant.MAP_WIDTH_UNIT;
    MAP_HEIGHT_UNIT = Constant.MAP_HEIGHT_UNIT;
    SIGHT_RANGE_UNIT = Constant.SIGHT_RANGE_UNIT;
    SHOOT_RANGE_UNIT = Constant.SHOOT_RANGE_UNIT;

    public applyCode() {
      this.onCodeApplied.emit(this.playerCode);
    }

    public cancel() {
      this.onCancel.emit();
    }
}