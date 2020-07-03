import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { forkJoin, fromEvent, Observable, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { FileBrowserService, Node, NodeInfo } from './file-browser.service';

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

  constructor(
    private nzContextMenuService: NzContextMenuService,
    private fileBrowserService: FileBrowserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

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
    this.route.params.pipe(switchMap(params => {
      if (params.folderId) {
        console.log(params.folderId);
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
      console.log(nodes);
      console.log(node);
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
    console.log(id);
    this.router.navigate(['/pages/folder/', id]);
    // this.fileBrowserService.getNodesByParentId(id).subscribe(nodes => {
    //   console.log(nodes);
    //   this.currentNodes = nodes;
    // });
  }

  // cdkDrag(event) {
  //   console.log(event);
  // }

  // cdkDropListEntered(event, data: Node) {
  //   console.log(event, data.id);
  // }

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

  // dragEnter(event, data: Node) {
  //   // console.log('dragEnter', index, data);
  // }

  // dragLeave(event, data: Node) {
  //   // console.log('dragLeave', index, data);
  //   this.dragOverItemId = -1;
  // }

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

  // dragEnd(event: DragEvent, data: Node) {
  //   this.dragOverItemId = -1;
  // }

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
