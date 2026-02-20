import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { DatoGeneralesService } from '@services/legajo/datos-generales.service';
import { ReniecService } from '@services/general/reniec.service';
import { ExtranjeriaService } from '@services/general/extranjeria.service';
import { MigracionesClass } from '@classes/servicios/migraciones.class';
import { ModalTomarFotoComponent } from '@modules/legajo/components/modal-tomar-foto/modal-tomar-foto.component';
import { errorAlerta, successAlerta, warningAlerta, errorAlertaValidacion } from '@shared/utils';

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface Familiar {
  tipoD: string;
  dni: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  parentesco: string;
  centroLaboral: string;
}

interface EstudioAcademico {
  tipo: string;
  centro: string;
  especialidad: string;
  inicio: string;
  termino: string;
  nivel: string;
  archivo: File | null;
  ruta: string;
}

interface Especializacion {
  tipo: string;
  centro: string;
  materia: string;
  inicio: string;
  termino: string;
  certificacion: string;
  archivo: File | null;
  ruta: string;
}

interface Idioma {
  lenguaE: string;
  nivel: string;
  archivo: File | null;
  ruta: string;
}

interface ExperienciaLaboral {
  institucion: string;
  cargo: string;
  inicio: string;
  termino: string;
  archivo: File | null;
  ruta: string;
}

interface LaborDocencia {
  centro: string;
  curso: string;
  inicio: string;
  termino: string;
  archivo: File | null;
  ruta: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-registrar-empleado',
  templateUrl: './registrar-empleado.component.html',
  styleUrl: './registrar-empleado.component.scss'
})
export class RegistrarEmpleadoComponent implements OnInit {

  @ViewChild(ModalTomarFotoComponent) modalTomarFoto?: ModalTomarFotoComponent;

  // ── Estado general ────────────────────────────────────────────────────────
  loading = false;
  mensajeLoading = 'Cargando...';
  rutas: any;
  valGroup!: FormGroup;
  intentoGuardar = false;
  // ── Foto ──────────────────────────────────────────────────────────────────
  files: File[] = [];
  fotoFile: File[] = [];
  rutaFoto = 'default/perfil.png';

  // ── Discapacidad ──────────────────────────────────────────────────────────
  archivoDiscapacidad: File[] = [];
  rutaDiscapacidad = '';
  discapacidades: any[] = [];
  tipoDiscapacidad = [
    { id: 1, tipo: 'Fisica',      estado: 'A' },
    { id: 2, tipo: 'Sensorial',   estado: 'A' },
    { id: 3, tipo: 'Mental',      estado: 'A' },
    { id: 4, tipo: 'Intelectual', estado: 'A' },
  ];
tieneDiscapacidad = false;
tieneColegiatura  = false;
  // ── Listas de selects ─────────────────────────────────────────────────────
  datos: any[]              = [];
  tipoEmpleado: any[]       = [];
  tipoGrupo: any[]          = [];
  regimen: any[]            = [];
  tipoRegimen: any[]        = [];
  tipoSexo: any[]           = [];
  tipoGrupoSanguineo: any[] = [];
  tipoEstadoCivil: any[]    = [];
  tipoParentesco: any[]     = [];
  tipoProfesiones: any[]    = [];
  nivelIdioma: any[]        = [];
  cargo: any[]              = [];
  nivelCargo: any[]         = [];
  tipoVia: any[]            = [];
  tipoZona: any[]           = [];
  unidadOrganica: any[]     = [];
  servicioE: any[]          = [];

  // ── Valores de selects ────────────────────────────────────────────────────
  valorRegimen  = '';
  valortipRegimen = '';
  valorNivel    = '';
  valorCargo    = '';
  valorServicio = '';
  valorUnidad   = '';
  agregable     = false;

  // ── Datos personales ──────────────────────────────────────────────────────
  tipoDoc        = '';
  numeroDocumento = '';
  nacionalidad   = '';
  tipoEmp        = '';
  grupOcup       = '';
  aPaterno       = '';
  aMaterno       = '';
  nombres        = '';
  sexo           = '';
  ruc            = '';
  fNacimiento    = '';
  gSanguineo     = '';
  enfAlergias    = 'SIN DATOS';
  estadoCivil    = '';
  codigoAirhsp   = '';
  fechaIngreso   = '';

  // ── Contacto de emergencia ────────────────────────────────────────────────
  nombreContacto = '';
  parentesco     = '';

