import {Component, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {ISuggestionProvider} from '../label-suggestion-provider';
import {MatAutocompleteSelectedEvent} from '@angular/material';

@Component({
    selector: 'labels-input',
    templateUrl: './labels-input.component.html',
    styleUrls: ['./labels-input.component.scss']
})
export class LabelEditorComponent implements OnInit {


    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/


    private _compareWith: (o1: any, o2: any) => boolean;
    private _nameResolver: (o1: Object) => string;
    private _colorResolver: (o1: Object) => string;

    private _allowCreate = true;
    private _labels: Object[] = [];
    private _labelsSubject = new Subject<Object[]>();
    private _suggestionLoader: ISuggestionProvider<any>;
    public labelInputControl: FormControl = new FormControl();
    public availableSuggestions: Observable<Object[]>;

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor() { }

    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/

    public get currentLabels(): Object[] {
        return this._labels;
    }

    @Input('labels')
    public set labels(value: Object[]) {
        this._labels = value;
    }

    @Input('suggestionLoader')
    public set suggestionLoader(provider: ISuggestionProvider<any>){
        this._suggestionLoader = provider;
    }

    @Input('allowNew')
    public set allowNew(value: boolean) {
        this._allowCreate = value;
    }

    @Output('labelsChanged')
    public get labelsChanged(): Observable<Object[]>{
        return this._labelsSubject;
    }

    /**
     * A function to compare the option values with the selected values. The first argument
     * is a value from an option. The second is a value from the selection. A boolean
     * should be returned.
     */
    @Input('compareWith')
    public set compareWith(fn: (o1: any, o2: any) => boolean) {
        if (typeof fn !== 'function') {
            throw new Error('compareWith must be a function!');
        }
        this._compareWith = fn;
    }


    /**
     * A function which returns the color of a given label object.
     * @param {(o1: Object) => string} fn
     */
    @Input('colorResolver')
    public set colorResolver(fn: (o1: Object) => string) {
        if (typeof fn !== 'function') {
            throw new Error('colorResolver must be a function!');
        }
        this._colorResolver = fn;
    }

    /**
     * A function which returns the display name of a given label object.
     * @param {(o1: Object) => string} fn
     */
    @Input('nameResolver')
    public set nameResolver(fn: (o1: Object) => string) {
        if (typeof fn !== 'function') {
            throw new Error('nameResolver must be a function!');
        }
        this._nameResolver = fn;
    }



    /***************************************************************************
     *                                                                         *
     * Life-Cycle Event                                                        *
     *                                                                         *
     **************************************************************************/

    ngOnInit() {
        this.availableSuggestions = this.labelInputControl.valueChanges
            .startWith(null)
            .debounce(() => Observable.timer(150))
            .flatMap((value) => {
                if (this._suggestionLoader) {
                    return this._suggestionLoader.loadSuggestions(value)
                        .map(labels => this.filterNotPresent(labels));
                }else {
                    return Observable.empty();
                }
            });
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public labelSelected(ev: MatAutocompleteSelectedEvent) {
        console.log('labelSelected:', ev);
        const selection = ev.option.value;
        if (selection) {
            this.addLabel(selection);
        }
    }

    public createNewLabels(newLabels: HTMLInputElement): void {
        if (this._allowCreate) {
            const newLabelString = newLabels.value;
            if (newLabelString) {
                // TODO Support callback for creating new
                // this.addLabel(Label.fromName(newLabelString));
            }
        }
    }

    public addLabel(label: Object) {
        this._labels.push(label);
        this.labelInputControl.reset();
        this.onLabelsChanged();
    }

    public removeLabel(toRemove: Object): void {
        const item = this._labels.find(l => this.areEqual(l, toRemove));
        if (item) {
            const index = this._labels.indexOf(<Object>item, 0);
            if (index > -1) {
                this._labels.splice(index, 1);
                this.onLabelsChanged();
            }
        }
    }

    public labelName(label: Object): string {
        return this._nameResolver ?  this._nameResolver(label) : label.toString();
    }

    public labelColor(label: Object): string {
        return this._colorResolver ?  this._colorResolver(label) : 'none';
    }

    /***************************************************************************
     *                                                                         *
     * Private methods                                                         *
     *                                                                         *
     **************************************************************************/

    private onLabelsChanged(): void {
        this._labelsSubject.next(this._labels);
    }

    private filterNotPresent(suggestions: Object[]): Object[] {
        return suggestions.filter(l => !this._labels.some(el => this.areEqual(el, l)));
    }

    private areEqual(a: Object, b: Object): boolean {
        return this._compareWith ? this._compareWith(a, b) : a === b;
    }
}
