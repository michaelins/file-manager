import { NgModule } from '@angular/core';
import { FileBrowserRoutingModule } from './file-browser-routing.module';
import { FileBrowserComponent } from './file-browser.component';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@NgModule({
  declarations: [FileBrowserComponent],
  imports: [
    CommonModule,
    SharedModule,
    DragDropModule,
    NzTableModule,
    NzBreadCrumbModule,
    NzDropDownModule,
    FileBrowserRoutingModule
  ],
  exports: [FileBrowserComponent]
})
export class FileBrowserModule { }
