import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth guard/auth.guard';
import { NotFoundComponenteComponent } from './components/not-found-componente/not-found-componente.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'contribute',
    loadChildren: () =>
      import('./pages/contribute/contribute.module').then(
        (m) => m.ContributePageModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'errorview',
    loadChildren: () =>
      import('./pages/errorview/errorview.module').then(
        (m) => m.ErrorviewPageModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'reset',
    loadChildren: () =>
      import('./pages/reset/reset.module').then(m => m.ResetPageModule)
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  // Si no se encuentra la ruta, redirigir a la página de error
  {   // Además, agregamos el componente NotFoundComponenteComponent para manejar páginas no encontradas (404)
    component: NotFoundComponenteComponent,
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  // SIno se encuentra la ruta, redirigir a la página de error
  {
    path: '**', // Si no se encuentra la ruta, redirigir a la página de error
    redirectTo: 'home' // Entonces, redirigir a la página de inicio
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }