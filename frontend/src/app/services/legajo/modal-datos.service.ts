import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable, shareReplay } from "rxjs";
import { HttpResponseApi } from "@interfaces/http.interface";

@Injectable({
  providedIn: 'root'
})
export class ModalDatosService {

  constructor(private http: HttpClient) { }

  listarDatos(pkEmpleado: string) {
    return this.http.post<HttpResponseApi>('/api/datos/datosEmpleado', {  pkEmpleado  }, { responseType: "json" }).pipe(shareReplay(1));
  }
  
  verArchivo(ruta: string) {
    return this.http.get('/api/datos/archivos', {
      params: {
         ruta:ruta
      },   responseType: "blob"
      
  }).pipe(shareReplay(1));}
 
}
