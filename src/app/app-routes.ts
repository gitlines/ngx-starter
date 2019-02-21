import {Routes} from '@angular/router';
import {DemoPanelComponent} from './demo-panel/demo-panel.component';
import {DemoPanelSideComponent} from './demo-panel-side/demo-panel-side.component';
import {EatableCategoryListComponent} from './eatables/categories/category-list/eatable-category-list.component';
import {EatableCategoryDetailComponent} from './eatables/categories/category-detail/eatable-category-detail.component';
import {TableMasterDetailComponent} from './table-master-detail/table-master-detail.component';
import {DemoSimpleSideComponent} from './demo-simple-side/demo-simple-side.component';
import {CardsDemoComponent} from './cards-demo/cards-demo.component';


export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'app/mixed-demo',
    pathMatch: 'full'
  },

  {
    path: 'app',
    children: [

      {
        path: 'links',
        children: [
          {
            path: 'a',
            component: DemoPanelComponent,
          },
          {
            path: 'b',
            component: DemoPanelComponent,
          },
          {
            path: 'c',
            component: DemoPanelComponent,
          },
          {
            path: 'd',
            component: DemoPanelComponent,
          }
        ]
      },


      {
        path: 'mixed-demo',
        component: DemoPanelComponent,
        data: {
          title: 'Mixed Demo'
        }
      },

      {
        path: 'master-detail',
        component: TableMasterDetailComponent,
        data: {
          title: 'Table - Local Master Detail'
        }
      },

      {
        path: 'cards-demo',
        component: CardsDemoComponent,
        data: {
          title: 'Cards Demo'
        }
      },

      {
        path: 'eatables',
        component: EatableCategoryListComponent,
        data: {
          title: 'Eatables'
        }
      },
      {
        path: 'eatables/:id',
        component: EatableCategoryDetailComponent,
        data: {
          title: 'Eatable Detail'
        }
      },

      {
        path: 'sub',
        children: [
          {
            path: 'override-title',
            component: DemoPanelComponent,
            data: {
              title: 'Overridden Title'
            }
          },
          {
            path: 'toolbar-title-demo',
            component: DemoPanelComponent,
          }
        ],
        data: {
          _title: 'Base Title'
        }
      } ,
    ],
    data: {
      title: 'App Home'
    }
  },

  // OUTLET SIDE
  {
    path: 'simple',
    outlet: 'side',
    component: DemoSimpleSideComponent,

  },
  {
    path: 'mixed-demo',
    outlet: 'side',
    component: DemoPanelSideComponent,

  },
  {
    path: 'foods/:id',
    outlet: 'side',
    component: DemoPanelSideComponent,

  },
];
