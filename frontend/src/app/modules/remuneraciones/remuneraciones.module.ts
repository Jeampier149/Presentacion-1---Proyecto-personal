import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TablaComponent } from '@shared/components/tabla/tabla.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { PaginacionComponent } from '@shared/components/paginacion/paginacion.component';
import { RemuneracionesRoutingModule } from './remuneraciones-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import { ResumenComponent } from './pages/resumen/resumen.component';
import { EjecucionGastosComponent } from './pages/ejecucion-gastos/ejecucion-gastos.component';



@NgModule({
  declarations: [
    ResumenComponent,
    EjecucionGastosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BreadcrumbComponent,
    TablaComponent,
    LoadingComponent,
    PaginacionComponent,
    RemuneracionesRoutingModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    NgSelectModule,
    FormsModule
  ]
})
export class RemuneracionesModule { }
