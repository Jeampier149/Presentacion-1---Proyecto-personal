import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpResponseApi} from "@interfaces/http.interface";
import {reniecClass} from "@classes/servicios/reniec.class";
import {map, Observable} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class ReniecService {

  constructor(private http: HttpClient) {

  }

  buscarDni(documento: string,tipo:string) {
       return this.http.post<HttpResponseApi>('/api/reniec/buscarReniec', {documento,tipo},{responseType: "json"}).pipe(
          map(response => {
                  return {...response, datos: new reniecClass(response.datos)}
              }
          )
      )
  }
}
