import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TablaComponent } from '@shared/components/tabla/tabla.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { PaginacionComponent } from '@shared/components/paginacion/paginacion.component';
import { LegajoRoutingModule } from './legajo-routing.module';
import { InformacionComponent } from './Pages/informacion/informacion.component';
import {ReactiveFormsModule} from "@angular/forms";
import { RegistrarEmpleadoComponent } from './Pages/registrar-empleado/registrar-empleado.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  declarations: [
    InformacionComponent,
    RegistrarEmpleadoComponent,

  
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
    NgxDropzoneModule
  ]
})
export class LegajoModule { }
