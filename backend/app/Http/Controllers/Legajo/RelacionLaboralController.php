<?php

namespace App\Http\Controllers\Legajo;

use App\Http\Controllers\Respuesta\JSONResponseController;
use App\Models\Legajo\RelacionLaboralModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use stdClass;

class RelacionLaboralController extends JSONResponseController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }
    public function listarRelacionLaboral(Request $request): JsonResponse
    {

        $validacion = Validator::make($request->only([
            'documento', 'tipo', 'dni',
            'asunto', 'fecha', 'pagina', 'longitud'
        ]), [
            'dni' => 'nullable|string',
            'documento' => 'nullable|string',
            'asunto' => 'nullable|string',
            'fecha' => 'nullable|string',
            'pagina' => 'required|integer',
            'longitud' => 'required|integer',

        ]);

        if ($validacion->fails()) {
            return $this->sendResponse(200, false, 'Error de validación', $validacion->errors());
        }

        $recoModel = new RelacionLaboralModel();
        $documento = $request->get('documento') ?? '';
        $asunto = $request->get('asunto') ?? '';
        $fecha = $request->get('fecha') ?? '';
        $dni = $request->get('dni') ?? '';
        $pagina = $request->get('pagina');
        $longitud = $request->get('longitud');
        $resultado = $recoModel->listarRelacionLaboral($documento,$asunto,$fecha,$dni,$pagina,$longitud);
        
        return $this->sendResponse(200, true, '', $resultado);
    }

   
    public function obtenerRelacionLaboral(Request $request){
        $id=$request->post('id');
        $solicitud=new RelacionLaboralModel();
        $resultado=$solicitud->obtenerRelacionLaboral($id);
        return $this->sendResponse(200, true, '', $resultado);
    }

    public function registrarRelacionLaboral(Request $request): JsonResponse{
        [$usuario, $perfil, $equipo] = $this->getHost($request);
         $datos = json_decode($request->post('datos'), true);
         $numeroDocumento = json_decode($request->post('numeroDoc'), true);
        
         if ($request->hasFile('archivo')) {
             $ruta = $datos['ruta'];
             $sbn=explode('/',$ruta)[1];   
             $archivo = $request->file('archivo');
             $nameArchivo = $archivo->getClientOriginalName();
             $name = str_replace(" ", "_", $nameArchivo);
             $destino = $numeroDocumento .'/'.$sbn. '/'. $name;         
             try {
                 Storage::disk('ftp')->put($destino, file_get_contents($archivo));
             } catch (\Exception $e) {
                 $errorMessage = $e->getMessage();
                 return response()->json(['error' => 'Error al subir el archivo al servidor FTP: ' . $errorMessage], 500);
             }
         }
         $cmp= new RelacionLaboralModel();
         $resultado=$cmp->registrarRelacionLaboral($datos,$usuario,$equipo,$perfil);
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
