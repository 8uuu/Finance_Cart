import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/pages/login/login.component';
import { RegisterPersonComponent } from './core/auth/register-person/pages/register-person/register-person.component';
import { LetraComponent } from './core/finanzas/pages/letra/letra.component';
import { FacturaComponent } from './core/finanzas/pages/factura/factura.component';
import { ReciboComponent } from './core/finanzas/pages/recibo/recibo.component';
import { HomeComponent } from './core/finanzas/pages/home/home.component';

const routes: Routes = [
  /* {
    path: '',
    component: LoginComponent,
    // pathMatch: 'full'
  }, */
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/auth/login/login.module').then(
        (module) => module.LoginModule
      ),
  },
  {
    path: 'registerProfiles',
    component: RegisterPersonComponent,
    pathMatch: 'full',
  },

  {
    path: 'personProfiles',
    component: HomeComponent,
    pathMatch: 'full',
  },

  {
    path: 'personProfiles/letras',
    component: LetraComponent,
  },
  {
    path: 'personProfiles/facturas',
    component: FacturaComponent,
  },
  {
    path: 'personProfiles/recibos',
    component: ReciboComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), RouterModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
