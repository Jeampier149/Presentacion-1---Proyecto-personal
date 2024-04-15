import { Component, OnInit, ViewChild } from '@angular/core';
import { DatoGeneralesService } from '@services/legajo/datos-generales.service';
import {
    errorAlerta,
    successAlerta,
    warningAlerta,
    errorAlertaValidacion,
} from '@shared/utils';
import { finalize } from 'rxjs';
import { ReniecService } from '@services/general/reniec.service';
import { ExtranjeriaService } from '@services/general/extranjeria.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalDatosService } from '@services/legajo/modal-datos.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalTomarFotoComponent } from '@modules/legajo/components/modal-tomar-foto/modal-tomar-foto.component';
@Component({
    selector: 'app-editar-empleado',
    templateUrl: './editar-empleado.component.html',
    styleUrl: './editar-empleado.component.scss',
})
export class EditarEmpleadoComponent implements OnInit {
    numDoc: string = '';
    @ViewChild(ModalTomarFotoComponent) modalTomarFoto?: any;
    constructor(
        private DatoGeneralesService$: DatoGeneralesService,
        private ReniecService$: ReniecService,
        private ExtranjeriaService$: ExtranjeriaService,
        private route: ActivatedRoute,
        private ModalDatosService$: ModalDatosService,
        private sanitizer: DomSanitizer
    ) {
        this.inicializarVariables();
        this.listarSelects();
    }
    ngOnInit() {
        this.numDoc = this.route.snapshot.paramMap.get('numDoc')!;
        this.listarDatos(this.numDoc);
    }

    //DORPZONE IMAGEN
    files: File[] = [];
    fotoFile: any[] = [];
    archivoDiscapacidad: File[] = [];
    onSelect(event: any) {
        this.files = [];
        this.files.push(event.addedFiles[0]);
        const file = event.addedFiles[0];
        const timestamp = new Date().getTime();
        const nuevoNombre = timestamp + '_' + file.name;
        const fileFinal: File = new File([file], nuevoNombre);
        this.fotoFile.push(fileFinal);

        const ruta =
            this.valDatosPersonales?.get('numDoc')?.value +
            '/' +
            fileFinal.name.replace(/\s+/g, '_');
        this.valDatosPersonales.controls['rutaFoto'].setValue(ruta);
    }

    onRemove(event: any) {
        console.log(event);
        this.files.splice(this.files.indexOf(event), 1);
    }
    //FOTO PERSONAL
    fotoPersonal: File[] = [];

    archivoUrl: any;
    fotoP: any;
    //DEFAULT
    rutas: any;
    loading: boolean = false;

    discapacidad: string = 'Si';
    agregable: boolean = false;
    //---ARRAYS DE SELECTS---//
    datos: any[] = [];
    tipoEmpleado: any[] = [];
    tipoGrupo: any[] = [];
    regimen: any[] = [];
    tipoRegimen: any[] = [];
    tipoSexo: any[] = [];
    tipoGrupoSanguineo: any[] = [];
    tipoEstadoCivil: any[] = [];
    tipoParentesco: any[] = [];
    tipoProfesiones: any[] = [];
    nivelIdioma: any[] = [];
    cargo: any[] = [];
    nivelCargo: any[] = [];
    tipoVia: any[] = [];
    tipoZona: any[] = [];
    unidadOrganica: any[] = [];
    servicioE: any[] = [];

    ubigeo: string = '';
    //---Datos discapacidad---//
    rutaDiscapacidad: string = '';

    atp = [
        { id: 1, tipo: 'Fisica', estado: 'A' },
        { id: 2, tipo: 'Sensorial', estado: 'A' },
        { id: 4, tipo: 'Mental', estado: 'A' },
        { id: 3, tipo: 'Intelectual', estado: 'A' },
    ];
    discapacidades: any[] = [];
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

    //arrays de archivos
    archivoSuperior: any[] = [];
    archivoPostgrado: any[] = [];
    archivoCursos: any[] = [];
    fechaIngreso: string = '';

