import { Component } from '@angular/core';

@Component({
  selector: 'app-datos-domicilio',
  templateUrl: './datos-domicilio.component.html',
  styleUrl: './datos-domicilio.component.scss'
})
export class DatosDomicilioComponent {
  //--datos domiclio--//
  departamento: string = "";
  provincia: string = "";
  distrito: string = "";
  via: string = "";
  nombreVia: string = "";
  numeroVia: string = "";
  interiorVia: string = "";
  zona: string = "";
  nombreZona: string = "";
  numeroZona: string = "";
  interiorZona: string = "";
  referenciaDomicilio: string = "";
  ubigeo:string="";


  enviarDatos(){
    const datosDomicilio = {
      departamento: this.departamento.toUpperCase(),
      provincia: this.provincia.toUpperCase(),
      distrito: this.distrito.toUpperCase(),
      via: this.via.toUpperCase(),
      nombreVia: this.nombreVia.toUpperCase(),
      numeroVia: this.numeroVia.toUpperCase(),
      interiorVia: this.interiorVia.toUpperCase(),
      zona: this.zona.toUpperCase(),
      nombreZona: this.nombreZona.toUpperCase(),
      numeroZona: this.numeroZona.toUpperCase(),
      interiorZona: this.interiorZona.toUpperCase(),
      referenciaDomicilio: this.referenciaDomicilio.toUpperCase(),
      ubigeo:this.ubigeo,
      numDocumento:this.numeroDocumento
    }
  }

}
