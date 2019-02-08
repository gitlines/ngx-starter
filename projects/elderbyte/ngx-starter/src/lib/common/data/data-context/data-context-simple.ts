import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {Filter} from '../filter';
import {DataContextBase} from './data-context-base';
import {Sort} from '../sort';
import {Observable, Subject} from 'rxjs';
import {take} from 'rxjs/operators';


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
        indexFn?: ((item: T) => any),
        localApply?: ((data: T[]) => T[])
    ) {
        super(indexFn, localApply);
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

    protected reloadInternal(): Observable<any> {

        const subject = new Subject();

        this.setLoadingIndicator(true);
        if (this.listFetcher) {
            this.listFetcher(this.sorts, this.filters)
                .pipe(take(1))
                .subscribe(
                    list => {
                        this.onSuccess();
                        this.setTotal(list.length);
                        this.setRows(list);
                        this.setLoadingIndicator(false);
                        this.log.debug('data-context: Got list data: ' + list.length);

                        subject.next();
                    }, err => {
                        this.onError(err);
                        this.clearAll();
                        this.log.error('data-context: Failed to query data', err);
                        subject.error(err);
                    });
        } else {
            this.log.warn('data-context: Skipping data context load - no list fetcher present!');
            subject.error(new Error('data-context: Skipping data context load - no list fetcher present!'));
        }

        return subject.pipe(take(1));
    }
}
