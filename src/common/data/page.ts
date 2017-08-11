import {
  URLSearchParams
} from "@angular/http";


export class Page<T>{
  
  public content : T[];
  public totalElements : number;
  public totalPages  : number;
  public last  : boolean;
  public size  : number;
  public number: number;
  public sort: any;
  public first: boolean;
  public numberOfElements: number;


  public static from<TS>(data : TS[]){
    let page = new Page<TS>();
    page.content = data;
    page.totalElements = data.length;
    page.totalPages = 1;
    page.last = true;
    page.first = true;
    page.size = data.length;
    page.number = 0;
    page.numberOfElements = data.length;
    return page;
  }

}


export class Sort {
  constructor (
    public prop : string,
    public dir : string
  ){ }
}

export class Pageable {

  public page : number;
  public size : number;
  public sorts? : Sort[];

  constructor(
    page : number,
    size : number,
    sorts? : Sort[]){

    this.page = page;
    this.size = size;
    this.sorts = sorts;
  }
}


export class PageableUtil {

  public static addSearchParams(params : URLSearchParams, pageable : Pageable) : URLSearchParams{
    params.set('page', pageable.page.toString());
    params.set('size', pageable.size.toString());
    if(pageable.sorts){
      for(let sort of pageable.sorts){
        params.append('sort', sort.prop + ',' + sort.dir);
      }
    }
    return params;
  }
}
