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
    public function listarTodosLosDatos(Request $request)
    {
        $id = $request->post('pkEmpleado');
        $datos = new  verDatosModel();
        
        $resultado = [];

        $resultado['datosEmpleado'] = $datos->listarDatosEmpleado($id);
        $resultado['datosDiscapacidad'] = $datos->listarDatosDiscapacidades($id);
        $resultado['datosContactoEmergencia'] = $datos->listarDatosContactoEmergencia($id);
        $resultado['datosFamiliares'] = $datos->listarDatosFamiliares($id);
        $resultado['datosDomicilio'] = $datos->listarDatosDomicilio($id);
        $resultado['datosProfesion'] = $datos->listarDatosProfesion($id);
        $resultado['datosEstudioSuperior'] = $datos->listarDatosEstudioSuperior($id);
        $resultado['datosEstudioPostgrado'] = $datos->listarDatosEstudioPostgrado($id);
        $resultado['datosEstudioEspecializacion'] = $datos->listarDatosEstudioEspecializacion($id);
        $resultado['datosEstudioCursos'] = $datos->listarDatosEstudioCursos($id);
        $resultado['datosEstudioIdioma'] = $datos->listarDatosEstudioIdioma($id);
        $resultado['datosExperienciaLaboral'] = $datos->listarDatosExperienciaLaboral($id);
        $resultado['datosExperienciaDocencia'] = $datos->listarDatosExperienciaDocencia($id);

        return $this->sendResponse(200, true, 'Todos los datos', $resultado);
    }

    public function verArchivo(Request $request)
    {    
        try {
            $ruta = $request->get('ruta');
            if (empty(trim($ruta))) {
                return;
            }
            $archivo = Storage::disk('ftp')->get($ruta);
            $tipo = Storage::disk('ftp')->mimeType($ruta);
            return response($archivo, 200)->header('Content-Type', $tipo);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener el archivo desde FTP: ' . $e->getMessage()], 500);
        }
    }
}
