import { Component, ViewChild } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import {Modal} from 'bootstrap';

@Component({
  selector: 'app-modal-ver-compensacion',
  templateUrl: './modal-ver-compensacion.component.html',
  styleUrl: './modal-ver-compensacion.component.scss'
})
export class ModalVerCompensacionComponent {
  loading:boolean=false
  prevArchivo: any='';
  
  @ViewChild('modalVerCompensacion') modalFrame!: any;
 
  constructor(private sanitizer: DomSanitizer){
 
  }
 
  ngAfterViewInit() {
   this.modalFrame = new Modal(this.modalFrame.nativeElement, {
       backdrop: 'static',
       keyboard: false
   });
 }
  openModal(url:any) {
   this.prevArchivo =this.sanitizer.bypassSecurityTrustResourceUrl(url);
   this.modalFrame.show(); 
 }
 
  closeModal() {
   this.modalFrame.hide();
 }
 
}
