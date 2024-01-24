import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MenuComponent} from "@modules/configuracion/pages/menu/menu.component";

const routes: Routes = [{path: 'menu', component: MenuComponent}];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class ConfiguracionRoutingModule {
}
