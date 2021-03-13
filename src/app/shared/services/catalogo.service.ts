import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  URL = '';
  URI = '';
  constructor(private http: HttpClient) {
    

  }

  setServidor(tabla){
    this.URL=environment.servidor;
    this.URI=this.URL+'/'+tabla;
  }

  /*async mostrarTodo(pag, lim) {
    const resp = await this.http.get(`http://prematricula:8888/curso/${pag}/${lim}`);
    return resp;
  }*/

   guardar(datos, codigo?) {
    if(codigo){
      return  this.http.put(`${this.URI}/${codigo}`, datos);
    }else{
      return  this.http.post(this.URI, datos)
      .pipe(
        catchError(this.hadleError)
      )
    }
  }

  buscarPorCodigo(codigo) {
    return  this.http.get(`${this.URI}/${codigo}`);
  }

  eliminar(codigo) {
    return  this.http.delete(`${this.URI}/${codigo}`);
  }


  siguienteCodigo(tabla) {
    return this.http.get(`${this.URL}/codigo/${tabla}`);
  }

hadleError(error: HttpErrorResponse){
return throwError(error.status);
}

}
