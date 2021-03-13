import { Component, OnInit } from '@angular/core';
import { CatalogoService } from '../shared/services/catalogo.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PaginacionService } from '../shared/services/paginacion.service';
import { FiltradoService } from '../shared/services/filtrado.service';
import { ImprimirService } from '../shared/services/imprimir.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
  animations: [trigger('estadoFiltrar', [
    state('show', style({
      'max-height': '100%', 'opacity': '1', 'visibility': 'visible'
    })),
    state('hide', style({
      'max-height': '0', 'opacity': '0', 'visibility': 'hidden'
    })),
    transition('show=> hide',animate('600ms ease-in-out')),
    transition('hide=> show',animate('1000ms ease-in-out'))
  ])]
})
export class VentaComponent implements OnInit {

  ventas = [];
  venta = {
    id_venta: 0,
    id_producto_venta: 0,
    cedula_cliente_venta: '',
    fecha_venta: ''
    //id_venta    id_producto_venta   cedula_cliente_venta   fecha_venta
  }
  frmVenta: FormGroup;
  tituloForm;
  guardado = false;
  confirmado = false;
  filtrarVisible=false;
  objFiltro={};
  numregs;
  constructor(private catalogoSrv: CatalogoService, private fb: FormBuilder, public paginacion: PaginacionService, private filtrar: FiltradoService, private srvImprimir: ImprimirService, private router: Router) {

    this.frmVenta = this.fb.group({
      id_venta: [''],
      id_producto_venta: ['', [Validators.required]],
      cedula_cliente_venta: ['', [Validators.required]],
      fecha_venta: ['', [Validators.required]],
      funcion: ['']
    })

  }

  onSubmit() {

    const datos = {
      id_producto_venta: this.frmVenta.value.id_producto_venta,
      cedula_cliente_venta: this.frmVenta.value.cedula_cliente_venta,
      fecha_venta: this.frmVenta.value.fecha_venta,
    }

    if (this.frmVenta.value.funcion === '') {
      this.catalogoSrv.guardar(datos)
        .subscribe(
          data => {
            this.guardado = data[0] != 0;
            this.filtro();
            //this.refrescar(1, this.paginacion.limite);//Se esta refrescando la tabla
            this.limpiarFormNuevo();
            this.ocultarMensajeTiempo();
          },
          error => {
            if (error.status != 409) {
              this.frmVenta.controls.id_venta.setErrors({ duplicado: true });
            }
          }
        )
    } else {
      this.catalogoSrv.guardar(datos, this.frmVenta.value.funcion)
        .subscribe(
          data => {
            this.guardado = data[0] != 1;
            this.filtro();
            //this.refrescar(this.paginacion.actual, this.paginacion.limite);//Se esta refrescando la tabla
            this.ocultarMensajeTiempo();
          },
          error => {
            if (error.status == 409) {
              this.frmVenta.controls.id_venta.setErrors({ duplicado: true });
            }
          }
        )
    }
  }

  nuevoVenta() {
    this.tituloForm = 'Nuevo Venta';
    this.frmVenta.controls.id_venta.disable();
    this.catalogoSrv.siguienteCodigo('venta').subscribe(
      data => this.frmVenta.reset({ id_venta: data, funcion: '' })
    );
  }

  editarVenta(id_venta) {
    this.tituloForm = 'Editar Venta';
    this.frmVenta.controls.id_venta.disable();
    this.catalogoSrv.buscarPorCodigo(id_venta).subscribe(
      data => this.frmVenta.reset({ id_venta: data[0].id_venta, id_producto_venta: data[0].id_producto_venta, cedula_cliente_venta: data[0].cedula_cliente_venta, fecha_venta: data[0].fecha_venta, funcion: data[0].id_venta })
      //data=>console.log(data)
    );
  }

  eliminar() {
    this.catalogoSrv.eliminar(this.venta.id_venta).subscribe(
      //data=> 
      data => {
        //console.log(data),
        this.filtro();
        //this.refrescar(this.paginacion.actual, this.paginacion.limite);
        this.confirmado = true;
      }
    );
  }

  confirmarEliminar(id) {
    this.confirmado = false;
    this.tituloForm = 'Eliminar Venta';
    this.catalogoSrv.buscarPorCodigo(id).subscribe(
      data => this.venta = { id_venta: id, id_producto_venta: data[0].id_producto_venta, cedula_cliente_venta: data[0].cedula_cliente_venta, fecha_venta: data[0].fecha_venta }
    );
  }

  limpiarFormNuevo() {
    this.catalogoSrv.siguienteCodigo('venta')
      .subscribe(
        data => this.frmVenta.reset({ id_venta: data, funcion: '' })
      )
  }

  ocultarMensajeTiempo() {
    setTimeout(() => {
      this.guardado = false;
    }, 1200)
  }

  toggleFiltro(){
    this.filtrarVisible=!this.filtrarVisible;
    if(!this.filtrarVisible){
      this.objFiltro={};
      this.filtro();
    }
  }

  get stateName(){
    return this.filtrarVisible ? 'show' : 'hide';
  }

  onFiltroChange(filtro){
    this.objFiltro=filtro;
    this.filtro();
  }

  filtro(){
    this.ventas.length=0;
    //num registros
    this.filtrar.numRegs('venta',this.objFiltro).then(
      snapshot=>{
        snapshot.subscribe(
          data=>this.paginacion.calcularPiecera(data)
        )
      }
    )
    //ejecutar
    this.filtrar.ejecutar('venta',this.objFiltro,this.paginacion.actual, this.paginacion.limite)
      .then(snapshot => {
        snapshot.subscribe(
          data => {
            for (const prop in data) {
              if (prop) {
                const dato = {
                  id_venta: data[prop].id_venta,
                  id_producto_venta: data[prop].id_producto_venta,
                  cedula_cliente_venta: data[prop].cedula_cliente_venta,
                  fecha_venta: data[prop].fecha_venta
                }
                this.ventas.push(dato);
              }
            }
          }
        )
      });
  }

  cambiarLimite(e){
    this.paginacion.iniciar(10);
    this.paginacion.cambioLimite(e.target.value);
    //this.paginacion.limite= e.target.value;
    this.paginacion.calcularPiecera(this.numregs);
    this.filtro();
    //this.refrescar(this.paginacion.actual, this.paginacion.limite);
  }

  cambiarPagina(pag){
    this.paginacion.cambiarPagina(pag);
    this.filtro();
    //this.refrescar(this.paginacion.actual, this.paginacion.limite);
  }

  onCerrar(){
    this.router.navigate(['/']);
  }

  onImprimir(){
    const columna= [['IdVenta', 'Nombre venta', 'Cantidad','Fecha']];
    const fila = [];
    this.filtrar.ejecutar('venta',this.objFiltro, 1, this.paginacion.numRegs)
      .then(snapshot => {
        snapshot.subscribe(
          data => {
            for (const prop in data) {
              if (prop) {
                const dato = [
                   data[prop].id_venta,
                   data[prop].id_producto_venta,
                   data[prop].cedula_cliente_venta,
                   data[prop].fecha_venta
                ]
                fila.push(dato);
              }
            }
            this.srvImprimir.imprimir(columna, fila, '');
          }
        )
      });
  }

  ngOnInit(): void {
    this.catalogoSrv.setServidor('venta');
    this.filtrar.setServidor('venta');
    this.paginacion.iniciar(10);
    this.filtro();
    //this.refrescar(this.paginacion.actual, this.paginacion.limite)
  }
}
