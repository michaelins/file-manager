import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
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
  type: NodeType;
  fileProperties: FileProperty;
  subCategories: string;
  id: number;
  createTime: string;
  updateTime: string;
}

export interface FileProperty {
  fileRealName: string;
  mediaEnum: MediaType;
  saveType: FileStatus;
  size: number;
  suffixEnum: string;
  images?: ImageResolution;
  thumbnail?: ThumbnailInfo;
}

export interface ImageResolution {
  width: number;
  height: number;
}

export interface ThumbnailInfo {
  thumbnailMapLocation: string;
  thumbnailSize: number;
}

export interface SignResp {
  status: SignStatus;
  hashKey: string;
  category: string
}

export interface UploadResp {
  id: string;
}

export enum SignStatus {
  NEW = 'NEW',
  EXIST = 'EXIST'
}

export enum NodeType {
  FILE = 'FILE',
  FOLDER = 'FOLDER',
  DEPARTMENT = 'DEPARTMENT'
}

export enum MediaType {
  WORD = 'WORD',
  EXCEL = 'EXCEL',
  PPT = 'PPT',
  TXT = 'TXT',
  CSV = 'CSV',
  IMG = 'IMG',
  UNKNOWN = 'UNKNOWN'
}

export enum FileStatus {
  NORMAL = 'NORMAL',
  DELETED = 'DELETED'
}

export interface CreateNodeReq {
  name: string,
  description?: string,
  parentId: number,
  weight: number,
  type: NodeType,
  fileId: string
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

  sign(formData: FormData) {
    return this.http.post<SignResp>(`${environment.apiServer}/node/sign`, formData);
  }

  upload(formData: FormData) {
    const req = new HttpRequest('POST', `${environment.apiServer}/node/upload`, formData, {
      reportProgress: true,
    });
    return this.http.request(req);
  }

  createFileNode(req: CreateNodeReq) {
    return this.http.post(`${environment.apiServer}/node`, req);
  }
}
