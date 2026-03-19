<?php

namespace App\Http\Controllers\Legajo;

use App\Http\Controllers\Controller;
use App\Models\Legajo\ReporteDatosModel;
use App\Models\Legajo\ReporteHistorialModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Mpdf\Mpdf;

class ReporteDatosController extends Controller
{
public function generarPDF(Request $request)
    {   
        $dni=$request->get('pkEmpleado');
        $url=$request->get('url');
        $reporteDatosModel = new ReporteDatosModel();
        $html = $reporteDatosModel->generarPDF($dni,$url);
        $fecha     = now()->format('d/m/Y');
        $mpdf = new Mpdf();
        $css = file_get_contents(resource_path('css\\legajo\\reporteInformacion.css')); // css
        $header='
        <div>
        <table class="encabezado">
        <tr>
           <td colspan="3" class="pega">
             <img width = "100" src = "'.resource_path().'/img/img_personal.png" class="pegantina" alt="imagen no ecnontrada">
           </td>
           <td class="logo"><img width = "60" src = "'.resource_path().'/img/logo-hsb.jpg" class="log" alt="imagen no ecnontrada"></td>  </tr>            
        </tr> 
       </table></div>';

 $footer = '
<table class="pie-pagina">
    <tr>
        <td colspan="3" class="pie-linea-top"></td>
    </tr>
    <tr>
        <td class="pie-izquierda">
            Hosp. Nac. Docente Madre Niño San Bartolomé
        </td>
        <td class="pie-centro">
            Oficina de Recursos Humanos
        </td>
        <td class="pie-derecha">
            ' . $fecha . ' &nbsp;|&nbsp;
            <b>Pág. {PAGENO}/{nbpg}</b>
        </td>
    </tr>
    <tr>
        <td colspan="3" class="pie-linea-bottom"></td>
    </tr>
</table>';

        $mpdf->SetMargins(15, 60,30);
        $mpdf->SetHTMLHeader($header);
        $mpdf->SetHTMLFooter($footer);
        $mpdf->WriteHTML($css,1);
        $mpdf->WriteHTML($html,2);

        $mpdf->Output($dni.'_ReporteDatos.pdf', 'D'); // Descargar el PDF directamente
    }
public function generarHistorialPDF(Request $request)
    {   
        $dni=$request->get('nroDoc');
        $reporteDatosModel = new ReporteHistorialModel();
        $html = $reporteDatosModel->generarHistorialPDF($dni);
   
        $mpdf = new Mpdf(['mode' => 'utf-8','format' => 'A4-L']);
        $css = file_get_contents(resource_path('css\\legajo\\reporteInformacion.css')); // css
        $mpdf->WriteHTML($css,1);
        $mpdf->WriteHTML($html,2);
        $mpdf->Output($dni.'_ReporteHistorial.pdf', 'D'); // Descargar el PDF directamente
    }
   

}