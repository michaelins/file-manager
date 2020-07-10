import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { forkJoin, fromEvent, Observable, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { FileBrowserService, Node, NodeInfo, SignStatus, CreateNodeReq, NodeType } from './file-browser.service';
import { AuthService, User } from '../auth/auth.service';
import { UploadXHRArgs, UploadFile } from 'ng-zorro-antd/upload';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MoveToComponent } from '../modals/move-to/move-to.component';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html',
  styleUrls: ['./file-browser.component.less']
})
export class FileBrowserComponent implements OnInit {

  @ViewChild('photoSwipe') photoSwipe: ElementRef;
  @ViewChild('uploadProgress') uploadProgressTemplate: TemplateRef<{}>;

  constructor(
    private configService: NzConfigService,
    private notificationService: NzNotificationService,
    private modalService: NzModalService,
    private nzContextMenuService: NzContextMenuService,
    private fileBrowserService: FileBrowserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  user: User;
  uploadList = [] as {
    filename: string;
    thumbnail: (string | ArrayBuffer),
    progress: number;
    status: string;
  }[];
  dragOverItemId = -1;
  currentNodes = [] as Node[];
  currentNode: NodeInfo;
  currentPath: string[] = ['全部'];
  environment = environment;
  isLoading = true;
  dragImageStyles = {} as { top: string, left: string, visibility: string, display: string };
  mouseMoveObs: Observable<Event>;
  mouseMoveSubscription: Subscription;

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      if (user) {
        this.user = user;
      }
    }, error => {
      console.log(error);
    });

    this.route.params.pipe(switchMap(params => {
      if (params.folderId) {
        // console.log(params.folderId);
        return forkJoin(
          this.fileBrowserService.getNodesByParentId(params.folderId),
          this.fileBrowserService.getNode(params.folderId)
        );
      } else {
        return forkJoin(
          this.fileBrowserService.getNodesByParentId(-999),
          of(null as NodeInfo)
        );
      }
    })).subscribe(([nodes, node]) => {
      // console.log(nodes);
      // console.log(node);
      if (nodes) {
        this.currentNodes = nodes;
      }
      if (node) {
        this.currentNode = node;
        const path = this.currentNode.path + this.currentNode.name;
        this.currentPath = path.substring(1).split('/');
      }
      this.isLoading = false;
    }, error => {
      console.log(error);
      this.isLoading = false;
    }, () => {
      console.log(this.isLoading);
    });

    this.mouseMoveObs = fromEvent(document, 'mousemove');
    // this.mouseMoveSubscription = this.mouseMoveObs.subscribe(e => {
    //   console.log(e);
    // })
  }

  getIconClass(data: Node, isActive?: boolean) {
    if (isActive) {
      return [data.header, 'active'];
    } else {
      return [data.header];
    }
  }

  openFolder(id: number) {
    // console.log(id);
    this.router.navigate(['/pages/folder/', id]);
    // this.fileBrowserService.getNodesByParentId(id).subscribe(nodes => {
    //   console.log(nodes);
    //   this.currentNodes = nodes;
    // });
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  handleChange(item: { file: UploadFile }) {
    console.log(item);
    let uploadListItem = {
      filename: item.file.name,
      thumbnail: '',
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

    let folderId: number;
    this.route.params.pipe(
      switchMap(params => {
        console.log(params);
        if (params.folderId) {
          console.log(params.folderId);
          folderId = params.folderId;
        }
        return this.fileBrowserService.sign(signFormData);
      }),
      switchMap(signResp => {
        console.log(event);
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
          let req: CreateNodeReq = {
            name: item.file.name,
            parentId: folderId,
            weight: 0,
            type: NodeType.FILE,
            fileId: (event.body as { id: string }).id
          };
          console.log(folderId);
          return this.fileBrowserService.createFileNode(req);
        }
        return of(null);
      }),
      switchMap(resp => {
        if (resp && (resp!.parentId == folderId)) {
          uploadListItem.status = 'success';
          return this.fileBrowserService.getNodesByParentId(folderId);
        };
        return of(null as Node[]);
      })
    ).subscribe(resp => {
      console.log(resp);
      if (resp) {
        this.currentNodes = resp;
      }
    }, error => {
      console.log(error);
    }, () => {
    });
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  customReq = (item: UploadXHRArgs) => {
    return new Subscription();
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

  onMouseDown(event: MouseEvent) {
    console.log(event);
  }

  drag(event: DragEvent, data: Node) {
    var img = document.createElement("img");
    img.src = "http://kryogenix.org/images/hackergotchi-simpler.png";

    event.dataTransfer.setData("application/pb.file.manager.node", data.id.toString());
    event.dataTransfer.setData("text/plain", data.id.toString());
    event.dataTransfer.setDragImage(new Image(), 0, 0);
    // event.dataTransfer.setData('id', data.id.toString());
    data.isBeingDragged = true;
    // console.log('drag - ', data);
  }

  dragOver(event: DragEvent) {
    const isNode = event.dataTransfer.types.includes("application/pb.file.manager.node");
    // console.log('dragover', event);
    this.dragImageStyles.visibility = 'visible';
    this.dragImageStyles.display = 'block';
    this.dragImageStyles.left = event.pageX + 30 + 'px';
    this.dragImageStyles.top = event.pageY + 30 + 'px';
    if (isNode) {
      event.preventDefault();
    }
    // event.preventDefault();
    // if (this.dragOverItemId !== data.id) {
    //   this.dragOverItemId = data.id;
    // }
  }

  dragLeave(event) {
    console.log(event);
    // this.dragImageStyles.visibility = 'hidden';
    this.dragImageStyles.display = 'none';

  }

  drop(event: DragEvent) {
    // this.dragOverItemId = -1;
    console.log(event.dataTransfer.getData('application/pb.file.manager.node'));
    // this.dragImageStyles.visibility = 'hidden';
    this.dragImageStyles.display = 'none';
    event.preventDefault();
  }

  sort(event) {
    console.log(event);
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }

}
