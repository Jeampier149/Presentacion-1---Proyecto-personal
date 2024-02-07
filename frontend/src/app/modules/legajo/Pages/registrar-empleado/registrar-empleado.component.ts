
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

  //---Datos discapacidad---//
  fisicas: boolean = false;
  sensorial: boolean = false;
  mentales: boolean = false;
  intelectuales: boolean = false;
  datosDiscapacidad:string[] = [];
  //--TABLAS DE INGRESO DE DATOS---
  familiares: any[] = [];
  estudioSuperior: any[] = [];
  estudioPostgrado: any[] = [];
  especializacion: any[] = [];
  cursos: any[] = [];
  idiomas: any[] = [];
  experienciaLaboral: any[] = [];
  laborDocencia: any[] = [];
  datosContacto: string[] = [];


  mensajeLoading: string = 'Cargando...';
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
  }
  setDatosMigraciones(datos: any) {
  }


  agregarFamiliar() { this.familiares.push({ nombre: '', apellidos: '', dni: '', parentesco: "", centroLaboral: "" }); }
  agregarEstudioSuperior() { this.estudioSuperior.push({ centro: '', especialidad: "", inicio: '', termino: "", nivel: "" }); }
  agregarEstudioPostgrado() { this.estudioPostgrado.push({ centro: '', especialidad: "", fechainicio: '', termino: "", nivel: "" }); }
  agregarEspecializacion() { this.especializacion.push({ centro: '', materia: "", inicio: '', termino: "", certificacion: "" }); }
  agregarCursos() { this.cursos.push({ centro: '', materia: "", inicio: '', termino: "", certificacion: "" }); }
  agregarIdioma() { this.idiomas.push({ lenguaE: '', basico: "", intermedio: '', avanzado: "" }); }
  agregarExperiencia() { this.experienciaLaboral.push({ institucion: '', cargo: "", inicio: '', termino: "" }); }
  agregarDocencia() { this.laborDocencia.push({ centroEnseñanza: '', curso: "", inicio: '', termino: "" }); }

  eliminarItem(index: number, nombre: keyof RegistrarEmpleadoComponent) { this[nombre].splice(index, 1); }

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
  onCheckboxChange() {
    if (this.fisicas) this.datosDiscapacidad.push("Fisica");
    if (this.sensorial) this.datosDiscapacidad.push("Sensorial");
    if (this.mentales) this.datosDiscapacidad.push("Mental");
    if (this.intelectuales) this.datosDiscapacidad.push("Intelectual");
  }
  registrarEmpleado() {
    const datosDomicilio = {
      departamento: this.departamento,
      provincia: this.provincia,
      distrito: this.distrito,
      via: this.via,
      nombreVia: this.nombreVia,
      numeroVia: this.numeroVia,
      interiorVia: this.interiorVia,
      zona: this.zona,
      nombreZona: this.nombreZona,
      numeroZona: this.numeroZona,
      interiorZona: this.interiorZona,
      referenciaDomicilio: this.referenciaDomicilio
    }
    const datosFamiliares = { datosFamiliares: this.familiares }
    const datosProfesionales = { datosProfesionales: this.estudioSuperior }
    const datosPostgrado = { datosPostgrado: this.estudioPostgrado }
    const datosEspecializacion = { datosEspecializacion: this.especializacion }
    const datosCursos = { datosCursos: this.cursos }
    const datosIdiomas = { datosIdiomas: this.idiomas }
    const experienciaLaboral = { datosExperienciaLaboral: this.experienciaLaboral }
    const laborDocencia = { datosLaborDocencia: this.laborDocencia }
    const tipoDiscapacidades={datosDiscapacidad:this.datosDiscapacidad}
    const datosPersonales = {
      tipoDocumento: this.tipoDoc,
      aPaterno: this.aPaterno,
      aMaterno: this.aMaterno,
      nombres: this.nombres,
      sexo: this.sexo,
      ruc: this.ruc,
      fNacimiento: this.fNacimiento,
      tFijo: this.tFijo,
      tMovil: this.tMovil,
      correoE: this.correoE,
      gSanguineo: this.gSanguineo,
      enfAlergias: this.enfAlergias,
      estadoCivil: this.estadoCivil,

    }

    const datosContacto = {
      nombreContacto: this.nombreContacto,
      parentesco: this.parentesco,
      numContacto: this.numContacto,

    }
   
    this.DatoGeneralesService$.guardarDatosEmpleado(
      datosPersonales,
      datosContacto,
      tipoDiscapacidades,
      datosDomicilio,
      datosFamiliares,
      datosProfesionales,
      datosPostgrado,
      datosEspecializacion,
      datosCursos,
      datosIdiomas,
      experienciaLaboral,
      laborDocencia
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


    console.log('Datos:', datosFamiliares, datosProfesionales, datosPostgrado, datosEspecializacion, datosCursos, datosIdiomas, experienciaLaboral, laborDocencia, datosPersonales);
  }

}


