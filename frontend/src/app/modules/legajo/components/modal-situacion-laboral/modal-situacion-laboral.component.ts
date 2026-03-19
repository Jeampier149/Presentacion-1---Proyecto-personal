import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatoGeneralesService } from '@services/legajo/datos-generales.service';
import { ModalDatosService } from '@services/legajo/modal-datos.service';
import { Modal } from 'bootstrap';
import {
    errorAlerta,
    successAlerta,
    warningAlerta,
} from '@shared/utils';
import { finalize } from 'rxjs';
import { SituacionLaboralService } from '@services/legajo/situacion-laboral.service';
import { ModalDarTerminoComponent } from '../modal-dar-termino/modal-dar-termino.component';

@Component({
    selector: 'app-modal-situacion-laboral',
    templateUrl: './modal-situacion-laboral.component.html',
    styleUrl: './modal-situacion-laboral.component.scss',
})
export class ModalSituacionLaboralComponent {
    loading = false;
    nombre = '';
    tipoEmpleado: any[] = [];
    tipoGrupo: any[] = [];
    regimen: any[] = [];
    tipoRegimen: any[] = [];
    cargo: any[] = [];
    nivelCargo: any[] = [];
    unidadOrganica: any[] = [];
    servicioE: any[] = [];
    agregable = false;
    idHistorial = '';
    mostrar = false;
    numeroDocumento = '';
    situacionHistorial: any[] = [];

    @ViewChild('modalSituacionLaboral') modalSituacion!: any;
    @ViewChild(ModalDarTerminoComponent) modalTermino?: ModalDarTerminoComponent;

    valSituacionLaboral!: FormGroup;
    valDatos!: FormGroup;

    constructor(
        private DatoGeneralesService$: DatoGeneralesService,
        private DatoSituacionService$: SituacionLaboralService
    ) {
        this.inicializarVariables();
        this.listarSelects();
    }

    ngAfterViewInit() {
        this.modalSituacion = new Modal(this.modalSituacion.nativeElement, {
            backdrop: 'static',
            keyboard: false,
        });
    }

    openModal(numDoc: string) {
        this.resetFormulario();
        this.numeroDocumento = numDoc;
        this.loading = true;
        this.modalSituacion.show();
        this.listarSituacion(numDoc);
        this.listarSituacionHistorial(numDoc);
    }

    inicializarVariables() {
        this.valSituacionLaboral = new FormGroup({
            grupOcup: new FormControl(''),
            valorRegimen: new FormControl(''),
            valorTipRegimen: new FormControl(''),
            valorUnidad: new FormControl(''),
            valorServicio: new FormControl(''),
            valorCargo: new FormControl(''),
            valorNivel: new FormControl(''),
            codigoAirhsp: new FormControl(''),
            fechaIngreso: new FormControl(''),
            valorEstado: new FormControl(''),
            motivo: new FormControl(''),
            tipoEmp: new FormControl(''),
        });
        this.valDatos = new FormGroup({
            nombre: new FormControl({ value: '', disabled: true }),
        });
    }

    /** Limpia el formulario antes de cargar nuevos datos */
    resetFormulario() {
        this.valSituacionLaboral.reset();
        this.valDatos.reset();
        this.situacionHistorial = [];
        this.nombre = '';
        this.idHistorial = '';
        this.tipoRegimen = [];
        this.servicioE = [];
    }

    listarSituacion(numDoc: string) {
        this.DatoSituacionService$.listarSituacion(numDoc)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe(({ estado, mensaje, datos }) => {
                if (estado) {
                    this.agregable = datos.length === 0;
                    if (datos.length > 0) {
                        this.setDatosSituacion(datos[0]);
                    }
                } else {
                    errorAlerta('Error', mensaje).then();
                }
            });
    }

    listarSituacionHistorial(numDoc: string) {
        this.DatoSituacionService$.listarSituacionHistorial(numDoc)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe(({ estado, mensaje, datos }) => {
                if (estado) {
                    this.situacionHistorial = datos ?? [];
                } else {
                    errorAlerta('Error', mensaje).then();
                }
            });
    }

    cambioTipo() {
        const id = this.valSituacionLaboral.get('valorRegimen')?.value;
        if (id) {
            this.tipoRegimen = [];
            this.valSituacionLaboral.get('valorTipRegimen')?.setValue('');
            this.listarTipoRegimen(id);
        } else {
            warningAlerta('Atención', 'Elija primero un régimen.');
        }
    }

