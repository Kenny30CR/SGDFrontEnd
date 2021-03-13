import { Component, OnInit } from '@angular/core';
import { CatalogoService } from '../shared/services/catalogo.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PaginacionService } from '../shared/services/paginacion.service';
import { FiltradoService } from '../shared/services/filtrado.service';
import { ImprimirService } from '../shared/services/imprimir.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
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

export class ClienteComponent implements OnInit {

  clientes = [];
  cliente = {
    cedula_cliente: '',
    nombre_cliente: '',
    apellidos_cliente: '',
    sexo_cliente:'',
    telefono_cliente:0,
    direccion_cliente:''

  }
  frmCliente: FormGroup;
  tituloForm;
  guardado = false;
  confirmado = false;
  filtrarVisible=false;
  objFiltro={};
  numregs;
  constructor(private catalogoSrv: CatalogoService, private fb: FormBuilder, public paginacion: PaginacionService, private filtrar: FiltradoService, private srvImprimir: ImprimirService, private router: Router) {

    this.frmCliente = this.fb.group({
      cedula_cliente: [''],
      nombre_cliente: ['', [Validators.required]],
      apellidos_cliente: ['', [Validators.required]],
      sexo_cliente:['',[Validators.required]],
      telefono_cliente:['',[Validators.required]],
      direccion_cliente:['',[Validators.required]],
      funcion: ['']
    })

  }

  onSubmit() {

    const datos = {
      cedula_cliente: this.frmCliente.value.cedula_cliente,
      nombre_cliente: this.frmCliente.value.nombre_cliente,
      apellidos_cliente: this.frmCliente.value.apellidos_cliente,
      sexo_cliente: this.frmCliente.value.sexo_cliente,
      telefono_cliente: this.frmCliente.value.telefono_cliente,
      direccion_cliente: this.frmCliente.value.direccion_cliente,
    }

    if (this.frmCliente.value.funcion === '') {
      this.catalogoSrv.guardar(datos)
        .subscribe(
          data => {
            this.guardado = data[0] != 0;
            this.filtro();
            this.limpiarFormNuevo();
            this.ocultarMensajeTiempo();
          },
          error => {
            if (error.status != 409) {
              this.frmCliente.controls.nombre_cliente.setErrors({ duplicado: true });
            }
          }
        )
    } else {
      this.catalogoSrv.guardar(datos, this.frmCliente.value.funcion)
        .subscribe(
          data => {
            this.guardado = data[0] != 1;
            this.filtro();
            this.ocultarMensajeTiempo();
          },
          error => {
            if (error.status == 409) {
              this.frmCliente.controls.nombre_cliente.setErrors({ duplicado: true });
            }
          }
        )
    }
  }

  nuevoCliente() {
    this.tituloForm = 'Nuevo Cliente';
    this.frmCliente.controls.cedula_cliente.enable();
    this.catalogoSrv.siguienteCodigo('cliente').subscribe(
      data => this.frmCliente.reset({ cedula_cliente: data, funcion: '' })
    );
  }

  editarCliente(cedula_cliente) {
    this.tituloForm = 'Editar Cliente';
    this.frmCliente.controls.cedula_cliente.disable();
    this.catalogoSrv.buscarPorCodigo(cedula_cliente).subscribe(
      data => this.frmCliente.reset({ cedula_cliente: data[0].cedula_cliente, nombre_cliente: data[0].nombre_cliente, apellidos_cliente: data[0].apellidos_cliente, sexo_cliente: data[0].sexo_cliente, telefono_cliente: data[0].telefono_cliente, direccion_cliente: data[0].direccion_cliente, funcion: data[0].cedula_cliente })
      
    );
  }

  eliminar() {
    this.catalogoSrv.eliminar(this.cliente.cedula_cliente).subscribe(
      data => {
        this.filtro();
        this.confirmado = true;
      }
    );
  }

  confirmarEliminar(id) {
    this.confirmado = false;
    this.tituloForm = 'Eliminar Cliente';
    this.catalogoSrv.buscarPorCodigo(id).subscribe(
      data => this.cliente = { cedula_cliente: id, nombre_cliente: data[0].nombre_cliente, apellidos_cliente: data[0].apellidos_cliente, sexo_cliente: data[0].sexo_cliente, telefono_cliente: data[0].telefono_cliente, direccion_cliente: data[0].direccion_cliente }
    );
  }

  limpiarFormNuevo() {
    this.catalogoSrv.siguienteCodigo('cliente')
      .subscribe(
        data => this.frmCliente.reset({ cedula_cliente: data, funcion: '' })
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
    this.clientes.length=0;
    //num registros
    this.filtrar.numRegs('cliente',this.objFiltro).then(
      snapshot=>{
        snapshot.subscribe(
          data=>this.paginacion.calcularPiecera(data)
        )
      }
    )
    //ejecutar
    this.filtrar.ejecutar('cliente',this.objFiltro,this.paginacion.actual, this.paginacion.limite)
      .then(snapshot => {
        snapshot.subscribe(
          data => {
            for (const prop in data) {
              if (prop) {
                const dato = {
                  cedula_cliente: data[prop].cedula_cliente,
                  nombre_cliente: data[prop].nombre_cliente,
                  apellidos_cliente: data[prop].apellidos_cliente,
                  sexo_cliente: data[prop].sexo_cliente,
                  telefono_cliente: data[prop].telefono_cliente,
                  direccion_cliente: data[prop].direccion_cliente
                }
                this.clientes.push(dato);
              }
            }
          }
        )
      });
  }

  cambiarLimite(e){
    this.paginacion.iniciar(10);
    this.paginacion.cambioLimite(e.target.value);
    this.paginacion.calcularPiecera(this.numregs);
    this.filtro();
  }

  cambiarPagina(pag){
    this.paginacion.cambiarPagina(pag);
    this.filtro();
  }

  onCerrar(){
    this.router.navigate(['/']);
  }

  onImprimir(){
    const columna= [['Cedula', 'Nombre', 'Apellidos', 'Sexo', 'Telefono', 'Direccion']];
    const fila = [];
    this.filtrar.ejecutar('cliente',this.objFiltro, 1, this.paginacion.numRegs)
      .then(snapshot => {
        snapshot.subscribe(
          data => {
            for (const prop in data) {
              if (prop) {
                const dato = [
                   data[prop].cedula_cliente,
                   data[prop].nombre_cliente,
                   data[prop].apellidos_cliente,
                   data[prop].sexo_cliente,
                   data[prop].telefono_cliente,
                   data[prop].direccion_cliente
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
    this.catalogoSrv.setServidor('cliente');
    this.filtrar.setServidor('cliente');
    this.paginacion.iniciar(10);
    this.filtro();
    //this.refrescar(this.paginacion.actual, this.paginacion.limite)
  }
}
