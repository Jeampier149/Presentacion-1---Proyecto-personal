import { ModalDatosService } from './../../../../services/legajo/modal-datos.service';
import { Modal } from 'bootstrap';
import { Component, ViewChild, ElementRef, } from '@angular/core';
import { finalize } from 'rxjs';
import { errorAlertaValidacion } from '@shared/utils';
@Component({
  selector: 'app-modal-ver',
  templateUrl: './modal-ver.component.html',
  styleUrl: './modal-ver.component.scss'
})
export class ModalVerComponent {
  pkEmpleado: string = "";
  estado:string=""

  //---ARRAYS DE SELECTS---//
  datosEmpleado: any[] = [];
  tipoEmpleado: any[] = []
  tipoGrupo: any[] = []
  regimen: any[] = []
  tipoRegimen: any[] = []

  //--VALOR DE SELECTS----//
  valorRegimen: any = ""
  valortipRegimen: any = ""
  valorNivel: string = ""
  valorCargo: string = ""
  valorServicio: string = ""
  valorUnidad: string = ""

  codigoAirhsp: string = ""
  //---DATOS PERSONALES FORM
  tipoDoc: string = "";
  numeroDocumento: string = ""
  nacionalidad: string = ""
  tipoEmp: string = "";
  grupOcup: string = "";
  aPaterno: string = "";
  aMaterno: string = "";
  nombres: string = "";
  sexo: string = "";
  ruc: string = "";
  fNacimiento: string = "";
  tFijo: string = "";
  tMovil: string = "";
  correoE: string = "";
  gSanguineo: string = "";
  enfAlergias: string = "";
  estadoCivil: string = "";
  //--datos contacto emergencia--//
  nombreContacto: string = "";
  parentesco: string = "";
  numContacto: string = "";
  //--datos domiclio--//
  departamento: string = "";
  provincia: string = "";
  distrito: string = "";
  via: string = "";
  nombreVia: string = "";
  numeroVia: string = "";
  interiorVia: string = "";
  zona: string = "";
  nombreZona: string = "";
  numeroZona: string = "";
  interiorZona: string = "";
  referenciaDomicilio: string = "";
  ubigeo: string = "";
  //---Datos discapacidad---//
  fisicas: boolean = false;
  sensorial: boolean = false;
  mentales: boolean = false;
  intelectuales: boolean = false;
  tipoDiscapacidad: any[] = [];
  //--TABLAS DE INGRESO DE DATOS---
  familiares: any[] = [];
  estudioSuperior: any[] = [];
  profesion: string = "";
  lugarColeg: string = "";
  fechColeg: string = "";
  fechTerColeg: string = "";
  numColeg: string = "";

  estudioPostgrado: any[] = [];
  especializacion: any[] = [];
  cursos: any[] = [];
  idiomas: any[] = [];
  experienciaLaboral: any[] = [];
  laborDocencia: any[] = [];
  datosContacto: string[] = [];
  mensajeLoading: string = '';

  loading: boolean = false;
  //arrays de archivos
  archivoSuperior: any[] = []
  archivoPostgrado: any[] = []
  archivoCursos: any[] = []
  fechaIngreso: string = ""
  @ViewChild('selFocus') selFocus!: ElementRef;
  @ViewChild('modalDatos') modalEl!: any;


  constructor(private ModalDatosService$: ModalDatosService) {

  }

  ngAfterViewInit() {
    this.modalEl = new Modal(this.modalEl.nativeElement, {
      backdrop: 'static',
      keyboard: false
    });
  }


