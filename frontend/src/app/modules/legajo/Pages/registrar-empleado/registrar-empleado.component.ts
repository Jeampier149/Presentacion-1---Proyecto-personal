import { Component } from '@angular/core';

@Component({
  selector: 'app-registrar-empleado',
  templateUrl: './registrar-empleado.component.html',
  styleUrl: './registrar-empleado.component.scss'
})
export class RegistrarEmpleadoComponent {
 rutas :any
loading:any

familiares: any[] = [];
  numFamiliares: number = 0;

  agregarFamiliar() {
    this.familiares.push({ nombre: '', fechaNacimiento: "", dni: '' ,parentesco:"",centroLaboral:""});
  }

  eliminarFamiliar(index: number) {
    this.familiares.splice(index, 1);
  }

  submitForm() {
    // Aquí puedes manejar la lógica para enviar los datos del formulario
    console.log('Datos de familiares:', this.familiares);
  }
}


