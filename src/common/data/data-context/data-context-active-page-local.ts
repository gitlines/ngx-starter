import {DataContextActivePage} from './data-context-active-page';
import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {Sort} from '../sort';
import {Observable, of, throwError} from 'rxjs/index';
import {Page, Pageable, PageRequest} from '../page';
import {Filter} from '../filter';

export class DataContextActivePageLocal<T> extends DataContextActivePage<T> {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly actloclogger: Logger = LoggerFactory.getLogger('DataContextActivePageLocal');

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/


    constructor(
        private localData: T[],
        pageSize: number,
        indexFn?: ((item: T) => any),
        localSort?: ((a: T, b: T) => number),
        localApply?: ((data: T[]) => T[]),
        activeSort?: Observable<Sort>,
        activePage?: Observable<PageRequest>) {

        super((pageable, filters) => {
            return this.getPage(pageable, filters);
        }, pageSize, indexFn, localSort, localApply, activeSort, activePage);
    }


    private getPage(pageable: Pageable, filters: Filter[]): Observable<Page<T>> {

        let page: Page<T>;

        if (this.localData) {
            try {
                const start = pageable.page * pageable.size;
                const end = start + pageable.size;
                const slice = this.localData.slice(start, end);
                page = Page.fromPage(slice, this.localData.length, pageable);
            } catch (err) {
                return throwError(err);
            }
        } else {
            page = Page.from([]);
        }

        return of(page);
    }
}