  openModal(id: string) {
    this.modalEl.show();
    this.listarDatosEmpleado(id);
    this.listarDatosDiscapacidad(id)
    this.listarContactoEmergencia(id)
    this.listarDatosDomicilio(id)
    this.listarDatosFamiliar(id)

  }
  closeModal() {
    this.modalEl.hide();
  }
  listarDatosEmpleado(id: string) {
    this.loading = true
    this.ModalDatosService$.listarDatosEmpleado(id).pipe(
      finalize(() => {
        this.loading = false
      })
    ).subscribe(respuesta => {
      const { estado, mensaje, datos } = respuesta;
      console.log(datos[0])
      this.setDatosEmpleado(datos[0])
    });
  }
  listarDatosDiscapacidad(id: string) {
    this.loading = true
    this.ModalDatosService$.listarDatosDiscapacidad(id).pipe(
      finalize(() => {
        this.loading = false
      })
    ).subscribe(respuesta => {
      const { estado, mensaje, datos } = respuesta;
      if (!estado) {
        return;
      }
    });
  }
  listarDatosDomicilio(id: string) {
    this.loading = true
    this.ModalDatosService$.listarDatosDomicilio(id).pipe(
      finalize(() => {
        this.loading = false
      })
    ).subscribe(respuesta => {
      const { estado, mensaje, datos } = respuesta;
      console.log(respuesta)
      if (!estado) {
        return;
      }
      this.setDatosDomicilio(datos[0])
    });
  }
  listarDatosFamiliar(id: string) {
    this.loading = true
    this.ModalDatosService$.listarDatosFamiliares(id).pipe(
      finalize(() => {
        this.loading = false
      })
    ).subscribe(respuesta => {
      const { estado, mensaje, datos } = respuesta;
      console.log(respuesta)
      if (!estado) {
        return;
      }
      this.familiares=datos
    });
  }
  listarContactoEmergencia(id: string) {
    this.loading = true
    this.ModalDatosService$.listarDatosContacto(id).pipe(
      finalize(() => {
        this.loading = false
      })
    ).subscribe(respuesta => {
      const { estado, mensaje, datos } = respuesta;
      console.log(datos[0])
      this.setDatosConctactoEmergencia(datos[0])
    });
  }

  setDatosEmpleado(datos:any) {
    this.tipoDoc=datos.tipoDocumento;
    this.numeroDocumento=datos.numeroDocumento;
    this.nacionalidad=datos.nacionalidad;
    this.aPaterno=datos.apellidoPaterno;
    this.aMaterno=datos.apellidoMaterno;
    this.nombres=datos.nombre;
    this.sexo=datos.sexo,
    this.ruc=datos.ruc;
    this.fNacimiento=datos.fechaNacimiento;
    this.tFijo=datos.telFijo;
    this.tMovil=datos.telFijo;
    this.correoE=datos.correo;
    this.gSanguineo=datos.grupSanguineo;
    this.enfAlergias=datos.enferAlergia;
    this.estadoCivil=datos.estadoCivil;
    this.tipoEmp=datos.condicion;
    this.grupOcup=datos.grupOcupacional;
    this.valorRegimen=datos.regimen;
    this.valortipRegimen=datos.tipoRegimen;
    this.valorUnidad=datos.unidadOrganica;
    this.valorServicio=datos.servicio;
    this.codigoAirhsp=datos.codigoAirhsp;
    this.fechaIngreso=datos.fechaIngreso;
    this.estado=datos.estado
    
  }
 setDatosConctactoEmergencia(datos:any){
   this.nombreContacto=datos.nombre;
   this.parentesco=datos.parentesco;
   this.numContacto=datos.telefono;
 }
 setDatosDomicilio(datos:any){
   this.departamento=datos.departamento
   this.provincia=datos.provincia
   this.distrito=datos.distrito
   this.via=datos.tipoVia
   this.nombreVia=datos.nombreVia
   this.numeroVia=datos.numeroVia
   this.interiorVia=datos.interiorVia
   this.zona=datos.tipoZona
   this.nombreZona=datos.nombreZona
   this.numeroZona=datos.numeroZona
   this.interiorZona=datos.interiorZona
   this.referenciaDomicilio=datos.referencia
 }
 setDatosProfesion(){
 
 }

}