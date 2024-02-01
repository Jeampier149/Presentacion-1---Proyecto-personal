import { Component } from '@angular/core';
import { DatoGeneralesService } from '@services/legajo/datos-generales.service';
import { errorAlerta, successAlerta } from "@shared/utils";
import { finalize } from "rxjs";
import { Store } from "@ngrx/store";
import { rutaBreadCrumb } from "@shared/components/breadcrumb/breadcrumb.component";
@Component({
  selector: 'app-registrar-empleado',
  templateUrl: './registrar-empleado.component.html',
  styleUrl: './registrar-empleado.component.scss'
})
export class RegistrarEmpleadoComponent {

  constructor(private DatoGeneralesService$: DatoGeneralesService) { 
    this.listarTipoDocumento()
  }


  rutas: any
  loading: any
  discapacidad: string = "Si"
  agregable: boolean = false;
  datos: any[] = [];
  numeroDocumento:string=""
    //---DATOS PERSONALES FORM
  tipoDoc:string="";
  aPaterno: string = "";
  aMaterno: string = "";
  nPrimer: string = "";
  nSegundo: string = "";
  ruc: string = "";
  fNacimiento: string = "";
  tFijo: string = "";
  tMovil: string = "";
  correoE: string = "";
  gSanguineo: string = "";
  enfAlergias: string = "";
  estadoCivil: string = "";
  nombreContacto: string = "";
  parentesco: string = "";
  numContacto: string = "";
  pDiscapacidad: string = "";
  fisicas: string = "";
  mentales: string = "";
  sensorial: string = "";
  intelectual: string = "";
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

  //--TABLAS DE INGRESO DE DATOS---
  familiares: any[] = [];
  estudioSuperior: any[] = [];
  estudioPostgrado: any[] = [];
  especializacion: any[] = [];
  cursos: any[] = [];
  idiomas: any[] = [];
  experienciaLaboral: any[] = [];
  laborDocencia: any[] = [];


  numFamiliares: number = 0;

  agregarFamiliar() {
    this.familiares.push({ nombre: '', apellidos: '',fechaNacimiento: "", dni: '', parentesco: "", centroLaboral: "" });
  }

  agregarEstudioSuperior() {
    this.estudioSuperior.push({ centroEstudio: '', especialidad: "", fechaInicio: '', fechaTermino: "", nivelA: "" });
  }
  agregarEstudioPostgrado() {
    this.estudioPostgrado.push({ centroEstudio: '', especialidad: "", fechaInicio: '', fechaTermino: "", nivelA: "" });
  }
  agregarEspecializacion() {
    this.especializacion.push({ centroEstudio: '', materia: "", fechaInicio: '', fechaTermino: "", certificacion: "" });
  }
  agregarCursos() {
    this.cursos.push({ centroEstudio: '', materia: "", fechaInicio: '', fechaTermino: "", certificacion: "" });
  }

  agregarIdioma() {
    this.idiomas.push({ lenguaE: '', basico: "", intermedio: '', avanzado: "" });
  }

  agregarExperiencia() {
    this.experienciaLaboral.push({ institucion: '', cargo: "", fechaInicio: '', fechaTermino: "" });
  }
  agregarDocencia() {
    this.laborDocencia.push({ centroEnseñanza: '', curso: "", fechaInicio: '', fechaTermino: "" });
  }

  eliminarItem(index: number, nombre: keyof RegistrarEmpleadoComponent) {
    this[nombre].splice(index, 1);
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

  listarTipoRegimen() {

  }
  submitForm(){
    
  }
 registrarEmpleado() {
    const datosDomicilio={
      departamento:this.departamento,
      provincia:this.provincia,
      distrito:this.distrito,
      via:this.via,
      nombreVia:this.nombreVia,
      numeroVia:this.numeroVia,
      interiorVia:this.interiorVia,
      zona:this.zona,
      nombreZona:this.nombreZona,
      numeroZona:this.numeroZona,
      interiorZona:this.interiorZona,
      referenciaDomicilio:this.referenciaDomicilio
    }
    const datosFamiliares={  datosProfesionales:this.familiares }
    const datosProfesionales={ datosProsionales:this.estudioSuperior}
    const datosPostgrado={ datosProsionales:this.estudioPostgrado}
    const datosEspecializacion={datosProsionales:this.especializacion }
    const datosCursos={ datosProsionales:this.cursos }
    const datosIdiomas={  datosProsionales:this.idiomas }
    const experienciaLaboral={ experienciaLaboral:this.experienciaLaboral }
    const laborDocencia={ laborDocencia:this.laborDocencia}
    const datosPersonales={
     tipoDocumento:this.tipoDoc,
     aPaterno:this.aPaterno,
     aMaterno:this.aMaterno,
     nPrimer:this.nPrimer,
     nSegundo:this.nSegundo,
     ruc:this.ruc,
     fNacimiento:this.fNacimiento,
     tFijo:this.tFijo,
     tMovil:this.tMovil,
     correoE:this.correoE,
     gSanguineo:this.gSanguineo,
     enfAlergias:this.enfAlergias,
     estadoCivil:this.estadoCivil,

     nombreContacto:this.nombreContacto,
     parentesco:this.parentesco,
     numContacto:this.numContacto,
     pDiscapacidad:this.pDiscapacidad,
     fisicas:this.fisicas,
     mentales:this.mentales,
     sensorial:this.sensorial,
     intelectual:this.intelectual,     
    }

    console.log('Datos:', datosFamiliares);
  }
}


