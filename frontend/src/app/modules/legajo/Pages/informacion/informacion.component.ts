
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
import { ModalVerComponent } from '@modules/legajo/components/modal-ver/modal-ver.component';
import { Router } from '@angular/router';
import { ModalSituacionLaboralComponent } from '@modules/legajo/components/modal-situacion-laboral/modal-situacion-laboral.component';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrl: './informacion.component.scss'
})
export class InformacionComponent {
@ViewChild(ModalSituacionLaboralComponent) modalSituacion?: any    
@ViewChild(ModalVerComponent) modalDatos?: any
@ViewChild('inpFocus') inpFocus!: ElementRef<HTMLInputElement>;
  rutas: rutaBreadCrumb[] = [{nombre: 'Legajo'}];
  accesos: any[] | undefined = [];
  longitud: number = 15;
  pagina: number = 1;
  loading: boolean = false;
  datos: any[] = [];
  agregable: boolean = false;

  filtroEstado: string = '';
  filtroServicioEquipo: string = '';
  filtroDocumento: string = '';
  filtroUnidadOrganica: string = '';
  filtroAppPaterno: string = '';
  filtroAppMaterno: string = '';
  filtroNombres: string = '';

  longitudes: number[] = [15, 20, 50, 100];

  cabeceras: CabeceraTabla[] = [
      {nombre: 'Acciones', estilo: 'width: 115px;min-width: 110px', clase: 'text-center'},
      {nombre: 'Documento', estilo: 'width: 120px; min-width: 120px', clase: 'text-center'},
      {nombre: 'Tipo. Doc', estilo: 'width: 100px; min-width: 100px;', clase: 'text-center'},
      {nombre: 'Apellido Pat.', estilo: 'width: 120px; min-width: 110px'},
      {nombre: 'Apellido Mat.', estilo: 'width: 120px; min-width: 110px'},
      {nombre: 'Nombres.', estilo: 'width: 120px; min-width: 110px'},
      {nombre: 'Unidad Organica', estilo: 'width: 140px; min-width: 140px', clase: 'text-center'},
      {nombre: 'Servicio/Equipo', estilo: 'width: 140px; min-width: 40px', clase: 'text-center'},
      {nombre: 'Estado', estilo: 'width: 140px; min-width: 40px', clase: 'text-center'}

  ]

  constructor(private DatoGeneralesService$: DatoGeneralesService,
              private store: Store<Session>,private router:Router) {
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
          nombres: this.filtroNombres,
          pagina: this.pagina,
          estado:this.filtroEstado
      }

      this.DatoGeneralesService$.listarEmpleado(datos)
          .pipe(
              finalize(() => {
                  this.loading = false;
              })
          )
          .subscribe(({estado, mensaje, datos}) => {
              if (estado) {
                console.log(datos)
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
      this.filtroNombres = ''
      this.filtroAppPaterno = '';
      this.filtroAppMaterno = '';
      this.filtroServicioEquipo = '';
      this.filtroEstado = '';
      this.pagina = 1;
      this.listarEmpleados();
      this.inpFocus.nativeElement.focus();
  }



  verDatos(numeroDoc :string) {
    this.modalDatos?.openModal(numeroDoc);

  }
  editarEmpleado(numeroDoc:string){
   this.router.navigate(['/legajo/editarEmpleado',numeroDoc])
  }
 
  situacionLaboral(numeroDoc:string){
    this.modalSituacion?.openModal(numeroDoc);
  }

}
