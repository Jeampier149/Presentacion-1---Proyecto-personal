<?php

namespace App\Http\Controllers\Legajo;

use App\Http\Controllers\Respuesta\JSONResponseController;
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

        $validacion = Validator::make($request->only(['numeroDocumento', 'apellidoPaterno', 'apellidoMaterno',
            'primerNombre', 'segundoNombre', 'unidadOrganica', 'equipoServicio', 'pagina', 'longitud']), [
            'numeroDocumento' => 'nullable|string',
            'apellidoPaterno' => 'string|nullable',
            'apellidoMaterno' => 'nullable|string',
            'primerNombre' => 'nullable|string',
            'segundoNombre' => 'nullable|string',
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
        $paramentos->apPaterno = $request->get('apellidoPaterno') ?? '';;
        $paramentos->apMaterno = $request->get('apellidoMaterno') ?? '';;
        $paramentos->priNombre = $request->get('primerNombre') ?? '';;
        $paramentos->segNombre = $request->get('segundoNombre') ?? '';;
        $paramentos->unidadOrganica = $request->get('unidadOrganica') ?? '';
        $paramentos->equipoServicio = $request->get('equipoServicio') ?? '';
        $paramentos->pagina = $request->get('pagina');
        $paramentos->longitud = $request->get('longitud');
        $resultado = $legajoModel->listarEmpleado($paramentos);
        return $this->sendResponse(200, true, '', $resultado);
    }

  

}