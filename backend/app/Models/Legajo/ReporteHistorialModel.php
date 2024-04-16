<?php

namespace App\Models\Legajo;

use Illuminate\Database\Eloquent\Model;
use App\Models\legajo\SituacionLaboralModel;

class ReporteHistorialModel extends Model
{
   

    public function generarHistorialPDF($dni){
       $data= new SituacionLaboralModel();
       $response=$data->listarSituacionLaboralHistorial($dni);  
        $html='<table class="encabezado">
        <tr>
           <td colspan="3" class="pega">
             <img width = "100" src = "'.resource_path().'/img/img_personal.png" class="pegantina" alt="imagen no ecnontrada">
           </td>
           <td class="logo"><img width = "60" src = "'.resource_path().'/img/logo-hsb.jpg" class="log" alt="imagen no ecnontrada"></td>  </tr>            
        </tr> 
       </table>';
           
        $html.='
         <h5 style="text-align:center;">REPORTE HISTORICO DE LA SITUACIÓN LABORAL</h5>';
        
        $html.='<p><b> APELLIDOS Y NOMBRES: </b>'.$response[0]->nombreC.'</p>';
        $html.='
        <table>
          <thead>
               <tr>
                <td>#</td>
                <td>Unidad Organica</td>
                <td style="width:15%;">Servicio</td>
                <td>Condicion</td>
                <td>Regimen</td>
                <td>T.Regimen</td>
                <td>F.Ingreo</td>
                <td>F.Termino</td>
                <td>Motivo</td>             
               </tr>
         
          </thead>
        <tbody> ';
        $count=1;
        foreach ($response as $data) {
            $html.='
            <tr>
             <td>'.$count++.'</td>
             <td>'.$data->unidadOrganica.'</td>
             <td>'.$data->servicio.'</td>
             <td>'.$data->condicion.'</td>
             <td>'.$data->regimen.'</td>
             <td>'.$data->tipoRegimen.'</td>
             <td>'.$data->fechaIngreso.'</td>
             <td>'.$data->fechaTermino.'</td>
             <td>'.$data->motivo.'</td>
            </tr>
          
          ';
        }
       
        $html.='
        </tbody>
        </table>';

        return $html;
    }
}
