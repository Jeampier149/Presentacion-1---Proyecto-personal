import { Component, ViewChild } from '@angular/core';
import { DatoGeneralesService } from '@services/legajo/datos-generales.service';
import { errorAlerta, successAlerta, warningAlerta, errorAlertaValidacion } from "@shared/utils";
import { finalize } from "rxjs";
import { ReniecService } from '@services/general/reniec.service';
import { ExtranjeriaService } from '@services/general/extranjeria.service';
import { reniecClass } from '@classes/servicios/reniec.class';
import { MigracionesClass } from '@classes/servicios/migraciones.class';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { ModalTomarFotoComponent } from '@modules/legajo/components/modal-tomar-foto/modal-tomar-foto.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-empleado',
  templateUrl: './registrar-empleado.component.html',
  styleUrl: './registrar-empleado.component.scss'
})
export class RegistrarEmpleadoComponent {
  @ViewChild(ModalTomarFotoComponent) modalTomarFoto?: any
  constructor(private DatoGeneralesService$: DatoGeneralesService, private ReniecService$: ReniecService, private ExtranjeriaService$: ExtranjeriaService,private router:Router) {
    this.inicializarVariables()
    this.listarSelects()
    
  }

  //DORPZONE IMAGEN
 files: File[] = [];
 
 fotoFile:any[]=[];
 
  onSelect(event: any) {
    this.files = [];
    this.files.push(event.addedFiles[0])

    const file = event.addedFiles[0];
    const timestamp = new Date().getTime();
    const nuevoNombre=timestamp + '_' + file.name
    const fileFinal: File = new File([file], nuevoNombre);
    this.fotoFile.push(fileFinal)
    const ruta =this.numeroDocumento+'/'+fileFinal.name.replace(/\s+/g, '_');
    this.rutaFoto=ruta

  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }


 tomarFoto(){
  this.modalTomarFoto?.openModal();
 }

 mandarImagen(foto:File){
  this.files=[]
  this.files.push(foto)
  const file = foto;
  const timestamp = new Date().getTime();
  const nuevoNombre=timestamp + '_' + file.name
  const fileFinal: File = new File([file], nuevoNombre);
  this.fotoFile.push(fileFinal)

  const ruta=this.numeroDocumento+'/'+fileFinal.name.replace(/\s+/g, '_');
  this.rutaFoto=ruta
 }


  //FOTO PERSONAL
  fotoPersonal:File []=[]
  rutaFoto:string="default/perfil.png"
  archivoDiscapacidad:File[]=[]

  //DEFAULT
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
  tipoSexo:any[]=[]
  tipoGrupoSanguineo:any[]=[]
  tipoEstadoCivil:any[]=[]
  tipoParentesco:any[]=[]
  tipoProfesiones:any[]=[]
  nivelIdioma:any[]=[]
  cargo:any[]=[]
  nivelCargo:any[]=[]
  tipoVia:any[]=[]
  tipoZona:any[]=[]
  //--VALOR DE SELECTS----//
  valorRegimen: any = ""
  valortipRegimen: any = ""
  valorNivel:string=""
  valorCargo:string=""
  valorServicio:string=""
  valorUnidad:string=""
  unidadOrganica: any[] = [];
  servicioE: any[] = [];
  codigoAirhsp:string=""
  //---DATOS PERSONALES FORM
  tipoDoc: string = "";
  numeroDocumento: string = "";
  nacionalidad:string="";
  tipoEmp: string = "";
  grupOcup: string = "";
  aPaterno: string = "";
  aMaterno: string = "";
  nombres: string = "";
  sexo: string = "";
  ruc: string = "";
  fNacimiento: string = "";
 

  gSanguineo: string = "";
  enfAlergias: string = "SIN DATOS";
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
  
rutaDiscapacidad:string=""

 tipoDiscapacidad = [
    { id: 1, tipo: 'Fisica' ,estado:'A'},
    { id: 2, tipo: 'Sensorial',estado:'A'},
    { id: 3, tipo: 'Mental',estado:'A' },
    { id: 4, tipo: 'Intelectual',estado:'A'}

  ];
  discapacidades:any[]=[]
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

  //mostrar divs
   divFamiliar:boolean=false
   divSuperior:boolean=false
   divPostgrado:boolean=false
   divEspecializacion:boolean=false
   divCursos:boolean=false
   divIdioma:boolean=false;
   divExperienciaLaboral:boolean=false;
   divExperienciaDocencia:boolean=false;
  //formocntrol
 valGroup!: FormGroup;


