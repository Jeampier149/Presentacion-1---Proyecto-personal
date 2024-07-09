<?php

namespace App\Http\Controllers\Legajo;

use App\Http\Controllers\Respuesta\JSONResponseController;
use App\Models\Legajo\EvaluacionModel;
use App\Models\Legajo\ReconocimientoSancionModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use stdClass;

class ReconocimientoSancionController extends JSONResponseController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }
    public function listarReconocimientoSanciones(Request $request): JsonResponse
    {

        $validacion = Validator::make($request->only([
            'documento', 'tipo', 'dni',
            'asunto', 'fecha', 'pagina', 'longitud'
        ]), [
            'dni' => 'nullable|string',
            'documento' => 'nullable|string',
            'tipo' => 'nullable|string',
            'asunto' => 'nullable|string',
            'fecha' => 'nullable|string',
            'pagina' => 'required|integer',
            'longitud' => 'required|integer',

        ]);

        if ($validacion->fails()) {
            return $this->sendResponse(200, false, 'Error de validación', $validacion->errors());
        }

        $recoModel = new ReconocimientoSancionModel();
        $documento = $request->get('documento') ?? '';
        $tipo = $request->get('tipo') ?? '';
        $asunto = $request->get('asunto') ?? '';
        $fecha = $request->get('fecha') ?? '';
        $dni = $request->get('dni') ?? '';
        $pagina = $request->get('pagina');
        $longitud = $request->get('longitud');
        $resultado = $recoModel->listarReconocimientoSanciones($documento,$tipo,$asunto,$fecha,$dni,$pagina,$longitud);
        
        return $this->sendResponse(200, true, '', $resultado);
    }

   
    public function obtenerReconocimientoSancion(Request $request){
        $id=$request->post('id');
        $solicitud=new ReconocimientoSancionModel();
        $resultado=$solicitud->obtenerReconocimientoSancion($id);
        return $this->sendResponse(200, true, '', $resultado);
    }

    public function registrarReconocimientoSancion(Request $request): JsonResponse{
        [$usuario, $perfil, $equipo] = $this->getHost($request);
         $datos = json_decode($request->post('datos'), true);
         $numeroDocumento = json_decode($request->post('numeroDoc'), true);
         $ruta = $datos['ruta'];
         $sbn=explode('/',$ruta)[2];

         if ($request->hasFile('archivo')) {
             $archivo = $request->file('archivo');
             $nameArchivo = $archivo->getClientOriginalName();
             $name = str_replace(" ", "_", $nameArchivo);
             $subcarpeta = explode('/',$ruta)[1];
             $destino = $numeroDocumento . '/'.$subcarpeta.'/'.$sbn. '/'. $name;         
             try {
                 Storage::disk('ftp')->put($destino, file_get_contents($archivo));
             } catch (\Exception $e) {
                 $errorMessage = $e->getMessage();
                 return response()->json(['error' => 'Error al subir el archivo al servidor FTP: ' . $errorMessage], 500);
             }
         }
         $cmp= new ReconocimientoSancionModel();
         $resultado=$cmp->registrarReconocimientoSancion($datos,$usuario,$equipo,$perfil);
         return $this->sendResponse(200, true, '', $resultado);
     }
     public function editarReconocimientoSancion(Request $request): JsonResponse{
        [$usuario, $perfil, $equipo] = $this->getHost($request);
         $datos = json_decode($request->post('datos'), true);
         $numeroDocumento = json_decode($request->post('numeroDoc'), true);
         $ruta = $datos['ruta'];
         $sbn=explode('/',$ruta)[2];
         if ($request->hasFile('archivo')) {
             $archivo = $request->file('archivo');
             $nameArchivo = $archivo->getClientOriginalName();
             $name = str_replace(" ", "_", $nameArchivo);
             $subcarpeta = explode('/',$ruta)[1];
             $destino = $numeroDocumento . '/'.$subcarpeta. '/'.$sbn. '/'. $name;         
             try {
                 Storage::disk('ftp')->put($destino, file_get_contents($archivo));
             } catch (\Exception $e) {
                 $errorMessage = $e->getMessage();
                 return response()->json(['error' => 'Error al subir el archivo al servidor FTP: ' . $errorMessage], 500);
             }
         }
         $cmp= new ReconocimientoSancionModel();
         $resultado=$cmp->editarReconocimientoSancion($datos,$usuario,$equipo,$perfil);
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
