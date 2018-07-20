
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {LoggerFactory} from '@elderbyte/ts-logger';


export class ToolbarHeader {
  constructor(
    public name: string) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ToolbarService');

  private _title = new ToolbarHeader('');
  private _titleChange: BehaviorSubject<ToolbarHeader>;


  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this._titleChange = new BehaviorSubject<ToolbarHeader>(this._title);

    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute)
    )
      .subscribe(active  => {
        this.updateTitle(active);
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

  /***************************************************************************
   *                                                                         *
   * Public Api                                                              *
   *                                                                         *
   **************************************************************************/

  public updateTitle(activatedRoute: ActivatedRoute): void {

    const title = this.resolveTitle(activatedRoute);

    this.logger.debug('Updating Title to: ' + title, activatedRoute);

    this.title = new ToolbarHeader(title);
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private resolveTitle(activatedRoute: ActivatedRoute): string {

    let resolvedTitle = 'missing-title';

    while (activatedRoute) {
      const point = activatedRoute.snapshot.data['title'];
      if (point) {
        resolvedTitle = point;
      }
      activatedRoute = activatedRoute.firstChild;
    }

    return resolvedTitle;
  }
}
