import { Component, OnInit } from '@angular/core';
import { CatalogoService } from '../shared/services/catalogo.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PaginacionService } from '../shared/services/paginacion.service';
import { FiltradoService } from '../shared/services/filtrado.service';
import { ImprimirService } from '../shared/services/imprimir.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
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


export class UsuarioComponent implements OnInit {

  usuarios = [];
  usuario = {
    id: 0,
    nombre: '',
    rol: 0
  }
  frmUsuario: FormGroup;
  tituloForm;
  guardado = false;
  confirmado = false;
  filtrarVisible=false;
  objFiltro={};
  numregs;
  constructor(private catalogoSrv: CatalogoService, private fb: FormBuilder, public paginacion: PaginacionService, private filtrar: FiltradoService, private srvImprimir: ImprimirService, private router: Router, private authSrv: AuthService) {

    this.frmUsuario = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(5)]],
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      rol: [''],
      funcion: ['']
    })

  }

  onSubmit() {

    const datos = {
      id: this.frmUsuario.value.id,
      nombre: this.frmUsuario.value.nombre,
      rol: this.frmUsuario.value.rol
    }

    if (this.frmUsuario.value.funcion === '') {
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
              this.frmUsuario.controls.id.setErrors({ duplicado: true });
            }
          }
        )
    } else {
      this.catalogoSrv.guardar(datos, this.frmUsuario.value.funcion)
        .subscribe(
          data => {
            this.guardado = data[0] != 1;
            this.filtro();
            //this.refrescar(this.paginacion.actual, this.paginacion.limite);//Se esta refrescando la tabla
            this.ocultarMensajeTiempo();
          },
          error => {
            if (error.status == 409) {
              this.frmUsuario.controls.id.setErrors({ duplicado: true });
            }
          }
        )
    }
  }

  nuevoUsuario() {
    this.tituloForm = 'Nuevo Usuario';
    this.frmUsuario.controls.id.enable();
    this.limpiarFormNuevo();
  }

  editarUsuario(id) {
    this.tituloForm = 'Editar Usuario';
    this.frmUsuario.controls.id.disable();
    this.catalogoSrv.buscarPorCodigo(id).subscribe(
      data => this.frmUsuario.reset({ id: data[0].id, nombre: data[0].nombre, rol: data[0].rol, funcion: data[0].id })
      //data=>console.log(data)
    );
  }

  eliminar() {
    this.catalogoSrv.eliminar(this.usuario.id).subscribe(
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
    this.tituloForm = 'Eliminar Usuario';
    this.catalogoSrv.buscarPorCodigo(id).subscribe(
      data => this.usuario = { id: id, nombre: data[0].nombre, rol: data[0].rol}
    );
  }

  limpiarFormNuevo() {
    this.frmUsuario.reset({rol:3, function:''});
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
    this.usuarios.length=0;
    //num registros
    this.filtrar.numRegs('usuario',this.objFiltro).then(
      snapshot=>{
        snapshot.subscribe(
          data=>this.paginacion.calcularPiecera(data)
        )
      }
    )
    //ejecutar
    this.filtrar.ejecutar('usuario',this.objFiltro,this.paginacion.actual, this.paginacion.limite)
      .then(snapshot => {
        snapshot.subscribe(
          data => {
            for (const prop in data) {
              if (prop) {
                const dato = {
                  id: data[prop].id,
                  nombre: data[prop].nombre,
                  rol: data[prop].rol
                }
                this.usuarios.push(dato);
              }
            }
          }
        )
      });
  }

  /*refrescar(pag, lim) {
    this.usuarios.length = 0;
    this.catalogoSrv.mostrarTodo(pag, lim)
      .then(snapshot => {
        snapshot.subscribe(
          data => {
            for (const prop in data) {
              if (prop) {
                const dato = {
                  id: data[prop].id,
                  nombre: data[prop].nombre,
                  rol: data[prop].rol,
                }
                this.usuarios.push(dato);
              }
            }
          }
        )
      });
  }*/

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

  onResetearPassw(id){
    if(confirm('Seguro que desea resetear esta contraseña?')){
    this.authSrv.resetPass(id)
    .subscribe(
      ()=>alert('La contraseña se ha reseteado')
    )
    }
  }

  onCerrar(){
    this.router.navigate(['/']);
  }

  onImprimir(){
    const columna= [['Id', 'Nombre Usuario', 'Rol']];
    const fila = [];
    this.filtrar.ejecutar('usuario',this.objFiltro, 1, this.paginacion.numRegs)
      .then(snapshot => {
        snapshot.subscribe(
          data => {
            for (const prop in data) {
              if (prop) {
                const dato = [
                   data[prop].id,
                   data[prop].nombre,
                   data[prop].rol
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
    this.catalogoSrv.setServidor('usuario');
    this.filtrar.setServidor('usuario');
    this.paginacion.iniciar(10);
    this.filtro();
    //this.refrescar(this.paginacion.actual, this.paginacion.limite)
  }

}
