import { Component } from '@angular/core';
import { DatoGeneralesService } from '@services/legajo/datos-generales.service';
import { errorAlerta, successAlerta, warningAlerta, errorAlertaValidacion } from "@shared/utils";
import { finalize } from "rxjs";
import { ReniecService } from '@services/general/reniec.service';
import { ExtranjeriaService } from '@services/general/extranjeria.service';
import { reniecClass } from '@classes/servicios/reniec.class';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { MigracionesClass } from '@classes/servicios/migraciones.class';

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
    this.listarsexo()
    this.listarGrupoSanguineo()
    this.listarEstadoCivil()
 
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
    console.log(ruta) 
  }

  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  //FOTO PERSONAL
  fotoPersonal:File []=[]
  rutaFoto:string=""

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
 setDatosFamiliar(datos:reniecClass,index:number){
  this.familiares[index].nombre = datos.nombres;
  this.familiares[index].apellidos =`${datos.apellidoPaterno} ${datos.apellidoMaterno} `;
  this.familiares[index].fechaNacimiento=datos.obtenerFechaNacimiento();
 }
 
 agregarFamiliar() { 
  if(this.familiares.length<=5)this.familiares.push({ nombre: '', apellidos: '', fechaNacimiento: '',dni: '', parentesco: "", centroLaboral: "" });
 }

  agregarEstudioSuperior() {     
  if(this.estudioSuperior.length<=5) this.estudioSuperior.push({ centro: '', especialidad: "", inicio: '', termino: "", nivel: "", archivo: null ,ruta:""  });
}
agregarEstudioPostgrado() { 
  if(this.estudioPostgrado.length<=5) this.estudioPostgrado.push({ centro: '', especialidad: "", inicio: '', termino: "", nivel: "", archivo: null ,ruta:"" }); }
agregarEspecializacion() { 
if(this.especializacion.length<=5) this.especializacion.push({ centro: '', materia: "", inicio: '', termino: "", certificacion: "", archivo: null,ruta:"" }); }
agregarCursos() { 
if(this.cursos.length<=5)  this.cursos.push({ centro: '', materia: "", inicio: '', termino: "", certificacion: "", archivo:null ,ruta:""  }); }
agregarIdioma() { 
 if(this.idiomas.length<=4) this.idiomas.push({ lenguaE: '', basico: "", intermedio: '', avanzado: "", archivo: "",ruta:""  }); }
agregarExperiencia() {
 if(this.seleccionarArchivoExpLaboral.length<=10)  this.experienciaLaboral.push({ institucion: '', cargo: "", inicio: '', termino: "", archivo:""}); }
agregarDocencia() {
  if(this.laborDocencia.length<=10) this.laborDocencia.push({ centroEnseñanza: '', curso: "", inicio: '', termino: "", archivo: "",ruta: ""}); 
 }


  eliminarItem(index: number, nombre: keyof RegistrarEmpleadoComponent) { this[nombre].splice(index, 1); }

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
  
  listarsexo() {
    this.DatoGeneralesService$.listarSexo()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(({ estado, mensaje, datos }) => {
        if (estado) {
          datos.length > 0 ? this.agregable = false : this.agregable = true;
          this.tipoSexo = datos;
        } else {
          errorAlerta('Error', mensaje).then();
        }
      });
  }
  listarGrupoSanguineo() {
    this.DatoGeneralesService$.listarGrupoSanguineo()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(({ estado, mensaje, datos }) => {
        if (estado) {
          datos.length > 0 ? this.agregable = false : this.agregable = true;
          this.tipoGrupoSanguineo = datos;
        } else {
          errorAlerta('Error', mensaje).then();
        }
      });
  }
  listarEstadoCivil() {
    this.DatoGeneralesService$.listarEstadoCivil()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(({ estado, mensaje, datos }) => {
        if (estado) {
          datos.length > 0 ? this.agregable = false : this.agregable = true;
          this.tipoEstadoCivil = datos;
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
      apellidoPaterno: this.aPaterno.toUpperCase(),
      apellidoMaterno: this.aMaterno.toUpperCase(),
      nombres: this.nombres.toUpperCase(),    
      ruc: this.ruc,
      estadoCivil: this.estadoCivil,
      sexo: this.sexo,
      grupoSanguineo: this.gSanguineo,
      grupOcupacional:this.grupOcup,
      tipoEmpleado:this.tipoEmp,
      regimen:this.valorRegimen,
      tipoRegimen:this.valortipRegimen,
      fechaNacimiento: this.fNacimiento,
      telefonoFijo: this.tFijo,
      telefonoMovil: this.tMovil,
      correoElectronico: this.correoE.toUpperCase(),         
      enfAlergias: this.enfAlergias.toUpperCase(),
      fechaIngreso:this.fechaIngreso,
      unidadOrganica:this.valorUnidad,
      servicio:this.valorServicio,
      rutaFoto:this.rutaFoto

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
     fotoPersonal
      
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




    
  }

}


