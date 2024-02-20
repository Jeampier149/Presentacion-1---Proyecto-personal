<?php

namespace App\Http\Controllers\legajo;

use Illuminate\Http\Request;
use App\Http\Controllers\Respuesta\JSONResponseController;
use App\Models\legajo\verDatosModel;
use Illuminate\Http\JsonResponse;
use stdClass;
class VerDatosController extends JSONResponseController
{
    public function listarDatosEmpleado(Request $request){
        $id=$request->post('pkempleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosEmpleado($id);
        return $this->sendResponse(200, true, '', $resultado);     
    }
    public function listarDatosDiscapacidades(Request $request){
        $id=$request->post('pkempleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosEmpleado($id);
        return $this->sendResponse(200, true, '', $resultado);     
    }
    public function listarDatosDiscapacidades(Request $request){
        $id=$request->post('pkempleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosEmpleado($id);
        return $this->sendResponse(200, true, '', $resultado);     
    }
    public function listarDatosDiscapacidades(Request $request){
        $id=$request->post('pkempleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosEmpleado($id);
        return $this->sendResponse(200, true, '', $resultado);     
    }

    public function listarDatosDiscapacidades(Request $request){
        $id=$request->post('pkempleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosEmpleado($id);
        return $this->sendResponse(200, true, '', $resultado);     
    }
}
