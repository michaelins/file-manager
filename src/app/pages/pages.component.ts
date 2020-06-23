import { Component, OnInit } from '@angular/core';
import { NzModalService, ModalButtonOptions, NzModalRef } from 'ng-zorro-antd';
import { MoveToComponent } from '../modals/move-to/move-to.component';
import { AuthService, User } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.less']
})
export class PagesComponent implements OnInit {

  isCollapsed = false;
  user: User;

  constructor(
    private modalService: NzModalService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.authService.user.subscribe(user => {
      console.log(user);
      if (user) {
        this.user = user;
      }
    }, error => {
      console.log(error);
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  createComponentModal(): void {
    const modal: NzModalRef<MoveToComponent, any> = this.modalService.create({
      nzTitle: '移动到',
      nzContent: MoveToComponent,
      nzComponentParams: {
        title: 'title in component',
        subtitle: 'component sub title，will be changed after 2 sec'
      },
      nzFooter: [
        {
          label: '新建文件夹',
          loading: false,
          type: 'default',
          onClick(): void {
            this.disabled = true;
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
              this.disabled = false;
            }, 1000);
          }
        },
        {
          label: '确定',
          type: 'primary',
          loading: false,
          onClick(): void {
            modal.getContentComponent().onSubmit();
            this.disabled = true;
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
              this.disabled = false;
              modal.destroy();
            }, 2000);
          }
        },
        {
          label: '取消',
          shape: 'default',
          onClick: () => modal.destroy()
        }
      ]
    });

    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));

    // Return a result when closed
    modal.afterClose.subscribe(result => console.log('[afterClose] The result is:', result));

    // delay until modal instance created
    setTimeout(() => {
      const instance = modal.getContentComponent();
      instance.subtitle = 'sub title is changed';
    }, 2000);
  }

}
