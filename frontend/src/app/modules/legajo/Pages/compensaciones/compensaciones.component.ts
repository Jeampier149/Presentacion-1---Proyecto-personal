import { Component, ElementRef, ViewChild } from '@angular/core';
import { rutaBreadCrumb } from '@shared/components/breadcrumb/breadcrumb.component';
import { CabeceraTabla } from '@shared/components/tabla/tabla.component';
import { finalize } from 'rxjs';
import { errorAlerta, successAlerta } from '@shared/utils';
import { Session } from '@store/session.actions';
import { SessionSelectors } from '@store/index.session';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ModalNuevaCompensacionComponent } from '@modules/legajo/components/modal-nueva-compensacion/modal-nueva-compensacion.component';
import { CompensacionService } from '@services/compensacion/compensacion.service';
import { ModalEditarCompensacionComponent } from '@modules/legajo/components/modal-editar-compensacion/modal-editar-compensacion.component';
import { ModalVerCompensacionComponent } from '@modules/legajo/components/modal-ver-compensacion/modal-ver-compensacion.component';

@Component({
    selector: 'app-compensaciones',
    templateUrl: './compensaciones.component.html',
    styleUrl: './compensaciones.component.scss',
})
export class CompensacionesComponent {
    @ViewChild(ModalNuevaCompensacionComponent) modalNuevaComp?: any;
    @ViewChild(ModalEditarCompensacionComponent) modalEditarComp?: any;
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
            estilo: 'width: 50px; min-width: 50px;',
            clase: 'text-center',
        },
        {
            nombre: 'Tip. Compensacion',
            estilo: 'width: 50px; min-width: 50px;',
            clase: 'text-center',
        },
        {
            nombre: 'Documento',
            estilo: 'width: 220px; min-width: 220px',
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
    

        //{nombre: 'Estado', estilo: 'width: 140px; min-width: 40px', clase: 'text-center'}
    ];

    constructor(
        private CompensacionService$: CompensacionService,
        private store: Store<Session>
    ) {
        this.obtenerPermisos();
        this.listarEmpleados();
        this.listarCompensaciones();
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
           
           dni: this.filtroDni,
           tipo: this.filtroTipo,        
           documento: this.filtroDocumento,
           asunto: this.filtroAsunto,
           fecha: this.filtroFecha,
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
        this.filtroDni = '';
        this.filtroDocumento = '';
        this.filtroAsunto = '';
        this.filtroFecha = '';
        this.pagina = 1;
        this.listarCompensaciones();
        this.inpFocus.nativeElement.focus();
    }
    listarEmpleados() {
        this.loading = true;
        this.CompensacionService$.listarSelectEmpleado()
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
       this.listarCompensaciones()
    }
    

    descargarArchivo(ruta: string) {
        this.loading = true;
        this.CompensacionService$.verArchivo(ruta)
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

    nuevoDocumento() {
        this.modalNuevaComp?.openModal();
    }
    editarDocumento(id:any){
        this.modalEditarComp?.openModal(id);
    }


       
    
}
