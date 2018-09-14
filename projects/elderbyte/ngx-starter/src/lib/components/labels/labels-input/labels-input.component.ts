import {Component, ElementRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {EMPTY, Observable, Subject} from 'rxjs';
import {debounceTime, flatMap, map, startWith} from 'rxjs/operators';
import {ISuggestionProvider} from '../../../common/suggestion-provider';
import {FormFieldBaseComponent} from '../../../common/forms/form-field-base.component';
import {buildFormIntegrationProviders} from '../../../common/forms/template-composite-control';

@Component({
  selector: 'ebs-label-input',
  templateUrl: './labels-input.component.html',
  styleUrls: ['./labels-input.component.scss'],
  providers: buildFormIntegrationProviders(EbsLabelInputComponent)
})
export class EbsLabelInputComponent<T> extends FormFieldBaseComponent<T[]> implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('EbsLabelInput');

  private _compareWith: (o1: any, o2: any) => boolean;
  private _nameResolver: (o1: any) => string;
  private _colorResolver: (o1: any) => string;
  private _labelBuilder: (rawinput: string) => any[];

  private _labelsSubject = new Subject<T[]>();

  private _allowCreate = true;
  private _suggestionLoader: ISuggestionProvider<any>;

  public selectable = true;
  public removable = true;

  public labelInputControl: FormControl = new FormControl();
  public availableSuggestions: Observable<any[]>;

  @ViewChild('labelInput')
  private inputControl: ElementRef<HTMLInputElement>;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
  ) {
    super();
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/

  public get currentLabels(): T[] {
    return this.value;
  }

  @Input('labels')
  public set labels(value: T[]) {
    this.value = value;
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

  public labelSelected(event: MatAutocompleteSelectedEvent) {
    console.log('labelSelected:', event);
    const selection = event.option.value;
    if (selection) {
      this.resetInput();
      this.addLabel(selection);
    }
  }

  public createNewLabels(event: MatChipInputEvent): void {
    if (this._allowCreate) {

      const input = event.input;
      const value = event.value;

      if (value) {
        const myLabels = this.buildLabels(value);
        this.addLabels(myLabels);
      }

      if (input) {
        // input.value = ''; // reset input
        this.resetInput();
      }
    }
  }

  public addLabels(labels: T[]) {
    const current = this.value ? this.value : [];
    this.replaceWith([...current, ...labels]);
  }



  public addLabel(label: any) {
    this.addLabels([label]);
  }

  public removeLabel(toRemove: T): void {

    const remaining = this.value
      .filter(l => !this.areEqual(l, toRemove));

    this.replaceWith(remaining);
  }

  public replaceWith(labels: T[]): void {
    this.value = labels;
    this.onLabelsChanged();
  }

  public labelName(label: T): string {
    if (label) {
      return this._nameResolver ?  this._nameResolver(label) : label.toString();
    } else {
      return '';
    }
  }

  public labelColor(label: T): string {
    return this._colorResolver ?  this._colorResolver(label) : 'none';
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private resetInput(): void {
    this.inputControl.nativeElement.value = '';
  }

  private buildLabels(rawName: string): any[] {
    if (this._labelBuilder) {
      return this._labelBuilder(rawName);
    } else {
      return [rawName];
    }
  }

  private onLabelsChanged(): void {
    this._labelsSubject.next(this.value);
  }

  private filterNotPresent(suggestions: any[]): any[] {
    if (suggestions) {

      if (this.value) {
        return suggestions
          .filter(l => l)
          .filter(l => !this.value.some(el => this.areEqual(el, l)));
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
