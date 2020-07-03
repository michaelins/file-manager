import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { ModalsModule } from '../modals/modals.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [PagesComponent],
  imports: [
    CommonModule,
    ModalsModule,
    NzLayoutModule,
    NzInputModule,
    NzMenuModule,
    NzUploadModule,
    NzButtonModule,
    NzAvatarModule,
    NzDropDownModule,
    NzCollapseModule,
    NzListModule,
    NzProgressModule,
    NzNotificationModule,
    NzModalModule,
    NzIconModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
