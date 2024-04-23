import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MenuComponent} from "@modules/configuracion/pages/menu/menu.component";
import {PerfilComponent} from "@modules/configuracion/pages/perfil/perfil.component";

const routes: Routes = [
    {path: 'menu', component: MenuComponent, title: 'Menu | SIGPER'},
    {path: 'perfil', component: PerfilComponent, title: 'Perfiles | SIGPER'}
];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class ConfiguracionRoutingModule {
}
