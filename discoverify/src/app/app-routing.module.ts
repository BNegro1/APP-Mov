import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
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
  {
    path: '404', // Si se accede a la ruta /404
    component: NotFoundComponenteComponent // ENtonces cargar el componente NotFoundComponenteComponent
  },
  {
    path: '**', // Si no se encuentra la ruta
    redirectTo: '/404' // Entonces redirigir a la página 404
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }