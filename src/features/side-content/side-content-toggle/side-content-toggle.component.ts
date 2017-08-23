import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {SideContentService} from '../side-content.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-side-content-toggle',
    templateUrl: './side-content-toggle.component.html',
    styleUrls: ['./side-content-toggle.component.scss']
})
export class SideContentToggleComponent implements OnInit, OnDestroy {

    private sub: Subscription;
    private _currentUrl: string;

    @Input('roots')
    public roots: string[] = ['/app/orders'];

    constructor(
        private router: Router,
        private sideContentService: SideContentService,
    ) { }

    ngOnInit() {

        this.sub = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                let navEnd = event as NavigationEnd;
                this._currentUrl = navEnd.url;
            }
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    public get showNavigateBack(): boolean {
        if (this._currentUrl && this.roots && this.roots.length > 0) {
            return !this.isRootRoute(this._currentUrl);
        }
        return false;
    }


    public toggleSideContent() {
        this.sideContentService.toggleSidenav();
    }

    public goBack(url: string) {
        const rootUrl = this.findRoot(url);
        this.router.navigate([rootUrl]);
    }

    private isRootRoute(url: string): boolean {
        return !!this.roots.find(r => r === url);
    }

    /**
     * Find the parent root url of a given url:
     *
     * /app/my/sub/route
     *
     * roots: ['/app/my', '/app/foo']
     *
     * -> /app/my
     *
     * @param {string} url
     * @returns {string}
     */
    private findRoot(url: string): string {
        if (this.isRootRoute(url)) { return url; };
        const parent = this.parent(url);
        return this.findRoot(parent);
    }

    private parent(url: string): string {
        let parts = url.split('/');
        // Remove last part
        parts = parts.splice(parts.length - 1, 1);
        return parts.join('/');
    }
}
