import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { HttpResponseApi } from '@interfaces/http.interface';

@Injectable({
    providedIn: 'root',
})
export class CompensacionService {
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
    listarCompensaciones(datos: any) {
        return this.http
            .get<HttpResponseApi>('/api/compensacion/listar-compensacion', {
                params: {
                    documento: datos.documento,
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

    registrarCompensacion(compensacion:any,archivo:any,dni:any){
      const formData = new FormData();
      formData.append(`datos`, JSON.stringify(compensacion));
      formData.append(`archivo`, archivo);
      formData.append('numeroDoc', JSON.stringify(dni)); 
      return this.http
      .post<HttpResponseApi>(
          '/api/compensacion/registrarCompensacion',
           formData,
          { responseType: 'json' }
      )
      .pipe(shareReplay(1));
    }

    getCompensacion(id:any){
        return this.http
        .post<HttpResponseApi>(
            '/api/compensacion/getCompensacion',
            {id},
            { responseType: 'json' }
        )
        .pipe(shareReplay(1));
    }

   editarCompensacion(compensacion:any,archivo:any,dni:any){
        const formData = new FormData();
        formData.append(`datos`, JSON.stringify(compensacion));
        formData.append(`archivo`, archivo);
        formData.append('numeroDoc', JSON.stringify(dni)); 
        return this.http
        .post<HttpResponseApi>(
            '/api/compensacion/editarCompensacion',
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