   inicializarVariables(){
    this.valGroup = new FormGroup({
      correo: new FormControl('', { validators: Validators.email}),    
      telFijo: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      telMovil: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      ruc: new FormControl('',[Validators.required,Validators.pattern('[0-9]{11}')]),
      numContacto: new FormControl('', [Validators.pattern('^[0-9]*$')]),
   })

  }
  buscarDocumento(documento:string,index?:number) {
    let tipoDocumento = this.tipoDoc;
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

          if (estado && datos ) {
            if(index == undefined){
                this.setDatosRENIEC(datos)
            }else{
                this.setDatosFamiliar(datos,index)
            }
         
          }
        })
    } else if (tipoDocumento === '2') {
      this.mensajeLoading = 'Buscando en MIGRACIONES...';
      this.ExtranjeriaService$. buscarMigraciones(documento)
        .pipe((
          finalize(() => {
            this.loading = false;
            this.mensajeLoading = 'Cargando...';
          }))
        )
        .subscribe(({ estado, datos }) => {

          if (estado && datos) {
            this.setDatosMigraciones(datos);
          }
        })
    } else {
      errorAlerta('Error', 'No se dispone del servicio en estos momentos.').then();
    }
  }
  buscarDocumentoFamiliar(documento:string,index:number,tipoD:string) {
    this.loading = true;
    this.mensajeLoading = 'Buscando Documento...';
    if (tipoD == 'DNI') {
      this.mensajeLoading = 'Buscando en RENIEC...';
      this.ReniecService$.buscarDni(documento)
        .pipe((
          finalize(() => {
            this.loading = false;
            this.mensajeLoading = 'Cargando...';
          }))
        )
        .subscribe(({ estado, datos }) => {

          if (estado && datos ) {           
                this.setDatosFamiliar(datos,index)        
          }
        })
    } else if (tipoD == 'CARNET EXTRANJERIA') {
      this.mensajeLoading = 'Buscando en MIGRACIONES...';
      this.ExtranjeriaService$. buscarMigraciones(documento)
        .pipe((
          finalize(() => {
            this.loading = false;
            this.mensajeLoading = 'Cargando...';
          }))
        )
        .subscribe(({ estado, datos }) => {

          if (estado && datos) {
            this.setDatosFamiliar(datos,index);
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
    this.fNacimiento = datos.obtenerFechaNacimiento();
    this.departamento = datos.departamento;
    this.provincia = datos.provincia
    this.distrito = datos.distrito
    this.ubigeo=datos.obtenerUbigeo()
  }
  setDatosMigraciones(datos:MigracionesClass) {
    this.aPaterno = datos.apellidoPaterno;
    this.aMaterno = datos.apellidoMaterno;
    this.nombres = datos.nombres;
  }
 setDatosFamiliar(datos:any ,index:number){
  this.familiares[index].nombre = datos.nombres;
  this.familiares[index].apellidos =`${datos.apellidoPaterno} ${datos.apellidoMaterno} `;
  this.familiares[index].fechaNacimiento=this.obtenerFechaNacimiento(datos.fechaNacimiento)
 }
 obtenerFechaNacimiento(fechaNacimiento:any) {
  return fechaNacimiento.slice(0, 4) + '-' + fechaNacimiento.slice(4, 6) + '-' + fechaNacimiento.slice(6, 8)
}
 
 agregarFamiliar() { 
  this.divFamiliar=false
  if(this.familiares.length<=5)this.familiares.push({ nombre: '', apellidos: '', fechaNacimiento: '',tipoD:'',dni: '', parentesco: "", centroLaboral: "" });
 }

  agregarEstudioSuperior() {
    this.divSuperior=false     
  if(this.estudioSuperior.length<=5) this.estudioSuperior.push({ tipo:'',centro: '', especialidad: "", inicio: '', termino: "", nivel: "", archivo: null ,ruta:""  });
 }
agregarEstudioPostgrado() { 
 this.divPostgrado=false
  if(this.estudioPostgrado.length<=5) this.estudioPostgrado.push({ tipo:'',centro: '', especialidad: "", inicio: '', termino: "", nivel: "", archivo: null ,ruta:"" }); }
agregarEspecializacion() { 
  this.divEspecializacion=false
if(this.especializacion.length<=5) this.especializacion.push({ tipo:'',centro: '', materia: "", inicio: '', termino: "", certificacion: "", archivo: null,ruta:"" }); }
agregarCursos() { 
  this.divCursos=false
if(this.cursos.length<=5)  this.cursos.push({tipo:'', centro: '', materia: "", inicio: '', termino: "", certificacion: "", archivo:null ,ruta:""  }); }
agregarIdioma() { 
  this.divIdioma=false
 if(this.idiomas.length<=4) this.idiomas.push({ lenguaE: '', nivel: "", archivo:null,ruta:""  }); }
agregarExperiencia() {
  this.divExperienciaLaboral=false
 if(this.experienciaLaboral.length<=10)  this.experienciaLaboral.push({ institucion: '', cargo: "", inicio: '', termino: "", archivo:null,ruta:""  }); }
agregarDocencia() {
  this.divExperienciaDocencia=false
  if(this.laborDocencia.length<=10) this.laborDocencia.push({ centro: '', curso: "", inicio: '', termino: "", archivo:null,ruta:""}); 
 }


  eliminarItem(index: number, nombre: keyof RegistrarEmpleadoComponent) { this[nombre].splice(index, 1); }
  sinDatosFamiliares(){
    this.divFamiliar=true
    this.familiares=[]
  }
  sinDatosSuperiores(){
    this.divSuperior=true
    this.estudioSuperior=[]
  }
  sinDatosPostgrado(){
    this.divPostgrado=true
    this.estudioPostgrado=[]
  }
  sinDatosEspecializacion(){
    this.divEspecializacion=true
    this.especializacion=[]
  }
  sinDatosCursos(){
    this.divCursos=true
    this.cursos=[]
  }
  sinDatosIdiomas(){
    this.divIdioma=true
    this.idiomas=[]
  }
  sinDatosExperienciaLaboral(){
    this.divExperienciaLaboral=true
    this.experienciaLaboral=[]
  }

  sinDatosExperienciaDocencia(){
    this.divExperienciaDocencia=true
    this.laborDocencia=[]
  }


  seleccionarArchivoEst(event: any, index: number) {
    const fileEs: File = event.target.files[0];
    const timestamp = new Date().getTime();
    const nuevoNombre=timestamp + '_' + fileEs.name
    const fileFinal: File = new File([fileEs], nuevoNombre);
    const ruta =this.numeroDocumento+'/'+fileFinal.name.replace(/\s+/g, '_');
    this.estudioSuperior[index].archivo = fileFinal;
    this.estudioSuperior[index].ruta=ruta

  }
    
  seleccionarArchivoPg(event: any, index: number) {
    const filePost: File = event.target.files[0];
    const timestamp = new Date().getTime();
    const nuevoNombre=timestamp + '_' + filePost.name
    const fileFinal: File = new File([filePost], nuevoNombre);
    const ruta =this.numeroDocumento+'/'+fileFinal.name.replace(/\s+/g, '_');
    this.estudioPostgrado[index].archivo = fileFinal;
    this.estudioPostgrado[index].ruta=ruta

  }
  seleccionarArchivoEspecialidad(event: any, index: number) {
    const fileEsp: File = event.target.files[0];
    const timestamp = new Date().getTime();
    const nuevoNombre=timestamp + '_' + fileEsp.name
    const fileFinal: File = new File([fileEsp], nuevoNombre);
    const ruta =this.numeroDocumento+'/'+fileFinal.name.replace(/\s+/g, '_');
    this.especializacion[index].archivo = fileFinal;
    this.especializacion[index].ruta=ruta

  }
  seleccionarArchivoCurso(event: any, index: number) {
    const fileCu: File = event.target.files[0];
    const timestamp = new Date().getTime();
    const nuevoNombre=timestamp + '_' + fileCu.name
    const fileFinal: File = new File([fileCu], nuevoNombre);
    const ruta =this.numeroDocumento+'/'+fileFinal.name.replace(/\s+/g, '_');
    this.cursos[index].archivo = fileFinal;
    this.cursos[index].ruta=ruta

  }
  seleccionarArchivoIdioma(event: any, index: number) {
    const fileId: File = event.target.files[0];
    const timestamp = new Date().getTime();
    const nuevoNombre=timestamp + '_' + fileId.name
    const fileFinal: File = new File([fileId], nuevoNombre);
    const ruta =this.numeroDocumento+'/'+fileFinal.name.replace(/\s+/g, '_');
    this.idiomas[index].archivo = fileFinal;
    this.idiomas[index].ruta=ruta

  }
  seleccionarArchivoExpLaboral(event: any, index: number) {
    const fileLa: File = event.target.files[0];
    const timestamp = new Date().getTime();
    const nuevoNombre=timestamp + '_' + fileLa.name
    const fileFinal: File = new File([fileLa], nuevoNombre);
    const ruta =this.numeroDocumento+'/'+fileFinal.name.replace(/\s+/g, '_');
    this.experienciaLaboral[index].archivo = fileFinal;
    this.experienciaLaboral[index].ruta=ruta

  }
  seleccionarArchivoExpDocencia(event: any, index: number) {
    const fileDo: File = event.target.files[0];
    const timestamp = new Date().getTime();
    const nuevoNombre=timestamp + '_' + fileDo.name
    const fileFinal: File = new File([fileDo], nuevoNombre);
    const ruta =this.numeroDocumento+'/'+fileFinal.name.replace(/\s+/g, '_');
    this.laborDocencia[index].archivo = fileFinal;
    this.laborDocencia[index].ruta=ruta

  }
  seleccionarArchivoDiscapacidad(event: any) {
    const fileDo: File = event.target.files[0];
    const timestamp = new Date().getTime();
    const nuevoNombre=timestamp + '_' + fileDo.name
    const fileFinal: File = new File([fileDo], nuevoNombre);
    const ruta =this.numeroDocumento+'/'+fileFinal.name.replace(/\s+/g, '_');
    this.archivoDiscapacidad.push(fileFinal) ;
    this.rutaDiscapacidad=ruta

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
          this.datos = datos.tipoDocumento;
          this.tipoEmpleado = datos.tipoEmpleado;
          this.tipoGrupo = datos.grupo;
          this.regimen = datos.regimen;
          this.tipoSexo = datos.sexo;
          this.tipoGrupoSanguineo = datos.grupoSanguineo;
          this.tipoEstadoCivil = datos.estadoCivil;
          this.tipoParentesco = datos.parentesco;
          this.tipoProfesiones = datos.profesiones;
          this.nivelIdioma = datos.idioma;
          this.nivelCargo=datos.nivel
          this.cargo=datos.cargo
          this.tipoVia=datos.via
          this.tipoZona=datos.zona
          this.unidadOrganica = datos.unidadOrganica;
          this.servicioE = datos.servicio;

        } else {
          errorAlerta('Error', mensaje).then();
        }
      });
  }


  cambioNacionalidad(){
    if(this.tipoDoc=='1'){
      this.nacionalidad='Peruana'
    }else{
      this.nacionalidad=""
    }
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
  

  
  
  registrarEmpleado() {
    console.log(this.via)
    console.log(this.zona)
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
      referenciaDomicilio: this.referenciaDomicilio,
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
    const datosPostgrado =  this.estudioPostgrado 
    const datosEspecializacion = this.especializacion 
    const datosCursos = this.cursos 
    const datosIdiomas = this.idiomas 
    const experienciaLaboral =  this.experienciaLaboral 
    const laborDocencia =  this.laborDocencia 
    const datosPersonales = {     
      tipoDocumento: this.tipoDoc,
      numeroDocumento:this.numeroDocumento,
      codigoAirhsp:this.codigoAirhsp,
      apellidoPaterno: this.aPaterno,
      apellidoMaterno: this.aMaterno,
      nombres: this.nombres,    
      ruc: this.valGroup.controls['ruc'].value,
      estadoCivil: this.estadoCivil,
      sexo: this.sexo,
      grupoSanguineo: this.gSanguineo,
      grupOcupacional:this.grupOcup,
      tipoEmpleado:this.tipoEmp,
      regimen:this.valorRegimen,
      tipoRegimen:this.valortipRegimen,
      fechaNacimiento: this.fNacimiento,
      telefonoFijo: this.valGroup.controls['telFijo'].value,
      telefonoMovil: this.valGroup.controls['telMovil'].value,
      correoElectronico:  this.valGroup.controls['correo'].value, 
      enfAlergias: this.enfAlergias,
      fechaIngreso:this.fechaIngreso,
      unidadOrganica:this.valorUnidad,
      servicio:this.valorServicio,
      rutaFoto:this.rutaFoto,
      nacionalidad:this.nacionalidad,
      cargo:this.valorCargo,
      nivel:this.valorNivel

    }
    const datosContacto = {
      nombreContacto: this.nombreContacto,
      parentesco: this.parentesco,
      numContacto:  this.valGroup.controls['numContacto'].value, 
    }

    const datosDiscapacidad={tipos:this.discapacidades,ruta:this.rutaDiscapacidad}
    const archivoDiscapacidad=this.archivoDiscapacidad 
    const fotoPersonal=this.fotoFile

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
      fotoPersonal,
      archivoDiscapacidad
      
    ).pipe(
      finalize(() => {
        this.loading = false
      })
    ).subscribe(respuesta => {
      const { estado, mensaje, datos } = respuesta;
      if (!estado && datos) {
        errorAlertaValidacion(mensaje,datos);
        return;
      }else if(datos==2){
         warningAlerta('Alerta',mensaje) 
      }else if((datos==1)){
        successAlerta('Éxito', mensaje);
        this.router.navigate(['/legajo/informacion'])

      }else{
         errorAlerta('Error',mensaje)
      }
      
    });
    
  }

}


