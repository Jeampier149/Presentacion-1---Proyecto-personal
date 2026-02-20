import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { finalize } from 'rxjs';

import { DatoGeneralesService } from '@services/legajo/datos-generales.service';
import { ReniecService } from '@services/general/reniec.service';
import { ExtranjeriaService } from '@services/general/extranjeria.service';
import { ModalDatosService } from '@services/legajo/modal-datos.service';
import { ModalTomarFotoComponent } from '@modules/legajo/components/modal-tomar-foto/modal-tomar-foto.component';
import { reniecClass } from '@classes/servicios/reniec.class';
import { MigracionesClass } from '@classes/servicios/migraciones.class';
import { errorAlerta, successAlerta, warningAlerta, errorAlertaValidacion } from '@shared/utils';

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface Familiar {
  id: string; tipoD: string; dni: string; nombre: string;
  apellidos: string; fechaNacimiento: string; parentesco: string;
  centroLaboral: string; estado: string;
}

interface EstudioAcademico {
  id: string; tipo: string; centro: string; especialidad: string;
  inicio: string; termino: string; nivel: string;
  archivo: File | null; ruta: string; estado: string;
}

interface Especializacion {
  id: string; tipo: string; centro: string; materia: string;
  inicio: string; termino: string; certificacion: string;
  archivo: File | null; ruta: string; estado: string;
}

interface Idioma {
  id: string; lenguaE: string; nivel: string;
  archivo: File | null; ruta: string; estado: string;
}

interface ExperienciaLaboral {
  id: string; institucion: string; cargo: string;
  inicio: string; termino: string;
  archivo: File | null; ruta: string; estado: string;
}

interface LaborDocencia {
  id: string; centro: string; curso: string;
  inicio: string; termino: string;
  archivo: File | null; ruta: string; estado: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-editar-empleado',
  templateUrl: './editar-empleado.component.html',
  styleUrl: './editar-empleado.component.scss',
})
export class EditarEmpleadoComponent implements OnInit {

  @ViewChild(ModalTomarFotoComponent) modalTomarFoto?: ModalTomarFotoComponent;

  // ── Estado general ────────────────────────────────────────────────────────
  numDoc         = '';
  loading        = false;
  mensajeLoading = 'Cargando...';
  rutas: any;
  agregable      = false;

  // ── Foto ──────────────────────────────────────────────────────────────────
  files:     File[]          = [];
  fotoFile:  File[]          = [];
  fotoP:     SafeResourceUrl = '';
  archivoUrl = '';
  intentoGuardar = false;
  // ── Discapacidad ──────────────────────────────────────────────────────────
  archivoDiscapacidad: File[]   = [];
  rutaDiscapacidad               = '';
  discapacidades:      string[] = [];
  arrayDiscapacidad:   any[]    = [];

  // ✅ FIX TOGGLE: propiedades booleanas para detección de cambios inmediata
  // Las variables de template (#ref) causan que Angular no detecte el cambio
  // hasta el siguiente ciclo (click en otro lado). Usando props del componente
  // con (change)="prop = !prop" el @if se actualiza en el mismo evento.
  tieneDiscapacidad = false;
  tieneColegiatura  = false;

  tipoDiscapacidad = [
    { id: 1, tipo: 'Fisica'      },
    { id: 2, tipo: 'Sensorial'   },
    { id: 3, tipo: 'Mental'      },
    { id: 4, tipo: 'Intelectual' },
  ];

  // ── Listas de selects ─────────────────────────────────────────────────────
  datos:              any[] = [];
  tipoEmpleado:       any[] = [];
  tipoGrupo:          any[] = [];
  regimenList:        any[] = []; // ✅ renombrado para evitar colisión con formControlName="regimen"
  tipoRegimen:        any[] = [];
  tipoSexo:           any[] = [];
  tipoGrupoSanguineo: any[] = [];
  tipoEstadoCivil:    any[] = [];
  tipoParentesco:     any[] = [];
  tipoProfesiones:    any[] = [];
  nivelIdioma:        any[] = [];
  cargo:              any[] = [];
  nivelCargo:         any[] = [];
  tipoVia:            any[] = [];
  tipoZona:           any[] = [];
  unidadOrganica:     any[] = [];
  servicioE:          any[] = [];

