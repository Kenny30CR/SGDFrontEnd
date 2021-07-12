import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PaginacionService } from '../shared/services/paginacion.service';
import { FiltradoService } from '../shared/services/filtrado.service';
import { ImprimirService } from '../shared/services/imprimir.service';
import { Router } from '@angular/router';
import { CatalogoService } from '../shared/services/catalogo.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css'],
  animations: [trigger('estadoFiltrar', [
    state('show', style({
      'max-height': '100%', 'opacity': '1', 'visibility': 'visible'
    })),
    state('hide', style({
      'max-height': '0', 'opacity': '0', 'visibility': 'hidden'
    })),
    transition('show=> hide', animate('600ms ease-in-out')),
    transition('hide=> show', animate('1000ms ease-in-out'))
  ])]
})

export class FacturasComponent  implements OnInit {

  facturas = [] as any;
  factura = {
    idFactura: 0,
    ordenDesp: 0,
    subcontratados: '',
    fechaFactura: '',
    facturaPagada: 0,
    Descripcion: '',
    subTotal: 0,
    montoTotal: 0,
    indicacionExtra: '',
    montoExtra: 0
  }
  frmFactura: FormGroup;
  tituloForm: any;
  guardado = false;
  confirmado = false;
  filtrarVisible = false;
  objFiltro = {};
  numregs: any;





  constructor(private rutasSrv: CatalogoService, private fb: FormBuilder, private filtrar: FiltradoService, public paginacion: PaginacionService, private router: Router) {
    
    this.frmFactura = this.fb.group({
      idFactura: [''],
      ordenDesp: [''],
      subcontratados: [''],
      fechaFactura: [''],
      facturaPagada: [''],
      Descripcion: [''],
      subTotal: [''],
      montoTotal: [''],
      indicacionExtra: [''],
      montoExtra: [''],
      funcion: ['']
    })
  }



  onSubmit() {

    const datos = {
      ordenDesp: this.frmFactura.value.ordenDesp,
      subcontratados: this.frmFactura.value.subcontratados,
      fechaFactura: this.frmFactura.value.fechaFactura,
      facturaPagada: this.frmFactura.value.facturaPagada,
      Descripcion: this.frmFactura.value.Descripcion,
      subTotal: this.frmFactura.value.subTotal,
      montoTotal: this.frmFactura.value.montoTotal,
      indicacionExtra: this.frmFactura.value.indicacionExtra,
      montoExtra: this.frmFactura.value.montoExtra
    }

    if (this.frmFactura.value.funcion === '') {
      this.rutasSrv.guardar(datos)
        .subscribe(
          data => {
            this.guardado = data[0] != 0;
            this.filtroFactura();
            this.limpiarFormNuevo();
            this.ocultarMensajeTiempo();
          },
          error => {
            if (error.status != 409) {
              this.frmFactura.controls.idFactura.setErrors({ duplicado: true });
            }
          }
        )
    } else {
      this.rutasSrv.guardar(datos, this.frmFactura.value.funcion)
        .subscribe(
          data => {
            this.guardado = data[0] != 1;
            this.filtroFactura();
            this.ocultarMensajeTiempo();
          },
          error => {
            if (error.status == 409) {
              this.frmFactura.controls.idFactura.setErrors({ duplicado: true });
            }
          }
        )
    }
  }

  nuevoFactura() {
    this.tituloForm = 'Nuevo Producto';
    this.frmFactura.controls.idFactura.disable();
    this.rutasSrv.siguienteCodigo('facturacion').subscribe(
      data => this.frmFactura.reset({ idFactura: data, funcion: '' })
    );
  }

  editarFactura(idFactura: any) {
    this.tituloForm = 'Editar Factura';
    this.frmFactura.controls.id_producto.disable();
    this.rutasSrv.buscarPorCodigo(idFactura).subscribe(
      data => this.frmFactura.reset({ idFactura: data[0].idFactura, ordenDesp: data[0].ordenDesp }),
      data => console.log(data)
    );
  }

  eliminarFactura() {
    this.rutasSrv.eliminar(this.factura.idFactura).subscribe(
      //data=> 
      data => {
        //console.log(data),
        this.filtroFactura();
        this.confirmado = true;
      }
    );
  }

  confirmarEliminar(idFactura: any) {
    this.confirmado = false;
    this.tituloForm = 'Eliminar Factura';
    this.rutasSrv.buscarPorCodigo(idFactura).subscribe(
      data => this.factura = {
        idFactura: idFactura,
        ordenDesp: data[0].ordenDesp,
        subcontratados: data[0].subcontratados,
        fechaFactura: data[0].fechaFactura,
        facturaPagada: data[0].facturaPagada,
        Descripcion: data[0].Descripcion,
        subTotal: data[0].subTotal,
        montoTotal: data[0].montoTotal,
        indicacionExtra: data[0].indicaciónExtra,
        montoExtra: data[0].montoExtra
      }
    );
  }

  limpiarFormNuevo() {
    this.rutasSrv.siguienteCodigo('facturacion')
      .subscribe(
        data => this.frmFactura.reset({ idFactura: data, funcion: '' })
      )
  }

  ocultarMensajeTiempo() {
    setTimeout(() => {
      this.guardado = false;
    }, 1200)
  }

  filtroFactura() {
    this.facturas.length = 0;
    //num registros
    this.filtrar.numRegs('facturacion', this.objFiltro).then(
      snapshot => {
        snapshot.subscribe(
          data => this.paginacion.calcularPiecera(data)
        )
      }
    )
    //ejecutar
    this.filtrar.ejecutar('facturacion', this.objFiltro, this.paginacion.actual, this.paginacion.limite)
      .then(snapshot => {
        snapshot.subscribe(
          data => {
            for (const prop in data) {
              if (prop) {
                const dato: any = {
                  idFactura: data[prop].idFactura,
                  ordenDesp: data[prop].ordenDesp,
                  subcontratados: data[prop].subcontratados,
                  fechaFactura: data[prop].fechaFactura,
                  facturaPagada: data[prop].facturaPagada,
                  Descripcion: data[prop].Descripcion,
                  subTotal: data[prop].subTotal,
                  montoTotal: data[prop].montoTotal,
                  indicacionExtra: data[prop].indicaciónExtra,
                  montoExtra: data[prop].montoExtra
                }
                this.facturas.push(dato);
              }
            }
          }
        )
      });
  }

  cambiarLimite(e: { target: { value: string; }; }){
    this.paginacion.iniciar(10);
    this.paginacion.cambioLimite(e.target.value);
    this.paginacion.calcularPiecera(this.numregs);
    this.filtroFactura();
  }

  cambiarPagina(pag: number | undefined){
    this.paginacion.cambiarPagina(pag);
    this.filtroFactura();
  }

  onCerrar(){
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.rutasSrv.setServidor('facturacion');
    this.filtrar.setServidor('facturacion');
    this.paginacion.iniciar(10);
    this.filtroFactura();
  }

  generarFactura() {
    console.log('funciono');
  }








}