import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { InformacionComponent } from './Pages/informacion/informacion.component';
import { RegistrarEmpleadoComponent } from './Pages/registrar-empleado/registrar-empleado.component';
import { EditarEmpleadoComponent } from './Pages/editar-empleado/editar-empleado.component';

const routes: Routes = [
    {path: 'informacion', component:InformacionComponent},
    {path: 'agregarEmpleado', component:RegistrarEmpleadoComponent},
    {path: 'editarEmpleado/:idHis/:numDoc', component:EditarEmpleadoComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LegajoRoutingModule {
}
