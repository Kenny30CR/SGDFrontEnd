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
import { ProductoComponent } from './producto/producto.component';
import { ClienteComponent } from './cliente/cliente.component';
import { VentaComponent } from './venta/venta.component';


const routes: Routes = [
  {path: '' , pathMatch: 'full', redirectTo:'/login'},
  {path: 'login' , component: LoginComponent,canActivate:[LoginGuard]},
  {path: 'usuario' , component: UsuarioComponent, canActivate:[AuthGuard],data:{roles: [Role.Admin]}},
  {path: 'producto' , component: ProductoComponent, canActivate:[AuthGuard],data:{roles: [Role.User,Role.Admin, Role.PowerUser]}},
  {path: 'venta' , component: VentaComponent, canActivate:[AuthGuard],data:{roles: [ Role.Admin, Role.PowerUser]}},
  {path: 'cliente' , component: ClienteComponent, canActivate:[AuthGuard],data:{roles: [Role.User, Role.Admin, Role.PowerUser]}},
  {path: 'cambio-passw' , component: CambiopassComponent, canActivate:[AuthGuard],data:{roles: [Role.User, Role.Admin, Role.PowerUser]}},
  {path: 'error401' , component: Error401Component},
  {path: 'home' , component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }



