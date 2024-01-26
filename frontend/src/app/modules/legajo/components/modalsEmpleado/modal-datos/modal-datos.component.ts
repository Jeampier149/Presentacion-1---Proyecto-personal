import { Modal } from 'bootstrap';
import { Component, ViewChild, ElementRef, } from '@angular/core';

@Component({
  selector: 'app-modal-datos',
  templateUrl: './modal-datos.component.html',
  styleUrl: './modal-datos.component.scss'
})
export class ModalDatosComponent {
  modal: any;
  resolve: any;
  reject: any;
  idMenu: string = '';
  tipo: number = 1; // 1 Nuevo, 2 Editar
  loading: any
  @ViewChild('selFocus') selFocus!: ElementRef;
  @ViewChild('modalDatos') modalEl!: any;

  ngAfterViewInit() {
    this.modalEl = new Modal(this.modalEl.nativeElement, {
      backdrop: 'static',
      keyboard: false
    });
  }  

  openModal() {
    this.modalEl.show();

  }

  closeModal() {
    this.modalEl.hide();

  }
}
