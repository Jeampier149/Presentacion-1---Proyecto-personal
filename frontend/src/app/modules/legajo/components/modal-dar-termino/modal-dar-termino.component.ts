import { Component, ViewChild } from '@angular/core';
import {Modal} from 'bootstrap';
import { finalize } from "rxjs";
import { errorAlerta, successAlerta, warningAlerta, errorAlertaValidacion } from "@shared/utils";
import { SituacionLaboralService } from '@services/legajo/situacion-laboral.service';

@Component({
  selector: 'app-modal-dar-termino',
  templateUrl: './modal-dar-termino.component.html',
  styleUrl: './modal-dar-termino.component.scss'
})
export class ModalDarTerminoComponent {
  loading:boolean=false
  constructor(private  DatoSituacionService$: SituacionLaboralService){}
  @ViewChild('modalDarTermino') modalTermino!: any;

  fechaTermino:any
  motivo:any
  agregable: boolean = false;
  idHistorial:string=''
  ngAfterViewInit() {
    this.modalTermino= new Modal(this.modalTermino.nativeElement, {
        backdrop: 'static',
        keyboard: false
    });
  }
  openModal(idHistorial:string) {
    this.modalTermino.show(); 
   this.idHistorial=idHistorial
  }
  closeModal() {
    this.modalTermino.hide();
    
  }

 registrarTermino(){
  this.DatoSituacionService$.registrarTermino(this.idHistorial,this.motivo,this.fechaTermino)
  .pipe(
    finalize(() => {
      this.loading = false;
    })
  )
  .subscribe(({ estado, mensaje, datos }) => {
    if (estado) {
       if(datos=='1'){
        successAlerta('Éxito', mensaje);
       }
    } else {
      errorAlerta('Error', mensaje).then();
    }
  });
  }
}