  // ── Domicilio ─────────────────────────────────────────────────────────────
  departamento       = '';
  provincia          = '';
  distrito           = '';
  via                = '';
  nombreVia          = '';
  numeroVia          = '';
  interiorVia        = '';
  zona               = '';
  nombreZona         = '';
  numeroZona         = '';
  interiorZona       = '';
  referenciaDomicilio = '';
  ubigeo             = '';

  // ── Profesión / colegiatura ───────────────────────────────────────────────
  profesion    = '';
  lugarColeg   = '';
  fechColeg    = '';
  fechTerColeg = '';
  numColeg     = '';

  // ── Tablas de datos ───────────────────────────────────────────────────────
  familiares:          Familiar[]         = [];
  estudioSuperior:     EstudioAcademico[] = [];
  estudioPostgrado:    EstudioAcademico[] = [];
  especializacion:     Especializacion[]  = [];
  cursos:              Especializacion[]  = [];
  idiomas:             Idioma[]           = [];
  experienciaLaboral:  ExperienciaLaboral[] = [];
  laborDocencia:       LaborDocencia[]    = [];

  // ── Flags de "sin datos" ──────────────────────────────────────────────────
  divFamiliar            = false;
  divSuperior            = false;
  divPostgrado           = false;
  divEspecializacion     = false;
  divCursos              = false;
  divIdioma              = false;
  divExperienciaLaboral  = false;
  divExperienciaDocencia = false;

  // ─── Constructor ──────────────────────────────────────────────────────────

  constructor(
    private datosGeneralesService: DatoGeneralesService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private router: Router
  ) {}

