import {Component, ViewChild} from '@angular/core';
import {Modal} from 'bootstrap';
import {finalize} from "rxjs";
import {errorAlerta, successAlerta} from "@shared/utils";
import { RecocimientoSancionService } from '@services/legajo/reconocimiento-sancion.service';
import { RelacionesLaboralesService } from '@services/legajo/relaciones-laborales.service';
@Component({
  selector: 'app-modal-relaciones-laborales',
  templateUrl: './modal-relaciones-laborales.component.html',
  styleUrl: './modal-relaciones-laborales.component.scss'
})
export class ModalRelacionesLaboralesComponent {
  @ViewChild('modalRelaciones') modalEl!: any;
  public modal: any;
  public  resolve: any;
  public  reject: any;
  public  tipo: number = 1; // 1 Nuevo, 2 Editar
  public  loading: boolean = false;
  public  empl:any[]=[]
  public  tipoD:any[]=[]
  
  public  formulario = {
      id: '',
      documento: '',
      asunto: '',
      fecha:'',
      dni:'',
      ruta:''

  }
  public  archivoC:any
  public  subcarpeta:any
  public idDocumento:any

  constructor(private RelacionLaboral$: RelacionesLaboralesService) {
    this.listarSelectEmpleado()
 
  }
  ngAfterViewInit() {
      this.modal = new Modal(this.modalEl.nativeElement, {
          backdrop: 'static',
          keyboard: false
      });
  }


  openModal(tipo: number, idDocumento?: string): Promise<boolean> {
      this.modal.show();
      this.tipo = tipo;
      if (tipo === 2) {
          this.idDocumento =idDocumento!;
          this.obtenerRelacionLaboral();
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

  archivoEvaluacion(event:any){ 
    const fileDo: File = event.target.files[0];
    const timestamp = new Date().getTime();
    const nuevoNombre ='RelacionesLaborales_'+timestamp + '_' + fileDo.name;
    const fileFinal: File = new File([fileDo], nuevoNombre);
    const ruta = this.formulario.dni+'/RelacionesLaborales/'+fileFinal.name.replace(/\s+/g, '_');
     this.archivoC=fileFinal;
     this.formulario.ruta= ruta;
  }

  listarSelectEmpleado(){
    this.RelacionLaboral$.listarSelectEmpleado()
    .pipe(
      finalize(() => {
        this.loading = false;
    })
    )
    .subscribe(({estado, mensaje, datos}) => {
      if (estado) {
          this.empl = datos;
      } else {
          errorAlerta('Error', mensaje).then();
      }
  });
  }

  
   obtenerRelacionLaboral() {
       this.loading = true;
       this.RelacionLaboral$.obtenerRelacionLaboral(this.idDocumento)
           .pipe(finalize(() => this.loading = false))
           .subscribe(({estado, mensaje, datos}) => {
               if (estado) {
                    this.formulario.dni= datos!.numeroDocumento;
                     this.formulario.id = datos!.id;
                     this.formulario.asunto = datos!.asunto;
                     this.formulario.fecha= datos!.fecha;
                     this.formulario.documento= datos!.documento;
                     this.formulario.asunto= datos!.asunto;
                     this.formulario.ruta= datos!.ruta;
               } else {
                   errorAlerta('Error!', mensaje).then();
               }
           })
   }

 guardarRelacionLaboral() {
     this.loading = true;
     let params = {
          id:this.formulario.id,
          documento: this.formulario.documento,
          fecha: this.formulario.fecha,
          asunto: this.formulario.asunto,
          numeroDocumento: this.formulario.dni,
          ruta:this.formulario.ruta          
     }

     if (this.tipo === 1) {
         this.RelacionLaboral$.registrarRelacionLaboral(params,this.archivoC,this.formulario.dni)
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

     if (this.tipo === 2) {
         this.RelacionLaboral$.editarRelacionLaboral(params,this.archivoC,this.formulario.dni)
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
      documento: '',
      asunto: '',
      fecha:'',
      dni:'',
      ruta:''
    }
 }

  limpiarCampos() {
  }

  ngOnDestroy() {
      this.modal.dispose();
  }


}
