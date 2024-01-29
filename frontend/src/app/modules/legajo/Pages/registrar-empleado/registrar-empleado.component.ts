import { Component } from '@angular/core';

@Component({
  selector: 'app-registrar-empleado',
  templateUrl: './registrar-empleado.component.html',
  styleUrl: './registrar-empleado.component.scss'
})
export class RegistrarEmpleadoComponent {
 rutas :any
 loading:any
 discapacidad:string="Si"

//---DATOS PERSONALES FORM
aPaterno:string="";
aMaterno:string="";
nPrimer:string="";
nSegundo:string="";
ruc:string="";
fNacimiento:string="";
tFijo:string="";
tMovil:string="";
correoE:string="";
gSanguineo:string=""; 
enfAlergias:string="";
estadoCivil:string="";
nombreContacto:string="";
parentesco:string="";
numContacto:string="";
pDiscapacidad:string="";
fisicas:string="";
mentales:string="";
sensorial:string="";
intelectual:string="";
departamento:string="";
provincia:string="";
distrito:string="";
via:string="";
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
    this.familiares.push({ nombre: '', fechaNacimiento: "", dni: '' ,parentesco:"",centroLaboral:""});
  }

  agregarEstudioSuperior(){
    this.estudioSuperior.push({ centroEstudio: '', especialidad: "", fechaInicio: '' ,fechaTermino:"",nivelA:""});
  }
  agregarEstudioPostgrado(){
    this.estudioPostgrado.push({ centroEstudio: '', especialidad: "", fechaInicio: '',fechaTermino:"",nivelA:""});
  }
  agregarEspecializacion(){
    this.especializacion.push({ centroEstudio: '', materia: "", fechaInicio: '',fechaTermino:"",certificacion:""});
  }
  agregarCursos(){
    this.cursos.push({ centroEstudio: '', materia: "", fechaInicio: '',fechaTermino:"",certificacion:""});
  }
  
  agregarIdioma(){
    this.idiomas.push({ lenguaE: '', basico: "", intermedio: '',avanzado:""});
  }
  
  agregarExperiencia(){
    this.experienciaLaboral.push({ institucion: '', cargo: "", fechaInicio: '',fechaTermino:""});
  }
  agregarDocencia(){
    this.laborDocencia.push({ centroEnseñanza: '', curso: "", fechaInicio: '',fechaTermino:""});
  }
  


  eliminarItem(index: number,nombre:  keyof RegistrarEmpleadoComponent) {
    this[nombre].splice(index, 1);
  }

  submitForm() {
    // Aquí puedes manejar la lógica para enviar los datos del formulario
    console.log('Datos de familiares:', this.familiares);
  }
}