  // ── Tablas ────────────────────────────────────────────────────────────────
  familiares:         Familiar[]           = [];
  estudioSuperior:    EstudioAcademico[]   = [];
  estudioPostgrado:   EstudioAcademico[]   = [];
  especializacion:    Especializacion[]    = [];
  cursos:             Especializacion[]    = [];
  idiomas:            Idioma[]             = [];
  experienciaLaboral: ExperienciaLaboral[] = [];
  laborDocencia:      LaborDocencia[]      = [];

  // ── Flags "sin datos" ─────────────────────────────────────────────────────
  divFamiliar:            boolean = false;
  divSuperior:            boolean = false;
  divPostgrado:           boolean = false;
  divEspecializacion:     boolean = false;
  divCursos:              boolean = false;
  divIdioma:              boolean = false;
  divExperienciaLaboral:  boolean = false;
  divExperienciaDocencia: boolean = false;

  // ── FormGroups ────────────────────────────────────────────────────────────
  valDatosPersonales!:    FormGroup;
  valContactoEmergencia!: FormGroup;
  valDatosDomicilio!:     FormGroup;
  valDatosProfesion!:     FormGroup;
  valSituacionLaboral!:   FormGroup;

  // ─── Constructor ──────────────────────────────────────────────────────────

  constructor(
    private datosGeneralesService: DatoGeneralesService,
    private reniecService:         ReniecService,
    private extranjeriaService:    ExtranjeriaService,
    private route:                 ActivatedRoute,
    private modalDatosService:     ModalDatosService,
    private sanitizer:             DomSanitizer,
    private router:                Router
  ) {}

  // ─── Ciclo de vida ─────────────────────────────────────────────────────────

  ngOnInit(): void {
    // ✅ FIX: toda la inicialización en ngOnInit, nunca en el constructor
    this.inicializarFormularios();
    this.listarSelects();
    this.numDoc = this.route.snapshot.paramMap.get('numDoc')!;
    this.listarDatos(this.numDoc);
  }

  // ─── Formularios ───────────────────────────────────────────────────────────

  private inicializarFormularios(): void {
    this.valDatosPersonales = new FormGroup({
      tipoDocumento:   new FormControl({ value: '', disabled: true }),
      numDoc:          new FormControl({ value: '', disabled: true }),
      nacionalidad:    new FormControl({ value: '', disabled: true }),
      aPaterno:        new FormControl({ value: '', disabled: true }),
      aMaterno:        new FormControl({ value: '', disabled: true }),
      nombres:         new FormControl({ value: '', disabled: true }),
      sexo:            new FormControl(''),
      ruc:             new FormControl('', [Validators.pattern('[0-9]{11}')]),
      fechaNacimiento: new FormControl(''),
      telFijo:         new FormControl('', [Validators.pattern('^[0-9]*$')]),
      telMovil:        new FormControl('', [Validators.pattern('^[0-9]*$')]),
      correo:          new FormControl('', [Validators.email]),
      grupoSanguineo:  new FormControl(''),
      estadoCivil:     new FormControl(''),
      rutaFoto:        new FormControl(''),
      enfAlergias:     new FormControl(''),
    });

    this.valSituacionLaboral = new FormGroup({
      id:           new FormControl(''),
      condicion:    new FormControl(''),
      grupOcup:     new FormControl(''),
      regimen:      new FormControl(''),
      tipoRegimen:  new FormControl(''),
      unidad:       new FormControl(''),
      servicio:     new FormControl(''),
      cargo:        new FormControl(''),
      nivelCargo:   new FormControl(''),
      airhsp:       new FormControl(''),
      fechaIngreso: new FormControl(''),
    });

    this.valContactoEmergencia = new FormGroup({
      id:             new FormControl(''),
      nombreContacto: new FormControl(''),
      parentesco:     new FormControl(''),
      numContacto:    new FormControl('', [Validators.pattern('^[0-9]*$')]),
    });

    this.valDatosDomicilio = new FormGroup({
      id:           new FormControl(''),
      departamento: new FormControl(''),
      provincia:    new FormControl(''),
      distrito:     new FormControl(''),
      ubigeo:       new FormControl(''),
      via:          new FormControl(''),
      nombreVia:    new FormControl(''),
      numeroVia:    new FormControl(''),
      interiorVia:  new FormControl(''),
      zona:         new FormControl(''),
      nombreZona:   new FormControl(''),
      numeroZona:   new FormControl(''),
      interiorZona: new FormControl(''),
      referencia:   new FormControl(''),
    });

    this.valDatosProfesion = new FormGroup({
      id:           new FormControl(''),
      profesion:    new FormControl(''),
      lugarColeg:   new FormControl(''),
      fechColeg:    new FormControl(''),
      fechTerColeg: new FormControl(''),
      numColeg:     new FormControl(''),
    });
  }

