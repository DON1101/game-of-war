import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';

import { RangePipe } from './range.pipe';
import { TimeStrPipe } from './time_str.pipe';

@NgModule({
  declarations: [
    DashboardComponent,
    RangePipe,
    TimeStrPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [DashboardComponent]
})
export class AppModule { }
