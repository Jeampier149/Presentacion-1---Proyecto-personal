<?php

namespace App\Http\Controllers\Util;

use App\Http\Controllers\Respuesta\JSONResponseController;
use App\Models\Util\GeneralModel;
use Illuminate\Http\JsonResponse;
class GeneralController extends JSONResponseController
{
    public function listarTipoDocumento(){
        $tipoDocumento =new GeneralModel();
        $resultado=$tipoDocumento->listarTipoDocumento();
        return $this->sendResponse(200, true, '', $resultado);

    }
}