  // ─── Carga de datos del empleado ───────────────────────────────────────────

  private listarDatos(numeroDoc: string): void {
    this.loading = true;
    this.modalDatosService.listarDatos(numeroDoc)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe(({ estado, datos }) => {
        if (!estado) { return; }

        this.setDatosEmpleado(datos.datosEmpleado?.[0]);
        this.setSituacionLaboral(datos.datosSituacion?.[0]);
        this.setDatosContactoEmergencia(datos.datosContactoEmergencia?.[0]);
        this.setDatosDomicilio(datos.datosDomicilio?.[0]);
        this.setDatosProfesion(datos.datosProfesion?.[0]);

        this.familiares         = datos.datosFamiliares             ?? [];
        this.estudioSuperior    = datos.datosEstudioSuperior        ?? [];
        this.estudioPostgrado   = datos.datosEstudioPostgrado       ?? [];
        this.especializacion    = datos.datosEstudioEspecializacion ?? [];
        this.cursos             = datos.datosEstudioCursos          ?? [];
        this.idiomas            = datos.datosEstudioIdioma          ?? [];
        this.experienciaLaboral = datos.datosExperienciaLaboral     ?? [];
        this.laborDocencia      = datos.datosExperienciaDocencia    ?? [];
        this.arrayDiscapacidad  = datos.datosDiscapacidad           ?? [];

        // ✅ FIX: map() en lugar de forEach+push para evitar acumulación en recargas
        this.discapacidades    = this.arrayDiscapacidad.map((t: any) => t.tipo);
        this.tieneDiscapacidad = this.discapacidades.length > 0;
      });
  }

  // ─── Setters: patchValue en lugar de setValue uno por uno ─────────────────

  private setDatosEmpleado(datos: any): void {
    if (!datos) { return; }
    this.valDatosPersonales.patchValue({
      tipoDocumento:   datos.idTipoDoc,
      numDoc:          datos.numeroDocumento,
      nacionalidad:    datos.nacionalidad,
      aPaterno:        datos.apellidoPaterno,
      aMaterno:        datos.apellidoMaterno,
      nombres:         datos.nombre,
      sexo:            datos.sexo,
      ruc:             datos.ruc,
      fechaNacimiento: datos.fechaNacimiento,
      telFijo:         datos.telFijo,
      telMovil:        datos.telMovil,
      correo:          datos.correo,
      grupoSanguineo:  datos.grupSanguineo,
      enfAlergias:     datos.enferAlergia,
      estadoCivil:     datos.estadoCivil,
      rutaFoto:        datos.rutaFoto,
    });
    this.listarFoto(datos.rutaFoto);
  }

  private setSituacionLaboral(datos: any): void {
    if (!datos) { return; }
    this.valSituacionLaboral.patchValue({
      id:           datos.idHistorial,
      condicion:    datos.idCondicion,
      grupOcup:     datos.idGrupO,
      regimen:      datos.idRegimen,
      tipoRegimen:  datos.idTipoRegimen,
      unidad:       datos.idUnidadOrganica,
      servicio:     datos.idServicio,
      cargo:        datos.idCargo,
      nivelCargo:   datos.nivel,
      airhsp:       datos.codigoAirhsp,
      fechaIngreso: datos.fechaIngreso,
    });
    if (datos.idRegimen)        { this.listarTipoRegimen(datos.idRegimen); }
    if (datos.idUnidadOrganica) { this.listarServicio(datos.idUnidadOrganica); }
  }

