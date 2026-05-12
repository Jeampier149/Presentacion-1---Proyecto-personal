<?php

namespace App\Http\Controllers\Legajo;

use Illuminate\Http\Request;
use App\Http\Controllers\Respuesta\JSONResponseController;
use App\Models\Legajo\SituacionLaboralModel;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
class SituacionLaboralController  extends JSONResponseController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }
    public function listarSituacionLaboral(Request $request){
        $id=$request->post('pkEmpleado');
        $situacion =new SituacionLaboralModel();
        $resultado=$situacion->listarSituacionLaboral($id);
        return $this->sendResponse(200, true, '', $resultado);
    }
    public function listarSituacionLaboralHistorial(Request $request){
        $id=$request->post('pkEmpleado');
        $situacion =new SituacionLaboralModel();
        $resultado=$situacion->listarSituacionLaboralHistorial($id);
        return $this->sendResponse(200, true, '', $resultado);
    }
    public function registrarTermino(Request $request){
        $user=$request->user();
        $usuario = $user->username;
        $perfil = $user->id_perfil;
        $equipo = Str::upper(explode(':', gethostbyaddr($_SERVER['REMOTE_ADDR']))[0] ?? '');
        $id=$request->post('idHistorial');
        $motivo=$request->post('motivo');
        $fechaTermino=$request->post('fechaTermino');
        $validacion = Validator::make($request->only([
            'fechaTermino'
        ]), [
            'fechaTermino' => 'required',
           
        ]);

        if ($validacion->fails()) {
            return $this->sendResponse(200, false, 'Error de validación', $validacion->errors());
        }


        $situacion =new SituacionLaboralModel();
        $resultado=$situacion->registrarTermino($id,$motivo,$fechaTermino,$usuario,$equipo,$perfil);
    
       return $this->sendResponse(200, true,$resultado[0]->mensaje, $resultado[0]->dato);
    }
    public function actualizarSituacion(Request $request){
        $user=$request->user();
        $usuario = $user->username;
        $perfil = $user->id_perfil;
        $equipo = Str::upper(explode(':', gethostbyaddr($_SERVER['REMOTE_ADDR']))[0] ?? '');
        $numDoc=$request->post('numDoc');
        $grupOcup=$request->post('grupOcup');
        $regimen=$request->post('valorRegimen');
        $tipoRegimen=$request->post('valorTipRegimen');
        $unidad=$request->post('valorUnidad');
        $servicio=$request->post('valorServicio');
        $cargo=$request->post('valorCargo');
        $nivel=$request->post('valorNivel');
        $codAir=$request->post('codigoAirhsp');
        $fechaIngreso=$request->post('fechaIngreso');
        $condicion=$request->post('tipoEmp');
        $sit =new SituacionLaboralModel();
        $resultado=$sit->actualizarSituacion($numDoc,$grupOcup,$regimen,$tipoRegimen,$unidad,$servicio,$cargo,$nivel,$codAir,$fechaIngreso,$condicion,$usuario,$equipo,$perfil);
    
       return $this->sendResponse(200, true,$resultado->mensaje, $resultado->dato);
    }
   public function agregarHistorial(Request $request)
{
    $user    = $request->user();
    $usuario = $user->username;
    $perfil  = $user->id_perfil;
    $equipo  = Str::upper(explode(':', gethostbyaddr($_SERVER['REMOTE_ADDR']))[0] ?? '');

    $validacion = Validator::make($request->only(['numDoc', 'valorUnidad', 'valorRegimen', 'fechaIngreso']), [
        'numDoc'       => 'required',
        'valorUnidad'  => 'required',
        'valorRegimen' => 'required',
        'fechaIngreso' => 'required',
    ]);

    if ($validacion->fails()) {
        return $this->sendResponse(200, false, 'Error de validación', $validacion->errors());
    }

    $sit       = new SituacionLaboralModel();
   $resultado = $sit->agregarHistorial(
    $request->post('numDoc'),
    $request->post('condicion'),
    $request->post('grupOcup'),
    $request->post('valorUnidad'),
    $request->post('valorRegimen'),
    $request->post('valorTipRegimen'),
    $request->post('valorCargo'),
    $request->post('valorNivel'),
    $request->post('fechaIngreso'),
    $request->post('fechaTermino'),
    $request->post('motivo'),
    $request->post('sueldo'),
    $request->post('resolucionIngreso'),  // 👈
    $request->post('resolucionTermino'),  // 👈
    $usuario,
    $equipo,
    $perfil
);

    return $this->sendResponse(200, true, $resultado->mensaje, $resultado->dato);
}
}
