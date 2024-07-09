import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TablaComponent } from '@shared/components/tabla/tabla.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { PaginacionComponent } from '@shared/components/paginacion/paginacion.component';
import { LegajoRoutingModule } from './legajo-routing.module';
import { InformacionComponent } from './Pages/informacion/informacion.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RegistrarEmpleadoComponent } from './Pages/registrar-empleado/registrar-empleado.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ModalVerComponent } from './components/modal-ver/modal-ver.component';
import { ModalVerArchivoComponent } from './components/modal-ver-archivo/modal-ver-archivo.component';
import { EditarEmpleadoComponent } from './Pages/editar-empleado/editar-empleado.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalSituacionLaboralComponent } from './components/modal-situacion-laboral/modal-situacion-laboral.component';
import { ModalDarTerminoComponent } from './components/modal-dar-termino/modal-dar-termino.component';
import { ModalTomarFotoComponent } from './components/modal-tomar-foto/modal-tomar-foto.component';
import { CompensacionesComponent } from './Pages/compensaciones/compensaciones.component';
import { ModalNuevaCompensacionComponent } from './components/modal-nueva-compensacion/modal-nueva-compensacion.component';
import { ModalEditarCompensacionComponent } from './components/modal-editar-compensacion/modal-editar-compensacion.component';
import { ModalVerCompensacionComponent } from './components/modal-ver-compensacion/modal-ver-compensacion.component';
import { EvaluacionComponent } from './Pages/evaluacion/evaluacion.component';
import { ModalEvaluacionComponent } from './components/modal-evaluacion/modal-evaluacion.component';
import { ReconocimientoSancionComponent } from './Pages/reconocimiento-sancion/reconocimiento-sancion.component';
import { ModalReconocimientoSancionComponent } from './components/modal-reconocimiento-sancion/modal-reconocimiento-sancion.component';




@NgModule({
  declarations: [
    InformacionComponent,
    RegistrarEmpleadoComponent,
    ModalVerComponent, 
    ModalVerArchivoComponent,
    EditarEmpleadoComponent,
    ModalSituacionLaboralComponent,
    ModalDarTerminoComponent,
    ModalTomarFotoComponent,
    ModalNuevaCompensacionComponent,
    ModalEditarCompensacionComponent,
    ModalVerCompensacionComponent,
    CompensacionesComponent,
    EvaluacionComponent,
    ModalEvaluacionComponent,
    ReconocimientoSancionComponent,
    ModalReconocimientoSancionComponent
    
  
  ],
  imports: [
    CommonModule,
    SharedModule,
    BreadcrumbComponent,
    TablaComponent,
    LoadingComponent,
    PaginacionComponent,
    LegajoRoutingModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    NgSelectModule,
    FormsModule
  ]
})
export class LegajoModule { }