  private setDatosContactoEmergencia(datos: any): void {
    if (!datos) { return; }
    this.valContactoEmergencia.patchValue({
      id:             datos.id,
      nombreContacto: datos.nombre,
      parentesco:     datos.parentesco,
      numContacto:    datos.telefono,
    });
  }

  private setDatosDomicilio(datos: any): void {
    if (!datos) { return; }
    this.valDatosDomicilio.patchValue({
      id:           datos.id,
      departamento: datos.departamento,
      provincia:    datos.provincia,
      distrito:     datos.distrito,
      ubigeo:       datos.ubigeo,
      via:          datos.tipoVia,
      nombreVia:    datos.nombreVia,
      numeroVia:    datos.numeroVia,
      interiorVia:  datos.interiorVia,
      zona:         datos.tipoZona,
      nombreZona:   datos.nombreZona,
      numeroZona:   datos.numeroZona,
      interiorZona: datos.interiorZona,
      referencia:   datos.referencia,
    });
  }

  private setDatosProfesion(datos: any): void {
    if (!datos) { return; }
    this.valDatosProfesion.patchValue({
      id:           datos.id,
      profesion:    datos.profesion,
      lugarColeg:   datos.lugar,
      fechColeg:    datos.fechaInicio,
      fechTerColeg: datos.fechaTermino,
      numColeg:     datos.numeroCole,
    });
    // ✅ inicializa el toggle según datos existentes al cargar
    this.tieneColegiatura = !!(datos.numeroCole || datos.lugar);
  }

  private setDatosRENIEC(datos: reniecClass): void {
    this.valDatosPersonales.patchValue({
      aPaterno:        datos.apellidoPaterno,
      aMaterno:        datos.apellidoMaterno,
      nombres:         datos.nombres,
      sexo:            datos.obtenerSexo(),
      fechaNacimiento: datos.obtenerFechaNacimiento(),
    });
    this.valDatosDomicilio.patchValue({
      departamento: datos.departamento,
      provincia:    datos.provincia,
      distrito:     datos.distrito,
      ubigeo:       datos.obtenerUbigeo(),
    });
  }

  private setDatosMigraciones(datos: MigracionesClass): void {
    this.valDatosPersonales.patchValue({
      aPaterno: datos.apellidoPaterno,
      aMaterno: datos.apellidoMaterno,
      nombres:  datos.nombres,
    });
  }

  private setDatosFamiliar(datos: any, index: number): void {
    this.familiares[index].nombre         = datos.nombres;
    this.familiares[index].apellidos      = `${datos.apellidoPaterno} ${datos.apellidoMaterno}`;
    this.familiares[index].fechaNacimiento = this.parsearFecha(datos.fechaNacimiento);
  }

  private parsearFecha(fecha: string): string {
    return `${fecha.slice(0, 4)}-${fecha.slice(4, 6)}-${fecha.slice(6, 8)}`;
  }

  // ─── Búsqueda de documentos ────────────────────────────────────────────────

  buscarDocumento(documento: string, index?: number): void {
    const tipoDocumento = this.valDatosPersonales.get('tipoDocumento')?.value;
    this.loading = true;

    if (tipoDocumento === '1') {
      this.mensajeLoading = 'Buscando en RENIEC...';
      this.reniecService.buscarDni(documento, '1')
        .pipe(finalize(() => this.resetLoading()))
        .subscribe(({ estado, datos }) => {
          if (estado && datos) {
            index !== undefined
              ? this.setDatosFamiliar(datos, index)
              : this.setDatosRENIEC(datos);
          }
        });

    } else if (tipoDocumento === '2') {
      this.mensajeLoading = 'Buscando en MIGRACIONES...';
      this.extranjeriaService.buscarMigraciones(documento)
        .pipe(finalize(() => this.resetLoading()))
        .subscribe(({ estado, datos }) => {
          if (estado && datos) { this.setDatosMigraciones(datos); }
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
          if (estado && datos) { this.setDatosFamiliar(datos, index); }
        });

    } else if (tipoD === 'CARNET EXTRANJERIA') {
      this.mensajeLoading = 'Buscando en MIGRACIONES...';
      this.extranjeriaService.buscarMigraciones(documento)
        .pipe(finalize(() => this.resetLoading()))
        .subscribe(({ estado, datos }) => {
          if (estado && datos) { this.setDatosFamiliar(datos, index); }
        });

    } else {
      this.loading = false;
      errorAlerta('Error', 'No se dispone del servicio en estos momentos.');
    }
  }

