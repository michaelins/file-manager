import { NgModule } from '@angular/core';
import { FileBrowserRoutingModule } from './file-browser-routing.module';
import { FileBrowserComponent } from './file-browser.component';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [FileBrowserComponent],
  imports: [
    CommonModule,
    SharedModule,
    DragDropModule,
    NzLayoutModule,
    NzUploadModule,
    NzButtonModule,
    NzAvatarModule,
    NzTableModule,
    NzBreadCrumbModule,
    NzDropDownModule,
    NzCollapseModule,
    NzListModule,
    NzProgressModule,
    NzNotificationModule,
    NzModalModule,
    NzIconModule,
    FileBrowserRoutingModule
  ],
  exports: [FileBrowserComponent]
})
export class FileBrowserModule { }
