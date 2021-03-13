import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, mapTo, catchError, flatMap } from 'rxjs/operators';
import { of, BehaviorSubject } from 'rxjs';
import { Tokens } from '../models/token.model';
import *  as jwt_encode from 'jwt-decode';
import { User } from '../models/user.model'
import { Router } from '@angular/router';
import { THIS_EXPR, IfStmt } from '@angular/compiler/src/output/output_ast';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private JTW_TOKEN = "JWT_TOKEN";
  private REFRESH_TOKEN = "REFRESH_TOKEN";
  private usrActulSubjet = new BehaviorSubject({ id: "", rol: -1, nombre: "" });
  usrActual = this.usrActulSubjet.asObservable();
  LIMITE = 20;
  refrescando = false;
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  public get valorUserActual(): User {
    return this.usrActulSubjet.value;
  }


  login(user: { id: string, passw: string }) {
    return this.http.post<any>(`${environment.servidor}/auth/iniciar`, user).pipe(
      tap(
        tokens => {
          this.doLogin(tokens);
          this.usrActulSubjet.next(this.getUserActual());
        }),
      mapTo(true),
      catchError(error => {
        //this.usrActulSubjet.next({id:"", rol:-1, nombre:""});
        this.doLogout();
        return of(error.status)
      })
    )
  }


  logout() {
    this.http.post<any>(`${environment.servidor}/auth/cerrar`, { id: this.getUserActual().id }).subscribe()
    this.doLogout();
    this.router.navigate(['/login']);
  }

  private doLogin(tokens: Tokens) {
    this.guardarTokens(tokens);
    this.usrActulSubjet.next(this.getUserActual());
  }

  private doLogout() {
    if (this.getJwtToken()) {
      this.borrarTokens();
    }
    this.usrActulSubjet.next({ id: "", rol: -1, nombre: "" })
  }

  private borrarTokens() {
    localStorage.removeItem(this.JTW_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  isLoggedIn() {
    //console.log(this.expJwtToken());
    return !!this.getJwtToken() && this.expJwtToken() > 0;
  }

  public expJwtToken() {
    const falta = !this.getJwtToken() ? -1 : this.getDecodeToken().exp - (Date.now() / 1000);
    return falta;
  }

  public verificarRefrescar() {
    if (this.isLoggedIn()) {
      if (this.refrescando) {
        const tiempo = this.expJwtToken();
        if (tiempo >0 && tiempo <= this.LIMITE) {
          console.log('deberia refrescar');
          this.refreshToken();
        }
        return true;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  private refreshToken() {
    this.refrescando=true;
    return this.http.post<any>(`${environment.servidor}/auth/refresh`,
      {
        id: this.getDecodeToken().sub,
        rfT: this.getRefreshToken()
      })
      .subscribe(
        tokens => {
          this.guardarTokens(tokens);
          console.log(this.getJwtToken(), this.getRefreshToken());
          this.refrescando=false;
        }
      )
  }

  getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  getJwtToken() {
    return localStorage.getItem(this.JTW_TOKEN);
  }

  private guardarTokens(tokens: Tokens) {
    this.guardarTokenJWT(tokens.token);
    this.guardarFrefreshToken(tokens.refreshToken);
  }

  private guardarTokenJWT(token: string) {
    localStorage.setItem(this.JTW_TOKEN, token)
  }

  guardarFrefreshToken(token: string) {
    localStorage.setItem(this.REFRESH_TOKEN, token)
  }

  private getDecodeToken() {
    return jwt_encode(this.getJwtToken());
  }

  private getUserActual(): User {
    if (!this.getJwtToken()) {
      return { id: "", rol: -1, nombre: " " }
    }
    const token = this.getDecodeToken();
    return { id: token.sub, rol: Number(token.role), nombre: " " }
  }


  resetPass(id){
    return  this.http.post<any>(`${environment.servidor}/auth/resetpass`, {id})
  }

  cambiarPassw(datos){
    return  this.http.post<any>(`${environment.servidor}/auth/cambioContraseña`, datos)
  }

}
