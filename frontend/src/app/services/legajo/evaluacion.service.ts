import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { HttpResponseApi } from '@interfaces/http.interface';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {

  constructor(private http: HttpClient) {}
    listarSelectEmpleado() {
        return this.http
            .post<HttpResponseApi>(
                '/api/general/listarEmpleado',
                {},
                { responseType: 'json' }
            )
            .pipe(shareReplay(1));
    }
    listarSelectDoc() {
        return this.http
            .post<HttpResponseApi>(
                '/api/evaluacion/listarEvalDoc',
                {},
                { responseType: 'json' }
            )
            .pipe(shareReplay(1));
    }
    listarSelectTipoDoc(id:any) {
        return this.http
            .post<HttpResponseApi>(
                '/api/evaluacion/listarEvalTipoDoc',
                {id},
                { responseType: 'json' }
            )
            .pipe(shareReplay(1));
    }
    listarEvaluaciones(datos: any) {
        return this.http
            .get<HttpResponseApi>('/api/evaluacion/listar-evaluaciones', {
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
    
    listartipoCompensacion(){
      return this.http
      .post<HttpResponseApi>(
          '/api/general/listarTipoCompensaciones',
          {},
          { responseType: 'json' }
      )
      .pipe(shareReplay(1));
    }

    registrarEvaluacion(evaluacion:any,archivo:any,dni:any){
      const formData = new FormData();
      formData.append(`datos`, JSON.stringify(evaluacion));
      formData.append(`archivo`, archivo);
      formData.append('numeroDoc', JSON.stringify(dni)); 
      return this.http
      .post<HttpResponseApi>(
          '/api/evaluacion/registrarEvaluacion',
           formData,
          { responseType: 'json' }
      )
      .pipe(shareReplay(1));
    }

    obtenerEvaluacion(id:any){
        return this.http
        .post<HttpResponseApi>(
            '/api/evaluacion/obtenerEvaluacion',
            {id},
            { responseType: 'json' }
        )
        .pipe(shareReplay(1));
    }

   editarEvaluacion(evaluacion:any,archivo:any,dni:any){
        const formData = new FormData();
        formData.append(`datos`, JSON.stringify(evaluacion));
        formData.append(`archivo`, archivo);
        formData.append('numeroDoc', JSON.stringify(dni)); 
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
