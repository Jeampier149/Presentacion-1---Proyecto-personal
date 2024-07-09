import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { HttpResponseApi } from '@interfaces/http.interface';

@Injectable({
  providedIn: 'root'
})
export class RecocimientoSancionService {
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

  listarSelectTipoDoc(id:any) {
      return this.http
          .post<HttpResponseApi>(
              '/api/reconocimiento-sancion/listarTipoDoc',
              {id},
              { responseType: 'json' }
          )
          .pipe(shareReplay(1));
  }
  listarReconocimientoSanciones(datos: any) {
      return this.http
          .get<HttpResponseApi>('/api/reconocimiento-sancion/listar-reconocimiento-sancion', {
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
  


  registrarReconocimientoSancion(evaluacion:any,archivo:any,dni:any){
    const formData = new FormData();
    formData.append(`datos`, JSON.stringify(evaluacion));
    formData.append(`archivo`, archivo);
    formData.append('numeroDoc', JSON.stringify(dni)); 
    return this.http
    .post<HttpResponseApi>(
        '/api/reconocimiento-sancion/registrarReconocimientoSancion',
         formData,
        { responseType: 'json' }
    )
    .pipe(shareReplay(1));
  }

  obtenerReconocimientoSancion(id:any){
      return this.http
      .post<HttpResponseApi>(
          '/api/reconocimiento-sancion/obtenerReconocimientoSancion',
          {id},
          { responseType: 'json' }
      )
      .pipe(shareReplay(1));
  }

 editarReconocimientoSancion(data:any,archivo:any,dni:any){
      const formData = new FormData();
      formData.append(`datos`, JSON.stringify(data));
      formData.append(`archivo`, archivo);
      formData.append('numeroDoc', JSON.stringify(dni)); 
      return this.http
      .post<HttpResponseApi>(
          '/api/reconocimiento-sancion/editarReconocimientoSancion',
           formData,
          { responseType: 'json' }
      )
      .pipe(shareReplay(1));
    }

    verArchivo(ruta: string) {
      return this.http
          .get('/api/reconocimiento-sancion/verArchivo', {
              params: {
                  ruta: ruta,
              },
              responseType: 'blob',
          })
          .pipe(shareReplay(1));
  }

}
