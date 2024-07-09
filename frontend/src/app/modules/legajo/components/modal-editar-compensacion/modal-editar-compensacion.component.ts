import { Component, ViewChild } from '@angular/core';
import {Modal} from 'bootstrap';
import { finalize } from "rxjs";
import { errorAlerta, successAlerta, warningAlerta, errorAlertaValidacion } from "@shared/utils";
import { CompensacionService } from '@services/legajo/compensacion.service';


@Component({
  selector: 'app-modal-editar-compensacion',
  templateUrl: './modal-editar-compensacion.component.html',
  styleUrl: './modal-editar-compensacion.component.scss'
})
export class ModalEditarCompensacionComponent {
  constructor( private CompensacionService$: CompensacionService){
   this.listarSelectEmpleado();
   this.listarSelectTipo();
  }

  @ViewChild('modalEditarCompensacion') modalEditarComp!: any;

  public loading:boolean=false
  public asunto:any=''
  public fecha:any
  public tipoC:any
  public agregable: boolean = false;
  public tipo :any[]=[]
  public empl :any[]=[]
  public datos :any[]=[]
  public dni :string=""
  public documento:string=""
  public archivoC:any
  public ruta:string=''
  public id:any
resolve: any;
 reject: any;
modal: any;
  ngAfterViewInit() {
    this.modal=new Modal(this.modalEditarComp.nativeElement, {
        backdrop: 'static',
        keyboard: false
    });
  }
  openModal(id:any) : Promise<boolean>{
    this.getCompensacion(id)
    this.id=id
    this.modal.show(); 

    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
  })
 
    
  }
  closeModal() {
    this.modal.hide();
    this.resolve(false);

  }
  listarSelectTipo(){
    this.CompensacionService$.listartipoCompensacion()
    .pipe(
      finalize(() => {
        this.loading = false;
    })
    )
    .subscribe(({estado, mensaje, datos}) => {
      if (estado) {
          datos.length > 0 ? this.agregable = false : this.agregable = true;
          this.tipo = datos;
      } else {
          errorAlerta('Error', mensaje).then();
      }
  });
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
  getCompensacion(id:any){
    this.CompensacionService$.getCompensacion(id)
    .pipe(
      finalize(() => {
        this.loading = false;
    })
    )
    .subscribe(({estado, mensaje, datos}) => {
      if (estado) {
          datos.length > 0 ? this.agregable = false : this.agregable = true;
          this.setCompensacion(datos)
      } else {
          errorAlerta('Error', mensaje).then();
      }
  });
  }
  setCompensacion(datos:any){
    this.tipoC=datos[0].tipo
    this.dni=datos[0].numeroDocumento
    this.asunto=datos[0].asunto
    this.documento=datos[0].documento
    this.fecha=datos[0].fecha
    this.ruta=datos[0].ruta
  }

  archivoCompensacion(event:any){
    const fileDo: File = event.target.files[0];
    const timestamp = new Date().getTime();
    const nuevoNombre ='Compensaciones_'+this.tipoC+'_'+timestamp+ '_' + fileDo.name;
    const fileFinal: File = new File([fileDo], nuevoNombre);
    const ruta = this.dni+'/Compensaciones/' +fileFinal.name.replace(/\s+/g, '_');
     this.archivoC=fileFinal;
     this.ruta= ruta;
  }


  editarCompensacion(){
    const compensacion={
      id:this.id,
      dni:this.dni,
      asunto:this.asunto,
      documento:this.documento,
      fecha:this.fecha,
      ruta:this.ruta,
      tipo:this.tipoC
    }
    console.log(this.ruta)
    this.CompensacionService$.editarCompensacion(compensacion,this.archivoC,this.dni)
    .pipe(
      finalize(() => {
        this.loading = false;
    })
    )
    .subscribe(({estado, mensaje}) => {
      if (estado) {
          successAlerta('Éxito!', 'Datos Actualizados').then(() => {
          this.modal.hide();
          this.resolve(true);      
      });
      } else {
          errorAlerta('Error', mensaje).then();
      }
  });
  }


}
