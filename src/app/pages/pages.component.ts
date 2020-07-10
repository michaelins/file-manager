import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalRef } from 'ng-zorro-antd/modal/modal-ref';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UploadFile, UploadXHRArgs } from 'ng-zorro-antd/upload';
import { of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService, User } from '../auth/auth.service';
import { FileBrowserService, SignStatus, CreateNodeReq, NodeType } from '../file-browser/file-browser.service';
import { MoveToComponent } from '../modals/move-to/move-to.component';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.less']
})
export class PagesComponent implements OnInit {

  isCollapsed = false;

  constructor(
    private configService: NzConfigService,
    private notificationService: NzNotificationService,
    private fileBrowserService: FileBrowserService,
    private modalService: NzModalService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
  }

}
