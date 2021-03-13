import { Injectable } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class PaginacionService {

  primero;
  ultimo;
  actual;
  limite;
  numRegs;
  numPags;
  regs;
  pags;
  max;

  constructor() { }


  iniciar(max) {
    this.primero = 1;
    this.ultimo = max;
    this.actual = 1;
    this.limite = 5;
    this.numRegs = 0;
    this.numPags = 0;
    this.pags = [];
    this.pags.lenght = 0;
    this.max = max;
  }

  cambioLimite(lim){
    this.actual=1;
    this.limite= parseInt(lim,0);
    this.setNumPags();

  }

  calcularPiecera(regs) {
    this.numRegs = regs;
    this.setNumPags();
  }

  setNumPags() {
    this.numPags = Math.ceil(this.numRegs / this.limite);
    this.pags.lenght = 0;
    this.pags=Array.from(Array(this.numPags)).map((x,i)=>i+1);
  }


  cambiarPagina(pag) {

    if(pag==-2){
      this.primero-=this.max;
      if(this.primero<1){
        this.primero=1;
      }
      this.ultimo=this.primero+(this.max-1);
      pag=this.primero;
    }

    if(pag==-3){
      this.primero=this.ultimo+1;
      this.ultimo += this.max;
      if(this.ultimo> this.numPags){
        this.ultimo=this.numPags;
      }
      pag=this.primero;
    }


    if (pag == -1) {
      if(this.actual>1){
        this.actual--;
        if(this.actual<this.primero){
          this.primero=this.actual-(this.max-1);
          this.ultimo=this.actual;
        }
      } 
  }else if (pag == 0) {
      if (this.actual < this.numPags) {
        this.actual++;
        if (this.actual > this.ultimo) {
          this.primero = this.actual;
          this.ultimo = this.actual + (this.max - 1);
        }
      } else {
        this.actual = 1;
        this.primero = 1;
        this.ultimo = this.max;
      }
    } else {
      this.actual = pag;
    }
  }





}
