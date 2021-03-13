import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private rooter: Router){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.authService.isLoggedIn()){
      //this.rooter.navigate(['/home']);
      console.log(next.data);
      console.log(this.authService.expJwtToken());
      if(next.data.roles && next.data.roles.indexOf(this.authService.valorUserActual.rol) == -1){
        if(this.authService.isLoggedIn()){
          this.rooter.navigate(['/error401']);
        }else{
          this.rooter.navigate(['/']);
        }
        return false;
      }
      return true;
    }
    this.authService.logout();
    this.rooter.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;
  }
  
}
