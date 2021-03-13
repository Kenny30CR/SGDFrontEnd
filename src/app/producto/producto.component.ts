import { Component, OnInit } from '@angular/core';
import { CatalogoService } from '../shared/services/catalogo.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PaginacionService } from '../shared/services/paginacion.service';
import { FiltradoService } from '../shared/services/filtrado.service';
import { ImprimirService } from '../shared/services/imprimir.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
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

export class ProductoComponent implements OnInit {

  productos = [];
  producto = {
    id_producto: 0,
    nombre_producto: '',
    cantidad_producto: 0
  }
  frmProducto: FormGroup;
  tituloForm;
  guardado = false;
  confirmado = false;
  filtrarVisible=false;
  objFiltro={};
  numregs;
  constructor(private catalogoSrv: CatalogoService, private fb: FormBuilder, public paginacion: PaginacionService, private filtrar: FiltradoService, private srvImprimir: ImprimirService, private router: Router) {

    this.frmProducto = this.fb.group({
      id_producto: [''],
      nombre_producto: ['', [Validators.required, Validators.minLength(5)]],
      cantidad_producto: ['', [Validators.required]],
      funcion: ['']
    })

  }

  onSubmit() {

    const datos = {
      nombre_producto: this.frmProducto.value.nombre_producto,
      cantidad_producto: this.frmProducto.value.cantidad_producto,
    }

    if (this.frmProducto.value.funcion === '') {
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
              this.frmProducto.controls.nombre_producto.setErrors({ duplicado: true });
            }
          }
        )
    } else {
      this.catalogoSrv.guardar(datos, this.frmProducto.value.funcion)
        .subscribe(
          data => {
            this.guardado = data[0] != 1;
            this.filtro();
            //this.refrescar(this.paginacion.actual, this.paginacion.limite);//Se esta refrescando la tabla
            this.ocultarMensajeTiempo();
          },
          error => {
            if (error.status == 409) {
              this.frmProducto.controls.nombre_producto.setErrors({ duplicado: true });
            }
          }
        )
    }
  }

  nuevoProducto() {
    this.tituloForm = 'Nuevo Producto';
    this.frmProducto.controls.id_producto.disable();
    this.catalogoSrv.siguienteCodigo('producto').subscribe(
      data => this.frmProducto.reset({ id_producto: data, funcion: '' })
    );
  }

  editarProducto(id_producto) {
    this.tituloForm = 'Editar Producto';
    this.frmProducto.controls.id_producto.disable();
    this.catalogoSrv.buscarPorCodigo(id_producto).subscribe(
      data => this.frmProducto.reset({ id_producto: data[0].id_producto, nombre_producto: data[0].nombre_producto, cantidad_producto: data[0].cantidad_producto, funcion: data[0].id_producto })
      //data=>console.log(data)
    );
  }

  eliminar() {
    this.catalogoSrv.eliminar(this.producto.id_producto).subscribe(
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
    this.tituloForm = 'Eliminar Producto';
    this.catalogoSrv.buscarPorCodigo(id).subscribe(
      data => this.producto = { id_producto: id, nombre_producto: data[0].nombre_producto, cantidad_producto: data[0].cantidad_producto }
    );
  }

  limpiarFormNuevo() {
    this.catalogoSrv.siguienteCodigo('producto')
      .subscribe(
        data => this.frmProducto.reset({ id_producto: data, funcion: '' })
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
    this.productos.length=0;
    //num registros
    this.filtrar.numRegs('producto',this.objFiltro).then(
      snapshot=>{
        snapshot.subscribe(
          data=>this.paginacion.calcularPiecera(data)
        )
      }
    )
    //ejecutar
    this.filtrar.ejecutar('producto',this.objFiltro,this.paginacion.actual, this.paginacion.limite)
      .then(snapshot => {
        snapshot.subscribe(
          data => {
            for (const prop in data) {
              if (prop) {
                const dato = {
                  id_producto: data[prop].id_producto,
                  nombre_producto: data[prop].nombre_producto,
                  cantidad_producto: data[prop].cantidad_producto
                }
                this.productos.push(dato);
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
    const columna= [['IdProducto', 'Nombre producto', 'Cantidad']];
    const fila = [];
    this.filtrar.ejecutar('producto',this.objFiltro, 1, this.paginacion.numRegs)
      .then(snapshot => {
        snapshot.subscribe(
          data => {
            for (const prop in data) {
              if (prop) {
                const dato = [
                   data[prop].id_producto,
                   data[prop].nombre_producto,
                   data[prop].cantidad_producto
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
    this.catalogoSrv.setServidor('producto');
    this.filtrar.setServidor('producto');
    this.paginacion.iniciar(10);
    this.filtro();
    //this.refrescar(this.paginacion.actual, this.paginacion.limite)
  }
}
