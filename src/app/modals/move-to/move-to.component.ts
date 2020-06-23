import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef, NzFormatEmitEvent, NzTreeNodeOptions, NzTreeNode } from 'ng-zorro-antd';

@Component({
  selector: 'app-move-to',
  templateUrl: './move-to.component.html',
  styleUrls: ['./move-to.component.less']
})
export class MoveToComponent implements OnInit {

  @Input() title: string;
  @Input() subtitle: string;

  nodes = [
    { title: '新建文件夹', key: '0' },
    { title: 'Horizon', key: '1' },
    { title: 'logs', key: '2', isLeaf: true }
  ];
  activedNode: NzTreeNode;
  constructor(private modal: NzModalRef) { }

  ngOnInit() {
  }

  destroyModal(): void {
    this.modal.destroy({ data: 'this the result data' });
  }

  public onSubmit() {
    console.log('submit');
  }

  openFolder(data: NzTreeNode | Required<NzFormatEmitEvent>): void {
    console.log(data);
    // do something if u want
    let node: NzTreeNode;
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded;
      node = data;
    } else {
      node = data.node;
      if (node) {
        node.isExpanded = !node.isExpanded;
      }
    }

    if (node && node.getChildren().length === 0 && node.isExpanded) {
      this.loadNode().then(nodes => {
        node.addChildren(nodes);
      });
    }
  }

  activeNode(data: Required<NzFormatEmitEvent>): void {
    this.activedNode = data.node;
    this.nzEvent(data);
  }

  nzEvent(event: Required<NzFormatEmitEvent>): void {
    console.log(event);
    // load child async
    if (event.eventName === 'expand') {
      console.log('loading...', event.node);
      const node = event.node;
      if (node && node.getChildren().length === 0 && node.isExpanded) {
        this.loadNode().then(data => {
          node.addChildren(data);
        });
      }
    }
  }

  loadNode(): Promise<NzTreeNodeOptions[]> {
    return new Promise(resolve => {
      setTimeout(
        () =>
          resolve([
            { title: 'The.Matrix.Reloaded.2003.黑客帝国.重装上阵.双语字幕.国英音轨.HR-HDTV.AC3.1024X576.x264', key: `${new Date().getTime()}-0` },
            { title: '新建文件夹1', key: `${new Date().getTime()}-1` },
            { title: '新建文件夹1', key: `${new Date().getTime()}-2` },
            { title: '新建文件夹1', key: `${new Date().getTime()}-3` },
            { title: '新建文件夹1', key: `${new Date().getTime()}-4` },
            { title: '新建文件夹1', key: `${new Date().getTime()}-5` },
            { title: '新建文件夹1', key: `${new Date().getTime()}-6` },
            { title: '新建文件夹1', key: `${new Date().getTime()}-7` },
            { title: '新建文件夹1', key: `${new Date().getTime()}-8` },
            { title: '新建文件夹1', key: `${new Date().getTime()}-9` },
          ]),
        200
      );
    });
  }
}
