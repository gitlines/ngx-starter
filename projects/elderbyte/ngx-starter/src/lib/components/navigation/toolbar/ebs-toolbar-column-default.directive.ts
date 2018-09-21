import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {EbsToolbarService} from './ebs-toolbar.service';

@Directive({
  selector: '[ebsToolbarColumnDefault]'
})
export class EbsToolbarColumnDefaultDirective implements OnInit {

  /***************************************************************************
   *                                                                         *
   * Fields                                                                  *
   *                                                                         *
   **************************************************************************/

  private readonly logger = LoggerFactory.getLogger('EbsToolbarColumnDefaultDirective');

  @Input('ebsToolbarColumnDefault')
  public columnId: string;

  /***************************************************************************
   *                                                                         *
   * Constructor                                                             *
   *                                                                         *
   **************************************************************************/

  constructor(
      private templateRef: TemplateRef<any>,
      private viewContainer: ViewContainerRef,
      private toolbarService: EbsToolbarService
  ) { }

  /***************************************************************************
   *                                                                         *
   * Life Cycle                                                              *
   *                                                                         *
   **************************************************************************/

  public ngOnInit(): void {

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
