import { NgModule } from '@angular/core'; // Importaciónes de angular
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirección a la ruta 'home' por defecto
  {
    path: 'home',

    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'contribute', // Ruta para 'contribute'
    loadChildren: () =>
      import('./pages/contribute/contribute.module').then(
        (m) => m.ContributePageModule
      ),
  },
  {
    path: 'errorview',
    loadChildren: () => import('./pages/errorview/errorview.module').then( m => m.ErrorviewPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
