import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {WordPositionFinder} from './word-position';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {EMPTY, Observable, Subscription, of} from 'rxjs';
import {debounceTime, flatMap} from 'rxjs/operators';
import {ISuggestionProvider} from '../../common/suggestion-provider';


@Component({
    selector: 'multi-autocomplete',
    templateUrl: './multi-autocomplete.component.html',
    styleUrls: ['./multi-autocomplete.component.scss']
})
export class MultiAutocompleteComponent implements OnInit, OnDestroy {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly logger = LoggerFactory.getLogger('MultiAutocompleteComponent');

    private _sub: Subscription;


    @Input()
    public placeholder: string;

    @Input()
    public suggestionProvider: ISuggestionProvider<string>;

    /**
     * Occurs when the value has been changed and committed
     */
    @Output('modify')
    public valueChanged = new EventEmitter<string>();

    @ViewChild('suggestionInput')
    public suggestionInput: ElementRef<HTMLInputElement>;

    public formControl: FormControl = new FormControl();
    public availableSuggestions: Observable<string[]>;

    private wordFinder: WordPositionFinder;

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor() {
        this.wordFinder = new WordPositionFinder();
    }

    /***************************************************************************
     *                                                                         *
     * Life-Cycle                                                              *
     *                                                                         *
     **************************************************************************/

    public ngOnInit(): void {
        this.availableSuggestions = this.formControl.valueChanges.pipe(
            debounceTime(150),
            flatMap((value) => {

                if (this.cursorPosition) {
                    const cursor = this.cursorPosition;
                    const word = this.extractWordFrom(value,  cursor);
                    return this.getSuggestions(word);
                } else {
                    return EMPTY;
                }
            })
        );
        this._sub = this.formControl.valueChanges.
        subscribe(value => this.onValueChanged(value));
    }

    public ngOnDestroy(): void {
        this._sub.unsubscribe();
    }

    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/


    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/


    public onValueChanged(value: string) {
        this.logger.debug('value changed', value);
        this.valueChanged.next(value);
    }

    public insertSuggestion(suggestion: string) {
        const full = this.formControl.value != null ? this.formControl.value : '';
        if (this.cursorPosition) {
            const cursor = this.cursorPosition;
            const replacement = this.wordFinder.replaceWord(full, cursor, suggestion + ' ');
            return replacement.newText;
        } else {
            this.logger.warn('Insert not possible as no cursor-position was available!');
        }
    }

    /***************************************************************************
     *                                                                         *
     * Private methods                                                         *
     *                                                                         *
     **************************************************************************/

    private getSuggestions(input: string): Observable<string[]> {

        if (this.suggestionProvider) {
            return this.suggestionProvider.loadSuggestions(input);
        } else {
            return of([]);
        }
    }

    private get cursorPosition(): number | null {
      if (this.suggestionInput) {
        return this.suggestionInput.nativeElement.selectionStart;
      }
      return null;
    }

    private extractWordFrom(text: string, position: number): string {
        const word = this.wordFinder.findWord(text, position);
        return word.value;
    }

}
