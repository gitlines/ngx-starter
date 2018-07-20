
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

@Injectable()
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
        const title = this.resolveTitle(active);
        this.title = new ToolbarHeader(title);
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
