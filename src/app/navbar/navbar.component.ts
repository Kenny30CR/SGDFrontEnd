import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  nomUsuario: string;
  constructor( private authSrv: AuthService) {
    this.authSrv.usrActual.subscribe(
      usr=> this.nomUsuario= usr.id
    )
   }

  ngOnInit(): void {
  }

  salir(){
    this.authSrv.logout();
  }

}
