import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TablaComponent } from '@shared/components/tabla/tabla.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { PaginacionComponent } from '@shared/components/paginacion/paginacion.component';
import { LegajoRoutingModule } from './legajo-routing.module';
import { InformacionComponent } from './Pages/informacion/informacion.component';
import { ModalDatosComponent } from './components/modalsEmpleado/modal-datos/modal-datos.component';
import { TabDatosPersonalesComponent } from './components/tabs-informacion/tab-datos-personales/tab-datos-personales.component';
import { TabDatosFamiliaresComponent } from './components/tabs-informacion/tab-datos-familiares/tab-datos-familiares.component';
import { TabDatosProfesionalesComponent } from './components/tabs-informacion/tab-datos-profesionales/tab-datos-profesionales.component';
import {ReactiveFormsModule} from "@angular/forms";
import { RegistrarEmpleadoComponent } from './Pages/registrar-empleado/registrar-empleado.component';


@NgModule({
  declarations: [
    InformacionComponent,
    RegistrarEmpleadoComponent,
    ModalDatosComponent,
    TabDatosPersonalesComponent,
    TabDatosFamiliaresComponent,
    TabDatosProfesionalesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    BreadcrumbComponent,
    TablaComponent,
    LoadingComponent,
    PaginacionComponent,
    LegajoRoutingModule,
    ReactiveFormsModule
  ]
})
export class LegajoModule { }
