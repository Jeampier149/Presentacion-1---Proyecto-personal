import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {TeleportToDirective} from './directives/teleport-to.directive';
import {RouterOutlet} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {BsTooltipDirective} from "@shared/directives/bs-tooltip.directive";
import { BsInvalidDirective } from './directives/bs-invalid.directive';

@NgModule({
    declarations: [
        TeleportToDirective,
        BsTooltipDirective,
        BsInvalidDirective
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        NgOptimizedImage,
        FormsModule,
        RouterOutlet,
    ],
    providers: [],
    bootstrap: [],
    exports: [
        CommonModule,
        HttpClientModule,
        NgOptimizedImage,
        FormsModule,
        TeleportToDirective,
        BsTooltipDirective,
        BsInvalidDirective
    ]
})
export class SharedModule {
}
