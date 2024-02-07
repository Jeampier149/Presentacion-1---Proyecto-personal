<?php

namespace App\Http\Controllers\Util;

use App\Http\Controllers\Respuesta\JSONResponseController;
use App\Models\Util\GeneralModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
class GeneralController extends JSONResponseController
{
    public function listarTipoDocumento(){
        $tipoDocumento =new GeneralModel();
        $resultado=$tipoDocumento->listarTipoDocumento();
        return $this->sendResponse(200, true, '', $resultado);

    }
    public function listarTipoEmpleado(){
        $tipoEmpleado =new GeneralModel();
        $resultado=$tipoEmpleado->listarTipoEmpleado();
        return $this->sendResponse(200, true, '', $resultado);

    }
    public function listarGrupo(){
        $tipoGrupo =new GeneralModel();
        $resultado=$tipoGrupo->listarGrupo();
        return $this->sendResponse(200, true, '', $resultado);

    }
    public function listarRegimen(){
        $regimen =new GeneralModel();
        $resultado=$regimen->listarRegimen();
        return $this->sendResponse(200, true, '', $resultado);

    }
    public function listarTipoRegimen(Request $request){
        $id=$request->post('id');
        $tipoRegimen =new GeneralModel();
        $resultado=$tipoRegimen->listarTipoRegimen($id);
        return $this->sendResponse(200, true, '', $resultado);

    }
}
