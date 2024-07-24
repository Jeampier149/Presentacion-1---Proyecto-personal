
import { Component, ViewChild } from '@angular/core';
import {Modal} from 'bootstrap';
import { finalize } from "rxjs";
import { errorAlerta, successAlerta, warningAlerta, errorAlertaValidacion } from "@shared/utils";
import { SituacionLaboralService } from '@services/legajo/situacion-laboral.service';
import { CompensacionService } from '@services/legajo/compensacion.service';
import { ExportarZipService } from '@services/general/exportar-zip.service';
@Component({
  selector: 'app-modal-exportar',
  templateUrl: './modal-exportar.component.html',
  styleUrl: './modal-exportar.component.scss'
})
export class ModalExportarComponent {
 
  constructor( private CompensacionService$: CompensacionService,private ExportarZip$:ExportarZipService){
    this.listarSelectEmpleado()
  }

  @ViewChild('modalExporta') modalExporta!: any;

  public loading:boolean=false
  public agregable: boolean = false;
  public empl :any[]=[]
  public dni :string=""
  public carpeta:any
  public subcarpeta: any
  ngAfterViewInit() {
    this.modalExporta=new Modal(this.modalExporta.nativeElement, {
        backdrop: 'static',
        keyboard: false
    });
  }
  openModal(tipo:string)  {
    this.carpeta=tipo
    this.modalExporta.show(); 
  
  }
  closeModal() {
    this.modalExporta.hide();
    
  }

  listarSelectEmpleado(){
    this.CompensacionService$.listarSelectEmpleado()
    .pipe(
      finalize(() => {
        this.loading = false;
    })
    )
    .subscribe(({estado, mensaje, datos}) => {
      if (estado) {
          datos.length > 0 ? this.agregable = false : this.agregable = true;
          this.empl = datos;
      } else {
          errorAlerta('Error', mensaje).then();
      }
  });
  }


  exportar(){   
    this.ExportarZip$.exportarCarpeta(this.dni,this.carpeta,this.subcarpeta)
    .pipe(
      finalize(() => {
        this.loading = false;
    })
    )
    .subscribe((response:Blob) => {
      if(!response){
        successAlerta('Warning', 'No existen archivos por exportar');
      }
      if (response instanceof Blob) {
        const fileURL = URL.createObjectURL(response);
        const downloadLink = document.createElement('a');
        downloadLink.href = fileURL;
        downloadLink.download =`${this.carpeta}`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        successAlerta('Éxito', 'Archivos exportados');
        this.closeModal()

      } else {
          errorAlerta('Error', 'Error al exportar carpeta de archivos').then();
      }
  });
  }

}