  // ─── Ciclo de vida ─────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.inicializarFormulario();
    this.listarSelects();
  }

  // ─── Formulario reactivo ───────────────────────────────────────────────────

  private inicializarFormulario(): void {
    this.valGroup = new FormGroup({
      correo:     new FormControl('', [Validators.email]),
      telFijo:    new FormControl('', [Validators.pattern('^[0-9]*$')]),
      telMovil:   new FormControl('', [Validators.pattern('^[0-9]*$')]),
      ruc:        new FormControl('', [Validators.required, Validators.pattern('[0-9]{11}')]),
      numContacto: new FormControl('', [Validators.pattern('^[0-9]*$')]),
    });
  }

  // ─── Foto personal ─────────────────────────────────────────────────────────

  onSelect(event: any): void {
    this.procesarArchivoFoto(event.addedFiles[0]);
  }

  onRemove(event: any): void {
    this.files.splice(this.files.indexOf(event), 1);
  }

  tomarFoto(): void {
    this.modalTomarFoto?.openModal();
  }

  mandarImagen(foto: File): void {
    this.procesarArchivoFoto(foto);
  }

  private procesarArchivoFoto(file: File): void {
    const timestamp = new Date().getTime();
    const nuevoNombre = `${timestamp}_${file.name}`;
    const fileFinal = new File([file], nuevoNombre);
    this.files = [file];
    this.fotoFile = [fileFinal];
    this.rutaFoto = `${this.numeroDocumento}/${fileFinal.name.replace(/\s+/g, '_')}`;
  }

  // ─── Búsqueda de documentos ────────────────────────────────────────────────

  buscarDocumento(documento: string, index?: number): void {
    this.loading = true;

    if (this.tipoDoc === '1') {
      this.mensajeLoading = 'Buscando en RENIEC...';
      this.reniecService.buscarDni(documento, '1')
        .pipe(finalize(() => this.resetLoading()))
        .subscribe(({ estado, datos }) => {
          if (estado && datos) {
            index !== undefined ? this.setDatosFamiliar(datos, index) : this.setDatosRENIEC(datos);
          }
        });

    } else if (this.tipoDoc === '2') {
      this.mensajeLoading = 'Buscando en MIGRACIONES...';
      this.extranjeriaService.buscarMigraciones(documento)
        .pipe(finalize(() => this.resetLoading()))
        .subscribe(({ estado, datos }) => {
          if (estado && datos) {
            index !== undefined ? this.setDatosFamiliar(datos, index) : this.setDatosMigraciones(datos);
          }
        });

    } else {
      this.loading = false;
      errorAlerta('Error', 'No se dispone del servicio en estos momentos.');
    }
  }

  buscarDocumentoFamiliar(documento: string, index: number, tipoD: string): void {
    this.loading = true;

    if (tipoD === 'DNI') {
      this.mensajeLoading = 'Buscando en RENIEC...';
      this.reniecService.buscarDni(documento, '1')
        .pipe(finalize(() => this.resetLoading()))
        .subscribe(({ estado, datos }) => {
          if (estado && datos) {
            this.setDatosFamiliar(datos, index);
          }
        });

    } else if (tipoD === 'CARNET EXTRANJERIA') {
      this.mensajeLoading = 'Buscando en MIGRACIONES...';
      this.extranjeriaService.buscarMigraciones(documento)
        .pipe(finalize(() => this.resetLoading()))
        .subscribe(({ estado, datos }) => {
          if (estado && datos) {
            this.setDatosFamiliar(datos, index);
          }
        });

    } else {
      this.loading = false;
      errorAlerta('Error', 'No se dispone del servicio en estos momentos.');
    }
  }

  private resetLoading(): void {
    this.loading = false;
    this.mensajeLoading = 'Cargando...';
  }

  // ─── Set de datos desde servicios ─────────────────────────────────────────

  private setDatosRENIEC(datos: any): void {
    this.aPaterno    = datos.appPaterno;
    this.aMaterno    = datos.appMaterno;
    this.nombres     = datos.nombres;
    this.sexo        = datos.obtenerSexo();
    this.fNacimiento = datos.obtenerFechaNacimiento();
    this.departamento = datos.departamento;
    this.provincia   = datos.provincia;
    this.distrito    = datos.distrito;
    this.ubigeo      = datos.obtenerUbigeo();
  }

  private setDatosMigraciones(datos: MigracionesClass): void {
    this.aPaterno = datos.apellidoPaterno;
    this.aMaterno = datos.apellidoMaterno;
    this.nombres  = datos.nombres;
  }

  private setDatosFamiliar(datos: any, index: number): void {
    this.familiares[index].nombre        = datos.nombres;
    this.familiares[index].apellidos     = `${datos.appPaterno} ${datos.appMaterno}`;
    this.familiares[index].fechaNacimiento = datos.obtenerFechaNacimiento();
  }

  private parsearFecha(fecha: string): string {
    return `${fecha.slice(0, 4)}-${fecha.slice(4, 6)}-${fecha.slice(6, 8)}`;
  }

  // ─── Selects encadenados ───────────────────────────────────────────────────

  cambioNacionalidad(): void {
    this.nacionalidad = this.tipoDoc === '1' ? 'Peruana' : '';
  }

  cambioTipo(): void {
    if (this.valorRegimen.length > 0) {
      this.listarTipoRegimen(this.valorRegimen);
    } else {
      warningAlerta('Atención!', 'Elija primero un régimen.');
    }
  }

  cambioUnidad(): void {
    if (this.valorUnidad.length > 0) {
      this.listarServicio(this.valorUnidad);
    } else {
      warningAlerta('Atención!', 'Elija primero una unidad orgánica.');
    }
  }

  // ─── Servicios de listado ──────────────────────────────────────────────────

  listarSelects(): void {
    this.datosGeneralesService.listarSelects()
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe(({ estado, mensaje, datos }) => {
        if (estado) {
          this.datos              = datos.tipoDocumento;
          this.tipoEmpleado       = datos.tipoEmpleado;
          this.tipoGrupo          = datos.grupo;
          this.regimen            = datos.regimen;
          this.tipoSexo           = datos.sexo;
          this.tipoGrupoSanguineo = datos.grupoSanguineo;
          this.tipoEstadoCivil    = datos.estadoCivil;
          this.tipoParentesco     = datos.parentesco;
          this.tipoProfesiones    = datos.profesiones;
          this.nivelIdioma        = datos.idioma;
          this.nivelCargo         = datos.nivel;
          this.cargo              = datos.cargo;
          this.tipoVia            = datos.via;
          this.tipoZona           = datos.zona;
          this.unidadOrganica     = datos.unidadOrganica;
        } else {
          errorAlerta('Error', mensaje);
        }
      });
  }

  private listarTipoRegimen(id: any): void {
    this.datosGeneralesService.listarTipoRegimen(id)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe(({ estado, mensaje, datos }) => {
        if (estado) {
          this.agregable   = datos.length === 0;
          this.tipoRegimen = datos;
        } else {
          errorAlerta('Error', mensaje);
        }
      });
  }

  private listarServicio(id: any): void {
    this.datosGeneralesService.listarServicio(id)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe(({ estado, mensaje, datos }) => {
        if (estado) {
          this.agregable = datos.length === 0;
          this.servicioE = datos;
        } else {
          errorAlerta('Error', mensaje);
        }
      });
  }

  // ─── Agregar filas a tablas ────────────────────────────────────────────────

  agregarFamiliar(): void {
    this.divFamiliar = false;
    if (this.familiares.length <= 5) {
      this.familiares.push({ tipoD: '', dni: '', nombre: '', apellidos: '', fechaNacimiento: '', parentesco: '', centroLaboral: '' });
    }
  }

  agregarEstudioSuperior(): void {
    this.divSuperior = false;
    if (this.estudioSuperior.length <= 5) {
      this.estudioSuperior.push({ tipo: '', centro: '', especialidad: '', inicio: '', termino: '', nivel: '', archivo: null, ruta: '' });
    }
  }

  agregarEstudioPostgrado(): void {
    this.divPostgrado = false;
    if (this.estudioPostgrado.length <= 5) {
      this.estudioPostgrado.push({ tipo: '', centro: '', especialidad: '', inicio: '', termino: '', nivel: '', archivo: null, ruta: '' });
    }
  }

  agregarEspecializacion(): void {
    this.divEspecializacion = false;
    if (this.especializacion.length <= 5) {
      this.especializacion.push({ tipo: '', centro: '', materia: '', inicio: '', termino: '', certificacion: '', archivo: null, ruta: '' });
    }
  }

  agregarCursos(): void {
    this.divCursos = false;
    if (this.cursos.length <= 5) {
      this.cursos.push({ tipo: '', centro: '', materia: '', inicio: '', termino: '', certificacion: '', archivo: null, ruta: '' });
    }
  }

  agregarIdioma(): void {
    this.divIdioma = false;
    if (this.idiomas.length <= 4) {
      this.idiomas.push({ lenguaE: '', nivel: '', archivo: null, ruta: '' });
    }
  }

  agregarExperiencia(): void {
    this.divExperienciaLaboral = false;
    if (this.experienciaLaboral.length <= 10) {
      this.experienciaLaboral.push({ institucion: '', cargo: '', inicio: '', termino: '', archivo: null, ruta: '' });
    }
  }

  agregarDocencia(): void {
    this.divExperienciaDocencia = false;
    if (this.laborDocencia.length <= 10) {
      this.laborDocencia.push({ centro: '', curso: '', inicio: '', termino: '', archivo: null, ruta: '' });
    }
  }

  // ─── Limpiar secciones ─────────────────────────────────────────────────────

  sinDatosFamiliares():          void { this.divFamiliar = true;            this.familiares = []; }
  sinDatosSuperiores():          void { this.divSuperior = true;            this.estudioSuperior = []; }
  sinDatosPostgrado():           void { this.divPostgrado = true;           this.estudioPostgrado = []; }
  sinDatosEspecializacion():     void { this.divEspecializacion = true;     this.especializacion = []; }
  sinDatosCursos():              void { this.divCursos = true;              this.cursos = []; }
  sinDatosIdiomas():             void { this.divIdioma = true;              this.idiomas = []; }
  sinDatosExperienciaLaboral():  void { this.divExperienciaLaboral = true;  this.experienciaLaboral = []; }
  sinDatosExperienciaDocencia(): void { this.divExperienciaDocencia = true; this.laborDocencia = []; }

  // ─── Eliminar filas ────────────────────────────────────────────────────────

  eliminarItem(index: number, nombre: keyof RegistrarEmpleadoComponent): void {
    (this[nombre] as any[]).splice(index, 1);
  }

  // ─── Selección de archivos (método genérico) ───────────────────────────────

  private procesarArchivo(event: any, index: number, array: any[], carpeta: string, prefijo: string): void {
    const file: File = event.target.files[0];
    if (!file) { return; }
    const timestamp = new Date().getTime();
    const nuevoNombre = `${prefijo}_${timestamp}_${file.name}`;
    const fileFinal = new File([file], nuevoNombre);
    array[index].archivo = fileFinal;
    array[index].ruta = `${this.numeroDocumento}/${carpeta}/${fileFinal.name.replace(/\s+/g, '_')}`;
    console.log(fileFinal)
  }

  seleccionarArchivoEst(event: any, index: number):          void { this.procesarArchivo(event, index, this.estudioSuperior,   'Superior',     'Superior'); }
  seleccionarArchivoPg(event: any, index: number):           void { this.procesarArchivo(event, index, this.estudioPostgrado,  'Postgrado',    'Postgrado'); }
  seleccionarArchivoEspecialidad(event: any, index: number): void { this.procesarArchivo(event, index, this.especializacion,   'Especialidad', 'Especialidad'); }
  seleccionarArchivoCurso(event: any, index: number):        void { this.procesarArchivo(event, index, this.cursos,            'Curso',        'Curso'); }
  seleccionarArchivoIdioma(event: any, index: number):       void { this.procesarArchivo(event, index, this.idiomas,           'Idioma',       'Idioma'); }
  seleccionarArchivoExpLaboral(event: any, index: number):   void { this.procesarArchivo(event, index, this.experienciaLaboral,'ExpLaboral',   'ExpLaboral'); }
  seleccionarArchivoExpDocencia(event: any, index: number):  void { this.procesarArchivo(event, index, this.laborDocencia,     'ExpDocencia',  'ExpDocencia'); }

  seleccionarArchivoDiscapacidad(event: any): void {
    const file: File = event.target.files[0];
    if (!file) { return; }
    const timestamp = new Date().getTime();
    const nuevoNombre = `Discapacidad_${timestamp}_${file.name}`;
    const fileFinal = new File([file], nuevoNombre);
    this.archivoDiscapacidad = [fileFinal];
    this.rutaDiscapacidad = `${this.numeroDocumento}/Discapacidad/${fileFinal.name.replace(/\s+/g, '_')}`;
  }

  // ─── Registro de empleado ──────────────────────────────────────────────────

  registrarEmpleado(): void {

     // Validar FormGroup principal
  // if (this.valGroup.invalid) {
  //   this.valGroup.markAllAsTouched();
  //   warningAlerta('Alerta', 'Revisa los campos del formulario principal.');
  //   return;
  // }
  this.intentoGuardar = true;
  // Validar tablas dinámicas
  const { valido, errores } = this.validarTablasDinamicas();
  console.log(valido)
  if (errores.length>0) {
  warningAlerta('Alerta','Datos incompletos ');
    return;
  }

  // // Validar que al menos marcó "sin datos" o agregó filas
  // if (!this.divSuperior && this.estudioSuperior.length === 0) {
  //   warningAlerta('Alerta', 'Indica si tienes estudios superiores o marca "Sin datos".');
  //   return;
  // }

    this.loading = true;

    this.datosGeneralesService.guardarDatosEmpleado(
      this.buildDatosPersonales(),
      this.buildDatosContacto(),
      this.buildDatosDiscapacidad(),
      this.buildDatosDomicilio(),
      this.familiares,
      this.buildDatosProfesion(),
      this.estudioSuperior,
      this.estudioPostgrado,
      this.especializacion,
      this.cursos,
      this.idiomas,
      this.experienciaLaboral,
      this.laborDocencia,
      this.fotoFile,
      this.archivoDiscapacidad
    ).pipe(
      finalize(() => { this.loading = false; })
    ).subscribe(({ estado, mensaje, datos }) => {
      if (!estado && datos) {
        errorAlertaValidacion(mensaje, datos);
      } else if (datos == 2) {
        warningAlerta('Alerta', mensaje);
      } else if (datos == 1) {
        successAlerta('Éxito', mensaje);
        this.router.navigate(['/legajo/informacion']);
      } else {
        errorAlerta('Error', mensaje);
      }
    });
  }

  // ─── Builders de objetos para el registro ─────────────────────────────────

  private buildDatosPersonales() {
    return {
      tipoDocumento:     this.tipoDoc,
      numeroDocumento:   this.numeroDocumento,
      codigoAirhsp:      this.codigoAirhsp,
      apellidoPaterno:   this.aPaterno,
      apellidoMaterno:   this.aMaterno,
      nombres:           this.nombres,
      ruc:               this.valGroup.controls['ruc'].value,
      estadoCivil:       this.estadoCivil,
      sexo:              this.sexo,
      grupoSanguineo:    this.gSanguineo,
      grupOcupacional:   this.grupOcup,
      tipoEmpleado:      this.tipoEmp,
      regimen:           this.valorRegimen,
      tipoRegimen:       this.valortipRegimen,
      fechaNacimiento:   this.fNacimiento,
      telefonoFijo:      this.valGroup.controls['telFijo'].value,
      telefonoMovil:     this.valGroup.controls['telMovil'].value,
      correoElectronico: this.valGroup.controls['correo'].value,
      enfAlergias:       this.enfAlergias,
      fechaIngreso:      this.fechaIngreso,
      unidadOrganica:    this.valorUnidad,
      servicio:          this.valorServicio,
      rutaFoto:          this.rutaFoto,
      nacionalidad:      this.nacionalidad,
      cargo:             this.valorCargo,
      nivel:             this.valorNivel,
    };
  }

  private buildDatosContacto() {
    return {
      nombreContacto: this.nombreContacto,
      parentesco:     this.parentesco,
      numContacto:    this.valGroup.controls['numContacto'].value,
    };
  }

  private buildDatosDiscapacidad() {
    return {
      tipos: this.discapacidades,
      ruta:  this.rutaDiscapacidad,
    };
  }

  private buildDatosDomicilio() {
    return {
      departamento:       this.departamento,
      provincia:          this.provincia,
      distrito:           this.distrito,
      via:                this.via,
      nombreVia:          this.nombreVia,
      numeroVia:          this.numeroVia,
      interiorVia:        this.interiorVia,
      zona:               this.zona,
      nombreZona:         this.nombreZona,
      numeroZona:         this.numeroZona,
      interiorZona:       this.interiorZona,
      referenciaDomicilio: this.referenciaDomicilio,
      ubigeo:             this.ubigeo,
      numDocumento:       this.numeroDocumento,
    };
  }

  private buildDatosProfesion() {
    return {
      profesion:    this.profesion,
      lugarColeg:   this.lugarColeg,
      fechColeg:    this.fechColeg,
      fechTerColeg: this.fechTerColeg,
      numColeg:     this.numColeg,
      numDocEmp:    this.numeroDocumento,
    };
  }
  private validarTablasDinamicas(): { valido: boolean; errores: string[] } {
  const errores: string[] = [];

  // ── Estudios Superiores ──────────────────────────────────────────────────
  this.estudioSuperior.forEach((item, i) => {
    const n = i + 1;
    if (!item.tipo)        errores.push(`Estudio Superior #${n}: Tipo es requerido.`);
    if (!item.centro)      errores.push(`Estudio Superior #${n}: Centro es requerido.`);
    if (!item.especialidad) errores.push(`Estudio Superior #${n}: Especialidad es requerida.`);
    if (!item.inicio)      errores.push(`Estudio Superior #${n}: Fecha de inicio es requerida.`);
    if (!item.nivel)       errores.push(`Estudio Superior #${n}: Nivel es requerido.`);
    if (item.inicio && item.termino && item.termino < item.inicio)
      errores.push(`Estudio Superior #${n}: La fecha de término no puede ser anterior al inicio.`);
  });

  // ── Postgrado ────────────────────────────────────────────────────────────
  this.estudioPostgrado.forEach((item, i) => {
    const n = i + 1;
    if (!item.tipo)        errores.push(`Postgrado #${n}: Tipo es requerido.`);
    if (!item.centro)      errores.push(`Postgrado #${n}: Centro es requerido.`);
    if (!item.especialidad) errores.push(`Postgrado #${n}: Especialidad es requerida.`);
    if (!item.inicio)      errores.push(`Postgrado #${n}: Fecha de inicio es requerida.`);
    if (item.inicio && item.termino && item.termino < item.inicio)
      errores.push(`Postgrado #${n}: La fecha de término no puede ser anterior al inicio.`);
  });

  // ── Especializaciones ────────────────────────────────────────────────────
  this.especializacion.forEach((item, i) => {
    const n = i + 1;
    if (!item.tipo)   errores.push(`Especialización #${n}: Tipo es requerido.`);
    if (!item.centro) errores.push(`Especialización #${n}: Centro es requerido.`);
    if (!item.materia) errores.push(`Especialización #${n}: Materia es requerida.`);
    if (!item.inicio) errores.push(`Especialización #${n}: Fecha de inicio es requerida.`);
  });

  // ── Cursos ───────────────────────────────────────────────────────────────
  this.cursos.forEach((item, i) => {
    const n = i + 1;
    if (!item.centro) errores.push(`Curso #${n}: Centro es requerido.`);
    if (!item.materia) errores.push(`Curso #${n}: Materia es requerida.`);
    if (!item.inicio) errores.push(`Curso #${n}: Fecha de inicio es requerida.`);
  });

  // ── Idiomas ──────────────────────────────────────────────────────────────
  this.idiomas.forEach((item, i) => {
    const n = i + 1;
    if (!item.lenguaE) errores.push(`Idioma #${n}: Lengua es requerida.`);
    if (!item.nivel)   errores.push(`Idioma #${n}: Nivel es requerido.`);
  });
 console.log(errores.length)
  return { valido: errores.length == 0, errores };
}
}