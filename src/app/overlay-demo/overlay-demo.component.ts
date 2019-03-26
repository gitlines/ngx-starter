import { Component, OnInit } from '@angular/core';
import {FilterContext} from '../../../projects/elderbyte/ngx-starter/src/lib/common/data/filter-context';
import {LoggerFactory} from '@elderbyte/ts-logger';
import {Filter} from '../../../projects/elderbyte/ngx-starter/src/lib/common/data/filter';

@Component({
  selector: 'starter-demo-overlay-demo',
  templateUrl: './overlay-demo.component.html',
  styleUrls: ['./overlay-demo.component.scss']
})
export class OverlayDemoComponent implements OnInit {

  private readonly logger = LoggerFactory.getLogger('OverlayDemoComponent');

  public readonly filter = new FilterContext();

  constructor() {
    this.filter.replaceFilters([new Filter('static', 'dont kill me')]);
  }

  ngOnInit() {
    this.filter.filters.subscribe(filters => {
      this.logger.info('Active Filters:', filters);
    });
  }

}
