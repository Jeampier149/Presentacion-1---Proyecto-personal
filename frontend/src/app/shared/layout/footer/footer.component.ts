import {Component} from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    standalone: true
})
export class FooterComponent {
    anio: string = new Date().getFullYear().toString();
}
