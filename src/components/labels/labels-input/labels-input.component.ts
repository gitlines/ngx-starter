import {Component, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ISuggestionProvider} from '../label-suggestion-provider';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {NGXLogger} from 'ngx-logger';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/empty';

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
    private _nameResolver: (o1: any) => string;
    private _colorResolver: (o1: any) => string;

    private _allowCreate = true;
    private _labels: any[] = [];
    private _labelsSubject = new Subject<any[]>();
    private _suggestionLoader: ISuggestionProvider<any>;

    public labelInputControl: FormControl = new FormControl();
    public availableSuggestions: Observable<any[]>;

    @Input('placeholder')
    public placeholder: string;

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        private logger: NGXLogger
    ) { }

    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/

    public get currentLabels(): any[] {
        return this._labels;
    }

    @Input('labels')
    public set labels(value: any[]) {
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
    public get labelsChanged(): Observable<any[]>{
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
     */
    @Input('colorResolver')
    public set colorResolver(fn: (o1: any) => string) {
        if (typeof fn !== 'function') {
            throw new Error('colorResolver must be a function!');
        }
        this._colorResolver = fn;
    }

    /**
     * A function which returns the display name of a given label object.
     */
    @Input('nameResolver')
    public set nameResolver(fn: (o1: any) => string) {
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
                    this.logger.debug('Cant provide suggestions since no suggestion provider was registered!');
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

    public addLabel(label: any) {
        this._labels.push(label);
        this.labelInputControl.reset();
        this.onLabelsChanged();
    }

    public removeLabel(toRemove: any): void {
        const item = this._labels.find(l => this.areEqual(l, toRemove));
        if (item) {
            const index = this._labels.indexOf(item, 0);
            if (index > -1) {
                this._labels.splice(index, 1);
                this.onLabelsChanged();
            }
        }
    }

    public labelName(label: any): string {
        if (label) {
            return this._nameResolver ?  this._nameResolver(label) : label.toString();
        }else {
            return '';
        }
    }

    public labelColor(label: any): string {
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

    private filterNotPresent(suggestions: any[]): any[] {
        if (suggestions) {

            if (this._labels) {
                return suggestions
                    .filter(l => l)
                    .filter(l => !this._labels.some(el => this.areEqual(el, l)));
            }else {
                return suggestions;
            }
        }else {
            return [];
        }

    }

    private areEqual(a: any, b: any): boolean {
        return this._compareWith ? this._compareWith(a, b) : a === b;
    }
}
