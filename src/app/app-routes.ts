import {Routes} from '@angular/router';
import {DemoPanelComponent} from './demo-panel/demo-panel.component';


export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'app/demo-panel',
    pathMatch: 'full',
  },

  {
    path: 'app',
    children: [

      {
        path: 'demo-panel',
        component: DemoPanelComponent,
        data: {
          title: 'Demo Panel'
        }
      },
    ]
  },
];
