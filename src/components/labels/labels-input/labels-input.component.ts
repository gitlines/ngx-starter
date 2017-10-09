import {Component, Input, OnInit, Output} from '@angular/core';
import {Label} from '../label';
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

  private _allowNew = true;
  private _labels: Label[] = [];
  private _labelsSubject = new Subject<Label[]>();
  private _suggestionLoader: ISuggestionProvider;
  public labelInputControl: FormControl = new FormControl();
  public availableSuggestions: Observable<Label[]>;

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

  public get currentLabels(): Label[] {
    return this._labels;
  }

  @Input('labels')
  public set labels(value: Label[] | string[]) {
    if (this.isStringArray(value)) {
      this._labels = value.map(s => Label.fromName(s));
    }else {
      this._labels = value;
    }
  }

  @Input('suggestionLoader')
  public set suggestionLoader(provider: ISuggestionProvider){
    this._suggestionLoader = provider;
  }

  @Input('allowNew')
  public set allowNew(value: boolean) {
    this._allowNew = value;
  }

  @Output('labelsChanged')
  public get labelsChanged(): Observable<Label[]>{
    return this._labelsSubject;
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
            .map(suggestions => this.mapToLabel(suggestions))
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
      this.addLabel(Label.fromName(selection));
    }
  }

  public addNewLabels(newLabels: HTMLInputElement): void {
    if (this._allowNew) {
      const newLabelString = newLabels.value;
      if (newLabelString) {
        this.addLabel(Label.fromName(newLabelString));
      }
    }
  }

  public addLabel(label: Label) {
    this._labels.push(label);
    this.labelInputControl.reset();
    this.onLabelsChanged();
  }

  public removeLabel(label: Label): void {
    const index = this._labels.indexOf(label, 0);
    if (index > -1) {
      this._labels.splice(index, 1);
      this.onLabelsChanged();
    }
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/




  private onLabelsChanged(): void {
    this._labelsSubject.next(this._labels);
  }

  private filterNotPresent(suggestions: Label[]): Label[] {
    return suggestions.filter(l => !this._labels.some(el => el.name === l.name));
  }

  private mapToLabel(suggestions: string[] | Label[]): Label[] {
    if (this.isStringArray(suggestions)) {
      return suggestions.map(s => Label.fromName(s));
    }else {
      return suggestions;
    }
  }


  private isStringArray(value: any): value is string[] {
    if (value instanceof Array) {
      return value.some(v => (typeof v === 'string'));
    }
    return false;
  }
}
