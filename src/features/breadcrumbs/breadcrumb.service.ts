

import {Injectable} from "@angular/core";


export class BreadcrumbContext {

  private exactPathReplacers : Map<string, string> =  new Map();
  private exactPathHandlers : Map<string, any> =  new Map();
  private dynamicHandlers : {(path: string) : IBreadcrumb;}[] = [];

  public prefix : IBreadcrumb;


  constructor(){
    this.replaceExactPath('/app', null);
  }

  public replaceExactPath(exactPath : string, label : string){
    this.exactPathReplacers.set(exactPath, label);
  }

  public handleExactPath(exactPath : string, handler: (path: string) => IBreadcrumb){
    this.exactPathHandlers.set(exactPath, handler);
  }

  public addDynamicHandler(handler: (path: string) => IBreadcrumb){
    this.dynamicHandlers.push(handler);
  }


  public  buildCrumb(url : string) : IBreadcrumb {

    if(this.exactPathReplacers.has(url)){
      let replacement = this.exactPathReplacers.get(url);
      if(replacement){
        return this.build(url, replacement);
      }else{
        return null;
      }
    }


    let handler = this.exactPathHandlers.get(url);
    if(handler){
      return handler(url);
    }

    for(let dh of this.dynamicHandlers){
      let dynamicReplacement = dh(url);
      if(dynamicReplacement){
        return dynamicReplacement;
      }
    }
    return this.buildCrumbFallback(url);
  }

  private  buildCrumbFallback(url : string) : IBreadcrumb{
    let parts = url.split('/');
    let last = parts[parts.length-1];

    last = last.split('(')[0];

    return this.build(url,  last);
  }

  private build(url : string, label : string) : IBreadcrumb {
    return new Breadcrumb(label, url);
  }
}



export interface IBreadcrumb {
  label: string;
  url: string;
}

export class Breadcrumb implements IBreadcrumb {
  constructor(
    public label: string,
    public url: string,
  ){ }
}

@Injectable()
export class BreadcrumbService {

  private context : BreadcrumbContext;

  constructor() {
    this.context = new BreadcrumbContext();
  }

  public generateBreadcrumbs(url : string) : IBreadcrumb[] {
    let crumbs : IBreadcrumb[] = [];

    let beforeSubOutletsUrl = url.split('(')[0];
    this.generateBreadcrumbsRecursive(beforeSubOutletsUrl, crumbs);
    return crumbs;
  }

  private generateBreadcrumbsRecursive(url : string, crumbs : IBreadcrumb[])  {

    let crumb = this.buildCrumb(url);
    if(crumb){
      crumbs.unshift(crumb);
    }

    if (url.lastIndexOf('/') > 0) {
      this.generateBreadcrumbsRecursive(
        url.substr(0, url.lastIndexOf('/')),
        crumbs
      ); //Find last '/' and add everything before it as a parent route
    } else if (this.context && this.context.prefix) {
      crumbs.unshift(this.context.prefix);
    }
  }

  private  buildCrumb(url : string) : IBreadcrumb{
    return this.context.buildCrumb(url);
  }

}
