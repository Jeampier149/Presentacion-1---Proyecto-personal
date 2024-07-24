<?php

namespace App\Http\Controllers\Util;

use App\Http\Controllers\Respuesta\JSONResponseController;
use App\Models\Util\GeneralModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use ZipArchive;
class GeneralController extends JSONResponseController
{
    public  function listarSelects(){
        $dato=new GeneralModel();
        $resultado=[];
        $resultado['tipoDocumento']=$dato->listarTipoDocumento();
        $resultado['tipoEmpleado']=$dato->listarTipoEmpleado();
        $resultado['grupo']=$dato->listarGrupo();
        $resultado['regimen']=$dato->listarRegimen();
        $resultado['sexo']=$dato->listarSexo();
        $resultado['grupoSanguineo']=$dato->listarGrupoSanguineo();
        $resultado['estadoCivil']=$dato->listarEstadoCivil();
        $resultado['parentesco']=$dato->listarParentesco();
        $resultado['profesiones']=$dato->listarProfesiones();
        $resultado['idioma']=$dato->listarNivelIdioma();
        $resultado['cargo']=$dato->listarCargo();
        $resultado['nivel']=$dato->listarNivel();
        $resultado['via']=$dato->listarVias();
        $resultado['zona']=$dato->listarZonas();
        $resultado['unidadOrganica']=$dato->listarUnidad();

        
        return $this->sendResponse(200, true, '', $resultado);
    }

    public function listarTipoRegimen(Request $request){
        $id=$request->post('id');
        $tipoRegimen =new GeneralModel();
        $resultado=$tipoRegimen->listarTipoRegimen($id);
        return $this->sendResponse(200, true, '', $resultado);
    }
    public function listarServicio(Request $request){
        $id=$request->post('id');
        $tipoRegimen =new GeneralModel();
        $resultado=$tipoRegimen->listarServicio($id);
        return $this->sendResponse(200, true, '', $resultado);
    }
    public function listarEmpleados(){
        $empleado=new GeneralModel();
        $resultado=$empleado->listarEmpleados();
        return $this->sendResponse(200, true, '', $resultado);
    }
    public function listarTipoCompensaciones(){
        $compensacion=new GeneralModel();
        $resultado=$compensacion->listarTipoCompensaciones();
        return $this->sendResponse(200, true, '', $resultado);
    }
    
    public function exportarCarpeta(Request $request)
{
    try {
        $documento = $request->get('documento');
        $carpeta = $request->get('carpeta');
        $subcarpeta = $request->get('subcarpeta');
        $ruta = ($subcarpeta) ? $documento . '/' . $carpeta . '/' . $subcarpeta . '/' : $documento . '/' . $carpeta . '/';

        // Obtener lista de archivos y carpetas en la ruta
        $archivosYCarpetas = Storage::disk('ftp')->allFiles($ruta);

        if (empty($archivosYCarpetas)) {
            return response()->json(['error' => 'No se encontraron archivos en la ruta proporcionada.'], 300);
        }

        // Crear un archivo ZIP
        $zip = new ZipArchive;
        $zipFileName = $carpeta . '.zip';
        $zipFilePath = storage_path('app/' . $zipFileName);

        if ($zip->open($zipFilePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
            // Añadir cada archivo y carpeta al ZIP
            foreach ($archivosYCarpetas as $archivo) {
                $contenidoArchivo = Storage::disk('ftp')->get($archivo);
                $nombreArchivo = str_replace($ruta, '', $archivo); // Mantener la estructura de carpetas
                $zip->addFromString($nombreArchivo, $contenidoArchivo);
            }
            $zip->close();
        } else {
            return response()->json(['error' => 'No se pudo crear el archivo ZIP.'], 500);
        }

        return response()->download($zipFilePath)->deleteFileAfterSend(true);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al obtener los archivos desde FTP: ' . $e->getMessage()], 500);
    }
}

   
}

