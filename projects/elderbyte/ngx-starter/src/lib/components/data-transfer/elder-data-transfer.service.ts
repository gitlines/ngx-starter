import { Injectable } from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {catchError, mergeMap, tap} from 'rxjs/operators';
import {HttpDataTransfer} from '../../common/http/transfer/http-data-transfer';


@Injectable({
  providedIn: 'root'
})
export class ElderDataTransferService {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private logger = LoggerFactory.getLogger('ElderDataTransferService');

  private readonly _transfers = new BehaviorSubject<HttpDataTransfer[]>([]);
  private readonly _uploadQueue = new Subject<HttpDataTransfer>();
  private _parallelUploads = 1;

  private readonly _completed = new Subject<HttpDataTransfer>();

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
  ) {
    this._uploadQueue.pipe(
      mergeMap(transfer => transfer.start().pipe(
        catchError(err => of(err)), // Avoid killing queue
        tap(null, null, () => this._completed.next(transfer))
      ), this._parallelUploads)
    ).subscribe(
      completedJob => {},
        err => this.logger.error('Data transfer failed', err)
    );
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  public get transfers(): Observable<HttpDataTransfer[]> {
    return this._transfers.asObservable();
  }

  public get transfersSnapshot(): HttpDataTransfer[] {
    return [...this._transfers.value];
  }

  public get transferCompleted(): Observable<HttpDataTransfer> {
    return this._completed.asObservable();
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * Enqueue and schedule a single data transfer
   * @param transfer
   */
  public enqueue(transfer: HttpDataTransfer): HttpDataTransfer {
    return this.enqueueAll([transfer])[0];
  }

  /**
   * Enqueue and schedule all given data transfers
   * @param transfers
   */
  public enqueueAll(transfers: HttpDataTransfer[]): HttpDataTransfer[] {
    this.addToQueue(transfers);
    const allTransfers = [...this._transfers.value, ...transfers];
    this._transfers.next(allTransfers);
    return transfers;
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private addToQueue(newTransfers: HttpDataTransfer[]): void {
    newTransfers.forEach(
      t => this._uploadQueue.next(t)
    );
  }

}
