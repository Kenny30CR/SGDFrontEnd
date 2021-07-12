import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioComponent } from './usuario/usuario.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { LoginGuard } from './shared/guard/login.guard';
import { Role } from './shared/models/role.model';
import { CambiopassComponent } from './cambiopass/cambiopass.component';
import { Error401Component } from './error401/error401.component';
import { DespachosComponent } from './despachos/despachos.component';
import { DieselComponent } from './diesel/diesel.component';
import { FacturasComponent } from './facturas/facturas.component';
import { PlanillasComponent } from './planillas/planillas.component';
import { BalancesComponent } from './balances/balances.component';


const routes: Routes = [
  {path: '' , pathMatch: 'full', redirectTo:'/login'},
  {path: 'login' , component: LoginComponent,canActivate:[LoginGuard]},
  {path: 'usuario' , component: UsuarioComponent, canActivate:[AuthGuard],data:{roles: [Role.Admin]}},
  {path: 'despachos' , component: DespachosComponent, canActivate:[AuthGuard],data:{roles: [Role.User,Role.Admin, Role.PowerUser]}},
  {path: 'diesel' , component: DieselComponent, canActivate:[AuthGuard],data:{roles: [Role.User,Role.Admin, Role.PowerUser]}},
  {path: 'facturas' , component: FacturasComponent, canActivate:[AuthGuard],data:{roles: [Role.User,Role.Admin, Role.PowerUser]}},
  {path: 'balances' , component: BalancesComponent, canActivate:[AuthGuard],data:{roles: [Role.User,Role.Admin, Role.PowerUser]}},
  {path: 'planillas' , component: PlanillasComponent, canActivate:[AuthGuard],data:{roles: [Role.User,Role.Admin, Role.PowerUser]}},
  {path: 'cambio-passw' , component: CambiopassComponent, canActivate:[AuthGuard],data:{roles: [Role.User, Role.Admin, Role.PowerUser]}},
  {path: 'error401' , component: Error401Component},
  {path: 'home' , component: HomeComponent, canActivate:[AuthGuard],data:{roles: [Role.User, Role.Admin, Role.PowerUser]}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }



