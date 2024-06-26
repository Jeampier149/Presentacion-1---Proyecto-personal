<?php

namespace App\Http\Controllers\legajo;

use Illuminate\Http\Request;
use App\Http\Controllers\Respuesta\JSONResponseController;
use App\Models\legajo\verDatosModel;
use Illuminate\Support\Facades\Storage;

class VerDatosController extends JSONResponseController
{
    public function listarTodosLosDatos(Request $request)
    {
        $numeroDoc = $request->post('pkEmpleado');
        $datos = new  verDatosModel();

        $resultado = [];

        $resultado['datosEmpleado'] = $datos->listarDatosEmpleadoVer($numeroDoc);
        $resultado['datosSituacion'] = $datos->listarDatosSituacionLaboral($numeroDoc);
        $resultado['datosDiscapacidad'] = $datos->listarDatosDiscapacidades($numeroDoc);
        $resultado['datosContactoEmergencia'] = $datos->listarDatosContactoEmergencia($numeroDoc);
        $resultado['datosFamiliares'] = $datos->listarDatosFamiliares($numeroDoc);
        $resultado['datosDomicilio'] = $datos->listarDatosDomicilio($numeroDoc);
        $resultado['datosProfesion'] = $datos->listarDatosProfesion($numeroDoc);
        $resultado['datosEstudioSuperior'] = $datos->listarDatosEstudioSuperior($numeroDoc);
        $resultado['datosEstudioPostgrado'] = $datos->listarDatosEstudioPostgrado($numeroDoc);
        $resultado['datosEstudioEspecializacion'] = $datos->listarDatosEstudioEspecializacion($numeroDoc);
        $resultado['datosEstudioCursos'] = $datos->listarDatosEstudioCursos($numeroDoc);
        $resultado['datosEstudioIdioma'] = $datos->listarDatosEstudioIdioma($numeroDoc);
        $resultado['datosExperienciaLaboral'] = $datos->listarDatosExperienciaLaboral($numeroDoc);
        $resultado['datosExperienciaDocencia'] = $datos->listarDatosExperienciaDocencia($numeroDoc);

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
    public function guardarImagen(Request $request)
    {

        if ($request->hasFile('imagen')) {
            $imagen = $request->file('imagen');
            $nombreImagen = $imagen->getClientOriginalName();
            $destino= 'img/'.$nombreImagen.'.jpg';
            Storage::disk('public')->put($destino,file_get_contents($imagen));
            return response()->json(['mensaje' => 'Imagen guardada exitosamente']);
        }
    }
    public function eliminarImagen(Request $request)
    {

        if ($request->post('numDoc')) {
            $imagen = $request->post('numDoc');
            $nombreImagen = $imagen.'.jpg';
            $destino= 'img/'.$nombreImagen;
            Storage::disk('public')->delete($destino);
            return response()->json(['mensaje' => 'Imagen eliminada exitosamente']);
        }
    }
}
