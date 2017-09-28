import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardPlayerComponent } from './dashboard/dashboard_player.component';

import { RangePipe } from './range.pipe';
import { TimeStrPipe } from './time_str.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DashboardPlayerComponent,
    RangePipe,
    TimeStrPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
