import { ModalDatosService } from './../../../../services/legajo/modal-datos.service';
import { Modal } from 'bootstrap';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { errorAlertaValidacion } from '@shared/utils';
import { ModalVerArchivoComponent } from '../modal-ver-archivo/modal-ver-archivo.component';
@Component({
    selector: 'app-modal-ver',
    templateUrl: './modal-ver.component.html',
    styleUrl: './modal-ver.component.scss',
})
export class ModalVerComponent {
    pkEmpleado: string = '';
    estado: string = '';

    //--VALOR ---//
    valorRegimen: any = '';
    valortipRegimen: any = '';
    valorNivel: string = '';
    valorCargo: string = '';
    valorServicio: string = '';
    valorUnidad: string = '';
    codigoAirhsp: string = '';
    //---DATOS PERSONALES FORM
    tipoDoc: string = '';
    numeroDocumento: string = '';
    nacionalidad: string = '';
    tipoEmp: string = '';
    grupOcup: string = '';
    aPaterno: string = '';
    aMaterno: string = '';
    nombres: string = '';
    sexo: string = '';
    ruc: string = '';
    fNacimiento: string = '';
    tFijo: string = '';
    tMovil: string = '';
    correoE: string = '';
    gSanguineo: string = '';
    enfAlergias: string = '';
    estadoCivil: string = '';
    //--datos contacto emergencia--//
    nombreContacto: string = '';
    parentesco: string = '';
    numContacto: string = '';
    //--datos domiclio--//
    departamento: string = '';
    provincia: string = '';
    distrito: string = '';
    via: string = '';
    nombreVia: string = '';
    numeroVia: string = '';
    interiorVia: string = '';
    zona: string = '';
    nombreZona: string = '';
    numeroZona: string = '';
    interiorZona: string = '';
    referenciaDomicilio: string = '';
    ubigeo: string = '';
    //---Datos discapacidad---//
    tipoDiscapacidad: any[] = [];
    //--TABLAS DE INGRESO DE DATOS---
    familiares: any[] = [];
    estudioSuperior: any[] = [];

    profesion: string = '';
    lugarColeg: string = '';
    fechColeg: string = '';
    fechTerColeg: string = '';
    numColeg: string = '';

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
    archivoSuperior: any[] = [];
    archivoPostgrado: any[] = [];
    archivoCursos: any[] = [];
    fechaIngreso: string = '';

    archivoUrl: any;
    imagenPdf:any
    fotoP: any;
    rutaF:any;
  
    @ViewChild('selFocus') selFocus!: ElementRef;
    @ViewChild('modalDatos') modalEl!: any;
    @ViewChild(ModalVerArchivoComponent) modalFrame?: ModalVerArchivoComponent;

    constructor(
        private ModalDatosService$: ModalDatosService,
        private sanitizer: DomSanitizer
    ) {}

    ngAfterViewInit() {
        this.modalEl = new Modal(this.modalEl.nativeElement, {
            backdrop: 'static',
            keyboard: false,
        });
    }

    openModal(numeroDoc:string) {
        this.listarDatos(numeroDoc)        
        this.modalEl.show();
    }

    closeModal() {
        this.modalEl.hide();
    }

    listarDatos(numeroDoc:string){
      
      this.loading = true;
      this.ModalDatosService$.listarDatos(numeroDoc)
          .pipe(
              finalize(() => {
                  this.loading = false;
              })
          )
          .subscribe((respuesta) => {
              const { estado, datos } = respuesta;
              if (!estado) {
                  return;
              }
              this.setDatosEmpleado(datos.datosEmpleado[0])
              this.setDatosConctactoEmergencia(datos?.datosContactoEmergencia[0])
              this.setDatosDomicilio(datos?.datosDomicilio[0])
              this.setDatosProfesion(datos?.datosProfesion[0])
              this.familiares=datos?.datosFamiliares;
              this.estudioSuperior=datos?.datosEstudioSuperior
              this.especializacion=datos?.datosEstudioEspecializacion
              this.estudioPostgrado=datos?.datosEstudioPostgrado
              this.cursos=datos?.datosEstudioCursos
              this.idiomas=datos.datosEstudioIdioma
              this.tipoDiscapacidad=datos?.datosDiscapacidad
              this.experienciaLaboral=datos?.datosExperienciaLaboral
              this.laborDocencia=datos?.datosExperienciaDocencia
          });
    }
 
    listarFoto(ruta: any) {
        this.fotoP = '';
        if (ruta =='default/perfil.png') {
            this.fotoP="./assets/perfil.png"
        }  

        this.descargarArchivo(ruta);
        
    }
  
