import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { InformacionComponent } from './Pages/informacion/informacion.component';
import { RegistrarEmpleadoComponent } from './Pages/registrar-empleado/registrar-empleado.component';
import { EditarEmpleadoComponent } from './Pages/editar-empleado/editar-empleado.component';
import { CompensacionesComponent } from './Pages/compensaciones/compensaciones.component';
import { EvaluacionComponent } from './Pages/evaluacion/evaluacion.component';
import { ReconocimientoSancionComponent } from './Pages/reconocimiento-sancion/reconocimiento-sancion.component';

const routes: Routes = [
    {path: 'informacion', component:InformacionComponent},
    {path: 'agregarEmpleado', component:RegistrarEmpleadoComponent},
    {path: 'editarEmpleado/:numDoc', component:EditarEmpleadoComponent},
    {path: 'compensaciones', component:CompensacionesComponent},
    {path: 'evaluacion', component:EvaluacionComponent},
    {path: 'reconocimientos-sanciones', component:ReconocimientoSancionComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LegajoRoutingModule {
}