    listarSelects() {
        this.DatoGeneralesService$.listarSelects()
            .pipe(finalize(() => (this.loading = false)))
            .subscribe(({ estado, mensaje, datos }) => {
                if (estado) {
                    this.tipoEmpleado = datos.tipoEmpleado;
                    this.tipoGrupo = datos.grupo;
                    this.regimen = datos.regimen;
                    this.nivelCargo = datos.nivel;
                    this.cargo = datos.cargo;
                    this.unidadOrganica = datos.unidadOrganica;
                } else {
                    errorAlerta('Error', mensaje).then();
                }
            });
    }





    setDatosSituacion(datos: any) {
        if (!datos) return;

        // Primero cargar los dependientes en cascada
        if (datos.idRegimen) this.listarTipoRegimen(datos.idRegimen);
      

        this.valSituacionLaboral.patchValue({
            tipoEmp: datos.idCondicion ?? '',
            grupOcup: datos.idGrupO ?? '',
            valorRegimen: datos.idRegimen ?? '',
            valorTipRegimen: datos.idTipoRegimen ?? '',
            valorCargo: datos.idCargo ?? '',
            valorNivel: datos.nivel ?? '',
            valorUnidad: datos.idUnidadOrganica ?? '',
            valorServicio: datos.idServicio ?? '',
            valorEstado: datos.estado ?? '',
            codigoAirhsp: datos.codigoAirhsp ?? '',
            fechaIngreso: datos.fechaIngreso ?? '',
        });

        this.valDatos.controls['nombre'].setValue(datos.nombreC ?? '');
        this.nombre = datos.nombreC ?? '';
        this.idHistorial = datos.idHistorial ?? '';

        // Bloquear edición si está ACTIVO (sólo los campos editables, no el estado)
        const esActivo = datos.estado === 'ACTIVO';
        const campos = ['grupOcup','valorRegimen','valorTipRegimen','valorUnidad',
                        'valorServicio','valorCargo','valorNivel','codigoAirhsp',
                        'fechaIngreso','motivo','tipoEmp'];
        campos.forEach(campo => {
            esActivo
                ? this.valSituacionLaboral.get(campo)?.disable()
                : this.valSituacionLaboral.get(campo)?.enable();
        });
    }

    listarTipoRegimen(id: any) {
        this.DatoGeneralesService$.listarTipoRegimen(id)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe(({ estado, mensaje, datos }) => {
                if (estado) {
                    this.tipoRegimen = datos;
                } else {
                    errorAlerta('Error', mensaje).then();
                }
            });
    }

    closeModal() {
        this.modalSituacion.hide();
    }

    darTermino(id: string) {
        this.modalTermino?.openModal(id, this.nombre);
        this.modalSituacion.hide();
    }

    actualizar() {
        const f = this.valSituacionLaboral;

        // Validación básica antes de enviar
        const camposRequeridos = ['tipoEmp','valorRegimen','valorUnidad','fechaIngreso'];
        const incompleto = camposRequeridos.some(c => !f.get(c)?.value);
        if (incompleto) {
            warningAlerta('Atención', 'Complete los campos obligatorios antes de actualizar.');
            return;
        }

        this.loading = true;
        this.DatoSituacionService$.actualizarSituacion(
            this.numeroDocumento,
            f.get('grupOcup')?.value,
            f.get('valorRegimen')?.value,
            f.get('valorTipRegimen')?.value,
            f.get('valorUnidad')?.value,
            f.get('valorServicio')?.value,
            f.get('valorCargo')?.value,
            f.get('valorNivel')?.value,
            f.get('codigoAirhsp')?.value,
            f.get('fechaIngreso')?.value,
            f.get('tipoEmp')?.value,
        )
            .pipe(finalize(() => (this.loading = false)))
            .subscribe(({ estado, mensaje, datos }) => {
                if (estado) {
                    datos === '1'
                        ? successAlerta('Éxito', mensaje)
                        : warningAlerta('Alerta', mensaje);
                    // Recargar datos tras actualizar
                    this.listarSituacion(this.numeroDocumento);
                } else {
                    errorAlerta('Error', mensaje).then();
                }
            });
    }

    generarReporteHistorial() {
        this.loading = true;
        this.DatoSituacionService$.generarPdf(this.numeroDocumento)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe((response: Blob) => {
                const fileURL = URL.createObjectURL(response);
                const a = document.createElement('a');
                a.href = fileURL;
                a.download = `historial_${this.numeroDocumento}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(fileURL);
            });
    }
}