    setDatosEmpleado(datos: any) {
        this.tipoDoc = datos?.tipoDocumento;
        this.numeroDocumento = datos?.numeroDocumento;
        this.nacionalidad = datos?.nacionalidad;
        this.aPaterno = datos?.apellidoPaterno;
        this.aMaterno = datos?.apellidoMaterno;
        this.nombres = datos?.nombre;
        this.sexo = datos?.sexo;
        this.ruc = datos?.ruc;
        this.fNacimiento = datos?.fechaNacimiento;
        this.tFijo = datos?.telFijo;
        this.tMovil = datos?.telMovil;
        this.correoE = datos?.correo;
        this.gSanguineo = datos?.grupSanguineo;
        this.enfAlergias = datos?.enferAlergia;
        this.estadoCivil = datos?.estadoCivil;
        this.tipoEmp = datos?.condicion;
        this.grupOcup = datos?.grupOcupacional;
        this.valorRegimen = datos?.regimen;
        this.valortipRegimen = datos?.tipoRegimen;
        this.valorUnidad = datos?.unidadOrganica;
        this.valorServicio = datos?.servicio;
        this.valorCargo = datos?.cargo;
        this.valorNivel = datos?.nivel;
        this.codigoAirhsp = datos?.codigoAirhsp;
        this.fechaIngreso = datos?.fechaIngreso;
        this.estado = datos?.estado;
        this.rutaF=datos?.rutaFoto

        this.listarFoto(datos?.rutaFoto);
    }

    setDatosConctactoEmergencia(datos: any) {
        this.nombreContacto = datos?.nombre;
        this.parentesco = datos?.parentesco;
        this.numContacto = datos?.telefono;
    }
    setDatosDomicilio(datos: any) {
        this.departamento = datos?.departamento;
        this.provincia = datos?.provincia;
        this.distrito = datos?.distrito;
        this.via = datos?.tipoVia;
        this.nombreVia = datos?.nombreVia;
        this.numeroVia = datos?.numeroVia;
        this.interiorVia = datos?.interiorVia;
        this.zona = datos?.tipoZona;
        this.nombreZona = datos?.nombreZona;
        this.numeroZona = datos?.numeroZona;
        this.interiorZona = datos?.interiorZona;
        this.referenciaDomicilio = datos?.referencia;
    }
    setDatosProfesion(datos: any) {
        this.profesion = datos?.profesion;
        this.fechColeg = datos?.fechaInicio;
        this.lugarColeg = datos?.lugar;
        this.fechTerColeg = datos?.fechaTermino;
        this.numColeg = datos?.numeroCole;
    }

    descargarArchivo(ruta: string, tipo?: string) {
        this.loading = true;
        this.ModalDatosService$.verArchivo(ruta)
            .pipe(
                finalize(() => {
                  this.loading = false;
                })
            )
            .subscribe((data) => {
                this.imagenPdf=data
                this.archivoUrl = URL.createObjectURL(data);
                switch (tipo) {
                    case 'descargar':
                        this.descargarArchivoLocalmente(ruta);
                        break;
                    case 'ver':
                        this.verArchivoEnModal();
                        break;
                    default:
                        this.mostrarArchivoEnFotoP();
                        break;
                }
            });
    }

    descargarArchivoLocalmente(ruta: string) {
        const enlace = document.createElement('a');
        enlace.href = this.archivoUrl;
        enlace.download = 'archiv_legajo_' + ruta;
        enlace.click();
    }

    verArchivoEnModal() {
        this.modalFrame?.openModal(this.archivoUrl);
    }

    mostrarArchivoEnFotoP() {
        this.fotoP = this.sanitizer.bypassSecurityTrustResourceUrl( this.archivoUrl );

    }

    generarReporte(){
        this.guardarImagen(this.imagenPdf);
        this.ModalDatosService$.generarPdf(this.numeroDocumento,this.fotoP)
            .pipe(
                finalize(() => {
                  this.loading = false;
                })
            )
            .subscribe((response:Blob) => {
            const fileURL = URL.createObjectURL(response);
            const downloadLink = document.createElement('a');
            downloadLink.href = fileURL;
            downloadLink.download =this.numeroDocumento;
            document.body.appendChild(downloadLink);
            downloadLink.click();

             this.eliminarImagen(this.numeroDocumento)
            });
    }
    guardarImagen(imagen:any){
        console.log(imagen)
        const formData = new FormData();
        formData.append('imagen',imagen,this.numeroDocumento);
        this.ModalDatosService$.guardarImagen(formData)
            .pipe(
                finalize(() => {
                  this.loading = false;
                })
            ) 
            .subscribe((response:any) => {
               console.log(response)
            });            
    }
    eliminarImagen(numDoc:any){
        this.ModalDatosService$.eliminarImagen(numDoc)
            .pipe(
                finalize(() => {
                  this.loading = false;
                })
            ) 
            .subscribe((response:any) => {
               console.log(response)
            });     
    }

}
