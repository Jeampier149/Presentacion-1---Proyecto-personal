import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatoGeneralesService } from '@services/legajo/datos-generales.service';
import { ModalDatosService } from '@services/legajo/modal-datos.service';
import { Modal } from 'bootstrap';
import {
    errorAlerta,
    successAlerta,
    warningAlerta,
    errorAlertaValidacion,
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
    loading: boolean = false;
    nombre:any=''
    tipoEmpleado: any[] = [];
    tipoGrupo: any[] = [];
    regimen: any[] = [];
    tipoRegimen: any[] = [];
    cargo: any[] = [];
    nivelCargo: any[] = [];
    unidadOrganica: any[] = [];
    servicioE: any[] = [];
    agregable: boolean = false;
    idHistorial: string = '';
    mostrar: boolean = false;
    numeroDocumento:string="";
    situacionHistorial:any[]=[]
    @ViewChild('modalSituacionLaboral') modalSituacion!: any;
    @ViewChild(ModalDarTerminoComponent)
    modalTermino?: ModalDarTerminoComponent;
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
        this.modalSituacion.show();
        this.numeroDocumento=numDoc;
        this.loading=true
        this.listarSituacion(numDoc);
        this.listarSituacionHistorial(numDoc)
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
        this.valDatos=new FormGroup({
            nombre:new FormControl({ value: '', disabled: true }),
        })

    }

    listarSituacion(numDoc: string) {
        this.DatoSituacionService$.listarSituacion(numDoc)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(({ estado, mensaje, datos }) => {
                if (estado) {
                    datos.length > 0
                        ? (this.agregable = false)
                        : (this.agregable = true);
                    this.setDatosSituacion(datos[0]);
                } else {
                    errorAlerta('Error', mensaje).then();
                }
            });
    }
    listarSituacionHistorial(numDoc: string) {
      this.DatoSituacionService$.listarSituacionHistorial(numDoc)
          .pipe(
              finalize(() => {
                  this.loading = false;
              })
          )
          .subscribe(({ estado, mensaje, datos }) => {
              if (estado) {
                  datos.length > 0
                      ? (this.agregable = false)
                      : (this.agregable = true);
                  this.situacionHistorial=datos
              } else {
                  errorAlerta('Error', mensaje).then();
              }
          });
  }

    cambioTipo() {
        let id = this.valSituacionLaboral.controls['valorRegimen'].value;
        if (id.length > 0) {
            this.listarTipoRegimen(id);
        } else {
            warningAlerta('Atención!', 'Elija primero un regimen ');
        }
    }

    listarSelects() {
        this.DatoGeneralesService$.listarSelects()
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(({ estado, mensaje, datos }) => {
                if (estado) {
                    datos.length > 0
                        ? (this.agregable = false)
                        : (this.agregable = true);
                    this.tipoEmpleado = datos.tipoEmpleado;
                    this.tipoGrupo = datos.grupo;
                    this.regimen = datos.regimen;
                    this.nivelCargo = datos.nivel;
                    this.cargo = datos.cargo;
                    this.unidadOrganica = datos.unidadOrganica;
                    this.servicioE = datos.servicio;
                } else {
                    errorAlerta('Error', mensaje).then();
                }
            });
    }

    setDatosSituacion(datos: any) {
        this.valSituacionLaboral.controls['tipoEmp'].setValue( datos.idCondicion );
        this.valSituacionLaboral.controls['grupOcup'].setValue(datos.idGrupO);
        this.valSituacionLaboral.controls['valorRegimen'].setValue(datos.idRegimen );
        this.listarTipoRegimen(datos.idRegimen);
        this.valSituacionLaboral.controls['valorTipRegimen'].setValue( datos.idTipoRegimen);
        this.valSituacionLaboral.controls['valorCargo'].setValue(datos.idCargo);
        this.valSituacionLaboral.controls['valorNivel'].setValue(datos.nivel);
        this.valSituacionLaboral.controls['valorUnidad'].setValue(datos.idUnidadOrganica);
        this.valSituacionLaboral.controls['valorServicio'].setValue(datos.idServicio);
        this.valSituacionLaboral.controls['valorEstado'].setValue(datos.estado);
        this.valSituacionLaboral.controls['codigoAirhsp'].setValue( datos.codigoAirhsp);
        this.valSituacionLaboral.controls['fechaIngreso'].setValue(datos.fechaIngreso);
        this.idHistorial = datos.idHistorial;
        if (  this.valSituacionLaboral.controls['valorEstado'].value == 'ACTIVO' ) {
            this.valSituacionLaboral.disable();
        } else {
          this.valSituacionLaboral.enable(); }

        this.valDatos.controls['nombre'].setValue( datos.nombreC);
        this.idHistorial = datos.idHistorial;
        this.nombre=datos.nombreC
    }

    listarTipoRegimen(id: any) {
        this.DatoGeneralesService$.listarTipoRegimen(id)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(({ estado, mensaje, datos }) => {
                if (estado) {
                    datos.length > 0
                        ? (this.agregable = false)
                        : (this.agregable = true);
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
        this.modalTermino?.openModal(id,this.nombre);
        this.modalSituacion.hide();
    }
    actualizar() {    
        this.DatoSituacionService$.actualizarSituacion(
        this.numeroDocumento,
        this.valSituacionLaboral.get('grupOcup')?.value,
        this.valSituacionLaboral.get('valorRegimen')?.value,
        this.valSituacionLaboral.get('valorTipRegimen')?.value,
        this.valSituacionLaboral.get('valorUnidad')?.value,
        this.valSituacionLaboral.get('valorServicio')?.value,
        this.valSituacionLaboral.get('valorCargo')?.value,
        this.valSituacionLaboral.get('valorNivel')?.value,
        this.valSituacionLaboral.get('codigoAirhsp')?.value,
        this.valSituacionLaboral.get('fechaIngreso')?.value,
        this.valSituacionLaboral.get('tipoEmp')?.value

      )
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(({ estado, mensaje, datos }) => {
                if (estado) {
                  if(datos=='1'){
                    successAlerta('Éxito', mensaje);
                   }else{
                    warningAlerta('Alerta',mensaje)
                   }
                } else {
                    errorAlerta('Error', mensaje).then();
                }
            });
    }
    generarReporteHistorial(){
        this.DatoSituacionService$.generarPdf(this.numeroDocumento)
            .pipe(
                finalize(() => {
                  this.loading = false;
                })
            )
            .subscribe((response:Blob) => {
                const file = new Blob([response], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                 window.open(fileURL); 
            });
    }
}
