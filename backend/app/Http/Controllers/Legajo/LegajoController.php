<?php

namespace App\Http\Controllers\Legajo;

use App\Http\Controllers\Respuesta\JSONResponseController;
use App\Models\Legajo\LegajoModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use stdClass;


class LegajoController extends JSONResponseController
{
    public function __construct()
    {
        //$this->middleware('auth:sanctum');
    }

    public function listarEmpleados(Request $request): JsonResponse
    {

        $validacion = Validator::make($request->only([
            'documento', 'apellidoPaterno', 'apellidoMaterno',
            'nombres', 'unidadOrganica', 'equipoServicio', 'pagina', 'longitud'
        ]), [
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
        $datosPersonales = json_decode($request->post('datosPersonales'), true);
        $reglasDatosEmpleado = [
            'tipoDocumento' => "required|string",
            'numeroDocumento' => 'required',
            'codigoAirhsp' => 'required',
            'aPaterno' => 'required',
            'aMaterno' => 'required',
            'nombres' => 'required',
            'ruc' => 'string',
            'estadoCivil' => 'required',
            'sexo' => 'required',
            'gSanguineo' => 'required',
            'grupOcupacional' => 'required',
            'tipoEmpleado' => 'required',
            'regimen' => 'required',
            'tipoRegimen' => 'required',
            'fNacimiento' => 'string',
            'tFijo' => 'required',
            'tMovil' => 'required',
            'correoE' => 'required',
            'enfAlergias' => 'string',
            'fechaIngreso' => 'string',
            'unidadOrganica' => 'required',
            'servicio' => 'required'

        ];
        $validacionDatosEmpleado = Validator::make($datosPersonales, $reglasDatosEmpleado);
        if ($validacionDatosEmpleado->fails()) {
            return $this->sendResponse(200, false, 'Error de validación', $validacionDatosEmpleado->errors());
        }

        $datosContacto = json_decode($request->post('datosContacto'), true);
        $reglasDatosContacto = [
            'nombreContacto' => 'string',
            'parentesco' => 'string',
            'numeroContacto' => 'string',
            'numDocumento' => 'required'
        ];

        $validacionDatosContacto = Validator::make($datosContacto, $reglasDatosContacto);
        if ($validacionDatosContacto->fails()) {
            return $this->sendResponse(200, false, 'Error de validación', $validacionDatosContacto->errors());
        }
        $datosDiscapacidad = json_decode($request->post('datosDiscapacidad'), true);

        $datosDomicilio = json_decode($request->post('datosDomicilio'), true);
        $reglasDatosDomicilio = [
            'departamento' => 'string|required',
            'provincia' => 'string',
            'distrito' => 'string',
            'via' => 'required',
            'nombreVia' => 'string|required',
            'numeroVia' => 'string|required',
            'interiorVia' => 'string|required',
            'zona' => 'string|required',
            'nombreZona' => 'string|required',
            'numeroZona' => 'string|required',
            'interiorZona' => 'string|required',
            'referenciaDomicilio' => 'string|required',
            'ubigeo' => 'string',
            'numDocumento' => 'string|required',
        ];

        $validacionDatosDomicilio = Validator::make($datosDomicilio, $reglasDatosDomicilio);
        if ($validacionDatosContacto->fails()) {
            return $this->sendResponse(200, false, 'Error de validación', $validacionDatosDomicilio->errors());
        }

        $datosFamiliares = json_decode($request->post('datosFamiliares'), true);
        $datosProfesion = json_decode($request->post('datosProfesion'), true);
        $datosEstudioSuperior = json_decode($request->post('datosEstudioSuperior'), true);
        $numeroDocumento = $datosPersonales['numeroDocumento'];
        $archivosT = $request->file();       
        foreach ($archivosT as $archivo) {
       
            $nameArchivo =  $archivo->getClientOriginalName();

            $destino = $numeroDocumento.'/'.$nameArchivo;
            try {
                Storage::disk('ftp')->put($destino, file_get_contents($archivo));     
                         
            } catch (\Exception $e) {
                // Capturar la excepción y obtener el mensaje de error
                $errorMessage = $e->getMessage();
                return response()->json(['error' => 'Error al subir el archivo al servidor FTP: ' . $errorMessage], 500);
            }
            // Subir el archivo al servidor FTP
        }
        $legajoModel = new LegajoModel();
        $resultado = $legajoModel->registrarEmpleado($datosPersonales, $datosContacto, $datosDiscapacidad, $datosDomicilio, $datosFamiliares, $datosProfesion, $datosEstudioSuperior);
        return $this->sendResponse(200, true, 'Datos Registrados Correctamente', $resultado);
  


       
    }
}
