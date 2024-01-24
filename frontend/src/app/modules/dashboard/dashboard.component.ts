import {Component} from '@angular/core';
import {rutaBreadCrumb} from "@shared/components/breadcrumb/breadcrumb.component";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    rutas: rutaBreadCrumb[] = [{nombre: 'Inicio'}]

    constructor() {
    }

}
