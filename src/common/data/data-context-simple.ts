import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {Observable} from 'rxjs/Observable';
import {Filter} from './filter';
import {IDataContext} from './data-context';
import {Sort} from './page';
import {DataContextBase} from './data-context-base';


export class DataContextSimple<T> extends DataContextBase<T> {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly log: Logger = LoggerFactory.getLogger('DataContextSimple');

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        private listFetcher: (sorts: Sort[], filters: Filter[]) => Observable<Array<T>>,
         _indexFn?: ((item: T) => any),
         _localSort?: ((a: T, b: T) => number),
         _localApply?: ((data: T[]) => T[])
    ) {
        super(_indexFn, _localSort, _localApply);
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/


    /***************************************************************************
     *                                                                         *
     * Private methods                                                         *
     *                                                                         *
     **************************************************************************/

    protected loadData(): Observable<any> {

        const subject = new Subject();

        this.setLoadingIndicator(true);
        if (this.listFetcher) {
            this.listFetcher(this.sorts, this.filters)
                .take(1)
                .subscribe(
                    list => {
                        this.setTotal(list.length);
                        this.setRows(list);
                        this.setLoadingIndicator(false);
                        this.log.debug('data-context: Got list data: ' + list.length);

                        subject.next();
                    }, err => {
                        this.clear();
                        this.log.error('data-context: Failed to query data', err);
                        subject.error(err);
                    });
        } else {
            this.log.warn('data-context: Skipping data context load - no list fetcher present!');
            subject.error(new Error('data-context: Skipping data context load - no list fetcher present!'));
        }

        return subject.take(1);
    }
}
