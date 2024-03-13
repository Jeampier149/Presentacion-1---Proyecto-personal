<?php

namespace App\Http\Controllers\Util;

use App\Http\Controllers\Respuesta\JSONResponseController;
use App\Models\Util\GeneralModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
        $resultado['servicio']=$dato->listarServicio();
        
        return $this->sendResponse(200, true, '', $resultado);
    }

    public function listarTipoRegimen(Request $request){
        $id=$request->post('id');
        $tipoRegimen =new GeneralModel();
        $resultado=$tipoRegimen->listarTipoRegimen($id);
        return $this->sendResponse(200, true, '', $resultado);
    }
 
}

