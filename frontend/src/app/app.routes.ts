import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'orders',
        pathMatch: 'full'
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/orders/orders.component').then((c) => c.OrdersComponent)
      },
      {
        path: 'ingredients',
        loadComponent: () => import('./pages/ingredients/ingredients.component').then((c) => c.IngredientsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'orders'
  }
];
