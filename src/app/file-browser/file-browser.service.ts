import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EqualObject, SortObject } from '../shared/common-interfaces/common-interfaces';
import { environment } from 'src/environments/environment';

export interface Node {
  id: number;
  label: string;
  header: string;
  dataBox: NodeInfo;
  leaf: boolean;
  children: string;
  isBeingDragged?: boolean;
}

export interface NodeInfo {
  status: string;
  path: string;
  searchIndex: string;
  indexKey: string;
  name: string;
  parentId: number;
  weight: number;
  description: string;
  createAdminId: string;
  type: string;
  fileProperties: string;
  subCategories: string;
  id: number;
  createTime: string;
  updateTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileBrowserService {

  constructor(
    private http: HttpClient) { }

  getNodesByParentId(parentId: number) {
    const equal = [{
      eqObj: 0,
      field: 'status'
    }, {
      eqObj: parentId,
      field: 'parentId'
    }] as EqualObject[];
    return this.getNodes(equal);
  }

  getNodes(equal: EqualObject[], sort?: SortObject[]) {
    if (!sort) {
      sort = [{ direction: 1, field: 'weight' }] as SortObject[];
    }
    return this.http.post<Node[]>(`${environment.apiServer}/node/tree`, { equal, sort });
  }

  getNode(id: number) {
    return this.http.get<NodeInfo>(`${environment.apiServer}/node/${id}`);
  }
}
