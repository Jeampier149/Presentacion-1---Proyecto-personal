<?php

namespace App\Http\Controllers\Service;
use App\Http\Controllers\Respuesta\JSONResponseController;
use App\Models\Service\ReniecMQModel;
use App\Models\Servicio\PideModel;
use App\Models\Util\GeneralModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class ReniecController extends JSONResponseController
{
    public function __construct()
    {
      //  $this->middleware('auth:sanctum');
    }

    public function buscarDNI(Request $request)
    {

         $validacion = Validator::make($request->only(['tipo', 'documento']),
        [
            'tipo' => 'required|integer',
            'documento' => 'required|string|min:8|max:12',
        ]);

         if ($validacion->fails()) {
            return $this->sendResponse(200, false, 'Error de validación', $validacion->errors());
        }


        $tipoDocumentoIdentidad = $request->post('tipo');
        $documentoIdentidad = $request->post('documento');

        if ($tipoDocumentoIdentidad == 1) {
            $reniecModel = new ReniecMQModel();
            $respuesta = $reniecModel->busquedaDNI($documentoIdentidad, 1, 'SISTEMA DE LEGAJOS');
            if (!$respuesta) {
                return $this->sendResponse(200, false, 'Error de validación', ['documentoIdentidad' => [$reniecModel->getMensajeError()]]);
            }

            $datosPaciente = $reniecModel->toArray();
        }

        if ($tipoDocumentoIdentidad == 2) {
            $pideModel = new PideModel();
            $pideModel->buscarDatosEnLocal($documentoIdentidad);
            if($pideModel->getEstado() === 1){
                $datosPaciente = $pideModel->getDatos();
            }else{
                $pideModel->buscarDatosEnLinea($documentoIdentidad);
                if ($pideModel->getEstado() === 1) {
                    $datosPaciente = $pideModel->getDatos();
                } else {
                    return $this->sendResponse(200, false, 'Error de validación', ['documentoIdentidad' => [$pideModel->getMensaje()]]);
                }
            }
        }

        return $this->sendResponse(200, true, 'Datos personales encontrados.', $datosPaciente);
            
        
    }
}
