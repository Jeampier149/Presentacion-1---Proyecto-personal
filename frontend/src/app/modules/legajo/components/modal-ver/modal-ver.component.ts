import { ModalDatosService } from './../../../../services/legajo/modal-datos.service';
import { Modal } from 'bootstrap';
import { Component, ViewChild, ElementRef, } from '@angular/core';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-modal-ver',
  templateUrl: './modal-ver.component.html',
  styleUrl: './modal-ver.component.scss'
})
export class ModalVerComponent {
   pkEmpleado:string="";

  fotoPersonal:File []=[]
  rutaFoto:string=""
  rutas: any
  discapacidad: string = "Si"
  agregable: boolean = false;
  //---ARRAYS DE SELECTS---//
  datos: any[] = [];
  tipoEmpleado: any[] = []
  tipoGrupo: any[] = []
  regimen: any[] = []
  tipoRegimen: any[] = []

  //--VALOR DE SELECTS----//
  valorRegimen: any = ""
  valortipRegimen: any = ""
  valorNivel:string=""
  valorCargo:string=""
  valorServicio:string=""
  valorUnidad:string=""

  codigoAirhsp:string=""
  //---DATOS PERSONALES FORM
  tipoDoc: string = "";
  numeroDocumento: string = ""
  nacionalidad:string=""
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
  ubigeo:string="";
  //---Datos discapacidad---//
  fisicas: boolean = false;
  sensorial: boolean = false;
  mentales: boolean = false;
  intelectuales: boolean = false;
  tipoDiscapacidad: any[]= [];
  //--TABLAS DE INGRESO DE DATOS---
  familiares: any[] = [];
  estudioSuperior: any[] = [];
  profesion:string="";
  lugarColeg:string="";
  fechColeg:string="";
  fechTerColeg:string="";
  numColeg:string="";

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
  archivoSuperior: any []=[]
  archivoPostgrado: any []=[]
  archivoCursos: any []=[]
  fechaIngreso:string=""
  @ViewChild('selFocus') selFocus!: ElementRef;
  @ViewChild('modalDatos') modalEl!: any;


  constructor(private ModalDatosService$:ModalDatosService){
   
  }

  ngAfterViewInit() {
    this.modalEl = new Modal(this.modalEl.nativeElement, {
      backdrop: 'static',
      keyboard: false
    });
  }  
  

  openModal(id:string) {
    this.modalEl.show();
    this.listarDatosEmpleado(id)
    
  }

  listarDatosEmpleado(id:string){
    this.loading=true
    this.ModalDatosService$.listarDatosEmpleado(id).pipe(
      finalize(() => {
        this.loading = false
    })
    ).subscribe(respuesta => {
      const {estado, mensaje, datos} = respuesta;
       
      if (!estado) {        
          return;
      }   
  });

      
  }

  closeModal() {
    this.modalEl.hide();

  }
}