    //mostrar divs
    divFamiliar: boolean = false;
    divSuperior: boolean = false;
    divPostgrado: boolean = false;
    divEspecializacion: boolean = false;
    divCursos: boolean = false;
    divIdioma: boolean = false;
    divExperienciaLaboral: boolean = false;
    divExperienciaDocencia: boolean = false;
    //formocntrol

    valDatosPersonales!: FormGroup;
    valContactoEmergencia!: FormGroup;
    valDatosDomicilio!: FormGroup;
    valDatosProfesion!: FormGroup;
    valSituacionLaboral!:FormGroup;

    inicializarVariables() {
        this.valDatosPersonales = new FormGroup({
            tipoDocumento: new FormControl({ value: '', disabled: true }),
            numDoc: new FormControl({ value: '', disabled: true }),
            nacionalidad: new FormControl({ value: '', disabled: true }),
            aPaterno: new FormControl({ value: '', disabled: true }),
            aMaterno: new FormControl({ value: '', disabled: true }),
            nombres: new FormControl({ value: '', disabled: true }),
            sexo: new FormControl({ value: '', disabled: true }),
            ruc: new FormControl('', [
                Validators.required,
                Validators.pattern('[0-9]{11}'),
            ]),
            fechaNacimiento: new FormControl({ value: '', disabled: true }),
            telFijo: new FormControl('', [Validators.pattern('^[0-9]*$')]),
            telMovil: new FormControl('', [Validators.pattern('^[0-9]*$')]),
            correo: new FormControl('', { validators: Validators.email }),
            grupoSanguineo: new FormControl({ value: '', disabled: true }),
            estadoCivil: new FormControl(''),
            rutaFoto: new FormControl(''),
            enfAlergias: new FormControl(''),
        });
        this.valSituacionLaboral = new FormGroup({
            id: new FormControl(''),
            condicion: new FormControl(''),
            grupOcup: new FormControl(''),
            regimen: new FormControl(''),
            tipoRegimen: new FormControl(''),
            unidad: new FormControl(''),
            servicio: new FormControl(''),
            cargo: new FormControl(''),
            nivelCargo: new FormControl(''),
            airhsp: new FormControl(''),
            fechaIngreso: new FormControl('')
        });

        this.valContactoEmergencia = new FormGroup({
            nombreContacto: new FormControl(''),
            parentesco: new FormControl(''),
            id: new FormControl(''),
            numContacto: new FormControl('', [Validators.pattern('^[0-9]*$')]),
        });

        this.valDatosDomicilio = new FormGroup({
            departamento: new FormControl(''),
            provincia: new FormControl(''),
            distrito: new FormControl(''),
            via: new FormControl(''),
            nombreVia: new FormControl(''),
            ubigeo: new FormControl(''),
            numeroVia: new FormControl(''),
            interiorVia: new FormControl(''),
            zona: new FormControl(''),
            nombreZona: new FormControl(''),
            numeroZona: new FormControl(''),
            interiorZona: new FormControl(''),
            referencia: new FormControl(''),
            id: new FormControl(''),
        });

        this.valDatosProfesion = new FormGroup({
            profesion: new FormControl(''),
            lugarColeg: new FormControl(''),
            fechColeg: new FormControl(''),
            fechTerColeg: new FormControl(''),
            numColeg: new FormControl(''),
            id: new FormControl(''),
        });
    }

