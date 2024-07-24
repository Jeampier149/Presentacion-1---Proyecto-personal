import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "@layout/not-found/not-found.component";
import {SkeletonComponent} from "@layout/skeleton/skeleton.component";
import {authGuard} from "./core/guard/auth.guard";

const routes: Routes = [
    {
        path: '',
        component: SkeletonComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'inicio',
                loadChildren: () => import('@modules/dashboard/dashboard.module').then(m => m.DashboardModule),
            },
            {
                path: 'legajo',
                loadChildren: () => import('@modules/legajo/legajo.module').then(m => m.LegajoModule),
            },
            {
                path: 'remuneraciones',
                loadChildren: () => import('@modules/remuneraciones/remuneraciones.module').then(m => m.RemuneracionesModule),
            },
            {
                path: 'configuracion',
                loadChildren: () => import('@modules/configuracion/configuracion.module').then(m => m.ConfiguracionModule),
            },
            {
                path: 'mantenimiento',
                loadChildren: () => import('@modules/mantenimiento/mantenimiento.module').then(m => m.MantenimientoModule),
            }
        ]
    },
    {
        path: 'login',
        loadChildren: () => import('@modules/login/login.module').then(m => m.LoginModule),
        title: 'Inicio Sesión | SIGPER'
    },
    {
        path: '404',
        component: NotFoundComponent,
        title: '404 Not Found'
    },
    {
        path: '**',
        component: NotFoundComponent,
        title: '404 Not Found'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: []
})
export class AppRoutingModule {
}
