import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '', /* La ruta "base", donde se redireccionará si no hay nada en la URL  */
    redirectTo: 'home', /* Cuando la ruta raíz es seleccionada (path:'') la aplicación redirige a 'home'. */
    pathMatch: 'full' /*Modo de coincidencia para la ruta ('')*/
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
