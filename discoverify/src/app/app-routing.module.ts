import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard/auth.guard';
import { NotFoundComponenteComponent } from './components/not-found-componente/not-found-componente.component';

const routes: Routes = [
  // Ruta por defecto
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // Rutas públicas (sin autenticación)
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },

  // Rutas protegidas (requieren autenticación)
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadChildren: () => 
      import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'contribute',
    loadChildren: () =>
      import('./pages/contribute/contribute.module').then(
        (m) => m.ContributePageModule
      ),
    canActivate: [AuthGuard],
  },

  // 404 not found
  {
    path: '**',
    component: NotFoundComponenteComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
