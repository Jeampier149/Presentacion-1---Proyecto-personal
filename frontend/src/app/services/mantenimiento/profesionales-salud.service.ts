import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResponseApi} from "@interfaces/http.interface";
import {
    IListaProfesionales,
    IListaProfesionalesParams,
    IProfesional
} from "@interfaces/mantenimiento/profesionales-salud.interface";
import {MedicoClass} from "@classes/mantenimiento/medico.class";


@Injectable({
    providedIn: 'root'
})
export class ProfesionalesSaludService {
    constructor(private http: HttpClient) {

    }

    listarProfesionales(params: IListaProfesionalesParams): Observable<HttpResponseApi<IListaProfesionales[]>> {
        return this.http.get<HttpResponseApi<IListaProfesionales[]>>('/api/mantenimiento/profesionales-salud/lista-profesional', {
            params: {...params},
            responseType: "json"
        });
    }

    obtenerProfesional(codigo: string): Observable<HttpResponseApi<IProfesional>> {
        return this.http.get<HttpResponseApi<IProfesional>>('/api/mantenimiento/profesionales-salud/obtener-profesional', {
            params: {codigo},
            responseType: "json"
        });
    }

    guardarProfesional(medico: MedicoClass): Observable<HttpResponseApi> {
        return this.http.post<HttpResponseApi>('/api/mantenimiento/profesionales-salud/guardar-profesional', {
            ...medico
        }, {
            responseType: "json"
        });
    }

    editarProfesional(medico: MedicoClass): Observable<HttpResponseApi> {
        return this.http.post<HttpResponseApi>('/api/mantenimiento/profesionales-salud/editar-profesional', {
            ...medico
        }, {
            responseType: "json"
        });
    }

    anularProfesional(codigo: string, motivo: string): Observable<HttpResponseApi> {
        return this.http.post<HttpResponseApi>('/api/mantenimiento/profesionales-salud/anular-profesional', {
            codigo, motivo
        }, {
            responseType: "json"
        });
    }

    activarProfesional(codigo: string): Observable<HttpResponseApi> {
        return this.http.post<HttpResponseApi>('/api/mantenimiento/profesionales-salud/activar-profesional', {
            codigo
        }, {
            responseType: "json"
        });
    }
}
