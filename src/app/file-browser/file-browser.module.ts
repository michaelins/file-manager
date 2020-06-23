import { NgModule } from '@angular/core';
import { FileBrowserRoutingModule } from './file-browser-routing.module';
import { FileBrowserComponent } from './file-browser.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [FileBrowserComponent],
  imports: [
    CommonModule,
    SharedModule,
    DragDropModule,
    NgZorroAntdModule,
    FileBrowserRoutingModule
  ],
  exports: [FileBrowserComponent]
})
export class FileBrowserModule { }
