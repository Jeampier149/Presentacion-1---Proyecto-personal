import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ResumenComponent } from './pages/resumen/resumen.component';
import { EjecucionGastosComponent } from './pages/ejecucion-gastos/ejecucion-gastos.component';

const routes: Routes = [
    {path: 'resumen', component:ResumenComponent},
    {path: 'ejecucion-gastos', component:EjecucionGastosComponent},

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RemuneracionesRoutingModule {
}
