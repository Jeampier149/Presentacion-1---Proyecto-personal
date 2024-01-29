import { ModalDatosComponent } from './../../components/modalsEmpleado/modal-datos/modal-datos.component';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {rutaBreadCrumb} from "@shared/components/breadcrumb/breadcrumb.component";
import {CabeceraTabla} from "@shared/components/tabla/tabla.component";
import {DatoGeneralesService} from "@services/legajo/datos-generales.service";
import {finalize} from "rxjs";
import { ListarPersonalParams} from "@interfaces/legajo/listar-datos-g";
import {errorAlerta, successAlerta} from "@shared/utils";
import {Session} from "@store/session.actions";
import {SessionSelectors} from "@store/index.session";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrl: './informacion.component.scss'
})
export class InformacionComponent {
@ViewChild(ModalDatosComponent) modalDatos?: any
@ViewChild('inpFocus') inpFocus!: ElementRef<HTMLInputElement>;
  rutas: rutaBreadCrumb[] = [{nombre: 'Legajo'}];
  accesos: any[] | undefined = [];
  longitud: number = 15;
  pagina: number = 1;
  loading: boolean = false;
  datos: any[] = [];
  agregable: boolean = false;


  filtroServicioEquipo: string = '';
  filtroDocumento: string = '';
  filtroUnidadOrganica: string = '';
  filtroAppPaterno: string = '';
  filtroAppMaterno: string = '';
  filtroNomPrimer: string = '';
  filtroNomSegundo: string = '';



  longitudes: number[] = [15, 20, 50, 100];

  cabeceras: CabeceraTabla[] = [
      {nombre: 'Acciones', estilo: 'width: 80px;min-width: 80px', clase: 'text-center'},
      {nombre: 'Documento', estilo: 'width: 120px; min-width: 120px', clase: 'text-center'},
      {nombre: 'Tipo. Doc', estilo: 'width: 100px; min-width: 100px;', clase: 'text-center'},
      {nombre: 'Apellido Pat.', estilo: 'width: 120px; min-width: 110px'},
      {nombre: 'Apellido Mat.', estilo: 'width: 120px; min-width: 110px'},
      {nombre: 'Primer Nom.', estilo: 'width: 120px; min-width: 110px'},
      {nombre: 'Segundo Nom.', estilo: 'width: 120px; min-width: 110px'},
      {nombre: 'Unidad Organica', estilo: 'width: 140px; min-width: 140px', clase: 'text-center'},
      {nombre: 'Servicio/Equipo', estilo: 'width: 140px; min-width: 40px', clase: 'text-center'},

  ]

  constructor(private DatoGeneralesService$: DatoGeneralesService,
              private store: Store<Session>) {
      this.listarEmpleados();
      //this.obtenerPermisos();
  }

  ngAfterViewInit() {
      this.inpFocus.nativeElement.focus();
  }

obtenerPermisos() {
     this.store.select(SessionSelectors.session).subscribe((e) => {
          this.accesos = e.accesos;
      });
  }

  listarEmpleados() {
      this.loading = true;
      let datos: ListarPersonalParams = {
          appMat: this.filtroAppMaterno,
          appPat: this.filtroAppPaterno,
          documento: this.filtroDocumento,
          longitud: this.longitud,
          unidadOrganica: this.filtroUnidadOrganica,
          equipoServicio: this.filtroServicioEquipo,
          nomPri: this.filtroNomPrimer,
          nomSec: this.filtroNomSegundo,
          pagina: this.pagina
      }

      this.DatoGeneralesService$.listarEmpleado(datos)
          .pipe(
              finalize(() => {
                  this.loading = false;
              })
          )
          .subscribe(({estado, mensaje, datos}) => {
              if (estado) {
                  datos.length > 0 ? this.agregable = false : this.agregable = true;
                  this.datos = datos;
              } else {
                  errorAlerta('Error', mensaje).then();
              }
          });
  }

  filtrarEmpleado() {
      this.pagina = 1;
      this.listarEmpleados();
  }

  cambioPagina(pagina: number) {
      this.pagina = pagina;
      this.listarEmpleados();
  }

  limpiarCampos() {
      this.filtroUnidadOrganica = ''
      this.filtroDocumento = ''
      this.filtroNomPrimer = ''
      this.filtroNomSegundo = '';
      this.filtroAppPaterno = '';
      this.filtroAppMaterno = '';
      this.filtroServicioEquipo = '';
      this.pagina = 1;
      this.listarEmpleados();
      this.inpFocus.nativeElement.focus();
  }


  //nuevaHistoria() {
  //    this.modalHC?.openModal(1);
  //}



verDatos(id: string) {

    this.modalDatos?.openModal(2, id);
  }

  editarEmpleado(codigo:string){

  }


}
