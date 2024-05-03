import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IListaCombo} from "@interfaces/mantenimiento/general.interface";
import {BehaviorSubject, finalize, Subject} from "rxjs";
import {HttpResponseApi} from "@interfaces/http.interface";
import {IListaProfesional} from "@interfaces/mantenimiento/profesional.interface";
import {IListaPerfil} from "@interfaces/mantenimiento/perfil.interface";


@Injectable({
    providedIn: 'root'
})
export class GeneralProfesionalService {

    sexos: { estado: number, datos: IListaCombo[] } = {estado: 0, datos: []};
    sexos$ = new BehaviorSubject<IListaCombo[]>([]);

    profesiones: { estado: number, datos: IListaCombo[] } = {estado: 0, datos: []};
    profesiones$ = new BehaviorSubject<IListaCombo[]>([]);

    cargos: { estado: number, datos: IListaCombo[] } = {estado: 0, datos: []};
    cargos$ = new BehaviorSubject<IListaCombo[]>([]);

    tipoDocumentos: { estado: number, datos: IListaCombo[] } = {estado: 0, datos: []};
    tipoDocumentos$ = new BehaviorSubject<IListaCombo[]>([]);

    colegios: { estado: number, datos: IListaCombo[] } = {estado: 0, datos: []};
    colegios$ = new BehaviorSubject<IListaCombo[]>([]);

    constructor(private http: HttpClient) {

    }

    listarSexos(): Subject<IListaCombo[]> {
        if (this.sexos.estado === 0) {
            this.sexos.estado = 1;
            this.http.get<HttpResponseApi<IListaCombo[]>>('/api/mantenimiento/profesionales-salud/lista-sexo', {
                params: {},
                responseType: "json"
            }).pipe(finalize(() => {
            })).subscribe(({estado, datos, mensaje}) => {
                if (estado) {
                    this.sexos.datos = datos!;
                    this.sexos$.next(this.sexos.datos);
                } else {
                    this.sexos$.next([]);
                    console.error(mensaje);
                }
            });
        }
        return this.sexos$
    }

    listarProfesiones(): Subject<IListaCombo[]> {
        if (this.profesiones.estado === 0) {
            this.profesiones.estado = 1;
            this.http.get<HttpResponseApi<IListaCombo[]>>('/api/mantenimiento/profesionales-salud/lista-profesion', {
                params: {},
                responseType: "json"
            }).pipe(finalize(() => {
            })).subscribe(({estado, datos, mensaje}) => {
                if (estado) {
                    this.profesiones.datos = datos!;
                    this.profesiones$.next(this.profesiones.datos);
                } else {
                    this.profesiones$.next([]);
                    console.error(mensaje);
                }
            });
        }
        return this.profesiones$
    }

    listarTipoDocumentos(): Subject<IListaCombo[]> {
        if (this.tipoDocumentos.estado === 0) {
            this.tipoDocumentos.estado = 1;
            this.http.get<HttpResponseApi<IListaCombo[]>>('/api/mantenimiento/profesionales-salud/lista-tipo-documento', {
                params: {},
                responseType: "json"
            }).pipe(finalize(() => {
            })).subscribe(({estado, datos, mensaje}) => {
                if (estado) {
                    this.tipoDocumentos.datos = datos!;
                    this.tipoDocumentos$.next(this.tipoDocumentos.datos);
                } else {
                    this.tipoDocumentos$.next([]);
                    console.error(mensaje);
                }
            });
        }
        return this.tipoDocumentos$
    }

    listarColegios(): Subject<IListaCombo[]> {
        if (this.colegios.estado === 0) {
            this.colegios.estado = 1;
            this.http.get<HttpResponseApi<IListaCombo[]>>('/api/mantenimiento/profesionales-salud/lista-colegio', {
                params: {},
                responseType: "json"
            }).pipe(finalize(() => {
            })).subscribe(({estado, datos, mensaje}) => {
                if (estado) {
                    this.colegios.datos = datos!;
                    this.colegios$.next(this.colegios.datos);
                } else {
                    this.colegios$.next([]);
                    console.error(mensaje);
                }
            });
        }
        return this.colegios$
    }

    listarCargos(): Subject<IListaCombo[]> {
        if (this.cargos.estado === 0) {
            this.cargos.estado = 1;
            this.http.get<HttpResponseApi<IListaCombo[]>>('/api/mantenimiento/profesionales-salud/lista-cargo', {
                params: {},
                responseType: "json"
            }).pipe(finalize(() => {
            })).subscribe(({estado, datos, mensaje}) => {
                if (estado) {
                    this.cargos.datos = datos!;
                    this.cargos$.next(this.cargos.datos);
                } else {
                    this.cargos$.next([]);
                    console.error(mensaje);
                }
            });
        }
        return this.cargos$
    }

}
