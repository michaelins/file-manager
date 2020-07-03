import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MoveToComponent } from './move-to/move-to.component';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [MoveToComponent],
  imports: [
    CommonModule,
    NzTreeModule,
    NzIconModule
  ],
  entryComponents: [MoveToComponent]
})
export class ModalsModule { }
