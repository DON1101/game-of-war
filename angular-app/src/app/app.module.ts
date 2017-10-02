import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BattleFieldComponent } from './dashboard/battle_field.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardCodingComponent } from './dashboard/coding.component';
import { DashboardPreparingComponent } from './dashboard/preparing.component';

import { RangePipe } from './range.pipe';
import { TimeStrPipe } from './time_str.pipe';

@NgModule({
  declarations: [
    AppComponent,
    BattleFieldComponent,
    DashboardPreparingComponent,
    DashboardComponent,
    DashboardCodingComponent,
    RangePipe,
    TimeStrPipe
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
