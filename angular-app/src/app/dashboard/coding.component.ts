import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dashboard-coding',
  templateUrl: './coding.component.html',
})
export class DashboardCodingComponent {
    @Input() playerCode: string;
    @Output() onCodeApplied = new EventEmitter<string>();
    @Output() onCancel = new EventEmitter<string>();

    public applyCode() {
      this.onCodeApplied.emit(this.playerCode);
    }

    public cancel() {
      this.onCancel.emit();
    }
}