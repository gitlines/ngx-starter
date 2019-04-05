import {Logger, LoggerFactory} from '@elderbyte/ts-logger';
import {Filter} from '../filter';
import {DataContextBase} from './data-context-base';
import {Sort} from '../sort';
import {Observable, Subject} from 'rxjs';
import {first} from 'rxjs/operators';


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
        indexFn: ((item: T) => any),
        localApply: ((data: T[]) => T[]),
        localSort: ((data: T[], sorts: Sort[]) => T[])

    ) {
        super(indexFn, localApply, localSort);
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

        this.setLoading(true);
        if (this.listFetcher) {
            this.listFetcher(this.sort.sortsSnapshot, this.filter.filtersSnapshot)
                .pipe(first())
                .subscribe(
                    list => {
                        this.onSuccess();
                        this.setTotal(list.length);
                        this.setData(list);
                        this.setLoading(false);
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

        return subject.pipe(first());
    }
}