  private resetLoading(): void {
    this.loading        = false;
    this.mensajeLoading = 'Cargando...';
  }

  // ─── Foto ──────────────────────────────────────────────────────────────────

  onSelect(event: any): void {
    this.procesarArchivoFoto(event.addedFiles[0]);
  }

  onRemove(event: any): void {
    this.files.splice(this.files.indexOf(event), 1);
    this.valDatosPersonales.controls['rutaFoto'].setValue('default/perfil.png');
  }

  tomarFoto(): void {
    this.modalTomarFoto?.openModal();
  }

  mandarImagen(foto: File): void {
    this.procesarArchivoFoto(foto);
  }

  private procesarArchivoFoto(file: File): void {
    const timestamp   = new Date().getTime();
    const nuevoNombre = `Foto_${timestamp}_${file.name}`;
    const fileFinal   = new File([file], nuevoNombre);
    const numDoc      = this.valDatosPersonales.get('numDoc')?.value ?? '';
    const ruta        = `${numDoc}/Foto/${fileFinal.name.replace(/\s+/g, '_')}`;

    this.files    = [file];
    this.fotoFile = [fileFinal];
    this.valDatosPersonales.controls['rutaFoto'].setValue(ruta);
  }

  private listarFoto(ruta: string): void {
    this.fotoP = '';
    if (ruta) { this.descargarArchivo(ruta); }
  }

  private descargarArchivo(ruta: string): void {
    this.loading = true;
    this.modalDatosService.verArchivo(ruta)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe((data) => {
        this.archivoUrl = URL.createObjectURL(data);
        this.fotoP      = this.sanitizer.bypassSecurityTrustResourceUrl(this.archivoUrl);
        this.files      = [new File([data], 'perfil.jpg', { type: 'image/jpeg' })];
      });
  }

  // ─── Selects encadenados ───────────────────────────────────────────────────

  cambioTipo(): void {
    const id = this.valSituacionLaboral.get('regimen')?.value;
    id?.length > 0
      ? this.listarTipoRegimen(id)
      : warningAlerta('Atención!', 'Elija primero un régimen.');
  }

  cambioUnidad(): void {
    const id = this.valSituacionLaboral.get('unidad')?.value;
    id?.length > 0
      ? this.listarServicio(id)
      : warningAlerta('Atención!', 'Elija primero una unidad orgánica.');
  }

  // ─── Servicios de listado ──────────────────────────────────────────────────

  private listarSelects(): void {
    this.datosGeneralesService.listarSelects()
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe(({ estado, mensaje, datos }) => {
        if (!estado) { errorAlerta('Error', mensaje); return; }
        this.datos              = datos.tipoDocumento;
        this.tipoEmpleado       = datos.tipoEmpleado;
        this.tipoGrupo          = datos.grupo;
        this.regimenList        = datos.regimen;
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
      });
  }

  private listarTipoRegimen(id: any): void {
    this.datosGeneralesService.listarTipoRegimen(id)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe(({ estado, mensaje, datos }) => {
        if (!estado) { errorAlerta('Error', mensaje); return; }
        this.agregable   = datos.length === 0;
        this.tipoRegimen = datos;
      });
  }

  private listarServicio(id: any): void {
    this.datosGeneralesService.listarServicio(id)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe(({ estado, mensaje, datos }) => {
        if (!estado) { errorAlerta('Error', mensaje); return; }
        this.agregable = datos.length === 0;
        this.servicioE = datos;
      });
  }

  // ─── Agregar filas ─────────────────────────────────────────────────────────

  agregarFamiliar(): void {
    this.divFamiliar = false;
    if (this.familiares.length <= 5) {
      this.familiares.push({ id: '', tipoD: '', dni: '', nombre: '', apellidos: '', fechaNacimiento: '', parentesco: '', centroLaboral: '', estado: '' });
    }
  }

