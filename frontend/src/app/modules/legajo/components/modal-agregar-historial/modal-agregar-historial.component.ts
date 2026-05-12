import { Component, ElementRef, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { finalize } from 'rxjs';
import { SituacionLaboralService } from '@services/legajo/situacion-laboral.service';
import { DatoGeneralesService } from '@services/legajo/datos-generales.service';
import { errorAlerta, successAlerta, warningAlerta } from '@shared/utils';

@Component({
  selector: 'app-modal-agregar-historial',
  templateUrl: './modal-agregar-historial.component.html',
  styleUrl: './modal-agregar-historial.component.scss',
    encapsulation: ViewEncapsulation.None 
})
export class ModalAgregarHistorialComponent {

  @ViewChild('modalAgregarHistorial') modalRef!: ElementRef;
  @Output() guardado = new EventEmitter<void>();

  loading = false;
  nombre = '';
  numeroDocumento = '';

  regimen: any[] = [];
  tipoRegimen: any[] = [];
  unidadOrganica: any[] = [];
  cargo: any[] = [];
  nivelCargo: any[] = [];
tipoEmpleado: any[] = [];  // 👈
tipoGrupo:    any[] = [];  // 👈
  private modal!: Modal;

  form = new FormGroup({
    valorUnidad:     new FormControl('', Validators.required),
    valorRegimen:    new FormControl('', Validators.required),
    valorTipRegimen: new FormControl(''),
    valorCargo:      new FormControl(''),
    valorNivel:      new FormControl(''),
    fechaIngreso:    new FormControl('', Validators.required),
    fechaTermino:    new FormControl(''),
    motivo:          new FormControl(''),
    condicion:       new FormControl(''),   // 👈
    grupOcup:        new FormControl(''),   // 👈
    sueldo:          new FormControl(''),   // 👈
    resolucionIngreso: new FormControl(''),  // 👈
    resolucionTermino: new FormControl(''),  // 👈
  });

  constructor(
    private situacionSvc: SituacionLaboralService,
    private datosSvc: DatoGeneralesService,
  ) {}

  openModal(numDoc: string, nombre: string) {
    this.numeroDocumento = numDoc;
    this.nombre = nombre;
    this.form.reset();
    this.tipoRegimen = [];
    this.listarSelects();

    // setTimeout garantiza que @ViewChild ya resolvió el nativeElement
    setTimeout(() => {
      if (!this.modal) {
        this.modal = new Modal(this.modalRef.nativeElement, {
          backdrop: false,
          keyboard: false,
        });
      }
      this.modal.show();
    });
  }

  closeModal() {
    this.modal?.hide();
  }

  cambioRegimen() {
    const id = this.form.get('valorRegimen')?.value;
    this.tipoRegimen = [];
    this.form.get('valorTipRegimen')?.setValue('');
    if (id) this.listarTipoRegimen(id);
  }

  listarSelects() {
    this.loading = true;
    this.datosSvc.listarSelects()
      .pipe(finalize(() => this.loading = false))
      .subscribe(({ estado, mensaje, datos }) => {
        if (estado) {
          this.regimen        = datos.regimen;
          this.unidadOrganica = datos.unidadOrganica;
          this.cargo          = datos.cargo;
          this.nivelCargo     = datos.nivel;
          this.tipoEmpleado   = datos.tipoEmpleado;  // 👈
          this.tipoGrupo      = datos.grupo;    
        } else {
          errorAlerta('Error', mensaje);
        }
      });
  }

  listarTipoRegimen(id: any) {
    this.datosSvc.listarTipoRegimen(id)
      .subscribe(({ estado, mensaje, datos }) => {
        if (estado) this.tipoRegimen = datos;
        else errorAlerta('Error', mensaje);
      });
  }

  guardar() {
    if (this.form.invalid) {
        warningAlerta('Atención', 'Complete los campos obligatorios.');
        return;
    }

    const f = this.form.value;
    this.loading = true;

    this.situacionSvc.agregarHistorial(
        this.numeroDocumento,
    f.condicion,
    f.grupOcup,
    f.valorUnidad,
    f.valorRegimen,
    f.valorTipRegimen,
    f.valorCargo,
    f.valorNivel,
    f.fechaIngreso,
    f.fechaTermino,
    f.motivo,
    f.sueldo,
    f.resolucionIngreso,  // 👈
    f.resolucionTermino,  // 👈
    )
    .pipe(finalize(() => this.loading = false))
    .subscribe(({ estado, mensaje }) => {
        if (estado) {
            successAlerta('Éxito', mensaje);
            this.guardado.emit();
            this.closeModal();
        } else {
            errorAlerta('Error', mensaje);
        }
    });
}
}