import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { ModalsModule } from '../modals/modals.module';

@NgModule({
  declarations: [PagesComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    ModalsModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
