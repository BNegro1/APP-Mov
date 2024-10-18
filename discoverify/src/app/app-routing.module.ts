import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';
import { DbService } from './services/dbservice.service';

const routes: Routes = [
  {
    path: '', // Ruta raíz. RECORDAR: Si es '**' aparece el error 404. !!!
    redirectTo: 'home', // Redirige a home. Estandar.
    pathMatch: 'full', // Redirige a home si la ruta es vacía.
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
      canActivate: [authGuard] // Protege la ruta de home.
  },
  {
    path: 'contribute',
    loadChildren: () =>
      import('./pages/contribute/contribute.module').then(
        (m) => m.ContributePageModule
      ),
      canActivate: [authGuard] // Proteger ruta de contribute.
  },
  {
    path: 'errorview',
    loadChildren: () =>
      import('./pages/errorview/errorview.module').then(
        (m) => m.ErrorviewPageModule
      ),
      canActivate: [authGuard] // Proteger ruta de errorview.
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'reset',
    loadChildren: () =>
      import('./pages/reset/reset.module').then((m) => m.ResetPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
