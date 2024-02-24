<?php

namespace App\Http\Controllers\legajo;

use Illuminate\Http\Request;
use App\Http\Controllers\Respuesta\JSONResponseController;
use App\Models\legajo\verDatosModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use stdClass;
class VerDatosController extends JSONResponseController
{
    public function listarDatosEmpleado(Request $request){
        $id=$request->post('pkEmpleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosEmpleado($id);
        return $this->sendResponse(200, true, '', $resultado);     
    }
    public function listarDatosDiscapacidad(Request $request){
        $id=$request->post('pkEmpleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosDiscapacidades($id);
        return $this->sendResponse(200, true, '', $resultado);     
    }
    public function listarDatosContactoEmergencia(Request $request){
        $id=$request->post('pkEmpleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosContactoEmergencia($id);
        return $this->sendResponse(200, true, '', $resultado);     
    }
    public function listarDatosFamiliares(Request $request){
        $id=$request->post('pkEmpleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosFamiliares($id);
        return $this->sendResponse(200, true, '', $resultado);     
    }

    public function listarDatosDomicilio(Request $request){
        $id=$request->post('pkEmpleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosDomicilio($id);
        return $this->sendResponse(200, true, '', $resultado);     
    }
    public function listarArchivos(Request $request){
        $id=$request->post('pkEmpleado');
    // Carpeta remota donde se encuentran los archivos
        $remoteFolder = $id;
        // Carpeta local donde se guardarán los archivos descargados
        $localFolder = storage_path('app');
        // Obtener una lista de archivos en la carpeta remota
        $files = $ftp->nlist($remoteFolder);
        // Descargar cada archivo de la lista
        foreach ($files as $file) {
      // Nombre del archivo en el servidor remoto
          $remoteFilePath = $remoteFolder . '/' . $file;            
        // Ruta local donde se guardará el archivo descargado
         $localFilePath = $localFolder . '/' . $file;
    
        // Descargar el archivo
     if ($ftp->get($remoteFilePath, $localFilePath, FTP_BINARY)) {
        echo "Archivo descargado: $file\n";
        
        // Eliminar el archivo local después de descargarlo
        if (unlink($localFilePath)) {
            echo "Archivo local eliminado: $localFilePath\n";
        } else {
            echo "Error al eliminar el archivo local: $localFilePath\n";
        }
    } else {
        echo "Error al descargar el archivo: $file\n";
    }
}

    // Cerrar conexión FTP
    $ftp->close();
        return $this->sendResponse(200, true, '', $resultado);     
    }
   

}
