import {Routes} from '@angular/router';
import {DemoPanelComponent} from './demo-panel/demo-panel.component';
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
        path: 'mixed-demo',
        component: DemoPanelComponent,
        data: {
          title: 'Mixed Demo'
        }
      },

      {
        path: 'sub',
        children: [
          {
            path: 'override-title',
            component: CardsDemoComponent,
            data: {
              title: 'Overridden Title'
            }
          },
          {
            path: 'tolbar-title-demo',
            component: CardsDemoComponent,
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
];