  agregarEstudioSuperior(): void {
    this.divSuperior = false;
    if (this.estudioSuperior.length <= 5) {
      this.estudioSuperior.push({ id: '', tipo: '', centro: '', especialidad: '', inicio: '', termino: '', nivel: '', archivo: null, ruta: '', estado: '' });
    }
  }

  agregarEstudioPostgrado(): void {
    this.divPostgrado = false;
    if (this.estudioPostgrado.length <= 5) {
      this.estudioPostgrado.push({ id: '', tipo: '', centro: '', especialidad: '', inicio: '', termino: '', nivel: '', archivo: null, ruta: '', estado: '' });
    }
  }

  agregarEspecializacion(): void {
    this.divEspecializacion = false;
    if (this.especializacion.length <= 5) {
      this.especializacion.push({ id: '', tipo: '', centro: '', materia: '', inicio: '', termino: '', certificacion: '', archivo: null, ruta: '', estado: '' });
    }
  }

  agregarCursos(): void {
    this.divCursos = false;
    if (this.cursos.length <= 5) {
      this.cursos.push({ id: '', tipo: '', centro: '', materia: '', inicio: '', termino: '', certificacion: '', archivo: null, ruta: '', estado: '' });
    }
  }

  agregarIdioma(): void {
    this.divIdioma = false;
    if (this.idiomas.length <= 4) {
      this.idiomas.push({ id: '', lenguaE: '', nivel: '', archivo: null, ruta: '', estado: '' });
    }
  }

  agregarExperiencia(): void {
    this.divExperienciaLaboral = false;
    if (this.experienciaLaboral.length <= 10) {
      this.experienciaLaboral.push({ id: '', institucion: '', cargo: '', inicio: '', termino: '', archivo: null, ruta: '', estado: '' });
    }
  }

