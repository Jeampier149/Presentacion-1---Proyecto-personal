
import {Component, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import {Modal} from 'bootstrap';
import {errorAlerta, successAlerta} from "@shared/utils";
import { CabeceraTabla } from '@shared/components/tabla/tabla.component';
import { finalize } from 'rxjs';
//import { ActividadService } from '@services/programacion/actividad.service';
@Component({
  selector: 'app-modal-datos',
  imports: [],
  templateUrl: './modal-datos.component.html',
  styleUrl: './modal-datos.component.scss'
})
export class ModalDatosComponent {
  @ViewChild('modalActividades') modalActividades?: any;

  modal: any;
  resolve: any;
  reject: any;
  loading: boolean = false;
  longitud: number = 10;
  pagina: number = 1;
  textoBusqueda: string = '';
  filtroBuscarPor: number = 2;
  filtrosBuscarPor: Filtro[] = [
      { nombre: 'Código', valor: 1 },
      { nombre: 'Actividad', valor: 2 },
  ];

  actividades: any[] = [];
  cabeceraTablaActividades: CabeceraTabla[] = [
      { nombre: 'Acciones', clase: 'w-10' },
      { nombre: 'Código', clase: 'w-20' },
      { nombre: 'Actividad', clase: 'w-70' },
  ];

  constructor(private ActividadService$: ActividadService) { }

  ngAfterViewInit() {
      this.modal = new Modal(this.modalActividades.nativeElement, {
          backdrop: 'static',
          keyboard: false
      });
  }

  ngOnDestroy() {
      this.modal.dispose();
  }

  cambioPagina(pagina: number) {
      this.pagina = pagina;
      this.listarActividades();
  }

  abrirModal() {
      this.listarActividades();
      this.modal.show();
      return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;
      })
  }

  cerrarModal() {
      this.resolve();
      this.modal.hide();
      this.limpiarModal();
  }

  limpiarModal() {
      this.actividades = [];
      this.filtroBuscarPor = 2;
      this.textoBusqueda = '';
      this.pagina = 1;
  }

  buscarActividades() {
      this.pagina = 1;
      this.listarActividades();
  }

  listarActividades() {
      this.loading = true;
      this.ActividadService$.listarActividades(this.filtroBuscarPor, this.textoBusqueda, this.longitud, this.pagina).pipe(
          finalize(() => {
              this.loading = false
          })
      ).subscribe(respuesta => {
          this.actividades = respuesta.datos;
      });
  }

  seleccionarActividad(codigo: string, actividad: string) {
      this.resolve({codigo, actividad});
      this.cerrarModal();
  }
}
