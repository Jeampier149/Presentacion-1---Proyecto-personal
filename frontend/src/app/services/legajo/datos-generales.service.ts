import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, shareReplay} from "rxjs";
import {HttpResponseApi} from "@interfaces/http.interface";
import { ListarPersonalParams} from "@interfaces/legajo/listar-datos-g";
import {FinanciadorClass, DatosClass} from "@classes/legajo/datos.class";

@Injectable({
    providedIn: 'root'
})
export class DatoGeneralesService {

    constructor(private http: HttpClient) {

    }

    listarEmpleado(datos: ListarPersonalParams): Observable<HttpResponseApi> {
        return this.http.get<HttpResponseApi>('/api/legajo/listar-empleado', {
            params: {
                documento: datos.documento,
                apellidoPaterno: datos.appPat,
                apellidoMaterno: datos.appMat,
                primerNombre: datos.nomPri,
                segundoNombre: datos.nomSec,
                unidadOrganica: datos.unidadOrganica,
                servicioEquipo: datos.servicioEquipo,
                pagina: datos.pagina,
                longitud: datos.longitud
            },
            responseType: "json"
        }).pipe(shareReplay(1));
    }

    listarHistoriaXNombres(appPat: string, appMat: string, nomPri: string, nomSec: string, estado: number, pagina: number, longitud: number): Observable<HttpResponseApi> {
        return this.http.get<HttpResponseApi>('/api/filiacion/listar-historia-x-nombres', {
            params: {
                appPaterno: appPat,
                appMaterno: appMat,
                nomPrimero: nomPri,
                nomSegundo: nomSec,
                estado: estado,
                pagina: pagina,
                longitud: longitud
            },
            responseType: "json"
        }).pipe(shareReplay(1));
    }

    obtenerHistoriaClinica(codigo: string) {
        return this.http.get<HttpResponseApi<DatosClass>>('/api/filiacion/obtener-historia', {
            params: {codigo},
            responseType: "json"
        }).pipe(
            map(response => {
                    let historia = new DatosClass();
                    historia.financiador = Object.assign(new FinanciadorClass(), response.datos!.financiador);
                    return {...response, datos: Object.assign(new DatosClass(), response.datos)}
                }
            )
        );
    }

   



    guardarHistoriaClinica(historia: DatosClass) {
        return this.http.post<HttpResponseApi>('/api/filiacion/guardar-historia', {
            ...historia
        }, {
            responseType: "json"
        });
    }

    editarHistoriaClinica(historia: DatosClass) {
        return this.http.post<HttpResponseApi>('/api/filiacion/editar-historia', {
            ...historia
        }, {
            responseType: "json"
        });
    }

}
