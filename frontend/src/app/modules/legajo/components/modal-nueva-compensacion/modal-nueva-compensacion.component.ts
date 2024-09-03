import { Component, ViewChild } from '@angular/core';
import {Modal} from 'bootstrap';
import { finalize } from "rxjs";
import { errorAlerta, successAlerta, warningAlerta, errorAlertaValidacion } from "@shared/utils";
import { CompensacionService } from '@services/legajo/compensacion.service';


@Component({
  selector: 'app-modal-nueva-compensacion',
  templateUrl: './modal-nueva-compensacion.component.html',
  styleUrl: './modal-nueva-compensacion.component.scss'
})
export class ModalNuevaCompensacionComponent {
  
  constructor( private CompensacionService$: CompensacionService){
    this.listarSelectTipo();
    this.listarSelectEmpleado()
  }

  @ViewChild('modalNuevaCompensacion') modalNuevaComp!: any;

  public loading:boolean=false
  public asunto:any=''
  public fecha:any
  public tipoC:any
  public agregable: boolean = false;
  public tipo :any[]=[]
  public empl :any[]=[]
  public dni :string=""
  public documento:string=""
  public archivoC:any
  public ruta:any
  public resolve: any;
  public reject: any;
  ngAfterViewInit() {
    this.modalNuevaComp=new Modal(this.modalNuevaComp.nativeElement, {
        backdrop: 'static',
        keyboard: false
    });
  }
  openModal(): Promise<boolean>  {
    this.modalNuevaComp.show(); 
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
  })
  }
  closeModal() {
    this.modalNuevaComp.hide();
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

  archivoCompensacion(event:any){
    const fileDo: File = event.target.files[0];
    const timestamp = new Date().getTime();
    const nuevoNombre ='Compensaciones_'+this.tipoC+'_'+timestamp + '_' + fileDo.name;
    const fileFinal: File = new File([fileDo], nuevoNombre);
    const ruta = this.dni+'/Compensaciones/' +fileFinal.name.replace(/\s+/g, '_');
     this.archivoC=fileFinal;
    // this.archivoDiscapacidad.push(fileFinal);
     this.ruta= ruta;
  }
  registrarCompensacion(){
    const compensacion={
      dni:this.dni,
      asunto:this.asunto,
      documento:this.documento,
      fecha:this.fecha,
      ruta:this.ruta,
      tipo:this.tipoC
    }
    this.CompensacionService$.registrarCompensacion(compensacion,this.archivoC,this.dni)
    .pipe(
      finalize(() => {
        this.loading = false;
    })
    )
    .subscribe(({estado, mensaje, datos}) => {
      if (estado) {
          successAlerta('Éxito', 'Compensación registrada correctamente');
          this.closeModal()
         // this.resolve(true);
      } else {
          errorAlerta('Error', mensaje).then();
      }
  });
  }



}