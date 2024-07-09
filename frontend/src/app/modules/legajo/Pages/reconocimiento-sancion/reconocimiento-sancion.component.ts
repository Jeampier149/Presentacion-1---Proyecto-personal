import { Component, ElementRef, ViewChild } from '@angular/core';
import { rutaBreadCrumb } from '@shared/components/breadcrumb/breadcrumb.component';
import { CabeceraTabla } from '@shared/components/tabla/tabla.component';
import { finalize } from 'rxjs';
import { errorAlerta, successAlerta } from '@shared/utils';
import { Session } from '@store/session.actions';
import { SessionSelectors } from '@store/index.session';
import { Store } from '@ngrx/store';
import { ModalVerCompensacionComponent } from '@modules/legajo/components/modal-ver-compensacion/modal-ver-compensacion.component';
import { ModalEvaluacionComponent } from '@modules/legajo/components/modal-evaluacion/modal-evaluacion.component';
import { RecocimientoSancionService } from '@services/legajo/reconocimiento-sancion.service';
import { ModalReconocimientoSancionComponent } from '@modules/legajo/components/modal-reconocimiento-sancion/modal-reconocimiento-sancion.component';
import { ModalVerArchivoComponent } from '@modules/legajo/components/modal-ver-archivo/modal-ver-archivo.component';

@Component({
  selector: 'app-reconocimiento-sancion',
  templateUrl: './reconocimiento-sancion.component.html',
  styleUrl: './reconocimiento-sancion.component.scss'
})
export class ReconocimientoSancionComponent {
  @ViewChild(ModalReconocimientoSancionComponent) modalEva?: any;
  @ViewChild(ModalVerCompensacionComponent) modalVerComp?: any;
  @ViewChild('inpFocus') inpFocus!: ElementRef<HTMLInputElement>;
  
  public rutas: rutaBreadCrumb[] = [{ nombre: 'Legajo' }];
  public accesos: any[] | undefined = [];
  public longitud: number = 15;
  public pagina: number = 1;
  public loading: boolean = false;
  public datos: any[] = [];
  public emp:any[]=[];
  public agregable: boolean = false;
  public filtroEstado: string = '';
  public filtroTipo: string = '';
  public filtroDn: string = '';
  public filtroDocumento: string = '';
  public filtroAsunto: string = '';
  public filtroFecha: string = '';
  public filtroDni: string = '';
  public archivoCmp:any

  public longitudes: number[] = [15, 20, 50, 100];

  cabeceras: CabeceraTabla[] = [
      {
          nombre: 'Acciones',
          estilo: 'width: 115px;min-width: 110px',
          clase: 'text-center',
      },
      {
          nombre: 'N° DNI',
          estilo: 'width: 100px; min-width: 100px;',
          clase: 'text-center',
      },
      {
          nombre: 'Documento',
          estilo: 'width: 150px; min-width: 115px',
          clase: 'text-center',
      },
      {
          nombre: 'Tip. Documento',
          estilo: 'width: 200px; min-width: 50px;',
          clase: 'text-center',
      },
     
      {
          nombre: 'Asunto',
          estilo: 'width: 270px; min-width: 270px',
          clase: 'text-center',
      },
      {
          nombre: 'Fecha Doc ',
          estilo: 'width: 100px; min-width: 100px',
          clase: 'text-center',
      },
  

  ];

  constructor(
      private ReconocimientoSancioneService$: RecocimientoSancionService,
      private store: Store<Session>
  ) {
      this.obtenerPermisos();
      this.listarEmpleados();
      this.listarReconocimientoSanciones();
  }

  ngAfterViewInit() {
      this.inpFocus.nativeElement.focus();
  }

  obtenerPermisos() {
      this.store.select(SessionSelectors.session).subscribe((e) => {
          this.accesos = e.accesos;
      });
  }
  listarReconocimientoSanciones() {
     this.loading = true;
     let datos:any = {         
         dni: this.filtroDni,
         tipo: this.filtroTipo,        
         documento: this.filtroDocumento,
         asunto: this.filtroAsunto,
         fecha: this.filtroFecha,
         pagina: this.pagina,
         longitud: this.longitud,

     }
   this.ReconocimientoSancioneService$.listarReconocimientoSanciones(datos)
         .pipe(
                finalize(() => {
                 this.loading = false;
             })
         )
         .subscribe(({estado, mensaje, datos}) => {
             if (estado) {          
               this.datos = datos;
             } else {
                 errorAlerta('Error', mensaje).then();
             }
         });
  }

  filtrarEmpleado() {
      this.pagina = 1;
      this.listarReconocimientoSanciones();
  }

  cambioPagina(pagina: number) {
      this.pagina = pagina;
      this.listarReconocimientoSanciones();
  }

  limpiarCampos() {
      this.filtroDni = '';
      this.filtroDocumento = '';
      this.filtroAsunto = '';
      this.filtroFecha = '';
      this.pagina = 1;
      this.listarReconocimientoSanciones();
      this.inpFocus.nativeElement.focus();
  }
  listarEmpleados() {
      this.loading = true;
      this.ReconocimientoSancioneService$.listarSelectEmpleado()
          .pipe(
              finalize(() => {
                  this.loading = false;
              })
          )
          .subscribe(({ estado, mensaje, datos }) => {
              if (estado) {
                
                  datos.length > 0 ? (this.agregable = false) : (this.agregable = true);
                  this.emp = datos;
              } else {
                  errorAlerta('Error', mensaje).then();
              }
          });
  }
  changeEmp(){
     this.listarReconocimientoSanciones()
  }
  

  descargarArchivo(ruta: string) {
      this.loading = true;
      this.ReconocimientoSancioneService$.verArchivo(ruta)
          .pipe(
              finalize(() => {
                this.loading = false;
              })
          )
          .subscribe((data) => {
              this.archivoCmp = URL.createObjectURL(data);
              this.modalVerComp?.openModal(this.archivoCmp);
          }
          );
  }

 async nuevoDocumento() {
      let respuesta = await  this.modalEva?.openModal(1);
      if (respuesta) {
         this.listarReconocimientoSanciones()
      }
    
  }
  async editarDocumento(id:any) {
      let respuesta = await  this.modalEva?.openModal(2,id);
      if (respuesta) {
         this.listarReconocimientoSanciones()
      }
    
  }
}
