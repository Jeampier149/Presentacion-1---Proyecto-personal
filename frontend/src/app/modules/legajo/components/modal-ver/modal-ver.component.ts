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
    fotoP: any;

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

    openModal(id: string) {

        this.listarDatosEmpleado(id)
        this.listarDatosDiscapacidad(id)
        this.listarContactoEmergencia(id)
        this.listarDatosDomicilio(id)
        this.listarDatosFamiliar(id)
        this.listarDatosProfesion(id)
        this.listarDatosEstudioSuperior(id)
        this.listarDatosEstudioPostgrado(id)
        this.listarDatosEstudioEspecializacion(id)
        this.listarDatosEstudioCursos(id)
        this.listarDatosEstudioIdioma(id)
        this.listarDatosExperienciaLaboral(id)
        this.listarDatosExperienciaDocencia(id)
        
        this.modalEl.show();
    }

    closeModal() {
        this.modalEl.hide();
    }

    listarDatosEmpleado(id: string) {
        this.loading = true;
        this.ModalDatosService$.listarDatosEmpleado(id)
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
                this.setDatosEmpleado(datos[0]);
            });
    }
    listarDatosDiscapacidad(id: string) {
        this.loading = true;
        this.ModalDatosService$.listarDatosDiscapacidad(id)
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
                this.tipoDiscapacidad = datos;
            });
    }
    listarDatosDomicilio(id: string) {
        this.loading = true;
        this.ModalDatosService$.listarDatosDomicilio(id)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe((respuesta) => {
                const { estado, datos } = respuesta;
                console.log(respuesta);
                if (!estado) {
                    return;
                }
                this.setDatosDomicilio(datos[0]);
            });
    }
    listarDatosFamiliar(id: string) {
        this.loading = true;
        this.ModalDatosService$.listarDatosFamiliares(id)
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
                this.familiares = datos;
            });
    }
    listarContactoEmergencia(id: string) {
        this.loading = true;
        this.ModalDatosService$.listarDatosContacto(id)
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
                this.setDatosConctactoEmergencia(datos[0]);
            });
    }
    listarDatosProfesion(id: string) {
        this.loading = true;
        this.ModalDatosService$.listarDatosProfesion(id)
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
                this.setDatosProfesion(datos[0]);
            });
    }
    listarDatosEstudioSuperior(id: string) {
        this.loading = true;
        this.ModalDatosService$.listarDatosEstudioSuperior(id)
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
                this.estudioSuperior = datos;
            });
    }
    listarDatosEstudioPostgrado(id: string) {
        this.loading = true;
        this.ModalDatosService$.listarDatosEstudioPostgrado(id)
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
                this.estudioPostgrado = datos;
            });
    }
    listarDatosEstudioEspecializacion(id: string) {
        this.loading = true;
        this.ModalDatosService$.listarDatosEstudioEspecializacion(id)
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
                this.especializacion = datos;
            });
    }
    listarDatosEstudioCursos(id: string) {
        this.loading = true;
        this.ModalDatosService$.listarDatosEstudioCursos(id)
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
                this.cursos = datos;
            });
    }
    listarDatosEstudioIdioma(id: string) {
        this.loading = true;
        this.ModalDatosService$.listarDatosEstudioIdioma(id)
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
                this.idiomas = datos;
            });
    }
    listarDatosExperienciaLaboral(id: string) {
        this.loading = true;
        this.ModalDatosService$.listarDatosExperienciaLaboral(id)
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
                this.experienciaLaboral = datos;
            });
    }
    listarDatosExperienciaDocencia(id: string) {
        this.loading = true;
        this.ModalDatosService$.listarDatosExperienciaDocencia(id)
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
                this.laborDocencia = datos;
            });
    }
    listarFoto(ruta: any) {
        this.fotoP = '';
        if (ruta !== '') {
            this.descargarArchivo(ruta);
            console.log(this.fotoP)
            console.log('no hay ruta');
        }
    }

    setDatosEmpleado(datos: any) {
        this.tipoDoc = datos.tipoDocumento;
        this.numeroDocumento = datos.numeroDocumento;
        this.nacionalidad = datos.nacionalidad;
        this.aPaterno = datos.apellidoPaterno;
        this.aMaterno = datos.apellidoMaterno;
        this.nombres = datos.nombre;
        this.sexo = datos.sexo;
        this.ruc = datos.ruc;
        this.fNacimiento = datos.fechaNacimiento;
        this.tFijo = datos.telFijo;
        this.tMovil = datos.telFijo;
        this.correoE = datos.correo;
        this.gSanguineo = datos.grupSanguineo;
        this.enfAlergias = datos.enferAlergia;
        this.estadoCivil = datos.estadoCivil;
        this.tipoEmp = datos.condicion;
        this.grupOcup = datos.grupOcupacional;
        this.valorRegimen = datos.regimen;
        this.valortipRegimen = datos.tipoRegimen;
        this.valorUnidad = datos.unidadOrganica;
        this.valorServicio = datos.servicio;
        this.codigoAirhsp = datos.codigoAirhsp;
        this.fechaIngreso = datos.fechaIngreso;
        this.estado = datos.estado;
        this.listarFoto(datos.rutaFoto);
    }

    setDatosConctactoEmergencia(datos: any) {
        this.nombreContacto = datos.nombre;
        this.parentesco = datos.parentesco;
        this.numContacto = datos.telefono;
    }
    setDatosDomicilio(datos: any) {
        this.departamento = datos.departamento;
        this.provincia = datos.provincia;
        this.distrito = datos.distrito;
        this.via = datos.tipoVia;
        this.nombreVia = datos.nombreVia;
        this.numeroVia = datos.numeroVia;
        this.interiorVia = datos.interiorVia;
        this.zona = datos.tipoZona;
        this.nombreZona = datos.nombreZona;
        this.numeroZona = datos.numeroZona;
        this.interiorZona = datos.interiorZona;
        this.referenciaDomicilio = datos.referencia;
    }
    setDatosProfesion(datos: any) {
        this.profesion = datos.profesion;
        this.fechColeg = datos.fechaInicio;
        this.lugarColeg = datos.lugar;
        this.fechTerColeg = datos.fechaTermino;
        this.numColeg = datos.numeroCole;
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
        this.fotoP = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.archivoUrl
        );
    }
}
