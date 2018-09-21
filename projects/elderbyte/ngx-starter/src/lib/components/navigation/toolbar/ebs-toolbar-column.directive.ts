import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {EbsToolbarService} from './ebs-toolbar.service';

@Directive({
  selector: '[ebsToolbarColumn]'
})
export class EbsToolbarColumnDirective implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('EbsToolbarColumnDirective');

  @Input('ebsToolbarColumn')
  public columnId: string;

  @Input('ebsToolbarDefault')
  public asDefault: boolean;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
      public templateRef: TemplateRef<any>,
      private viewContainer: ViewContainerRef,
      private toolbarService: EbsToolbarService
  ) { }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {

    if (this.asDefault) {
        this.logger.debug('Initializing default toolbar column: ' + this.columnId);

        switch (this.columnId) {
            case 'left':
                this.toolbarService.registerLeftColumnDefault(this.templateRef);
                break;
            case 'center':
                this.toolbarService.registerCenterColumnDefault(this.templateRef);
                break;
            case 'right':
                this.toolbarService.registerRightColumnDefault(this.templateRef);
                break;
            default:
                throw new Error('Could not identify column! Have you set the column property?');
        }
    }
  }

  /***************************************************************************
   *                                                                         *
   * Properties                                                              *
   *                                                                         *
   **************************************************************************/


  /***************************************************************************
   *                                                                         *
   * Selection                                                               *
   *                                                                         *
   **************************************************************************/


  /***************************************************************************
   *                                                                         *
   * Public API                                                              *
   *                                                                         *
   **************************************************************************/



  /***************************************************************************
   *                                                                         *
   * Private Methods                                                         *
   *                                                                         *
   **************************************************************************/



}
