import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {SearchInputState} from './search-input-state';
import {SearchInput} from './search-input';


export class SimpleSearchInput implements SearchInput {

  private readonly _state: BehaviorSubject<SearchInputState>;
  private readonly _resetRequest = new Subject<any>();

  constructor(
    public attribute: string,
    public queryKey?: string,
    private _readonly?: boolean
  ) {
    this._state = new BehaviorSubject(
      new SearchInputState(
        attribute,
        null,
        queryKey || attribute,
        true
      )
    );
  }

  public set value(value: string) {
    this._state.next(
      this.stateSnapshot.withQueryValue(value ? value : null)
    );
  }

  public get state$(): Observable<SearchInputState> {
    return this._state.asObservable();
  }

  public get stateSnapshot(): SearchInputState {
    return this._state.getValue();
  }

  public get resetRequest(): Observable<any> {
    return this._resetRequest;
  }

  public get readonly(): boolean {
    return this._readonly;
  }

  public reset(): void {
    this._resetRequest.next();
  }
}
