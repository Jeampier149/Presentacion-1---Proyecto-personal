import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { HttpResponseApi } from '@interfaces/http.interface';

@Injectable({
  providedIn: 'root'
})
export class ExportarZipService {

  constructor(private http: HttpClient) { }

  exportarCarpeta(documento:string,carpeta:string,subcarpeta=''){

      return this.http
      .get('/api/general/exportarCarpeta', {
        params: {
           documento,
           carpeta,
           subcarpeta
        },
        responseType: 'blob',
    })
      .pipe(shareReplay(1));
    
  }
}
