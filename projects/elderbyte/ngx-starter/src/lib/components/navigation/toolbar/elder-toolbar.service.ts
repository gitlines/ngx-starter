import {Injectable, TemplateRef} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {ToolbarColumnPosition} from './toolbar-column-position';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElderToolbarService {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('ElderToolbarService');

  /** Default templates (App Level) */
  private readonly _columnDefaults = new Map<ToolbarColumnPosition, TemplateRef<any>>();

  /** Custom templates (Component Level) */
  private readonly _columns = new Map<ToolbarColumnPosition, TemplateRef<any>>();

  private readonly _activeColumns = new Map<ToolbarColumnPosition, BehaviorSubject<TemplateRef<any>>>();

  private readonly _availablePositions = [ToolbarColumnPosition.LEFT, ToolbarColumnPosition.CENTER, ToolbarColumnPosition.RIGHT];

  /***************************************************************************
   *                                                                         *
   * Constructors                                                            *
   *                                                                         *
   **************************************************************************/

  constructor() {
    for (const pos of this._availablePositions) {
      this._activeColumns.set(pos, new BehaviorSubject<TemplateRef<any>>(null));
    }
  }

  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/

  /**
   * Returns an observable which emits the current active template for the given position
   * over time.
   */
  public activeColumnTemplate(position: ToolbarColumnPosition): Observable<TemplateRef<any>> {
    const activeColumn = this._activeColumns.get(position);
    if (activeColumn) {
      return activeColumn.asObservable();
    } else {
      throw new Error('Could not find column-template for position ' + position);
    }
  }

  /**
   * Registers the given template as toolbar column at the given position.
   *
   * @param position at which template should be placed
   * @param template to set at position
   * @param isDefault if the given template should be used as app default
   */
  public registerColumn(position: ToolbarColumnPosition, template: TemplateRef<any>, isDefault = false): void {

    this.logger.trace('Registering toolbar column at position ' + position, template);

    if (isDefault) {
      this._columnDefaults.set(position, template);
    } else {
      this._columns.set(position, template);
    }
    this.updateActiveColumn(position);
  }

  /**
   * Deregister the given template from the toolbar.
   *
   * @param template to deregister
   * @param position if set, the template will only be deregistered if it was registered at this position (optional)
   */
  public deregisterColumn(template: TemplateRef<any>, position?: ToolbarColumnPosition) {

    if (position) {
      if (this._columns.get(position) === template) {
        this.removeColumn(position);
      }
    } else {
      this._columns.forEach((value: TemplateRef<any>, key: ToolbarColumnPosition) => {
        if (value === template) {
          this.removeColumn(key);
        }
      });
    }
  }

  /***************************************************************************
   *                                                                         *
   * Private methods                                                         *
   *                                                                         *
   **************************************************************************/

  private removeColumn(pos: ToolbarColumnPosition): void {
    this.logger.trace('Deregistering toolbar column at ', pos);
    this._columns.delete(pos);
    this.updateActiveColumn(pos);
  }

  private updateActiveColumn(position: ToolbarColumnPosition): void {
    const active = this.findActiveTemplate(position);
    const activeColumn = this._activeColumns.get(position);
    if (activeColumn.getValue() !== active) {
      activeColumn.next(active);
    }
  }

  private findActiveTemplate(position: ToolbarColumnPosition): TemplateRef<any> {
    return this._columns.has(position)
      ? this._columns.get(position)
      : this._columnDefaults.get(position);
  }

}
