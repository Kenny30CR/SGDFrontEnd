import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FiltradoService {
  URL;
  URI;
  constructor(private http:HttpClient){

  }

  setServidor(tabla){
    this.URL=environment.servidor;
    this.URI=this.URL+'/filtrar/'+tabla;
  }


  async numRegs(tabla,parametros){
    let params = new HttpParams();

    for(const prop in parametros){
      if(prop){
        params=params.append(prop, parametros[prop])
      }
    }
    const resp= await this.http.get(`${this.URI}/numregs`, {params:params});
    return resp;
  }

  async ejecutar(tabla, parametros, pag, lim){
    let params = new HttpParams();
    for(const prop in parametros){
      if(prop){
        params=params.append(prop, parametros[prop])
      }
    }
    const resp= await this.http.get(`${this.URI}/${pag}/${lim}`, {params:params});
    return resp;
  }

}
