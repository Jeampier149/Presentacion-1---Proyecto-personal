import {NgModule} from '@angular/core';
import {ConfiguracionRoutingModule} from './configuracion-routing.module';
import {SharedModule} from "@shared/shared.module";
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {TablaComponent} from "@shared/components/tabla/tabla.component";
import {LoadingComponent} from "@shared/components/loading/loading.component";
import {PaginacionComponent} from "@shared/components/paginacion/paginacion.component";
import {MenuComponent} from "@modules/configuracion/pages/menu/menu.component";
import {ModalMenuComponent} from "@modules/configuracion/components/modal-menu/modal-menu.component";
import {ModalAccionComponent} from "@modules/configuracion/components/modal-accion/modal-accion.component";

@NgModule({
    declarations: [
        MenuComponent,
        ModalMenuComponent,
        ModalAccionComponent
    ],
    exports: [],
    imports: [
        ConfiguracionRoutingModule,
        SharedModule,
        BreadcrumbComponent,
        TablaComponent,
        LoadingComponent,
        PaginacionComponent
    ]
})
export class ConfiguracionModule {

}
