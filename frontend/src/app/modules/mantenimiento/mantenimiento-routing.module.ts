import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsuarioComponent} from "@modules/mantenimiento/pages/usuarios/usuario.component";

const routes: Routes = [
    {
        path: 'usuarios',
        component: UsuarioComponent,
        title: 'Usuarios | SIGPER',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class MantenimientoRoutingModule {
}
