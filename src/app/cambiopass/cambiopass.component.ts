import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { ComparePassword } from '../shared/helpers/validarpassw';

@Component({
  selector: 'app-cambiopass',
  templateUrl: './cambiopass.component.html',
  styleUrls: ['./cambiopass.component.css']
})
export class CambiopassComponent implements OnInit {
  passwForm: FormGroup;
  mensaje='';
  constructor(private fb:FormBuilder, private authSrv: AuthService, private router: Router) { }


  onSubmit(){
    const datos={
      id:this.authSrv.valorUserActual.id,
      passwV:this.passwForm.value.passw,
      passwN:this.passwForm.value.passwN
    };
    this.authSrv.cambiarPassw(datos)
    .subscribe(
      res=> res,
      error=>{
        if(error.status==401){
          this.passwForm.controls.passw.setErrors({invalid: true})
        }
        //console.log(error.status)
      },
      ()=>{
        this.mensaje= 'Se actualizó la contraseña de forma correcta.';
        setTimeout(() => {
          this.mensaje='';
          this.onCerrar();
        }, 3000);
      }
    )
  }

  onCerrar(){
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.passwForm= this.fb.group({
      passw: ['', Validators.required],
      passwN: ['', Validators.required],
      passwR: ['', Validators.required]
      
    },
    {validator: ComparePassword()})
    
  }

}

