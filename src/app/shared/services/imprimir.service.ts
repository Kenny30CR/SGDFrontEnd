import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ImprimirService {

  constructor() { }


  baseImprimir(salida) {
    const win = window.open();
    win.document.write('<iframe src="'+salida+'" frameborder="0" style="border:0; top:0; left:0; bottom:0; width:100%; height:100%;" allowfullscreen ></iframe>');

  }


  imprimir(columna, fila, encabezado, guardar?) {

    const doc = new jsPDF('portrait', 'px', 'letter');
    doc.text(encabezado, (doc.internal.pageSize.width / 2), 250, { aling: 'center' })
    doc.autoTable({
      head: columna,
      body: fila
    });

    if (guardar) {
      const hoy = new Date();
      doc.save(hoy.getDate() + hoy.getMonth() + hoy.getFullYear() + hoy.getTime() + '.pdf');
    } else {
      const cadena = doc.output('datauristring');
      this.baseImprimir(cadena);
    }



  }


}
