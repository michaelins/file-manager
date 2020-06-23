import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MoveToComponent } from './move-to/move-to.component';

@NgModule({
  declarations: [MoveToComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule
  ],
  entryComponents: [MoveToComponent]
})
export class ModalsModule { }