  agregarDocencia(): void {
    this.divExperienciaDocencia = false;
    if (this.laborDocencia.length <= 10) {
      this.laborDocencia.push({ id: '', centro: '', curso: '', inicio: '', termino: '', archivo: null, ruta: '', estado: '' });
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

  // ─── Eliminar fila (soft-delete: marca estado '*') ────────────────────────

  eliminarItem(index: number, nombre: keyof EditarEmpleadoComponent): void {
    (this[nombre] as any[])[index].estado = '*';
  }

  // ─── Selección de archivos (método genérico) ───────────────────────────────

  private get numDocValue(): string {
    return this.valDatosPersonales.get('numDoc')?.value ?? '';
  }

  private procesarArchivo(event: any, index: number, array: any[], carpeta: string, prefijo: string): void {
    const file: File = event.target.files[0];
    if (!file) { return; }
    const timestamp   = new Date().getTime();
    const nuevoNombre = `${prefijo}_${timestamp}_${file.name}`;
    const fileFinal   = new File([file], nuevoNombre);
    array[index].archivo = fileFinal;
    array[index].ruta    = `${this.numDocValue}/${carpeta}/${fileFinal.name.replace(/\s+/g, '_')}`;
     console.log(fileFinal)
  }

  seleccionarArchivoEst(e: any, i: number):          void { this.procesarArchivo(e, i, this.estudioSuperior,    'Superior',     'Superior'); }
  seleccionarArchivoPg(e: any, i: number):           void { this.procesarArchivo(e, i, this.estudioPostgrado,   'Postgrado',    'Postgrado'); }
  seleccionarArchivoEspecialidad(e: any, i: number): void { this.procesarArchivo(e, i, this.especializacion,    'Especialidad', 'Especialidad'); }
  seleccionarArchivoCurso(e: any, i: number):        void { this.procesarArchivo(e, i, this.cursos,             'Curso',        'Curso'); }
  seleccionarArchivoIdioma(e: any, i: number):       void { this.procesarArchivo(e, i, this.idiomas,            'Idioma',       'Idioma'); }
  seleccionarArchivoExpLaboral(e: any, i: number):   void { this.procesarArchivo(e, i, this.experienciaLaboral, 'ExpLaboral',   'ExpLaboral'); }
  seleccionarArchivoExpDocencia(e: any, i: number):  void { this.procesarArchivo(e, i, this.laborDocencia,      'ExpDocencia',  'ExpDocencia'); }

  seleccionarArchivoDiscapacidad(event: any): void {
    const file: File = event.target.files[0];
    if (!file) { return; }
    const timestamp   = new Date().getTime();
    const nuevoNombre = `Discapacidad_${timestamp}_${file.name}`;
    const fileFinal   = new File([file], nuevoNombre);
    this.archivoDiscapacidad = [fileFinal];
    this.rutaDiscapacidad    = `${this.numDocValue}/Discapacidad/${fileFinal.name.replace(/\s+/g, '_')}`;
  }

  // ─── Guardar / Actualizar ──────────────────────────────────────────────────

  actualizarEmpleado(): void {
 this.intentoGuardar = true;
  // Validar tablas dinámicas
  const { valido, errores } = this.validarTablasDinamicas();
  console.log(valido)
  if (!valido) {
    console.log('entroo')
  warningAlerta('Alerta','Datos incompletos ');
    return;
  }
    this.loading = true;
    this.datosGeneralesService.editarDatosEmpleado(
      this.valDatosPersonales.getRawValue(),
      this.valSituacionLaboral.value,
      this.valContactoEmergencia.value,
      this.valDatosDomicilio.getRawValue(),
      this.familiares,
      this.valDatosProfesion.value,
      this.estudioSuperior,
      this.estudioPostgrado,
      this.especializacion,
      this.cursos,
      this.idiomas,
      this.experienciaLaboral,
      this.laborDocencia,
      this.fotoFile,
    ).pipe(finalize(() => { this.loading = false; }))
     .subscribe(({ estado, mensaje, datos }) => {
       if (!estado && datos) {
         errorAlertaValidacion(mensaje, datos);
       } else if (datos === 2) {
         warningAlerta('Alerta', mensaje);
       } else if (datos == 1) {
         successAlerta('Éxito', mensaje);
         this.router.navigate(['/legajo/informacion']);
       } else {
         errorAlerta('Error', mensaje);
       }
     });
  }

  actualizarDiscapacidad(): void {
    this.loading = true;
    const datosDiscapacidad = { tipos: this.discapacidades, ruta: this.rutaDiscapacidad };

    this.datosGeneralesService.actualizarDiscapacidad(datosDiscapacidad, this.archivoDiscapacidad, this.numDoc)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe(({ estado, mensaje, datos }) => {
        this.resetTablas();
        if (!estado && datos) {
          errorAlertaValidacion(mensaje, datos);
        } else if (datos === 2) {
          warningAlerta('Alerta', mensaje);
        } else if (datos === 1) {
          successAlerta('Éxito', mensaje);
        } else {
          errorAlerta('Error', mensaje);
        }
      });
  }

  private resetTablas(): void {
    this.familiares         = [];
    this.estudioSuperior    = [];
    this.estudioPostgrado   = [];
    this.especializacion    = [];
    this.cursos             = [];
    this.idiomas            = [];
    this.experienciaLaboral = [];
    this.laborDocencia      = [];
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
  // ── Datos Laborales ───────────────────────────────────────────────────────────────
  this.experienciaLaboral.forEach((item, i) => {
    const n = i + 1;
    if (!item.institucion) errores.push(`Institucion #${n}: Institucion es requerido.`);
    if (!item.cargo) errores.push(`Institucion #${n}: cargo es requerida.`);
    if (!item.inicio) errores.push(`Institucion #${n}: Fecha de inicio es requerida.`);
    if (!item.termino) errores.push(`Institucion #${n}: Fecha de inicio es requerida.`);
  });

  // ── Idiomas ──────────────────────────────────────────────────────────────
  this.idiomas.forEach((item, i) => {
    const n = i + 1;
    if (!item.lenguaE) errores.push(`Idioma #${n}: Lengua es requerida.`);
    if (!item.nivel)   errores.push(`Idioma #${n}: Nivel es requerido.`);
  });
  console.log(this.experienciaLaboral)
 console.log(errores)
  return { valido: errores.length == 0, errores };
}
}