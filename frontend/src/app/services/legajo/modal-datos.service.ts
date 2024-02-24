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
    return this.http.post<HttpResponseApi>('/api/datos/datosEmpleado', { pkEmpleado }, { responseType: "json" }).pipe(shareReplay(1));
  }
  listarDatosDiscapacidad(pkEmpleado: string) {
    return this.http.post<HttpResponseApi>('/api/datos/datosDiscapacidad',{pkEmpleado}, {
      responseType: "json"
    }).pipe(shareReplay(1));
  }
  listarDatosContacto(pkEmpleado: string) {
    return this.http.post<HttpResponseApi>('/api/datos/datosContactoEmergencia',{pkEmpleado}, {
      responseType: "json"
    }).pipe(shareReplay(1));
  }
  listarDatosDomicilio(pkEmpleado: string) {
    return this.http.post<HttpResponseApi>('/api/datos/datosDomicilio',{pkEmpleado}, {
      responseType: "json"
    }).pipe(shareReplay(1));
  
  }
  listarDatosFamiliares(pkEmpleado: string) {
    return this.http.post<HttpResponseApi>('/api/datos/datosFamiliares',{pkEmpleado}, {
      responseType: "json"
    }).pipe(shareReplay(1));
  
  }

}
