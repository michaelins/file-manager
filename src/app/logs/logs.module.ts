import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LogsRoutingModule } from './logs-routing.module';
import { LogsComponent } from './logs.component';
import { ZorroSharperModule } from "zorro-sharper";

@NgModule({
  declarations: [LogsComponent],
  imports: [
    CommonModule,
    ZorroSharperModule,
    LogsRoutingModule
  ]
})
export class LogsModule { }
