import { Component, HostListener } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FrontEnd';
  nomUsuario: string;
  constructor(private authSrv: AuthService){ this.authSrv.usrActual.subscribe(
    usr=> this.nomUsuario= usr.id
  )}
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event:Event){
    this.authSrv.logout();
  }
  salir(){
    this.authSrv.logout();
  }
}
