import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalRef, NzModalService, NzConfigService } from 'ng-zorro-antd';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService, User } from '../auth/auth.service';
import { MoveToComponent } from '../modals/move-to/move-to.component';
import { UploadXHRArgs, UploadFile } from 'ng-zorro-antd/upload';
import { HttpRequest, HttpEvent, HttpEventType, HttpResponse, HttpClient } from '@angular/common/http';
import { FileBrowserService, SignStatus, UploadResp } from '../file-browser/file-browser.service';
import { switchMap } from 'rxjs/operators';
import { of, Observable, Observer, Subscription } from 'rxjs';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.less']
})
export class PagesComponent implements OnInit {

  @ViewChild('uploadProgress', { static: true }) uploadProgressTemplate: TemplateRef<{}>;

  isCollapsed = false;
  user: User;
  uploadList = [] as {
    filename: string;
    thumbnail: (string | ArrayBuffer),
    progress: number;
    status: string;
  }[];

  constructor(
    private configService: NzConfigService,
    private notificationService: NzNotificationService,
    private fileBrowserService: FileBrowserService,
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

  handleChange(item: { file: UploadFile }) {
    console.log(item);
    let uploadListItem = {
      filename: item.file.name,
      thumbnail: 'thumbnail',
      progress: 0,
      status: 'normal'
    };
    this.getBase64(item.file!.originFileObj!, (img: string) => {
      uploadListItem.thumbnail = img;
    });
    this.uploadList.push(uploadListItem);
    this.configService.set("notification", { nzPlacement: 'bottomRight' });
    this.notificationService.template(this.uploadProgressTemplate, {
      nzKey: 'uploadProgress',
      nzData: [...this.uploadList],
      nzDuration: 0,
      nzStyle: {
        width: '600px',
        marginLeft: '-265px'
      }
    });

    let fileSize = item.file.size;
    let signFormData = new FormData();//创建提交对象
    if (fileSize <= 64 * 1024) {
      signFormData.append("startSign", item.file!.originFileObj!.slice(0, fileSize)); //整个文件的签名
      signFormData.append("endSign", null); //整个文件的签名
    } else {
      signFormData.append("startSign", item.file!.originFileObj!.slice(0, 64 * 1024)); //文件前64K的数据
      signFormData.append("endSign", item.file!.originFileObj!.slice(fileSize - 64 * 1024, fileSize)); //文件末尾64K的数据
    }

    this.fileBrowserService.sign(signFormData).pipe(
      switchMap(signResp => {
        switch (signResp.status) {
          case SignStatus.NEW:
            let fileData = new FormData();
            fileData.append("signString", signResp.hashKey);
            fileData.append("file", item.file!.originFileObj!);
            return this.fileBrowserService.upload(fileData);
          case SignStatus.EXIST:
            break;
          default:
            break;
        }
      }),
      switchMap(event => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total! > 0) {
            uploadListItem.progress = Math.floor((event.loaded / event.total!) * 100);
            uploadListItem.status = 'active';
          }
          console.log(event);
          // item.onProgress!(event, item.file!);
        } else if (event instanceof HttpResponse) {
          console.log(event);
          // item.onSuccess!(event.body, item.file!, event);
          uploadListItem.status = 'success';
        }
        return of(null);
      })
    ).subscribe(resp => {
      console.log(resp);
    });
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  customReq = (item: UploadXHRArgs) => {
    return new Subscription();
    // console.log(item);
    // console.log(item.file);
    // // // Create a FormData here to store files and other parameters.
    // // const formData = new FormData();
    // // // tslint:disable-next-line:no-any
    // // formData.append('file', item.file as any);
    // // formData.append('id', '1000');
    // // const req = new HttpRequest('POST', item.action!, formData, {
    // //   reportProgress: true,
    // //   withCredentials: true
    // // });
    // this.getBase64(item.file!.originFileObj!, (img: string) => {
    //   console.log(img);
    // });


    // let uploadListItem = {
    //   filename: item.file.name,
    //   thumbnail: 'thumbnail',
    //   progress: 0,
    //   status: 'normal'
    // };
    // this.uploadList.push(uploadListItem);
    // this.configService.set("notification", { nzPlacement: 'bottomRight' });
    // this.notificationService.template(this.uploadProgressTemplate, {
    //   nzDuration: 0,
    //   nzStyle: {
    //     width: '600px',
    //     marginLeft: '-265px'
    //   }
    // });

    // let fileSize = item.file.size;
    // let signFormData = new FormData();//创建提交对象
    // if (fileSize <= 64 * 1024) {
    //   signFormData.append("startSign", item.file.slice(0, fileSize)); //整个文件的签名
    //   signFormData.append("endSign", null); //整个文件的签名
    // } else {
    //   signFormData.append("startSign", item.file.slice(0, 64 * 1024)); //文件前64K的数据
    //   signFormData.append("endSign", item.file.slice(fileSize - 64 * 1024, fileSize)); //文件末尾64K的数据
    // }

    // return this.fileBrowserService.sign(signFormData).pipe(
    //   switchMap(signResp => {
    //     switch (signResp.status) {
    //       case SignStatus.NEW:
    //         let fileData = new FormData();
    //         fileData.append("signString", signResp.hashKey);
    //         fileData.append("file", item.file as any);
    //         return this.fileBrowserService.upload(fileData);
    //       case SignStatus.EXIST:
    //         break;
    //       default:
    //         break;
    //     }
    //   }),
    //   switchMap(event => {
    //     if (event.type === HttpEventType.UploadProgress) {
    //       if (event.total! > 0) {
    //         uploadListItem.progress = Math.floor((event.loaded / event.total!) * 100);
    //         uploadListItem.status = 'active';
    //       }
    //       console.log(event);
    //       // item.onProgress!(event, item.file!);
    //     } else if (event instanceof HttpResponse) {
    //       console.log(event);
    //       // item.onSuccess!(event.body, item.file!, event);
    //       uploadListItem.status = 'success';
    //     }
    //     return of(null);
    //   })
    // ).subscribe(resp => {
    //   console.log(resp);
    // });
  };


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
          shape: 'round',
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
