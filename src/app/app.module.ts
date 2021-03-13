import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas,faPlus, faEdit ,faTrashAlt, faSignInAlt, faUser, faKey} from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { LoginComponent } from './login/login.component';
import { JwtInterceptor } from './shared/helpers/jwt.interceptor';
import { RefreshTokenInterceptor } from './shared/helpers/refresh-token.interceptor';
import { CambiopassComponent } from './cambiopass/cambiopass.component';
import { LoaderComponent } from './loader/loader.component';
import { LoaderInterceptor } from './shared/helpers/loader.interceptor';
import { Error401Component } from './error401/error401.component';
import { ProductoComponent } from './producto/producto.component';
import { ClienteComponent } from './cliente/cliente.component';
import { VentaComponent } from './venta/venta.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    UsuarioComponent,
    LoginComponent,
    CambiopassComponent,
    LoaderComponent,
    Error401Component,
    ProductoComponent,
    ClienteComponent,
    VentaComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass:RefreshTokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass:LoaderInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 

  constructor(library:FaIconLibrary){

    library.addIconPacks(fas,far);
    library.addIcons(faPlus, faEdit, faTrashAlt, faSignInAlt, faUser, faKey);
  }
}
