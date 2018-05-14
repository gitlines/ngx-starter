import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {SideContentService} from '../side-content.service';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {BehaviorSubject, Observable, Subscription} from 'rxjs/index';

@Component({
    selector: 'app-side-content-toggle',
    templateUrl: './side-content-toggle.component.html',
    styleUrls: ['./side-content-toggle.component.scss']
})
export class SideContentToggleComponent implements OnInit, OnDestroy {

    private readonly logger = LoggerFactory.getLogger('SideContentToggleComponent');

    private _icon = new BehaviorSubject<string>('menu');
    private sub: Subscription;
    private _currentUrl: string;

    @Input('roots')
    public roots: string[] = [];

    @Input('hide')
    public hideOns: string[] = [];

    constructor(
        private router: Router,
        private sideContentService: SideContentService,
    ) { }

    ngOnInit() {

        this.sub = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                let navEnd = event as NavigationEnd;
                this._currentUrl = navEnd.url;
                this.updateIcon();
            }
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    public onClick(): void {
        if (this.showNavigateBack) {
            this.goBack(this._currentUrl);
        } else {
            this.toggleSideContent();
        }
    }

    public get icon(): Observable<string> {
        return this._icon;
    }

    public showComponent(): boolean {
        if (this._currentUrl && this.hideOns && this.hideOns.length > 0) {
            return !this.isPartOfHiddenRoute(this._currentUrl);
        }
        return true;
    }

    private updateIcon() {
        let icon = this.showNavigateBack ? 'arrow_back' : 'menu';
        this.logger.trace('updating icon to ' + icon);
        this._icon.next(icon);
    }


    private get showNavigateBack(): boolean {
        if (this._currentUrl && this.roots && this.roots.length > 0) {
            return !this.isRootRoute(this._currentUrl);
        }
        return false;
    }


    private toggleSideContent() {
        this.sideContentService.toggleSidenav();
    }

    private goBack(url: string) {
        const rootUrl = this.findRoot(url);
        this.router.navigate([rootUrl]);
    }

    private isRootRoute(url: string): boolean {
        return !!this.roots.find(r => r === url);
    }

    private isPartOfHiddenRoute(url: string): boolean {
        return !!this.hideOns.find(r => url.indexOf(r) >= 0);
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
     */
    private findRoot(url: string): string {
        if (url && url.length > 0) {
            if (this.isRootRoute(url)) { return url; };
            const parent = this.parent(url);
            return this.findRoot(parent);
        } else {
            return '/';
        }
    }

    private parent(url: string): string {
        let parts = url.split('/');
        // Remove last part
        parts.splice(parts.length - 1, 1);
        return parts.join('/');
    }
}
