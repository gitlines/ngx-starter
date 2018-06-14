import { AfterViewInit, Directive, Host, HostListener, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { LoggerFactory } from '@elderbyte/ts-logger';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/internal/Subscription';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import {
    MatInput,
    MatSelect,
    MatSelectChange,
    MatSlideToggle,
} from '@angular/material';
import {FilterContext} from '../../common/data/index';

@Directive({
    selector: '[filterInput]'
})
export class FilterInputDirective implements OnInit, OnDestroy, AfterViewInit {

    /* *************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly logger = LoggerFactory.getLogger('FilterInputDirective');

    private readonly inputValue = new Subject<any>();
    private _extractedName: string | null;

    private _sub: Subscription;
    private filterContext: FilterContext;

    @Input() public filterInputKey: string;
    @Input() public filterInputValueTransform: ((value: any) => any);
    @Input() public filterInputValue: string;


    /* *************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        @Host() @Optional() private matInput: MatInput,
        @Host() @Optional() private matSlideToggle: MatSlideToggle,
        @Host() @Optional() private matSelect: MatSelect,
    ) {
        this.logger.debug('Host of directive: ', matInput || matSlideToggle || matSelect);
    }

    /* *************************************************************************
     *                                                                         *
     * Life Cycle                                                             *
     *                                                                         *
     **************************************************************************/

    public ngOnInit(): void {
        this._sub = this.inputValue.pipe(
            distinctUntilChanged(),
            debounceTime(200), // TODO Instead of debouncing per filter, we should handle it in the DC once
            map(value => this.resolveValue(value)),
            map(value => this.transformValue(value)),
            map(value => value)
        )
            .subscribe(
                newValue => this.inputValueChanged(newValue)
            );
    }

    public ngAfterViewInit(): void {
        this._extractedName = this.extractName();
        this.onFilterChanged();
    }

    public ngOnDestroy(): void {
        this._sub.unsubscribe();
    }

    /* *************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    @Input()
    public set filterInput(filterContext: FilterContext) {
        this.filterContext = filterContext;
        if (this._extractedName) {
            this.onFilterChanged();
        }
    }

    @HostListener('change', ['$event'])
    public onHostChange(event: any): void {
        this.onFilterChanged();
    }

    @HostListener('keyup', ['$event'])
    public onHostKeyup(event: KeyboardEvent): void {
        this.onFilterChanged();
    }

    @HostListener('selectionChange', ['$event'])
    public onHostSelectionChange(event: MatSelectChange): void {
        this.onFilterChanged(event.value);
    }

    /* *************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public onFilterChanged(value?: any): void {
        const snapshot = value ? value : this.hostValueSnapshot;
        this.logger.debug('onFilterChanged: ', snapshot);
        this.inputValue.next(snapshot);
    }

    /* *************************************************************************
     *                                                                         *
     * Private methods                                                         *
     *                                                                         *
     **************************************************************************/

    private get hostValueSnapshot(): any {
        if (this.matInput) {
            return this.matInput.value;
        } else if (this.matSlideToggle) {
            return this.matSlideToggle.checked;
        } else if (this.matSelect) {
            return this.matSelect.value;
        }

        this.logger.debug('hostValueSnapshot failed: Not supported host component!');
        return null;
    }

    private extractName(): string | null {
        if (this.matInput && this.matInput.ngControl) {
            return this.matInput.ngControl.name;
        } else if (this.matSlideToggle) {
            return this.matSlideToggle.name;
        } else if (this.matSelect && this.matSelect.ngControl) {
            return this.matSelect.ngControl.name;
        }
        this.logger.debug('extractName failed: Not supported host component!');
        return null;
    }

    /**
     * Apply a user defined value transformation
     */
    private transformValue(value: any): any {
        if (this.filterInputValueTransform) {
            return this.filterInputValueTransform(value);
        } else {
            return value;
        }
    }

    private resolveValue(value: any): any {
        if (this.filterInputValue) {

            const subPaths = this.filterInputValue.split('\.');
            subPaths.shift();
            let current = value;

            while (current && subPaths.length > 0) {
                const sub = subPaths.shift();
                if (sub) {
                    current = current[sub as string];
                } else {
                    break;
                }
            }

            return current;
        } else {
            return value;
        }
    }

    private get filterKey(): string {
        if (this.filterInputKey) { return this.filterInputKey; }
        if (this._extractedName) { return this._extractedName; }

        throw new Error('Could not determine the filter key name. Either specify the name property or explicitly set filterInputKey.');
    }

    private inputValueChanged(newValue: any) {
        this.logger.info('Setting filter: ' + this.filterKey + ' => ' + newValue);

        if (newValue === undefined || newValue === null) {
            this.filterContext.setFilter(this.filterKey, null);
        } else {
            this.filterContext.setFilter(this.filterKey, newValue + '');
        }
    }
}
