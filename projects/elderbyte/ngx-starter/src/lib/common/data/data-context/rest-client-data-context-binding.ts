import {Subscription, Unsubscribable} from 'rxjs';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {IDataContext} from './data-context';
import {RestClient} from '../rest/rest-client';

export class RestClientDataContextBinding implements Unsubscribable {


  private readonly logger = LoggerFactory.getLogger('MatTableDataContextBinding');
  private _subscription: Subscription;

  constructor(
    private readonly _dataContext: IDataContext<any>,
    private readonly _restClient: RestClient<any, any>,
  ) {
    this.subscribe();

    this._dataContext.data.subscribe(
      changed => {},
      err => {},
      () => this.unsubscribe()
    );
  }

  public unsubscribe(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }

  private subscribe(): void {
    this._subscription = this._restClient.localChanged.subscribe(
      change => this._dataContext.reload()
    );
  }
}
