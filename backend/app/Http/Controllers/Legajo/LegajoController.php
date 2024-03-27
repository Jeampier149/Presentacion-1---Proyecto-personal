<?php

namespace App\Http\Controllers\Legajo;

use App\Http\Controllers\Respuesta\JSONResponseController;
use App\Models\Legajo\LegajoModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use stdClass;


class LegajoController extends JSONResponseController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
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
            'longitud' => 'required|integer',
            'estado' => 'nullable|string',
        ]);

        if ($validacion->fails()) {
            return $this->sendResponse(200, false, 'Error de validación', $validacion->errors());
        }

        $legajoModel = new LegajoModel();
        $paramentos = new StdClass();
        $paramentos->documento = $request->get('documento') ?? '';
        $paramentos->apPaterno = $request->get('apellidoPaterno') ?? '';
        $paramentos->apMaterno = $request->get('apellidoMaterno') ?? '';
        $paramentos->nombres = $request->get('nombres') ?? '';
        $paramentos->unidadOrganica = $request->get('unidadOrganica') ?? '';
        $paramentos->equipoServicio = $request->get('equipoServicio') ?? '';
        $paramentos->pagina = $request->get('pagina');
        $paramentos->longitud = $request->get('longitud');
        $paramentos->estado = $request->get('estado');
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
            'apellidoPaterno' => 'required',
            'apellidoMaterno' => 'required',
            'nombres' => 'required',
            'ruc' => 'string| max:11',
            'estadoCivil' => 'required',
            'sexo' => 'required',
            'grupoSanguineo' => 'required',
            'grupOcupacional' => 'required',
            'tipoEmpleado' => 'required',
            'regimen' => 'required',
            'tipoRegimen' => 'required',
            'fechaNacimiento' => 'string',
            'telefonoFijo' => 'required',
            'telefonoMovil' => 'required | max:9',
            'correoElectronico' => 'required|email',
            'enfAlergias' => 'string',
            'fechaIngreso' => 'string',
            'unidadOrganica' => 'required',
            'servicio' => 'required',
            'nacionalidad' => 'required',
            'tipoEmpleado' => 'required'

        ];
        $validacionDatosEmpleado = Validator::make($datosPersonales, $reglasDatosEmpleado);
        if ($validacionDatosEmpleado->fails()) {
            return $this->sendResponse(200, false, 'Error de validación', $validacionDatosEmpleado->errors());
        }

        $datosContacto = json_decode($request->post('datosContacto'), true);
        $reglasDatosContacto = [
            'nombreContacto' => 'string',
            'parentesco' => 'string',


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

        ];

        $validacionDatosDomicilio = Validator::make($datosDomicilio, $reglasDatosDomicilio);
        if ($validacionDatosContacto->fails()) {
            return $this->sendResponse(200, false, 'Error de validación', $validacionDatosDomicilio->errors());
        }

        $datosFamiliares = json_decode($request->post('datosFamiliares'), true);
        $datosProfesion = json_decode($request->post('datosProfesion'), true);
        $datosEstudioSuperior = json_decode($request->post('datosEstudioSuperior'), true);
        $datosPostgrado = json_decode($request->post('datosPostgrado'), true);
        $datosEspecialidades = json_decode($request->post('datosEspecializacion'), true);
        $datosCursos = json_decode($request->post('datosCursos'), true);
        $datosIdiomas = json_decode($request->post('datosIdiomas'), true);
        $datosExpLaboral = json_decode($request->post('experienciaLaboral'), true);
        $datosLaborDocencia = json_decode($request->post('laborDocencia'), true);
        $numeroDocumento = $datosPersonales['numeroDocumento'];
        $user = $request->user();
        $usuario = $user->username;
        $perfil = $user->id_perfil;
        $equipo = Str::upper(explode(':', gethostbyaddr($_SERVER['REMOTE_ADDR']))[0] ?? '');
        $archivosT = $request->file();

        foreach ($archivosT as $archivo) {
            $nameArchivo =  $archivo->getClientOriginalName();
            $name = str_replace(" ", "_", $nameArchivo);
            $destino = $numeroDocumento . '/' . $name;
            try {
                Storage::disk('ftp')->put($destino, file_get_contents($archivo));
            } catch (\Exception $e) {
                $errorMessage = $e->getMessage();
                return response()->json(['error' => 'Error al subir el archivo al servidor FTP: ' . $errorMessage], 500);
            }
        }



        $legajoModel = new LegajoModel();
        $resultado = $legajoModel->registrarEmpleado(
            $datosPersonales,
            $datosContacto,
            $datosDiscapacidad,
            $datosDomicilio,
            $datosFamiliares,
            $datosProfesion,
            $datosEstudioSuperior,
            $datosPostgrado,
            $datosEspecialidades,
            $datosCursos,
            $datosIdiomas,
            $datosExpLaboral,
            $datosLaborDocencia,
            $usuario,
            $equipo,
            $perfil
        );
        return $this->sendResponse(200, true, $resultado->mensaje, $resultado->dato);
    }

    public function editarEmpleado(Request $request): JsonResponse
    {
        $datosPersonales = json_decode($request->post('datosPersonales'), true);
        $reglasDatosEmpleado = [
            'numDoc' => 'required',
            'ruc' => 'max:99999999999|numeric',
            'estadoCivil' => 'required',
            'telFijo' => 'numeric',
            'telMovil' => 'numeric|max:999999999',
            'correoE' => 'email'
            
        ];
        
        $messagesEmpleado = [
            'numDoc.required' => 'El numero de documento es requerido.',
            'ruc.max' => 'El ruc solo debe tener 11 dígitos.',
            'estadoCivil.required' => 'El estado civil es requerido.',
            'telFijo.numeric' => 'El teléfono fijo solo debe contener números.',
            'telMovil.numeric' => 'El teléfono móvil solo debe contener números.',
            'correoE.email' => 'El correo electrónico no es válido.',
            
        ];
        
        $validacionDatosEmpleado = Validator::make($datosPersonales, $reglasDatosEmpleado, $messagesEmpleado);
        
        if ($validacionDatosEmpleado->fails()) {
            return $this->sendResponse(200, false, 'Error de validación', $validacionDatosEmpleado->errors());
        }
        
      
        $datosContacto = json_decode($request->post('datosContacto'), true);
        $reglasDatosContacto = [
            'nombreContacto' => 'string',
            'parentesco' => 'string',
            'numeroContacto' => 'string',
            'id'=>'required'
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
            'ubigeo' => 'string',
            'id'=>'required'
        ];

        $validacionDatosDomicilio = Validator::make($datosDomicilio, $reglasDatosDomicilio);
        if ($validacionDatosContacto->fails()) {
            return $this->sendResponse(200, false, 'Error de validación', $validacionDatosDomicilio->errors());
        }

        $datosFamiliares = json_decode($request->post('datosFamiliares'), true);
        $datosProfesion = json_decode($request->post('datosProfesion'), true);
        $datosEstudioSuperior = json_decode($request->post('datosEstudioSuperior'), true);
        $datosPostgrado = json_decode($request->post('datosPostgrado'), true);
        $datosEspecialidades = json_decode($request->post('datosEspecializacion'), true);
        $datosCursos = json_decode($request->post('datosCursos'), true);
        $datosIdiomas = json_decode($request->post('datosIdiomas'), true);
        $datosExpLaboral = json_decode($request->post('experienciaLaboral'), true);
        $datosLaborDocencia = json_decode($request->post('laborDocencia'), true);
        $numeroDocumento = $datosPersonales['numDoc'];
        $user = $request->user();
        $usuario = $user->username;
        $perfil = $user->id_perfil;
        $equipo = Str::upper(explode(':', gethostbyaddr($_SERVER['REMOTE_ADDR']))[0] ?? '');
        $archivosT = $request->file();

        foreach ($archivosT as $archivo) {
            $nameArchivo =  $archivo->getClientOriginalName();
            $name = str_replace(" ", "_", $nameArchivo);
            $destino = $numeroDocumento . '/' . $name;
            try {
                Storage::disk('ftp')->put($destino, file_get_contents($archivo));
            } catch (\Exception $e) {
                $errorMessage = $e->getMessage();
                return response()->json(['error' => 'Error al subir el archivo al servidor FTP: ' . $errorMessage], 500);
            }
        }

        $legajoModel = new LegajoModel();
        $resultado = $legajoModel->editarEmpleado(
            $datosPersonales,
            $datosContacto,
            $datosDiscapacidad,
            $datosDomicilio,
            $datosFamiliares,
            $datosProfesion,
            $datosEstudioSuperior,
            $datosPostgrado,
            $datosEspecialidades,
            $datosCursos,
            $datosIdiomas,
            $datosExpLaboral,
            $datosLaborDocencia,
            $usuario,
            $equipo,
            $perfil

        );
        return $this->sendResponse(200, true, $resultado->mensaje, $resultado->resultado);

    }
}
