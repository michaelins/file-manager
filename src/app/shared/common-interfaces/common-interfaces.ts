export interface EqualObject {
  eqObj: any;
  field: string;
  isNot?: boolean;
}
export interface SortObject {
  direction: number;
  field: string;
}
export interface SearchObject {
  field: string;
  search: string;
}
