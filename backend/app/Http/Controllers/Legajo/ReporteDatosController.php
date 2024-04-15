<?php

namespace App\Http\Controllers\Legajo;

use App\Http\Controllers\Controller;
use App\Models\Legajo\ReporteDatosModel;
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
   
        $mpdf = new Mpdf();
        $css = file_get_contents(resource_path('css\\legajo\\reporteInformacion.css')); // css

        $mpdf->WriteHTML($css,1);
        $mpdf->WriteHTML($html,2);
        $mpdf->Output($dni.'_ReporteDatos.pdf', 'D'); // Descargar el PDF directamente
    }
   

}