import {Filter} from './filter';
import {Observable, Subject} from 'rxjs';

export class FilterContext {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly _filters = new Map<string, string>();
    private readonly _filtersChanged = new Subject<any>();

    /***************************************************************************
     *                                                                         *
     * Properties                                                              *
     *                                                                         *
     **************************************************************************/

    public get filtersChanged(): Observable<any> {
        return this._filtersChanged.asObservable();
    }

    public get filters(): Filter[] {
       return this.buildFilters(this._filters)
    }

    public set filters(filters: Filter[]) {
        this.replaceFiltersWith(filters);
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public setFilter(key: string, value: string | undefined | null): void {
        if (value) {
            const newValue = value as string;
            if (newValue !== this._filters.get(key)) {
                this._filters.set(key, newValue);
                this.onFiltersChanged();
            }
        } else {
            if (this._filters.delete(key)) {
                this.onFiltersChanged();
            }
        }
    }

    public updateFilters(filters?: Filter[], skipChangeEvent = false) {
        if (filters) {
            filters.forEach(f => this._filters.set(f.key, f.value));
            if (!skipChangeEvent) { this.onFiltersChanged(); }
        }
    }

    public getFilter(key: string): string | undefined {
        return this._filters.get(key)
    }

    public replaceFiltersWith(filters?: Filter[], skipChangeEvent = false) {
        this._filters.clear();
        this.updateFilters(filters, skipChangeEvent);
    }

    /***************************************************************************
     *                                                                         *
     * Private methods                                                         *
     *                                                                         *
     **************************************************************************/

    private buildFilters(filters: Map<string, string>): Filter[] {
        return Array.from(filters.entries())
            .filter((entry) => !!entry[0] && !!entry[1])
            .map((entry) => new Filter(entry[0], entry[1]));
    }

    private onFiltersChanged(): void {
        this._filtersChanged.next();
    }
}
