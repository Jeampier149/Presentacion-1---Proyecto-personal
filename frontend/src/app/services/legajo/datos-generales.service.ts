import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable, shareReplay } from "rxjs";
import { HttpResponseApi } from "@interfaces/http.interface";
import { ListarPersonalParams } from "@interfaces/legajo/listar-datos-g";
import { FinanciadorClass, DatosClass } from "@classes/legajo/datos.class";

@Injectable({
    providedIn: 'root'
})
export class DatoGeneralesService {
    constructor(private http: HttpClient) { }

    listarEmpleado(datos: ListarPersonalParams): Observable<HttpResponseApi> {
        return this.http.get<HttpResponseApi>('/api/legajo/listar-empleado', {
            params: {
                documento: datos.documento,
                apellidoPaterno: datos.appPat,
                apellidoMaterno: datos.appMat,
                Nombres: datos.nombres,
                unidadOrganica: datos.unidadOrganica,
                equipoServicio: datos.equipoServicio,
                pagina: datos.pagina,
                longitud: datos.longitud
            },
            responseType: "json"
        }).pipe(shareReplay(1));
    }

    listarTipoDocumento() {
        return this.http.post<HttpResponseApi>('/api/general/listarTipoDoc', {
            responseType: "json"
        }).pipe(shareReplay(1));
    }
    listarTipoEmpleado() {
        return this.http.post<HttpResponseApi>('/api/general/listarTipoEmp', {
            responseType: "json"
        }).pipe(shareReplay(1));
    }
    listarTipoGrupo() {
        return this.http.post<HttpResponseApi>('/api/general/listarTipoGrupo', {
            responseType: "json"
        }).pipe(shareReplay(1));
    }
    listarRegimen() {
        return this.http.post<HttpResponseApi>('/api/general/listarRegimen', {
            responseType: "json"
        }).pipe(shareReplay(1));
    }
    listarTipoRegimen(id: number) {
        return this.http.post<HttpResponseApi>('/api/general/listarTipoRegimen', { id }, { responseType: "json" }).pipe(shareReplay(1));
    }


    guardarDatosEmpleado(
        datosPersonales:any,
        datosContacto:any,
        datosDiscapacidad:any,
        datosDomicilio:any,
        datosFamiliares:any,
        datosProfesionales:any,
        datosPostgrado:any,
        datosEspecializacion:any,
        datosCursos:any,
        datosIdiomas:any,
        experienciaLaboral:any,
        laborDocencia:any
        ) 
        
        {
        return this.http.post<HttpResponseApi>('/api/legajo/registrar-empleado',
            {
                datosPersonales, 
                datosContacto,
                datosDiscapacidad,
                datosDomicilio,
                datosFamiliares,
                datosProfesionales,
                datosPostgrado,
                datosEspecializacion,
                datosCursos,
                datosIdiomas,
                experienciaLaboral,
                laborDocencia

            }, {
            responseType: "json"
        });
    }

   
}
