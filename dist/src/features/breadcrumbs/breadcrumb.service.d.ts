export declare class BreadcrumbContext {
    private exactPathReplacers;
    private exactPathHandlers;
    private dynamicHandlers;
    prefix: IBreadcrumb;
    constructor();
    replaceExactPath(exactPath: string, label: string | null): void;
    handleExactPath(exactPath: string, handler: (path: string) => IBreadcrumb): void;
    addDynamicHandler(handler: (path: string) => IBreadcrumb): void;
    buildCrumb(url: string): IBreadcrumb | null;
    private buildCrumbFallback(url);
    private build(url, label);
}
export interface IBreadcrumb {
    label: string;
    url: string;
}
export declare class Breadcrumb implements IBreadcrumb {
    label: string;
    url: string;
    constructor(label: string, url: string);
}
export declare class BreadcrumbService {
    private context;
    constructor();
    generateBreadcrumbs(url: string): IBreadcrumb[];
    private generateBreadcrumbsRecursive(url, crumbs);
    private buildCrumb(url);
}
