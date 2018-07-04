
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap} from 'rxjs/operators';


export class ToolbarHeader {
    constructor(
        public name: string) {
    }
}

@Injectable()
export class ToolbarService {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private _titleChange: BehaviorSubject<ToolbarHeader>;
    private _title: ToolbarHeader;

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        router: Router
    ) {
        this._title = new ToolbarHeader('Home');
        this._titleChange = new BehaviorSubject<ToolbarHeader>(this._title);

        router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => router.routerState.root),
            map(route => {
                while (route.firstChild) { route = route.firstChild; }
                return route;
            }),
            filter(route => route.outlet === 'primary'),
            mergeMap(route => route.data)
        )
            .subscribe(currentRouteData  => {
                let title = currentRouteData['title'];
                if (title) {
                    this.title = new ToolbarHeader(title);
                }
            });
    }

    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/

    public set title(title: ToolbarHeader) {
        this._title = title;
        this._titleChange.next(title);
    }

    public get title(): ToolbarHeader {
        return this._title;
    }

    public get titleChange(): Observable<ToolbarHeader> {
        return this._titleChange;
    }

}