    buscarDocumentoFamiliar(documento: string, index: number, tipoD: string) {
        this.loading = true;
        this.mensajeLoading = 'Buscando Documento...';
        if (tipoD == 'DNI') {
            this.mensajeLoading = 'Buscando en RENIEC...';
            this.ReniecService$.buscarDni(documento)
                .pipe(
                    finalize(() => {
                        this.loading = false;
                        this.mensajeLoading = 'Cargando...';
                    })
                )
                .subscribe(({ estado, datos }) => {
                    if (estado && datos) {
                        this.setDatosFamiliar(datos, index);
                    }
                });
        } else if (tipoD == 'CARNET EXTRANJERIA') {
            this.mensajeLoading = 'Buscando en MIGRACIONES...';
            this.ExtranjeriaService$.buscarMigraciones(documento)
                .pipe(
                    finalize(() => {
                        this.loading = false;
                        this.mensajeLoading = 'Cargando...';
                    })
                )
                .subscribe(({ estado, datos }) => {
                    if (estado && datos) {
                        this.setDatosFamiliar(datos, index);
                    }
                });
        } else {
            errorAlerta(
                'Error',
                'No se dispone del servicio en estos momentos.'
            ).then();
        }
    }

    listarDatos(numeroDoc: string) {
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
                this.setDatosEmpleado(datos.datosEmpleado[0]);
                this.setSituacionLaboral(datos.datosEmpleado[0]);
                this.setDatosConctactoEmergencia(
                    datos.datosContactoEmergencia[0]
                );
                this.setDatosDomicilio(datos.datosDomicilio[0]);
                this.setDatosProfesion(datos.datosProfesion[0]);
                this.familiares = datos.datosFamiliares;
                this.estudioSuperior = datos.datosEstudioSuperior;
                this.especializacion = datos.datosEstudioEspecializacion;
                this.estudioPostgrado = datos.datosEstudioPostgrado;
                this.cursos = datos.datosEstudioCursos;
                this.idiomas = datos.datosEstudioIdioma;
                this.experienciaLaboral = datos.datosExperienciaLaboral;
                this.laborDocencia = datos.datosExperienciaDocencia;

                datos.datosDiscapacidad.forEach((t: any) => {
                    this.discapacidades.push(t.tipo);
                });
            });
        console.log(this.discapacidades);
    }
    listarFoto(ruta: any) {
        this.fotoP = '';
        if (ruta !== '') {
            this.descargarArchivo(ruta);
        }
    }
    setDatosEmpleado(datos: any) {
       console.log(datos)
        this.valDatosPersonales.controls['tipoDocumento']?.setValue(
            datos.tipoDocumento
        );
        this.valDatosPersonales.controls['numDoc']?.setValue(
            datos.numeroDocumento
        );
        this.valDatosPersonales.controls['nacionalidad']?.setValue(
            datos.nacionalidad
        );
        this.valDatosPersonales.controls['aPaterno']?.setValue(
            datos.apellidoPaterno
        );
        this.valDatosPersonales.controls['aMaterno']?.setValue(
            datos.apellidoMaterno
        );
        this.valDatosPersonales.controls['nombres'].setValue(datos?.nombre);
        this.valDatosPersonales.controls['sexo'].setValue(datos?.sexo);
        this.valDatosPersonales.controls['ruc'].setValue(datos?.ruc);
        this.valDatosPersonales.controls['fechaNacimiento'].setValue(datos?.fechaNacimiento);
        this.valDatosPersonales.controls['telFijo'].setValue(datos?.telFijo);
        this.valDatosPersonales.controls['telMovil'].setValue(datos?.telMovil);
        this.valDatosPersonales.controls['correo'].setValue(datos?.correo);
        this.valDatosPersonales.controls['grupoSanguineo'].setValue(
            datos?.grupSanguineo
        );
        this.valDatosPersonales.controls['enfAlergias'].setValue(
            datos?.enferAlergia
        );
        this.valDatosPersonales.controls['estadoCivil'].setValue(
            datos?.estadoCivil
        );
        this.valDatosPersonales.controls['rutaFoto'].setValue(datos?.rutaFoto);
        this.listarFoto(datos?.rutaFoto);


    }
 

    setSituacionLaboral(datos:any){
        this.valSituacionLaboral.controls['id'].setValue(datos?.idHistorial); 
        this.valSituacionLaboral.controls['condicion'].setValue(datos?.idCondicion); 
        this.valSituacionLaboral.controls['grupOcup'].setValue(datos?.idGrupO); 
        this.valSituacionLaboral.controls['regimen'].setValue(datos?.idRegimen); 
        this.listarTipoRegimen(datos?.idRegimen)
        this.valSituacionLaboral.controls['tipoRegimen'].setValue(datos?.idTipoRegimen); 
        this.valSituacionLaboral.controls['unidad'].setValue(datos?.idUnidadOrganica); 
        this.valSituacionLaboral.controls['servicio'].setValue(datos?.idServicio); 
        this.valSituacionLaboral.controls['cargo'].setValue(datos?.idCargo); 
        this.valSituacionLaboral.controls['nivelCargo'].setValue(datos?.nivel); 
        this.valSituacionLaboral.controls['airhsp'].setValue(datos?.codigoAirhsp); 
        this.valSituacionLaboral.controls['fechaIngreso'].setValue(datos?.fechaIngreso); 


    }
    setDatosConctactoEmergencia(datos: any) {

            this.valContactoEmergencia.controls['nombreContacto'].setValue(
                datos?.nombre
            );
            this.valContactoEmergencia.controls['parentesco'].setValue(
                datos?.parentesco
            );
            this.valContactoEmergencia.controls['numContacto'].setValue(
                datos?.telefono
            );
            this.valContactoEmergencia.controls['id'].setValue(datos?.id);
        
        
    }
    setDatosDomicilio(datos: any) {
        this.valDatosDomicilio.controls['departamento'].setValue(
            datos?.departamento
        );
        this.valDatosDomicilio.controls['provincia'].setValue(datos?.provincia);
        this.valDatosDomicilio.controls['distrito'].setValue(datos?.distrito);
        this.valDatosDomicilio.controls['via'].setValue(datos?.tipoVia);
        this.valDatosDomicilio.controls['nombreVia'].setValue(datos?.nombreVia);
        this.valDatosDomicilio.controls['numeroVia'].setValue(datos?.numeroVia);
        this.valDatosDomicilio.controls['interiorVia'].setValue(
            datos?.interiorVia
        );
        this.valDatosDomicilio.controls['zona'].setValue(datos?.tipoZona);
        this.valDatosDomicilio.controls['nombreZona'].setValue(
            datos?.nombreZona
        );
        this.valDatosDomicilio.controls['numeroZona'].setValue(
            datos?.numeroZona
        );
        this.valDatosDomicilio.controls['interiorZona'].setValue(
            datos?.interiorZona
        );
        this.valDatosDomicilio.controls['referencia'].setValue(
            datos?.referencia
        );
        this.valDatosDomicilio.controls['ubigeo'].setValue(datos?.ubigeo);
        this.valDatosDomicilio.controls['id'].setValue(datos?.id);
    }
    setDatosProfesion(datos: any) {
        this.valDatosProfesion.controls['profesion'].setValue(datos?.profesion);
        this.valDatosProfesion.controls['fechColeg'].setValue(
            datos?.fechaInicio
        );
        this.valDatosProfesion.controls['fechTerColeg'].setValue(
            datos?.fechaTermino
        );
        this.valDatosProfesion.controls['lugarColeg'].setValue(datos?.lugar);
        this.valDatosProfesion.controls['numColeg'].setValue(datos?.numeroCole);
        this.valDatosProfesion.controls['id'].setValue(datos?.id);
    }

    setDatosFamiliar(datos: any, index: number) {
        this.familiares[index].nombre = datos?.nombres;
        this.familiares[
            index
        ].apellidos = `${datos.apellidoPaterno} ${datos?.apellidoMaterno} `;
        this.familiares[index].fechaNacimiento = this.obtenerFechaNacimiento(
            datos?.fechaNacimiento
        );
    }

    obtenerFechaNacimiento(fechaNacimiento: any) {
        return (
            fechaNacimiento.slice(0, 4) +
            '-' +
            fechaNacimiento.slice(4, 6) +
            '-' +
            fechaNacimiento.slice(6, 8)
        );
    }

    agregarFamiliar() {
        this.divFamiliar = false;
        if (this.familiares.length <= 5)
            this.familiares.push({
                id: '',
                nombre: '',
                apellidos: '',
                fechaNacimiento: '',
                tipoD: '',
                dni: '',
                parentesco: '',
                centroLaboral: '',
                estado: '',
            });
    }

    agregarEstudioSuperior() {
        this.divSuperior = false;
        if (this.estudioSuperior.length <= 5)
            this.estudioSuperior.push({
                id: '',
                tipo: '',
                centro: '',
                especialidad: '',
                inicio: '',
                termino: '',
                nivel: '',
                archivo: null,
                ruta: '',
                estado: '',
            });
    }
    agregarEstudioPostgrado() {
        this.divPostgrado = false;
        if (this.estudioPostgrado.length <= 5)
            this.estudioPostgrado.push({
                id: '',
                tipo: '',
                centro: '',
                especialidad: '',
                inicio: '',
                termino: '',
                nivel: '',
                archivo: null,
                ruta: '',
                estado: '',
            });
    }
    agregarEspecializacion() {
        this.divEspecializacion = false;
        if (this.especializacion.length <= 5)
            this.especializacion.push({
                id: '',
                tipo: '',
                centro: '',
                materia: '',
                inicio: '',
                termino: '',
                certificacion: '',
                archivo: null,
                ruta: '',
                estado: '',
            });
    }
    agregarCursos() {
        this.divCursos = false;
        if (this.cursos.length <= 5)
            this.cursos.push({
                id: '',
                tipo: '',
                centro: '',
                materia: '',
                inicio: '',
                termino: '',
                certificacion: '',
                archivo: null,
                ruta: '',
                estado: '',
            });
    }
    agregarIdioma() {
        this.divIdioma = false;
        if (this.idiomas.length <= 4)
            this.idiomas.push({
                id: '',
                lenguaE: '',
                nivel: '',
                archivo: null,
                ruta: '',
                estado: '',
            });
    }
    agregarExperiencia() {
        this.divExperienciaLaboral = false;
        if (this.experienciaLaboral.length <= 10)
            this.experienciaLaboral.push({
                id: '',
                institucion: '',
                cargo: '',
                inicio: '',
                termino: '',
                archivo: null,
                ruta: '',
                estado: '',
            });
    }
    agregarDocencia() {
        this.divExperienciaDocencia = false;
        if (this.laborDocencia.length <= 10)
            this.laborDocencia.push({
                id: '',
                centro: '',
                curso: '',
                inicio: '',
                termino: '',
                archivo: null,
                ruta: '',
            });
    }

    eliminarItem(index: number, nombre: keyof EditarEmpleadoComponent) {
        this[nombre][index].estado = '*';
    }
    sinDatosFamiliares() {
        this.divFamiliar = true;
        this.familiares = [];
    }
    sinDatosSuperiores() {
        this.divSuperior = true;
        this.estudioSuperior = [];
    }
    sinDatosPostgrado() {
        this.divPostgrado = true;
        this.estudioPostgrado = [];
    }
    sinDatosEspecializacion() {
        this.divEspecializacion = true;
        this.especializacion = [];
    }
    sinDatosCursos() {
        this.divCursos = true;
        this.cursos = [];
    }
    sinDatosIdiomas() {
        this.divIdioma = true;
        this.idiomas = [];
    }
    sinDatosExperienciaLaboral() {
        this.divExperienciaLaboral = true;
        this.experienciaLaboral = [];
    }

    sinDatosExperienciaDocencia() {
        this.divExperienciaDocencia = true;
        this.laborDocencia = [];
    }

    seleccionarArchivoEst(event: any, index: number) {
        const fileEs: File = event.target.files[0];
        const timestamp = new Date().getTime();
        const nuevoNombre = timestamp + '_' + fileEs.name;
        const fileFinal: File = new File([fileEs], nuevoNombre);
        const ruta =
            this.valDatosPersonales?.get('numDoc')?.value +
            '/' +
            fileFinal.name.replace(/\s+/g, '_');
        this.estudioSuperior[index].archivo = fileFinal;
        this.estudioSuperior[index].ruta = ruta;
    }

    seleccionarArchivoPg(event: any, index: number) {
        const filePost: File = event.target.files[0];
        const timestamp = new Date().getTime();
        const nuevoNombre = timestamp + '_' + filePost.name;
        const fileFinal: File = new File([filePost], nuevoNombre);
        const ruta =
            this.valDatosPersonales?.get('numDoc')?.value +
            '/' +
            fileFinal.name.replace(/\s+/g, '_');
        this.estudioPostgrado[index].archivo = fileFinal;
        this.estudioPostgrado[index].ruta = ruta;
    }
    seleccionarArchivoEspecialidad(event: any, index: number) {
        const fileEsp: File = event.target.files[0];
        const timestamp = new Date().getTime();
        const nuevoNombre = timestamp + '_' + fileEsp.name;
        const fileFinal: File = new File([fileEsp], nuevoNombre);
        const ruta =
            this.valDatosPersonales?.get('numDoc')?.value +
            '/' +
            fileFinal.name.replace(/\s+/g, '_');
        this.especializacion[index].archivo = fileFinal;
        this.especializacion[index].ruta = ruta;
    }
    seleccionarArchivoCurso(event: any, index: number) {
        const fileCu: File = event.target.files[0];
        const timestamp = new Date().getTime();
        const nuevoNombre = timestamp + '_' + fileCu.name;
        const fileFinal: File = new File([fileCu], nuevoNombre);
        const ruta =
            this.valDatosPersonales?.get('numDoc')?.value +
            '/' +
            fileFinal.name.replace(/\s+/g, '_');
        this.cursos[index].archivo = fileFinal;
        this.cursos[index].ruta = ruta;
    }
    seleccionarArchivoIdioma(event: any, index: number) {
        const fileId: File = event.target.files[0];
        const timestamp = new Date().getTime();
        const nuevoNombre = timestamp + '_' + fileId.name;
        const fileFinal: File = new File([fileId], nuevoNombre);
        const ruta =
            this.valDatosPersonales?.get('numDoc')?.value +
            '/' +
            fileFinal.name.replace(/\s+/g, '_');
        this.idiomas[index].archivo = fileFinal;
        this.idiomas[index].ruta = ruta;
    }
    seleccionarArchivoExpLaboral(event: any, index: number) {
        const fileLa: File = event.target.files[0];
        const timestamp = new Date().getTime();
        const nuevoNombre = timestamp + '_' + fileLa.name;
        const fileFinal: File = new File([fileLa], nuevoNombre);
        const ruta =
            this.valDatosPersonales?.get('numDoc')?.value +
            '/' +
            fileFinal.name.replace(/\s+/g, '_');
        this.experienciaLaboral[index].archivo = fileFinal;
        this.experienciaLaboral[index].ruta = ruta;
    }
    seleccionarArchivoExpDocencia(event: any, index: number) {
        const fileDo: File = event.target.files[0];
        const timestamp = new Date().getTime();
        const nuevoNombre = timestamp + '_' + fileDo.name;
        const fileFinal: File = new File([fileDo], nuevoNombre);
        const ruta =
            this.valDatosPersonales?.get('numDoc')?.value +
            '/' +
            fileFinal.name.replace(/\s+/g, '_');
        this.laborDocencia[index].archivo = fileFinal;
        this.laborDocencia[index].ruta = ruta;
    }
    seleccionarArchivoDiscapacidad(event: any) {
        const fileDo: File = event.target.files[0];
        const timestamp = new Date().getTime();
        const nuevoNombre = timestamp + '_' + fileDo.name;
        const fileFinal: File = new File([fileDo], nuevoNombre);
        const ruta =
            this.valDatosPersonales?.get('numDoc')?.value +
            '/' +
            fileFinal.name.replace(/\s+/g, '_');
        this.archivoDiscapacidad.push(fileFinal);
        this.rutaDiscapacidad = ruta;
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
                    datos.length > 0
                        ? (this.agregable = false)
                        : (this.agregable = true);
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
                    this.nivelCargo = datos.nivel;
                    this.cargo = datos.cargo;
                    this.tipoVia = datos.via;
                    this.tipoZona = datos.zona;
                    this.unidadOrganica = datos.unidadOrganica;
                    this.servicioE = datos.servicio;
                } else {
                    errorAlerta('Error', mensaje).then();
                }
            });
    }

    cambioTipo() {
        let id = this.valSituacionLaboral.controls['regimen'].value;
        if (id.length > 0) {
            this.listarTipoRegimen(id);
        } else {
            warningAlerta('Atención!', 'Elija primero un regimen ');
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
                    datos.length > 0
                        ? (this.agregable = false)
                        : (this.agregable = true);
                    this.tipoRegimen = datos;
                } else {
                    errorAlerta('Error', mensaje).then();
                }
            });
    }

    tomarFoto() {
        this.modalTomarFoto?.openModal();
    }
    mandarImagen(foto: File) {
        this.files = [];
        this.files.push(foto);

        const file = foto;
        const timestamp = new Date().getTime();
        const nuevoNombre = timestamp + '_' + file.name;
        const fileFinal: File = new File([file], nuevoNombre);
        this.fotoFile.push(fileFinal);

        const ruta =
            this.valDatosPersonales?.get('numDoc')?.value +
            '/' +
            fileFinal.name.replace(/\s+/g, '_');
        this.valDatosPersonales.controls['rutaFoto'].setValue(ruta);
    }

    actualizarEmpleado() {
        this.loading=true
        const datosDomicilio = this.valDatosDomicilio.getRawValue();
        const situacionLaboral=this.valSituacionLaboral.value
        const datosFamiliares = this.familiares;
        const datosEstudioSuperior = this.estudioSuperior;
        const datosProfesion = this.valDatosProfesion.value;
        const datosPostgrado = this.estudioPostgrado;
        const datosEspecializacion = this.especializacion;
        const datosCursos = this.cursos;
        const datosIdiomas = this.idiomas;
        const experienciaLaboral = this.experienciaLaboral;
        const laborDocencia = this.laborDocencia;
        const datosPersonales = this.valDatosPersonales.getRawValue();
        const datosContacto = this.valContactoEmergencia.value;
        const datosDiscapacidad = {
            tipos: this.discapacidades,
            ruta: this.rutaDiscapacidad,
        };
        const archivoDiscapacidad = this.archivoDiscapacidad;
        const fotoPersonal = this.fotoFile;

        this.DatoGeneralesService$.editarDatosEmpleado(
            datosPersonales,
            situacionLaboral,
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
        )
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe((respuesta) => {
                console.log(respuesta);
                const { estado, mensaje, datos } = respuesta;
                if (!estado && datos) {
                    errorAlertaValidacion(mensaje, datos);
                    return;
                } else if (datos == 2) {
                    warningAlerta('Alerta', mensaje);
                } else if (datos == 1) {
                    successAlerta('Éxito', mensaje);
                } else {
                    errorAlerta('Error', mensaje);
                }
            });
    }

    descargarArchivo(ruta: string) {
        this.loading = true;
        this.ModalDatosService$.verArchivo(ruta)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe((data) => {
                this.archivoUrl = URL.createObjectURL(data);
                this.fotoP = this.sanitizer.bypassSecurityTrustResourceUrl(
                    this.archivoUrl
                );
                const fotoD = new File([data], 'archivo.jpg', {
                    type: 'image/*',
                });
                this.files.push(fotoD);
            });
    }
}
