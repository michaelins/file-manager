import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { NzTableComponent, NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd';
import { Subject, merge, concat, forkJoin, Observable, of } from 'rxjs';
import { takeUntil, switchMap, mergeMap, exhaustMap } from 'rxjs/operators';
import { Node, NodeInfo, FileBrowserService } from './file-browser.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import * as PhotoSwipe from 'photoswipe';
import * as PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html',
  styleUrls: ['./file-browser.component.less']
})
export class FileBrowserComponent implements OnInit {

  @ViewChild('photoSwipe', { static: false }) photoSwipe: ElementRef;

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

  cdkDrag(event) {
    console.log(event);
  }

  cdkDropListEntered(event, data: Node) {
    console.log(event, data.id);
  }


  drag(event: DragEvent, data: Node) {
    event.dataTransfer.setData('id', data.id.toString());
    data.isBeingDragged = true;
  }

  dragEnter(event, data: Node) {
    // console.log('dragEnter', index, data);
  }

  dragLeave(event, data: Node) {
    // console.log('dragLeave', index, data);
    this.dragOverItemId = -1;
  }

  drop(event: DragEvent, data: Node) {
    event.preventDefault();
    this.dragOverItemId = -1;
    console.log(event.dataTransfer.getData('id'), data);
  }

  dragOver(event: DragEvent, data: Node) {
    event.preventDefault();
    if (this.dragOverItemId !== data.id) {
      this.dragOverItemId = data.id;
    }
  }

  dragEnd(event: DragEvent, data: Node) {
    this.dragOverItemId = -1;
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
