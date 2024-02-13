import { Component } from '@angular/core';
import { DatoGeneralesService } from '@services/legajo/datos-generales.service';
import { errorAlerta, successAlerta, warningAlerta, errorAlertaValidacion } from "@shared/utils";
import { finalize } from "rxjs";
import { ReniecService } from '@services/general/reniec.service';
import { ExtranjeriaService } from '@services/general/extranjeria.service';
import { reniecClass } from '@classes/servicios/reniec.class';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';

@Component({
  selector: 'app-registrar-empleado',
  templateUrl: './registrar-empleado.component.html',
  styleUrl: './registrar-empleado.component.scss'
})
export class RegistrarEmpleadoComponent {

  constructor(private DatoGeneralesService$: DatoGeneralesService, private ReniecService$: ReniecService, private ExtranjeriaService$: ExtranjeriaService) {
    this.listarTipoDocumento()
    this.listarTipoEmpleado()
    this.listarRegimen()
    this.listarTipoGrupo()
 
  }

  files: File[] = [];

  onSelect(event: any) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }


  rutas: any
  loading: boolean = false;
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

  //arrays de archivos
  archivoSuperior: any []=[]
  archivoPostgrado: any []=[]
  archivoCursos: any []=[]
  fechaIngreso:string=""

  buscarDocumento() {

    let tipoDocumento = this.tipoDoc;
    let documento = this.numeroDocumento;
    this.loading = true;
    this.mensajeLoading = 'Buscando Documento...';
    if (tipoDocumento === '1') {
      this.mensajeLoading = 'Buscando en RENIEC...';
      this.ReniecService$.buscarDni(documento)
        .pipe((
          finalize(() => {
            this.loading = false;
            this.mensajeLoading = 'Cargando...';
          }))
        )
        .subscribe(({ estado, datos }) => {

          if (estado && datos) {
            this.setDatosRENIEC(datos);
          }
        })
    } else if (tipoDocumento === '2') {
      this.mensajeLoading = 'Buscando en MIGRACIONES...';
      this.ExtranjeriaService$.buscarMigraciones(documento)
        .subscribe(({ estado, datos, mensaje }) => {
          if (estado && datos) {
            this.setDatosMigraciones(datos);
          } else {
            warningAlerta('Atención!', mensaje)
          }
        })
    } else {
      errorAlerta('Error', 'No se dispone del servicio en estos momentos.').then();
    }
  }

  setDatosRENIEC(datos: reniecClass) {
    this.aPaterno = datos.apellidoPaterno;
    this.aMaterno = datos.apellidoMaterno;
    this.nombres = datos.nombres;
    this.sexo = datos.obtenerSexo()
    this.fNacimiento = datos.obtenerFechaNacimiento()
    this.departamento = datos.departamento
    this.provincia = datos.provincia
    this.distrito = datos.distrito
    this.ubigeo=datos.obtenerUbigeo()
  }
  setDatosMigraciones(datos: any) {
  }

 
  agregarFamiliar() { 
    this.familiares.push({ nombre: '', apellidos: '', fechaNacimiento: '',dni: '', parentesco: "", centroLaboral: "",pkEmpleado:this.numeroDocumento }); }
   
    agregarEstudioSuperior() {  
      const ruta = `${this.numeroDocumento}/estudioSuperior/`;
      this.estudioSuperior.push({ centro: '', especialidad: "", inicio: '', termino: "", nivel: "", archivo: null ,ruta:ruta ,pkEmpleado:this.numeroDocumento });
  }
  agregarEstudioPostgrado() { 
    const ruta = `${this.numeroDocumento}/estudioPostgrado/`;
    this.estudioPostgrado.push({ centro: '', especialidad: "", inicio: '', termino: "", nivel: "", archivo: null ,ruta:ruta ,pkEmpleado:this.numeroDocumento }); }
  agregarEspecializacion() { 
    const ruta = `${this.numeroDocumento}/especializacion/`;
    this.especializacion.push({ centro: '', materia: "", inicio: '', termino: "", certificacion: "", archivo: null,ruta:ruta ,pkEmpleado:this.numeroDocumento }); }
  agregarCursos() { 
    const ruta = `${this.numeroDocumento}/cursos/`;
    this.cursos.push({ centro: '', materia: "", inicio: '', termino: "", certificacion: "", archivo:null ,ruta:ruta ,pkEmpleado:this.numeroDocumento }); }
  agregarIdioma() { 
    const ruta = `${this.numeroDocumento}/idiomas/`;
    this.idiomas.push({ lenguaE: '', basico: "", intermedio: '', avanzado: "", archivo: "",ruta:ruta ,pkEmpleado:this.numeroDocumento  }); }
  agregarExperiencia() {
    const ruta = `${this.numeroDocumento}/experienciaLaboral/`;
     this.experienciaLaboral.push({ institucion: '', cargo: "", inicio: '', termino: "", archivo: "",ruta:ruta ,pkEmpleado:this.numeroDocumento  }); }
  agregarDocencia() {
    const ruta = `${this.numeroDocumento}/experienciaDocencia/`;
     this.laborDocencia.push({ centroEnseñanza: '', curso: "", inicio: '', termino: "", archivo: "",ruta: ruta ,pkEmpleado:this.numeroDocumento  }); 
   }

  eliminarItem(index: number, nombre: keyof RegistrarEmpleadoComponent) { this[nombre].splice(index, 1); }

  seleccionarArchivoEst(event: any, index: number) {
    const fileEs: File = event.target.files[0];
    this.estudioSuperior[index].archivo = fileEs;}

  seleccionarArchivoPg(event: any, index: number) {
    const filePg: File = event.target.files[0];
    this.estudioPostgrado[index].archivo = filePg;
  }
  seleccionarArchivoEspecialidad(event: any, index: number) {
    const fileEsp: File = event.target.files[0];
    this.especializacion[index].archivo = fileEsp;
  }
  seleccionarArchivoCurso(event: any, index: number) {
    const fileCurso: File = event.target.files[0];
    this.cursos[index].archivo = fileCurso;
  }
  seleccionarArchivoIdioma(event: any, index: number) {
    const fileIdioma: File = event.target.files[0];
    this.idiomas[index].archivo = fileIdioma;
  }
  seleccionarArchivoExpLaboral(event: any, index: number) {
    const fileExpLaboral: File = event.target.files[0];
    this.experienciaLaboral[index].archivo = fileExpLaboral;
  }
  seleccionarArchivoExpDocencia(event: any, index: number) {
    const fileExpDocencia: File = event.target.files[0];
    this.laborDocencia[index].archivo = fileExpDocencia;
  }

  listarTipoDocumento() {
    this.DatoGeneralesService$.listarTipoDocumento()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(({ estado, mensaje, datos }) => {
        if (estado) {
          datos.length > 0 ? this.agregable = false : this.agregable = true;
          this.datos = datos;
        } else {
          errorAlerta('Error', mensaje).then();
        }
      });
  }

  listarTipoEmpleado() {
    this.DatoGeneralesService$.listarTipoEmpleado()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(({ estado, mensaje, datos }) => {
        if (estado) {
          datos.length > 0 ? this.agregable = false : this.agregable = true;
          this.tipoEmpleado = datos;
        } else {
          errorAlerta('Error', mensaje).then();
        }
      });
  }

  listarTipoGrupo() {
    this.DatoGeneralesService$.listarTipoGrupo()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(({ estado, mensaje, datos }) => {
        if (estado) {
          datos.length > 0 ? this.agregable = false : this.agregable = true;
          this.tipoGrupo = datos;
        } else {
          errorAlerta('Error', mensaje).then();
        }
      });
  }
  listarRegimen() {
    this.DatoGeneralesService$.listarRegimen()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(({ estado, mensaje, datos }) => {
        if (estado) {
          datos.length > 0 ? this.agregable = false : this.agregable = true;
          this.regimen = datos;
        } else {
          errorAlerta('Error', mensaje).then();
        }
      });
  }

  cambioTipo() {
    let id = this.valorRegimen
    if (id.length > 0) {
      this.listarTipoRegimen(id)
    } else {
      warningAlerta('Atención!', 'Elija primero un regimen ')
    }
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
          datos.length > 0 ? this.agregable = false : this.agregable = true;
          this.tipoRegimen = datos;
        } else {
          errorAlerta('Error', mensaje).then();
        }
      });
  }
  
  actualizarTipo(tipo: string, isChecked: boolean) {
    if (isChecked) {
      // Si está marcado, agregamos el tipo al arreglo
      this.tipoDiscapacidad.push(tipo);
    } else {
      // Si está desmarcado, verificamos si el tipo está presente en el arreglo
      const index = this.tipoDiscapacidad.indexOf(tipo);
      if (index !== -1) {
        // Si el tipo está presente, lo eliminamos del arreglo
        this.tipoDiscapacidad.splice(index, 1);
      }
    }
    console.log(this.tipoDiscapacidad)
  }



  registrarEmpleado() {
    const foto='ruta/foto';

    const datosDomicilio = {
      departamento: this.departamento.toUpperCase(),
      provincia: this.provincia.toUpperCase(),
      distrito: this.distrito.toUpperCase(),
      via: this.via.toUpperCase(),
      nombreVia: this.nombreVia.toUpperCase(),
      numeroVia: this.numeroVia.toUpperCase(),
      interiorVia: this.interiorVia.toUpperCase(),
      zona: this.zona.toUpperCase(),
      nombreZona: this.nombreZona.toUpperCase(),
      numeroZona: this.numeroZona.toUpperCase(),
      interiorZona: this.interiorZona.toUpperCase(),
      referenciaDomicilio: this.referenciaDomicilio.toUpperCase(),
      ubigeo:this.ubigeo,
      numDocumento:this.numeroDocumento
    }
    const datosFamiliares =this.familiares 
    const datosEstudioSuperior =this.estudioSuperior 
    const datosProfesion={
      profesion:this.profesion,
      lugarColeg:this.lugarColeg,
      fechColeg:this.fechColeg,
      fechTerColeg:this.fechTerColeg,
      numColeg:this.numColeg,
      numDocEmp:this.numeroDocumento
    }
    const datosPostgrado = { datosPostgrado: this.estudioPostgrado }
    const datosEspecializacion = { datosEspecializacion: this.especializacion }
    const datosCursos = { datosCursos: this.cursos }
    const datosIdiomas = { datosIdiomas: this.idiomas }
    const experienciaLaboral = { datosExperienciaLaboral: this.experienciaLaboral }
    const laborDocencia = { datosLaborDocencia: this.laborDocencia }
    const datosPersonales = {     
      tipoDocumento: this.tipoDoc,
      numeroDocumento:this.numeroDocumento,
      codigoAirhsp:this.codigoAirhsp,
      aPaterno: this.aPaterno.toUpperCase(),
      aMaterno: this.aMaterno.toUpperCase(),
      nombres: this.nombres.toUpperCase(),    
      ruc: this.ruc,
      estadoCivil: this.estadoCivil.toUpperCase(),
      sexo: this.sexo.toUpperCase(),
      gSanguineo: this.gSanguineo.toUpperCase(),
      grupOcupacional:this.grupOcup,
      tipoEmpleado:this.tipoEmp,
      regimen:this.valorRegimen,
      tipoRegimen:this.valortipRegimen,
      fNacimiento: this.fNacimiento,
      tFijo: this.tFijo,
      tMovil: this.tMovil,
      correoE: this.correoE.toUpperCase(),         
      enfAlergias: this.enfAlergias.toUpperCase(),
      fechaIngreso:this.fechaIngreso,
      unidadOrganica:this.valorUnidad,
      servicio:this.valorServicio,
      foto:foto

    }
    const datosContacto = {
      nombreContacto: this.nombreContacto.toUpperCase(),
      parentesco: this.parentesco.toUpperCase(),
      numContacto: this.numContacto.toUpperCase(),
      numDocumento:this.numeroDocumento
    }

    const datosDiscapacidad={
      numDocumento: this.numeroDocumento,
      tipos:this.tipoDiscapacidad
    }


    this.DatoGeneralesService$.guardarDatosEmpleado(
      datosPersonales,
      datosContacto,
      datosDiscapacidad,
      datosDomicilio,
      datosFamiliares,
      datosProfesion,
      datosEstudioSuperior,
      datosPostgrado,
      datosEspecializacion,
      datosCursos,
      datosIdiomas,
      experienciaLaboral,
      laborDocencia,
    ).pipe(
      finalize(() => {
        this.loading = false
      })
    ).subscribe(respuesta => {
      const { estado, mensaje, datos } = respuesta;
      if (!estado && datos) {
        errorAlertaValidacion(mensaje, datos);
        return;
      }
      successAlerta('Éxito', mensaje);
    });


    console.log('Datos:',  datosFamiliares,datosEstudioSuperior);
  }

}


