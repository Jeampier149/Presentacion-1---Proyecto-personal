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
  listarDatosProfesion(pkEmpleado: string) {
    return this.http.post<HttpResponseApi>('/api/datos/datosProfesion',{pkEmpleado}, {
      responseType: "json"
    }).pipe(shareReplay(1));
  
  }
  listarDatosEstudioSuperior(pkEmpleado: string) {
    return this.http.post<HttpResponseApi>('/api/datos/datosEstudioSuperior',{pkEmpleado}, {
      responseType: "json"
    }).pipe(shareReplay(1));
  
  }
  listarDatosEstudioPostgrado(pkEmpleado: string) {
    return this.http.post<HttpResponseApi>('/api/datos/datosEstudioPostgrado',{pkEmpleado}, {
      responseType: "json"
    }).pipe(shareReplay(1));
  
  }
  listarDatosEstudioEspecializacion(pkEmpleado: string) {
    return this.http.post<HttpResponseApi>('/api/datos/datosEstudioEspecializacion',{pkEmpleado}, {
      responseType: "json"
    }).pipe(shareReplay(1));
  
  }
  listarDatosEstudioCursos(pkEmpleado: string) {
    return this.http.post<HttpResponseApi>('/api/datos/datosEstudioCursos',{pkEmpleado}, {
      responseType: "json"
    }).pipe(shareReplay(1));
  
  }
  listarDatosEstudioIdioma(pkEmpleado: string) {
    return this.http.post<HttpResponseApi>('/api/datos/datosEstudioIdioma',{pkEmpleado}, {
      responseType: "json"
    }).pipe(shareReplay(1));
  
  }
  listarDatosExperienciaLaboral(pkEmpleado: string) {
    return this.http.post<HttpResponseApi>('/api/datos/datosExperienciaLaboral',{pkEmpleado}, {
      responseType: "json"
    }).pipe(shareReplay(1));
  
  }
  listarDatosExperienciaDocencia(pkEmpleado: string) {
    return this.http.post<HttpResponseApi>('/api/datos/datosExperienciaDocencia',{pkEmpleado}, {
      responseType: "json"
    }).pipe(shareReplay(1));
  
  }
 
}
