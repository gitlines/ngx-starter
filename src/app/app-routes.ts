import {Routes} from '@angular/router';
import {DemoPanelComponent} from './demo-panel/demo-panel.component';
import {CardsDemoComponent} from './cards-demo/cards-demo.component';


export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'app/mixed-demo',
    pathMatch: 'full',
    data: {
      title: 'Demo Home'
    }
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
            path: 'tolbar-title-demo',
            component: CardsDemoComponent,
          },
        ],
        data: {
          title: 'Toolbar Demo'
        }
      } ,
    ]
  },
];
