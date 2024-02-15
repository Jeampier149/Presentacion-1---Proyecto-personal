import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { map, Observable, shareReplay } from "rxjs";
import { HttpResponseApi } from "@interfaces/http.interface";
import { ListarPersonalParams } from "@interfaces/legajo/listar-datos-g";
import { FinanciadorClass, DatosClass } from "@classes/legajo/datos.class";

@Injectable({
    providedIn: 'root'
})
export class DatoGeneralesService {
    constructor(private http: HttpClient) { }

    listarEmpleado(datos: ListarPersonalParams): Observable<HttpResponseApi> {
        return this.http.get<HttpResponseApi>('/api/legajo/listar-empleado', {
            params: {
                documento: datos.documento,
                apellidoPaterno: datos.appPat,
                apellidoMaterno: datos.appMat,
                Nombres: datos.nombres,
                unidadOrganica: datos.unidadOrganica,
                equipoServicio: datos.equipoServicio,
                pagina: datos.pagina,
                longitud: datos.longitud
            },
            responseType: "json"
        }).pipe(shareReplay(1));
    }

    listarTipoDocumento() {
        return this.http.post<HttpResponseApi>('/api/general/listarTipoDoc', {
            responseType: "json"
        }).pipe(shareReplay(1));
    }
    listarTipoEmpleado() {
        return this.http.post<HttpResponseApi>('/api/general/listarTipoEmp', {
            responseType: "json"
        }).pipe(shareReplay(1));
    }
    listarTipoGrupo() {
        return this.http.post<HttpResponseApi>('/api/general/listarTipoGrupo', {
            responseType: "json"
        }).pipe(shareReplay(1));
    }
    listarRegimen() {
        return this.http.post<HttpResponseApi>('/api/general/listarRegimen', {
            responseType: "json"
        }).pipe(shareReplay(1));
    }
    listarTipoRegimen(id: number) {
        return this.http.post<HttpResponseApi>('/api/general/listarTipoRegimen', { id }, { responseType: "json" }).pipe(shareReplay(1));
    }


    guardarDatosEmpleado(
        datosPersonales:any ,
        datosContacto:any,
        datosDiscapacidad:any,
        datosDomicilio:any,
        datosFamiliares:any,
        datosProfesion:any,
        datosEstudioSuperior:any,
        datosPostgrado:any,
        datosEspecializacion:any,
        datosCursos:any,
        datosIdiomas:any,
        experienciaLaboral:any,
        laborDocencia:any,

        ) 
        
        {
 
            const formData = new FormData();

            datosEstudioSuperior.forEach((datos:any, index:any) => {
                formData.append(`estudioSuperior${index}_archivo`, datos.archivo);

            });
            datosPostgrado.forEach((datos:any, index:any) => {
                formData.append(`postgrado${index}_archivo`, datos.archivo);

            });
            datosEspecializacion.forEach((datos:any, index:any) => {
                formData.append(`especializacion${index}_archivo`, datos.archivo);

            });
            datosCursos.forEach((datos:any, index:any) => {
                formData.append(`curso${index}_archivo`, datos.archivo);

            });
            datosIdiomas.forEach((datos:any, index:any) => {
                formData.append(`idioma${index}_archivo`, datos.archivo);

            });
            experienciaLaboral.forEach((datos:any, index:any) => {
                formData.append(`laboral${index}_archivo`, datos.archivo);

            });
           laborDocencia.forEach((datos:any, index:any) => {
                formData.append(`docencia${index}_archivo`, datos.archivo);

            });
            // Aquí agregamos los datos al formData
            formData.append('datosPersonales', JSON.stringify(datosPersonales));
            formData.append('datosContacto', JSON.stringify(datosContacto));
            formData.append('datosDiscapacidad', JSON.stringify(datosDiscapacidad));
            formData.append('datosDomicilio', JSON.stringify(datosDomicilio));
            formData.append('datosFamiliares', JSON.stringify(datosFamiliares));
            formData.append('datosProfesion', JSON.stringify(datosProfesion));
            formData.append('datosEstudioSuperior', JSON.stringify(datosEstudioSuperior));
            formData.append('datosPostgrado', JSON.stringify(datosPostgrado));
            formData.append('datosEspecializacion', JSON.stringify(datosEspecializacion));
            formData.append('datosCursos', JSON.stringify(datosCursos));
            formData.append('datosIdiomas', JSON.stringify(datosIdiomas));
            formData.append('experienciaLaboral', JSON.stringify(experienciaLaboral));
            formData.append('laborDocencia', JSON.stringify(laborDocencia));

   
     
        return this.http.post<HttpResponseApi>('/api/legajo/registrar-empleado', formData,         
           {responseType: "json"} 
        );
    }

   
}
