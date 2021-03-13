import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup;
  error=false;
  returnUrl:string;
  constructor(private fb: FormBuilder, private auth: AuthService, private rooter: Router, private route: ActivatedRoute) { }

  onSubmit(){
    this.auth.login({id:this.loginForm.value.usuario, passw:this.loginForm.value.passw})
    .subscribe(
      res=>{
        if(!res || res==401){
          this.error=res==401;
        }else{
          this.rooter.navigate([this.returnUrl])
          //this.rooter.navigate(['/home']);
        }
      }
    );
  }

  ngOnInit(): void {
    this.loginForm= this.fb.group({
      usuario:['', Validators.required],
      passw: ['', Validators.required]
    })
    this.returnUrl=this.route.snapshot.queryParams.returnUrl || '/home';
  }

}
