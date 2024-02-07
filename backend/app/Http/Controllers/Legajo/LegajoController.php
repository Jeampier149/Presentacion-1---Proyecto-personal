<?php

namespace App\Http\Controllers\Legajo;

use App\Http\Controllers\Respuesta\JSONResponseController;
use App\Models\Ftp\FtpModel;
use App\Models\Legajo\LegajoModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use stdClass;
class LegajoController extends JSONResponseController
{
    public function __construct()
    {
        //$this->middleware('auth:sanctum');
    }

    public function listarEmpleados(Request $request): JsonResponse
    {

        $validacion = Validator::make($request->only(['documento', 'apellidoPaterno', 'apellidoMaterno',
            'nombres', 'unidadOrganica', 'equipoServicio', 'pagina', 'longitud']), [
            'numeroDocumento' => 'nullable|string',
            'apellidoPaterno' => 'nullable|string',
            'apellidoMaterno' => 'nullable|string',
            'nombres' => 'nullable|string',
            'unidadOrganica' => 'nullable|string',
            'equipoServicio' => 'nullable|string',
            'pagina' => 'required|integer',
            'longitud' => 'required|integer'
        ]);

        if ($validacion->fails()) {
            return $this->sendResponse(200, false, 'Error de validación', $validacion->errors());
        }

        $legajoModel = new LegajoModel();
        $paramentos = new StdClass();
        $paramentos->documento = $request->get('documento') ?? '';
        $paramentos->apPaterno = $request->get('apellidoPaterno') ?? '';
        $paramentos->apMaterno = $request->get('apellidoMaterno') ?? '';
        $paramentos->Nombres = $request->get('nombres') ?? '';
        $paramentos->unidadOrganica = $request->get('unidadOrganica') ?? '';
        $paramentos->equipoServicio = $request->get('equipoServicio') ?? '';
        $paramentos->pagina = $request->get('pagina');
        $paramentos->longitud = $request->get('longitud');
        $resultado = $legajoModel->listarEmpleado($paramentos);
        return $this->sendResponse(200, true, '', $resultado);
    }
    public function registrarEmpleado(Request $request): JsonResponse
    {
        $datosPersonales=$request('datosPersonales');
        $datosContacto=$request('datosContacto');
        $tiposDiscapacidades=$request('tiposDiscapacidades');
        $datosDomiclio=$request('datosDomiclio');
        $datosFamiliares=$request('datosFamiliares');
        $datosProfesionales=$request('datosProfesionales');
        $datosPostgrado=$request('datosPostgrado');
        $datosEspecializacion=$request('datosEspecializacion');
        $datosCursos=$request('datosCursos');
        $datosIdiomas=$request('datosIdiomas');
        $experienciaLaboral=$request('experienciaLaboral');
        $laborDocencia=$request('laborDocencia');
        $legajoModel = new LegajoModel();
        $resultado = $legajoModel->registrarEmpleado($datosPersonales,$datosContacto,$tiposDiscapacidades,$datosDomiclio,$datosFamiliares,
        $datosProfesionales,$datosPostgrado,$datosEspecializacion,$datosCursos,$datosIdiomas,
        $experienciaLaboral,$laborDocencia);
        return $this->sendResponse(200, true, '', $resultado);
    }
  

}
