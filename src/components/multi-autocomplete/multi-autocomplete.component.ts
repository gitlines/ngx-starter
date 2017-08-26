import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {WordPositionFinder} from './word-position';
import {Subscription} from 'rxjs/Subscription';


export interface SuggestionProvider {
  getSuggestions(input: string): Observable<string[]>;
}

@Component({
  selector: 'multi-autocomplete',
  templateUrl: './multi-autocomplete.component.html',
  styleUrls: ['./multi-autocomplete.component.scss']
})
export class MultiAutocompleteComponent implements OnInit, OnDestroy {


  private _sub: Subscription;


  @Input('placeholder')
  public placeholder: string;

  @Input('suggestionProvider')
  public suggestionProvider: SuggestionProvider;

  /**
   * Occurs when the value has been changed and committed
   * @type {EventEmitter<string>}
   */
  @Output('modify')
  public valueChanged = new EventEmitter<string>();

  @ViewChild('suggestionInput')
  public tagInput: ElementRef;
  public formControl: FormControl = new FormControl();
  public availableSuggestions: Observable<string[]>;

  private wordFinder: WordPositionFinder;

  constructor() {
    this.wordFinder = new WordPositionFinder();
  }

  ngOnInit() {
    this.availableSuggestions = this.formControl.valueChanges
      .debounce(() => Observable.timer(150))
      .flatMap((value) => {
        let word = this.extractWordFrom(value,  this.cursorPosition);
        return this.getSuggestions(word);
      });
    this._sub = this.formControl.valueChanges.
          subscribe(value => this.onValueChanged(value));
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }


  public onValueChanged(value: string) {
    console.log('value changed', value); // this.formControl.value
    this.valueChanged.next(value);
  }

  public insertSuggestion(suggestion: string) {
    let full = this.formControl.value != null ? this.formControl.value : '';
    let replacement = this.wordFinder.replaceWord(full,  this.cursorPosition, suggestion + ' ');
    return replacement.newText;
  }

  private getSuggestions(input: string): Observable<string[]> {

    if (this.suggestionProvider) {
      return this.suggestionProvider.getSuggestions(input);
    }else {
      return Observable.from([]);
    }
  }

  private get cursorPosition(): number {
    let input = this.tagInput.nativeElement as HTMLInputElement;
    return input.selectionStart;
  }

  private set cursorPosition(position: number) {
    let input = this.tagInput.nativeElement as HTMLInputElement;
    input.selectionStart = position;
  }

  private extractWordFrom(text: string, position: number): string {
    let word = this.wordFinder.findWord(text, position);
    return word.value;
  }

}
