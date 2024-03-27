<?php

namespace App\Models\Legajo;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Mpdf\Mpdf;

class ReporteDatosModel extends Model
{

    public function generarPDF()
    {

        $html = '';

        $html +="
        <table  style='width:100%; border: 1px solid black; 
                                   border-collapse: collapse;
                                   width: 100%;' >
        <tr>
            <td colspan='4'  style='text-align:left;background-color: #f2f2f2;'><b>DATOS PERSONALES</td>
        </tr>
        <tr>
            <td style='width: 25%;text-align:left'>Apellidos y Nombres</td>
            <td colspan='3'></td>           
        </tr>
              <tr>
             <td style='width: 25%;text-align:left'>DNI N°</td>
             <td style='width: 25%;'></td>
             <td style='width: 25%;text-align:left'>RUC N°</td>
            <td style='width: 25%;'></td>
        </tr>
              <tr>
            <td style='width: 25%;text-align:left'>Fecha de Nacimiento</td>
            <td style='width: 25%;'></td>
            <td style='width: 25%;text-align:left'>Nacionalidad</td>
            <td style='width: 25%;'></td>
        </tr>
              <tr>
            <td style='width: 25%;text-align:left'>Telefono Fijo</td>
            <td style='width: 25%;'></td>
            <td style='width: 25%;text-align:left'>Telefono Movil</td>
            <td style='width: 25%;'></td>
           </tr>
        <tr>
            <td style='width: 25%;text-align:left'>Correo Electronico</td>
            <td style='width: 25%;'></td>
            <td style='width: 25%;text-align:left'>Grupo Sanguineo</td>
            <td style='width: 25%;'></td>
        </tr>
             <tr>
            <td style='width: 25%;text-align:left'>Enfermedades / Alergias</td>
            <td colspan='3'></td>
           
        </tr>         
        <tr>
            <td style='width: 25%;text-align:left'>En Casos de Emeergencia contactar a:</td>
            <td colspan='3'></td>          
        </tr>
        <tr>
            <td style='width: 25%;text-align:left'>Parentesco</td>
            <td style='width: 25%;'></td>
            <td style='width: 25%;text-align:left'>Telefono del contacto de Emergencia</td>
            <td style='width: 25%;'></td>
        </tr>
          <tr>
            <td style='width: 25%;text-align:left'>Estado Civil</td>
            <td style='width: 25%;'></td>
            <td style='width: 25%;text-align:left'>Discapacidad</td>
            <td style='width: 25%;'></td>
        </tr>
                <tr>
            <td colspan='4'  style='text-align:left;background-color: #f2f2f2;'><b>DOMICILIO</td>
        </tr>
 
              <tr>
             <td style='width: 25%;text-align:left'>Departamento</td>
             <td style='width: 25%;'></td>
             <td style='width: 25%;text-align:left'>Provincia</td>
            <td style='width: 25%;'></td>
        </tr>
              <tr>
            <td style='width: 25%;text-align:left'>Distrito</td>
            <td style='width: 25%;'></td>
            <td style='width: 25%;text-align:left'>Tipo de Via</td>
            <td style='width: 25%;'></td>
        </tr>
        <tr>
            <td style='width: 25%;text-align:left'>Nombre Via</td>
            <td style='width: 25%;'></td>
            <td style='width: 25%;text-align:left' >Interior Via</td>
             <td style='width: 25%;'></td>
 
        </tr>
        <tr>
            <td style='width: 25%;text-align:left'>Tipo de Zona</td>
            <td style='width: 25%;'></td>
            <td style='width: 25%;text-align:left'>Nombre de zona</td>
            <td style='width: 25%;'></td>
        </tr>
             <tr>
                <td style='width: 25%;text-align:left'>Numero Zona</td>
            <td style='width: 25%;'></td>
            <td style='width: 25%;text-align:left'>Interior zona</td>
            <td style='width: 25%;'></td>
           
        </tr>
         
        <tr>
            <td style='width: 25%;text-align:left'>Referencia (Indicar Avenida/Calle y/o institucion cercana):</td>
            <td colspan='3'></td>
           
        </tr>
      <tr>
            <td colspan='4'  style='text-align:left;background-color: #f2f2f2;'><b>DATOS FAMILIARES</td>
        </tr>
       <table>
          <tr>
             <td style='width: 25%;text-align:center'><b>Apellidos y Nombres</td>
         <td style='width: 15%;text-align:center'><b>Fecha de Nacimiento</td>
            <td style='width: 15%;text-align:center'><b>N° de DNI</td>
          <td style='width: 15%;text-align:center'><b>Parentesco</td>
          <td style='width: 35%;text-align:center'><b>Institucion Laboral</td>
          </tr>    
           <tr>
           <td style='width: 25%;text-align:center'><b></td>
           <td style='width: 15%;text-align:center'><b></td>
           <td style='width: 15%;text-align:center'><b></td>
           <td style='width: 15%;text-align:center'><b></td>
           <td style='width: 35%;text-align:center'><b></td>
              </tr>
                    <tr>
           <td style='width: 25%;text-align:center'><b></td>
           <td style='width: 15%;text-align:center'><b></td>
           <td style='width: 15%;text-align:center'><b></td>
           <td style='width: 15%;text-align:center'><b></td>
           <td style='width: 35%;text-align:center'><b></td>
              </tr>
          <tr>
            <td colspan='5'  style='text-align:left;background-color: #f2f2f2;'><b>DATOS  PROFESIONALES/ACADEMICOS</td>
        </tr>
       </table>
        
    </table>              
        ";

        $mpdf = new Mpdf();
        $mpdf->WriteHTML($html);
        $mpdf->Output();
        exit;
    }
}
