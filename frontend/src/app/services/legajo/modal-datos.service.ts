import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable, shareReplay } from "rxjs";
import { HttpResponseApi } from "@interfaces/http.interface";

@Injectable({
  providedIn: 'root'
})
export class ModalDatosService {

  constructor(private http: HttpClient) { }

  listarDatosEmpleado(pkEmpleado: string) {
    return this.http.post<HttpResponseApi>('/api/verDatos/listarDatosEmpleado',pkEmpleado, {
      responseType: "json"
    }).pipe(shareReplay(1));
  }
  listarDatosDiscapacidad(pkEmpleado: string) {
    return this.http.post<HttpResponseApi>('/api/verDatos/listarDatosDiscapacidad',pkEmpleado, {
      responseType: "json"
    }).pipe(shareReplay(1));
  }
  listarDatosContacto(pkEmpleado: string) {
    return this.http.post<HttpResponseApi>('/api/verDatos/listarDatosContacto',pkEmpleado, {
      responseType: "json"
    }).pipe(shareReplay(1));
  }
  listarDatosDomicilio(pkEmpleado: string) {
    return this.http.post<HttpResponseApi>('/api/verDatos/listarDatosDomicilio',pkEmpleado, {
      responseType: "json"
    }).pipe(shareReplay(1));
  
  }
  listarDatosFamiliares(pkEmpleado: string) {
    return this.http.post<HttpResponseApi>('/api/verDatos/listarDatosFamiliares',pkEmpleado, {
      responseType: "json"
    }).pipe(shareReplay(1));
  
  }

}
