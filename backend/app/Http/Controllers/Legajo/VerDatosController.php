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
    public function listarDatosEmpleado(Request $request){
        $id=$request->post('pkEmpleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosEmpleado($id);
        return $this->sendResponse(200, true, '', $resultado);     
    }
    public function listarDatosDiscapacidad(Request $request){
        $id=$request->post('pkEmpleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosDiscapacidades($id);
        return $this->sendResponse(200, true, '', $resultado);     
    }
    public function listarDatosContactoEmergencia(Request $request){
        $id=$request->post('pkEmpleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosContactoEmergencia($id);
        return $this->sendResponse(200, true, '', $resultado);     
    }
    public function listarDatosFamiliares(Request $request){
        $id=$request->post('pkEmpleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosFamiliares($id);
        return $this->sendResponse(200, true, '', $resultado);     
    }

    public function listarDatosDomicilio(Request $request){
        $id=$request->post('pkEmpleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosDomicilio($id);
        return $this->sendResponse(200, true, '', $resultado);     
    }
    public function listarDatosProfesion(Request $request){
        $id=$request->post('pkEmpleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosProfesion($id);
        return $this->sendResponse(200, true, '', $resultado);    
    }
    public function listarDatosEstudioSuperior(Request $request){
        $id=$request->post('pkEmpleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosEstudioSuperior($id);
        return $this->sendResponse(200, true, '', $resultado);    
    }
    public function listarDatosEstudioPostgrado(Request $request){
        $id=$request->post('pkEmpleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosEstudioPostgrado($id);
        return $this->sendResponse(200, true, '', $resultado);    
    }
    public function listarDatosEstudioEspecializacion(Request $request){
        $id=$request->post('pkEmpleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosEstudioEspecializacion($id);
        return $this->sendResponse(200, true, '', $resultado);    
    }
    public function listarDatosEstudioCursos(Request $request){
        $id=$request->post('pkEmpleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosEstudioCursos($id);
        return $this->sendResponse(200, true, '', $resultado);    
    }
    public function listarDatosEstudioIdioma(Request $request){
        $id=$request->post('pkEmpleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosEstudioIdioma($id);
        return $this->sendResponse(200, true, '', $resultado);    
    }
    public function listarDatosExperienciaLaboral(Request $request){
        $id=$request->post('pkEmpleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosExperienciaLaboral($id);
        return $this->sendResponse(200, true, '', $resultado);    
    }
    public function listarDatosExperienciaDocencia(Request $request){
        $id=$request->post('pkEmpleado');
        $datos= new  verDatosModel();
        $resultado =$datos->listarDatosExperienciaDocencia($id);
        return $this->sendResponse(200, true, '', $resultado);    
    }

}
