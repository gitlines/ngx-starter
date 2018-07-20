import {Component, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ISuggestionProvider} from '../label-suggestion-provider';
import {MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {EMPTY, Observable, Subject} from 'rxjs';
import {debounceTime, flatMap, map, startWith} from 'rxjs/operators';

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

    private readonly logger = LoggerFactory.getLogger('LabelEditorComponent');

    private _compareWith: (o1: any, o2: any) => boolean;
    private _nameResolver: (o1: any) => string;
    private _colorResolver: (o1: any) => string;
    private _labelBuilder: (rawinput: string) => any[];

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
    public set suggestionLoader(provider: ISuggestionProvider<any>) {
        this._suggestionLoader = provider;
    }

    @Input('allowNew')
    public set allowNew(value: boolean) {
        this._allowCreate = value;
    }

    @Output('labelsChanged')
    public get labelsChanged(): Observable<any[]> {
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

    /**
     * A function which returns one or more labels for a given raw string
     */
    @Input('labelBuilder')
    public set labelBuilder(fn: (rawinput: string) => any[]) {
        if (typeof fn !== 'function') {
            throw new Error('labelBuilder must be a function!');
        }
        this._labelBuilder = fn;
    }

    /***************************************************************************
     *                                                                         *
     * Life-Cycle Event                                                        *
     *                                                                         *
     **************************************************************************/

    public ngOnInit(): void {
        this.availableSuggestions = this.labelInputControl.valueChanges.pipe(
            startWith(null),
            debounceTime(150),
            flatMap((value) => {
                if (this._suggestionLoader) {
                    return this._suggestionLoader.loadSuggestions(value).pipe(
                        map(labels => this.filterNotPresent(labels))
                    );
                } else {
                    this.logger.debug('Cant provide suggestions since no suggestion provider was registered!');
                    return EMPTY;
                }
            })
    );
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

    public createNewLabels(newLabels: MatChipInputEvent): void {
        if (this._allowCreate) {
            const newLabelString = newLabels.value;
            if (newLabelString) {
                const myLabels = this.buildLabels(newLabelString);
                this.addLabels(myLabels);
            }
        }
    }

    public addLabels(labels: any[]) {
        this._labels.push(...labels);
        this.resetInput();
        this.onLabelsChanged();
    }

    public addLabel(label: any) {
        this._labels.push(label);
        this.resetInput();
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
        } else {
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

    private resetInput(): void {
        // this.labelInputControl.reset();
        this.labelInputControl.setValue(
            null,
            {
                onlySelf: false,
                emitEvent: false
            }
        );
    }

    private buildLabels(rawName: string): any[] {
        if (this._labelBuilder) {
            return this._labelBuilder(rawName);
        } else {
            return [rawName];
        }
    }

    private onLabelsChanged(): void {
        this._labelsSubject.next(this._labels);
    }

    private filterNotPresent(suggestions: any[]): any[] {
        if (suggestions) {

            if (this._labels) {
                return suggestions
                    .filter(l => l)
                    .filter(l => !this._labels.some(el => this.areEqual(el, l)));
            } else {
                return suggestions;
            }
        } else {
            return [];
        }
    }

    private areEqual(a: any, b: any): boolean {
        return this._compareWith ? this._compareWith(a, b) : a === b;
    }
}