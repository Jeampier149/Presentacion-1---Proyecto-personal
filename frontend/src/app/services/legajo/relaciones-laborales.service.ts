import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { HttpResponseApi } from '@interfaces/http.interface';

@Injectable({
  providedIn: 'root'
})
export class RelacionesLaboralesService {
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

listarRelacionesLaborales(datos: any) {
    return this.http
        .get<HttpResponseApi>('/api/relacion-laboral/listar-relacion-laboral', {
            params: {
                documento: datos.documento,
                dni: datos.dni,
                asunto: datos.asunto,
                fecha: datos.fecha,
                pagina: datos.pagina,
                longitud: datos.longitud,
            },
            responseType: 'json',
        })
        .pipe(shareReplay(1));
}


registrarRelacionLaboral(evaluacion:any,archivo:any,dni:any){
  const formData = new FormData();
  formData.append(`datos`, JSON.stringify(evaluacion));
  formData.append(`archivo`, archivo);
  formData.append('numeroDoc', JSON.stringify(dni)); 
  return this.http
  .post<HttpResponseApi>(
      '/api/relacion-laboral/registrarRelacionLaboral',
       formData,
      { responseType: 'json' }
  )
  .pipe(shareReplay(1));
}

obtenerRelacionLaboral(id:any){
    return this.http
    .post<HttpResponseApi>(
        '/api/relacion-laboral/obtenerRelacionLaboral',
        {id},
        { responseType: 'json' }
    )
    .pipe(shareReplay(1));
}

editarRelacionLaboral(data:any,archivo:any,dni:any){
    const formData = new FormData();
    formData.append(`datos`, JSON.stringify(data));
    formData.append(`archivo`, archivo);
    formData.append('numeroDoc', JSON.stringify(dni)); 
    return this.http
    .post<HttpResponseApi>(
        '/api/relacion-laboral/editarRelacionLaboral',
         formData,
        { responseType: 'json' }
    )
    .pipe(shareReplay(1));
  }

  verArchivo(ruta: string) {
    return this.http
        .get('/api/relacion-laboral/verArchivo', {
            params: {
                ruta: ruta,
            },
            responseType: 'blob',
        })
        .pipe(shareReplay(1));
}
}
