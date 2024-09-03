import {Component, ViewChild} from '@angular/core';
import {Modal} from 'bootstrap';
import {finalize} from "rxjs";
import {errorAlerta, successAlerta} from "@shared/utils";
import { EvaluacionService } from '@services/legajo/evaluacion.service';

@Component({
  selector: 'app-modal-ejecucion-gastos',
  templateUrl: './modal-ejecucion-gastos.component.html',
  styleUrl: './modal-ejecucion-gastos.component.scss'
})
export class ModalEjecucionGastosComponent {
  @ViewChild('modalEvaluacion') modalEl!: any;
  public modal: any;
  public  resolve: any;
  public  reject: any;
  public  tipo: number = 1; // 1 Nuevo, 2 Editar
  public  loading: boolean = false;
  public  empl:any[]=[]
  public  tipoD:any[]=[]
  public  tipoDE:any[]=[]
  public  formulario = {
      id: '',
      documento: '',
      asunto: '',
      fecha:'',
      tipoC:'',
      tipoDE:'',
      dni:'',
      ruta:''

  }
  public  archivoC:any
  public  subcarpeta:any
  public idEvaluacion:any

  constructor(private EvaluacionService$: EvaluacionService) {
    this.listarSelectEmpleado()
    this.listarSelectDoc()
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
  asignarSubcarpeta(){

    if(this.formulario.tipoC=='1'){
      this.subcarpeta='Ciclo_Evaluacion'
     }else if(this.formulario.tipoC=='2'){
       this.subcarpeta='Progresion_Carrera'
     }else if(this.formulario.tipoC=='3'){
       this.subcarpeta='Desplazamiento'
     }
     return this.subcarpeta
  }
  archivoEvaluacion(event:any){ 
    const subC=this.asignarSubcarpeta()
    const fileDo: File = event.target.files[0];
    const timestamp = new Date().getTime();
    const nuevoNombre ='Evaluacion_'+subC+'_'+timestamp + '_' + fileDo.name;
    const fileFinal: File = new File([fileDo], nuevoNombre);
    const ruta = this.formulario.dni+'/Evaluacion/'+subC +'/'+fileFinal.name.replace(/\s+/g, '_');
     this.archivoC=fileFinal;
     this.formulario.ruta= ruta;
  }

  listarSelectEmpleado(){
    this.EvaluacionService$.listarSelectEmpleado()
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
  listarSelectDoc(){
    this.EvaluacionService$.listarSelectDoc()
    .pipe(
      finalize(() => {
        this.loading = false;
    })
    )
    .subscribe(({estado, mensaje, datos}) => {
      if (estado) {
          this.tipoD = datos;
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
    this.EvaluacionService$.listarSelectTipoDoc(id)
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

   obtenerEvaluacion() {
    console.log(this.idEvaluacion)
       this.loading = true;
       this.EvaluacionService$.obtenerEvaluacion(this.idEvaluacion)
           .pipe(finalize(() => this.loading = false))
           .subscribe(({estado, mensaje, datos}) => {
               if (estado) {
                    this.formulario.dni= datos!.numeroDocumento;
                     this.formulario.id = datos!.id;
                     this.formulario.tipoC = datos!.documento;
                     this.formulario.asunto = datos!.asunto;
                     this.formulario.fecha= datos!.fecha;
                     this.listarSelectTipoDoc(datos!.documento)
                     this.formulario.tipoDE= datos!.tipo;
                     this.formulario.asunto= datos!.asunto;
                     this.formulario.ruta= datos!.ruta;
                     this.formulario.documento= datos!.descripcion_doc;
               } else {
                   errorAlerta('Error!', mensaje).then();
               }
           })
   }

 guardarEvaluacion() {
     this.loading = true;
     let params = {
          id:this.formulario.id,
          documento: this.formulario.tipoC,
          tipo_doc: this.formulario.tipoDE,
          fecha: this.formulario.fecha,
          descripcion_doc: this.formulario.documento,
          asunto: this.formulario.asunto,
          numeroDocumento: this.formulario.dni,
          ruta:this.formulario.ruta          
     }

     if (this.tipo === 1) {
         this.EvaluacionService$.registrarEvaluacion(params,this.archivoC,this.formulario.dni)
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
         this.EvaluacionService$.editarEvaluacion(params,this.archivoC,this.formulario.dni)
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
      tipoC:'',
      tipoDE:'',
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
