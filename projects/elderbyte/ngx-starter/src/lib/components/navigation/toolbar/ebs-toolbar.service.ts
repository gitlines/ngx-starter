import {Injectable, TemplateRef} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {EbsToolbarColumnPosition} from './ebs-toolbar-column-position';

@Injectable({
  providedIn: 'root'
})
export class EbsToolbarService {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private readonly logger = LoggerFactory.getLogger('EbsToolbarService');

    /** Default templates (App Level) */
    public columnDefaults: Map<EbsToolbarColumnPosition, TemplateRef<any>> = new Map<EbsToolbarColumnPosition, TemplateRef<any>>();

    /** Custom templates (Component Level) */
    public columns: Map<EbsToolbarColumnPosition, TemplateRef<any>> = new Map<EbsToolbarColumnPosition, TemplateRef<any>>();

    /***************************************************************************
     *                                                                         *
     * Constructors                                                            *
     *                                                                         *
     **************************************************************************/

    constructor() {}

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    /**
     * Registers the given template as toolbar column at the given position.
     *
     * @param position at which template should be placed
     * @param template to set at position
     * @param setDefault if the given template should be used as app default
     */
    public registerColumn(position: EbsToolbarColumnPosition, template: TemplateRef<any>, setDefault = false): void {

        this.logger.trace('Registering toolbar column at position ' + position, template);

        if (setDefault) {
            this.columnDefaults.set(position, template);
        } else {
            this.columns.set(position, template);
        }

    }

    /**
     * Deregister the given template from the toolbar.
     *
     * @param template to deregister
     * @param position if set, the template will only be deregistered if it was registered at this position (optional)
     */
    public deregisterColumn(template: TemplateRef<any>, position?: EbsToolbarColumnPosition) {

        if (position) {
            if (this.columns.get(position) === template) {
                this.logger.trace('Deregistering toolbar column at position ' + position, template);
                this.columns.delete(position);
            }
        } else {
            this.columns.forEach((value: TemplateRef<any>, key: EbsToolbarColumnPosition) => {
                if (value === template) {
                    this.logger.trace('Deregistering toolbar column', template);
                    this.columns.delete(key);
                }
            });
        }
    }

}
