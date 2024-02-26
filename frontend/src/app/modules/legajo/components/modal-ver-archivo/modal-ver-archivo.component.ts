import { Component, ViewChild } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import {Modal} from 'bootstrap';
@Component({
  selector: 'app-modal-ver-archivo',
  templateUrl: './modal-ver-archivo.component.html',
  styleUrl: './modal-ver-archivo.component.scss'
})
export class ModalVerArchivoComponent {

 loading:boolean=false
 prevArchivo: any;
 
 @ViewChild('modalFrame') modalFrame!: any;

 constructor(private sanitizer: DomSanitizer){}

 ngAfterViewInit() {
  this.modalFrame = new Modal(this.modalFrame.nativeElement, {
      backdrop: 'static',
      keyboard: false
  });
}
 openModal(url:any) {
  this.modalFrame.show();
  this.prevArchivo=this.sanitizer.bypassSecurityTrustResourceUrl(url);
 
}

 closeModal() {
  this.modalFrame.hide();
}

}
