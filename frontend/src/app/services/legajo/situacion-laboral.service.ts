import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpResponseApi } from '@interfaces/http.interface';
import { map, Observable, shareReplay } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class SituacionLaboralService {

    constructor(private http: HttpClient) {}

    listarSituacion(pkEmpleado: string) {
        return this.http
            .post<HttpResponseApi>(
                '/api/situacion/datosSituacion',
                { pkEmpleado },
                { responseType: 'json' }
            )
            .pipe(shareReplay(1));
    }
    listarSituacionHistorial(pkEmpleado: string) {
        return this.http
            .post<HttpResponseApi>(
                '/api/situacion/datosSituacionHistorial',
                { pkEmpleado },
                { responseType: 'json' }
            )
            .pipe(shareReplay(1));
    }
    registrarTermino(idHistorial: string,motivo:string,fechaTermino:any) {
        return this.http
            .post<HttpResponseApi>(
                '/api/situacion/registrarTermino',
                { idHistorial,motivo,fechaTermino},
                { responseType: 'json' }
            )
            .pipe(shareReplay(1));
    }
    actualizarSituacion(
        numDoc:string,
        grupOcup:any,
        valorRegimen:any,
        valorTipRegimen:any,
        valorUnidad:any,
        valorServicio:any,
        valorCargo:any,
        valorNivel:any,
        codigoAirhsp:any,
        fechaIngreso:any,
        tipoEmp:any      
        ) {
        return this.http
            .post<HttpResponseApi>(
                '/api/situacion/actualizarSituacion',
                 {numDoc,grupOcup,valorRegimen,valorTipRegimen,valorUnidad,valorServicio,valorCargo,valorNivel,codigoAirhsp,fechaIngreso,tipoEmp},
                 { responseType: 'json' }
            )
            .pipe(shareReplay(1));
    }
    generarPdf(nroDoc:string){
        return this.http
        .get('/api/situacion/generarPdfHistorial', {
            params: {
               nroDoc
            },
            responseType: 'blob',
        })
        .pipe(shareReplay(1));
    }
}
