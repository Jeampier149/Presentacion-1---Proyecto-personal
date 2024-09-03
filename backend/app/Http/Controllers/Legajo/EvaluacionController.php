<?php

namespace App\Http\Controllers\Legajo;

use App\Http\Controllers\Respuesta\JSONResponseController;
use App\Models\Legajo\EvaluacionModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use stdClass;

class EvaluacionController extends JSONResponseController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }
    public function listarEvaluacion(Request $request): JsonResponse
    {

        $validacion = Validator::make($request->only([
            'documento', 'tipo', 'dni','desDocumento',
            'asunto', 'fecha', 'pagina', 'longitud'
        ]), [
            'dni' => 'nullable|string',
            'documento' => 'nullable|string',
            'desDocumento' => 'nullable|string',
            'tipo' => 'nullable|string',
            'asunto' => 'nullable|string',
            'fecha' => 'nullable|string',
            'pagina' => 'required|integer',
            'longitud' => 'required|integer',

        ]);

        if ($validacion->fails()) {
            return $this->sendResponse(200, false, 'Error de validación', $validacion->errors());
        }

        $evalModel = new EvaluacionModel();
        $documento = $request->get('documento') ?? '';
        $desDocumento = $request->get('desDocumento') ?? '';
        $tipo = $request->get('tipo') ?? '';
        $asunto = $request->get('asunto') ?? '';
        $fecha = $request->get('fecha') ?? '';
        $dni = $request->get('dni') ?? '';
        $pagina = $request->get('pagina');
        $longitud = $request->get('longitud');
        $resultado = $evalModel->listarEvaluaciones($documento,$desDocumento,$tipo,$asunto,$fecha,$dni,$pagina,$longitud);
        
        return $this->sendResponse(200, true, '', $resultado);
    }
    public function listarEvalDoc(){
        $empleado=new EvaluacionModel();
        $resultado=$empleado->listarEvalDoc();
        return $this->sendResponse(200, true, '', $resultado);
    }
    public function listarEvalTipoDoc(Request $request){
        $id=$request->post('id');
        $empleado=new EvaluacionModel();
        $resultado=$empleado->listarEvalTipoDoc($id);
        return $this->sendResponse(200, true, '', $resultado);
    }
    public function obtenerEvaluacion(Request $request){
        $id=$request->post('id');
        $empleado=new EvaluacionModel();
        $resultado=$empleado->obtenerEvaluacion($id);
        return $this->sendResponse(200, true, '', $resultado);
    }

    public function registrarEvaluacion(Request $request): JsonResponse{
        [$usuario, $perfil, $equipo] = $this->getHost($request);
         $datos = json_decode($request->post('datos'), true);
         $numeroDocumento = json_decode($request->post('numeroDoc'), true);
        
         if ($request->hasFile('archivo')) {
            $ruta = $datos['ruta'];
            $sbn=explode('/',$ruta)[2];
             $archivo = $request->file('archivo');
             $nameArchivo = $archivo->getClientOriginalName();
             $name = str_replace(" ", "_", $nameArchivo);
             $partes = explode('_', $nameArchivo);
             $subcarpeta = reset($partes);
             $destino = $numeroDocumento . '/'.$subcarpeta. '/'.$sbn. '/'. $name;         
             try {
                 Storage::disk('ftp')->put($destino, file_get_contents($archivo));
             } catch (\Exception $e) {
                 $errorMessage = $e->getMessage();
                 return response()->json(['error' => 'Error al subir el archivo al servidor FTP: ' . $errorMessage], 500);
             }
         }
         $cmp= new EvaluacionModel();
         $resultado=$cmp->registrarEvaluacion($datos,$usuario,$equipo,$perfil);
         return $this->sendResponse(200, true, '', $resultado);
     }
     public function editarEvaluacion(Request $request): JsonResponse{
        [$usuario, $perfil, $equipo] = $this->getHost($request);
         $datos = json_decode($request->post('datos'), true);
         $numeroDocumento = json_decode($request->post('numeroDoc'), true);
         $ruta = $datos['ruta'];
         $sbn=explode('/',$ruta)[2];
         if ($request->hasFile('archivo')) {
             $archivo = $request->file('archivo');
             $nameArchivo = $archivo->getClientOriginalName();
             $name = str_replace(" ", "_", $nameArchivo);
             $partes = explode('_', $nameArchivo);
             $subcarpeta = reset($partes);
             $destino = $numeroDocumento . '/'.$subcarpeta. '/'.$sbn. '/'. $name;         
             try {
                 Storage::disk('ftp')->put($destino, file_get_contents($archivo));
             } catch (\Exception $e) {
                 $errorMessage = $e->getMessage();
                 return response()->json(['error' => 'Error al subir el archivo al servidor FTP: ' . $errorMessage], 500);
             }
         }
         $cmp= new EvaluacionModel();
         $resultado=$cmp->editarEvaluacion($datos,$usuario,$equipo,$perfil);
         return $this->sendResponse(200, true, '', $resultado);
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
