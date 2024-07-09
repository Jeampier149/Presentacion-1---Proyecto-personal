import {Component, ViewChild} from '@angular/core';
import {Modal} from 'bootstrap';
import {finalize} from "rxjs";
import {errorAlerta, successAlerta} from "@shared/utils";
import { EvaluacionService } from '@services/legajo/evaluacion.service';
import { RecocimientoSancionService } from '@services/legajo/reconocimiento-sancion.service';


@Component({
  selector: 'app-modal-reconocimiento-sancion',
  templateUrl: './modal-reconocimiento-sancion.component.html',
  styleUrl: './modal-reconocimiento-sancion.component.scss'
})
export class ModalReconocimientoSancionComponent {
  @ViewChild('modalReconocimiento') modalEl!: any;
  public modal: any;
  public  resolve: any;
  public  reject: any;
  public  tipo: number = 1; // 1 Nuevo, 2 Editar
  public  loading: boolean = false;
  public  empl:any[]=[]
  public  tipoD:any[]=[]
  public  tipoDE:any[]=[
    {
      id:'sancion',
      tipo:'Sanción'
    },
    {
      id:'reconocimiento',
      tipo:'Reconocimiento'
    }
  ]
  public  formulario = {
      id: '',
      documento: '',
      asunto: '',
      fecha:'',
      tipo:'',
      dni:'',
      ruta:''

  }
  public  archivoC:any
  public  subcarpeta:any
  public idDocumento:any

  constructor(private ReconocimientoSancion$: RecocimientoSancionService) {
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
          this.obtenerReconocimientoSancion();
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
    const nuevoNombre =this.formulario.tipo+'_'+timestamp + '_' + fileDo.name;
    const fileFinal: File = new File([fileDo], nuevoNombre);
    const ruta = this.formulario.dni+'/ReconocimientoYSanciones/'+this.formulario.tipo +'/'+fileFinal.name.replace(/\s+/g, '_');
     this.archivoC=fileFinal;
     this.formulario.ruta= ruta;
  }

  listarSelectEmpleado(){
    this.ReconocimientoSancion$.listarSelectEmpleado()
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


  cambioTipo(id:any){
        if(id){
            this.listarSelectTipoDoc(id)
        }
  }
  listarSelectTipoDoc(id:any){
    this.ReconocimientoSancion$.listarSelectTipoDoc(id)
    .pipe(
      finalize(() => {
        this.loading = false;
    })
    )
    .subscribe(({estado, mensaje, datos}) => {
      if (estado) {
          this.tipoDE = datos;
      } else {
          errorAlerta('Error', mensaje).then();
      }
  });
  }

   obtenerReconocimientoSancion() {
       this.loading = true;
       this.ReconocimientoSancion$.obtenerReconocimientoSancion(this.idDocumento)
           .pipe(finalize(() => this.loading = false))
           .subscribe(({estado, mensaje, datos}) => {
               if (estado) {
                    this.formulario.dni= datos!.numeroDocumento;
                     this.formulario.id = datos!.id;
                     this.formulario.asunto = datos!.asunto;
                     this.formulario.tipo= datos!.tipo;
                     this.formulario.fecha= datos!.fecha;
                     this.formulario.documento= datos!.documento;
                     this.formulario.asunto= datos!.asunto;
                     this.formulario.ruta= datos!.ruta;
               } else {
                   errorAlerta('Error!', mensaje).then();
               }
           })
   }

 guardarReconocientoSancion() {
     this.loading = true;
     let params = {
          id:this.formulario.id,
          documento: this.formulario.documento,
          tipo: this.formulario.tipo,
          fecha: this.formulario.fecha,
          asunto: this.formulario.asunto,
          numeroDocumento: this.formulario.dni,
          ruta:this.formulario.ruta          
     }

     if (this.tipo === 1) {
         this.ReconocimientoSancion$.registrarReconocimientoSancion(params,this.archivoC,this.formulario.dni)
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
         this.ReconocimientoSancion$.editarReconocimientoSancion(params,this.archivoC,this.formulario.dni)
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
      tipo:'',
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
