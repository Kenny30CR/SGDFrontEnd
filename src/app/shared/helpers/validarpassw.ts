import { FormGroup } from '@angular/forms';


export function ComparePassword(){
 return (FormGroup: FormGroup) =>{
   const passwN= FormGroup.controls['passwN'];
   const passwR= FormGroup.controls['passwR'];

   if(passwR.errors && !passwR.errors.debeCoincidir){
       return;
   }
   if(passwN.value !== passwR.value){
       passwR.setErrors({debeCoincidir: true});
   }else{
       passwR.setErrors(null);
   }


 }
}