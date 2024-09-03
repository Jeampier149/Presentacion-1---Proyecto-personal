import {Component, ViewChild} from '@angular/core';
import {Modal} from 'bootstrap';
import {finalize} from "rxjs";
import {errorAlerta, successAlerta} from "@shared/utils";
import { ResumenService } from '@services/remuneraciones/resumen.service';

@Component({
  selector: 'app-modal-resumen',
  templateUrl: './modal-resumen.component.html',
  styleUrl: './modal-resumen.component.scss'
})
export class ModalResumenComponent {
  @ViewChild('modalResumen') modalEl!: any;
  public modal: any;
  public  resolve: any;
  public  reject: any;
  public  tipo: number = 1; // 1 Nuevo, 2 Editar
  public  loading: boolean = false;
  public  formulario = {
      id: '',
      year: '',
      mes: '',
      ruta:''

  }
  public  archivoDatosPLH:any
  public  subcarpeta:any
  public idEvaluacion:any

  constructor(private ResumenService$: ResumenService) {

  }
  ngAfterViewInit() {
      this.modal = new Modal(this.modalEl.nativeElement, {
          backdrop: 'static',
          keyboard: false
      });
  }


  openModal(tipo: number, idEvaluacion?: string): Promise<boolean> {
      this.modal.show();
      this.tipo = tipo;
      if (tipo === 2) {
          this.idEvaluacion =idEvaluacion!;
          this.obtenerEvaluacion();
      }
      return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;
      })
  }

  closeModal() {
      this.modal.hide();
      this.resolve(false);
     // this.resetModal();
  }
 
  archivoDatos(event:any){ 
    const fileDo: File = event.target.files[0];
    // const timestamp = new Date().getTime();
    // const nuevoNombre =''+subC+'_'+timestamp + '_' + fileDo.name;
    // const fileFinal: File = new File([fileDo], nuevoNombre);
     const ruta = 'Remuneraciones/Resumen/'+this.formulario.year+'/'+fileDo.name.replace(/\s+/g, '_');
     this.archivoDatosPLH=fileDo;
     this.formulario.ruta= ruta;
  }

   obtenerEvaluacion() {
    console.log(this.idEvaluacion)
       this.loading = true;
       this.ResumenService$.obtenerResumen(this.idEvaluacion)
           .pipe(finalize(() => this.loading = false))
           .subscribe(({estado, mensaje, datos}) => {
               if (estado) {
                    this.formulario.year= datos!.numeroDocumento;
                     this.formulario.id = datos!.id;
                     this.formulario.mes = datos!.documento;
                     this.formulario.ruta = datos!.asunto;
                  
               } else {
                   errorAlerta('Error!', mensaje).then();
               }
           })
   }

    generarResumen() {
     this.loading = true;
     let params = {
          id:this.formulario.id,
          mes: this.formulario.mes,
          year: this.formulario.year,
          ruta:this.formulario.ruta          
     }

     if (this.tipo === 1) {
        console.log(this.archivoDatosPLH);
         this.ResumenService$.generarResumen(params,this.archivoDatosPLH)      
              .pipe(finalize(() => this.loading = false))
              .subscribe((response:Blob) => {
                const fileURL = URL.createObjectURL(response);
                const downloadLink = document.createElement('a');
                downloadLink.href = fileURL;
                downloadLink.download ='this.numeroDocumento';
                document.body.appendChild(downloadLink);
                downloadLink.click();
             
            });
        }
     if (this.tipo === 2) {
         this.ResumenService$.editarResumen(params,this.archivoDatosPLH)
             .pipe(finalize(() => this.loading = false))
             .subscribe(({estado, mensaje}) => {
                 if (estado) {
                     successAlerta('Éxito!', mensaje).then(() => {
                         this.modal.hide();
                          this.resolve(true);
                          this.resetModal()
                       
                      });
                  } else {
                     errorAlerta('Error!', mensaje).then();
                 }
             })
     }
     // this.obtenerPerfil();
 }

  resetModal() {
     this.tipo = 1;
     this.formulario = {
      id: '',
      mes: '',
      year: '',
      ruta:''
    }
 }

  limpiarCampos() {
  }

  ngOnDestroy() {
      this.modal.dispose();
  }
}
