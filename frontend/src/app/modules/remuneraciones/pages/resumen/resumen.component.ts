import { Component, ElementRef, ViewChild } from '@angular/core';
import { rutaBreadCrumb } from '@shared/components/breadcrumb/breadcrumb.component';
import { CabeceraTabla } from '@shared/components/tabla/tabla.component';
import { finalize } from 'rxjs';
import { errorAlerta, successAlerta } from '@shared/utils';
import { Session } from '@store/session.actions';
import { SessionSelectors } from '@store/index.session';
import { Store } from '@ngrx/store';
import { CompensacionService } from '@services/legajo/compensacion.service';
import { ModalVerCompensacionComponent } from '@modules/legajo/components/modal-ver-compensacion/modal-ver-compensacion.component';
import { ModalExportarComponent } from '@modules/legajo/components/modal-exportar/modal-exportar.component';
import { ModalResumenComponent } from '@modules/remuneraciones/components/modal-resumen/modal-resumen.component';



@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.scss'
})
export class ResumenComponent {
  @ViewChild(ModalResumenComponent) modalResumen?: any;
  @ViewChild(ModalVerCompensacionComponent) modalVerComp?: any;
  @ViewChild(ModalExportarComponent) modalExporta?: any;
  @ViewChild('inpFocus') inpFocus!: ElementRef<HTMLInputElement>;
  
  public rutas: rutaBreadCrumb[] = [{ nombre: 'Legajo' }];
  public accesos: any[] | undefined = [];
  public longitud: number = 15;
  public pagina: number = 1;
  public loading: boolean = false;
  public datos: any[] = [];
  public agregable: boolean = false;
  public filtroYear: string = '';
  public filtroMes: string = '';
  public filtroUsuario: string = '';
  public archivoCmp:any

  public longitudes: number[] = [15, 20, 50, 100];

  cabeceras: CabeceraTabla[] = [
      {
          nombre: 'Acciones',
          estilo: 'width: 115px;min-width: 110px',
          clase: 'text-center',
      },
      {
          nombre: 'Año',
          estilo: 'width: 50px; min-width: 50px;',
          clase: 'text-center',
      },
      {
          nombre: 'Mes',
          estilo: 'width: 100px; min-width: 100px;',
          clase: 'text-center',
      },
    
      {
          nombre: 'Usuario',
          estilo: 'width: 150px; min-width: 150px',
          clase: 'text-center',
      },
      {
        nombre: 'Fecha de Creación',
        estilo: 'width: 150px; min-width: 150px',
        clase: 'text-center',
    }
  

  ];

  constructor(
      private CompensacionService$: CompensacionService,
      private store: Store<Session>
  ) {
      this.obtenerPermisos();
     // this.listarEmpleados();
      //this.listarCompensaciones();
  }

  ngAfterViewInit() {
      this.inpFocus.nativeElement.focus();
  }

  obtenerPermisos() {
      this.store.select(SessionSelectors.session).subscribe((e) => {
          this.accesos = e.accesos;
      });
  }
  listarCompensaciones() {
     this.loading = true;
     let datos:any = {
         
         year: this.filtroYear,
         mes: this.filtroMes,        
         usuario: this.filtroUsuario,
         pagina: this.pagina,
         longitud: this.longitud,

     }
   this.CompensacionService$.listarCompensaciones(datos)
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
      this.listarCompensaciones();
  }

  cambioPagina(pagina: number) {
      this.pagina = pagina;
      this.listarCompensaciones();
  }

  limpiarCampos() {
      this.filtroYear = '';
      this.filtroMes = '';
      this.filtroUsuario = '';
      this.pagina = 1;
      this.listarCompensaciones();
      this.inpFocus.nativeElement.focus();
  }

  descargarArchivo(ruta: string) {
      this.loading = true;
      console.log(ruta)
      this.CompensacionService$.verArchivo(ruta)
          .pipe(
              finalize(() => {
                this.loading = false;
              })
          )
          .subscribe((data) => {
              
              this.archivoCmp = URL.createObjectURL(data);
              console.log(this.archivoCmp)
              this.modalVerComp?.openModal(this.archivoCmp);
          }
          );
  }
  exportarCarpeta(){
      this.modalExporta.openModal('');    
  }

  async nuevoResumen() {
     let response= await this.modalResumen.openModal(1);    
     if(response){
      //  this.listarCompensaciones()
       }        
  }
  async editarDocumento(id:any){
      let response= await this.modalResumen.openModal(2,id);   
      if(response){
      /// this.listarCompensaciones()
      }

  // if(response){
    //  this.listarCompensaciones()
  // }

  }
}
