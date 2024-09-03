import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { HttpResponseApi } from '@interfaces/http.interface';
@Injectable({
  providedIn: 'root'
})
export class ResumenService {

  constructor(private http: HttpClient) {}
    listarResumenes(datos: any) {
        return this.http
            .get<HttpResponseApi>('/api/resumen/listar-resumenes', {
                params: {
                    documento: datos.documento,
                    desDoc: datos.desDoc,
                    dni: datos.dni,
                    tipo: datos.tipo,
                    asunto: datos.asunto,
                    fecha: datos.fecha,
                    pagina: datos.pagina,
                    longitud: datos.longitud,
                },
                responseType: 'json',
            })
            .pipe(shareReplay(1));
    }
 

    obtenerResumen(id:any){
        return this.http
        .post<HttpResponseApi>(
            '/api/evaluacion/obtenerEvaluacion',
            {id},
            { responseType: 'json' }
        )
        .pipe(shareReplay(1));
    }
    generarResumen(parametros:any,archivo:any) {
        const formData = new FormData();
        formData.append(`datos`,JSON.stringify(parametros));
        formData.append(`archivo`,archivo);
        return this.http
        .post<HttpResponseApi>(
            '/api/reconocimiento-sancion/registrarReconocimientoSancion',
             formData,
            { responseType: 'blob' }
        )
        .pipe(shareReplay(1));
    }

   editarResumen(evaluacion:any,archivo:any){
        const formData = new FormData();
        formData.append(`datos`, JSON.stringify(evaluacion));
        formData.append(`archivo`, archivo);
        return this.http
        .post<HttpResponseApi>(
            '/api/evaluacion/editarEvaluacion',
             formData,
            { responseType: 'json' }
        )
        .pipe(shareReplay(1));
      }

      verArchivo(ruta: string) {
        return this.http
            .get('/api/compensacion/verArchivo', {
                params: {
                    ruta: ruta,
                },
                responseType: 'blob',
            })
            .pipe(shareReplay(1));
    }
}
