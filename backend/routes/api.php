<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Configuracion\AccesoController;
use App\Http\Controllers\Configuracion\AccionController;
use App\Http\Controllers\Configuracion\MenuController;
use App\Http\Controllers\Configuracion\PerfilController;
use App\Http\Controllers\Legajo\CompensacionController;
use App\Http\Controllers\Legajo\EvaluacionController;
use App\Http\Controllers\Legajo\LegajoController;
use App\Http\Controllers\Legajo\ReconocimientoSancionController;
use App\Http\Controllers\Legajo\RelacionLaboralController;
use App\Http\Controllers\Legajo\ReporteDatosController;
use App\Http\Controllers\Legajo\SituacionLaboralController;
use App\Http\Controllers\legajo\VerDatosController;
use App\Http\Controllers\Mantenimiento\UsuarioController;
use App\Http\Controllers\Mantenimiento\ListarController;
use App\Http\Controllers\Service\ExtranjeriaController;
use App\Http\Controllers\Service\ReniecController;
use App\Http\Controllers\Util\GeneralController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
Route::post('/validar-usuario', [AuthController::class, 'validarUsuario']);
Route::post('cambiar-contrasena', [AuthController::class, 'cambiarContrasena']);

Route::controller(LegajoController::class)->group(function () {
    Route::get('legajo/listar-empleado', 'listarEmpleados'); 
    Route::post('legajo/registrar-empleado', 'registrarEmpleado');
    Route::post('legajo/editar-empleado', 'editarEmpleado');
    Route::post('legajo/editar-discapacidad', 'editarDiscapacidad');
});



Route::controller(CompensacionController::class)->group(function () {   
    Route::post('compensacion/registrarCompensacion', 'registrarCompensacion');
    Route::get('compensacion/listar-compensacion', 'listarCompensaciones'); 

    Route::post('compensacion/getCompensacion', 'getCompensacion'); 
    Route::post('compensacion/editarCompensacion', 'editarCompensacion'); 
    Route::get('compensacion/verArchivo', 'verArchivo'); 
});

Route::controller(EvaluacionController::class)->group(function () {   
    Route::post('evaluacion/registrarEvaluacion', 'registrarEvaluacion');
    Route::post('evaluacion/editarEvaluacion', 'editarEvaluacion');
    Route::post('evaluacion/listarEvalDoc', 'listarEvalDoc');
    Route::post('evaluacion/obtenerEvaluacion', 'obtenerEvaluacion');
    Route::post('evaluacion/listarEvalTipoDoc', 'listarEvalTipoDoc');
    Route::get('evaluacion/listar-evaluaciones', 'listarEvaluacion'); 

});
Route::controller(ReconocimientoSancionController::class)->group(function () {   
    Route::post('reconocimiento-sancion/registrarReconocimientoSancion', 'registrarReconocimientoSancion');
    Route::post('reconocimiento-sancion/editarReconocimientoSancion', 'editarReconocimientoSancion');
    Route::post('reconocimiento-sancion/obtenerReconocimientoSancion', 'obtenerReconocimientoSancion');
    Route::get('reconocimiento-sancion/listar-reconocimiento-sancion', 'listarReconocimientoSanciones'); 
    Route::get('reconocimiento-sancion/verArchivo', 'verArchivo'); 
});
Route::controller(RelacionLaboralController::class)->group(function () {   
    Route::post('relacion-laboral/registrarRelacionLaboral', 'registrarRelacionLaboral');
    Route::post('relacion-laboral/editarRelacionLaboral', 'registrarRelacionLaboral');
    Route::post('relacion-laboral/obtenerRelacionLaboral', 'obtenerRelacionLaboral');
    Route::get('relacion-laboral/listar-relacion-laboral', 'listarRelacionLaboral'); 
    Route::get('relacion-laboral/verArchivo', 'verArchivo'); 
});



Route::controller(GeneralController::class)->group(function () {
    Route::post('general/listarSelects', 'listarSelects'); 
    Route::get('general/exportarCarpeta', 'exportarCarpeta'); 
    Route::post('general/listarTipoRegimen', 'listarTipoRegimen');
    Route::post('general/listarServicio', 'listarServicio');
    Route::post('general/listarEmpleado', 'listarEmpleados');
    Route::post('general/listarTipoCompensaciones', 'listarTipoCompensaciones');
});

Route::controller(VerDatosController::class)->group(function () {
    Route::post('datos/datosEmpleado', 'listarTodosLosDatos');
    Route::get('datos/archivos', 'verArchivo');
    Route::post('datos/guardarImagen', 'guardarImagen');
    Route::post('datos/eliminarImagen', 'eliminarImagen');
});
Route::controller(SituacionLaboralController::class)->group(function () {
    Route::post('situacion/datosSituacion', 'listarSituacionLaboral');
    Route::post('situacion/registrarTermino', 'registrarTermino');
    Route::post('situacion/actualizarSituacion', 'actualizarSituacion');
    Route::post('situacion/datosSituacionHistorial', 'listarSituacionLaboralHistorial');
    
});
Route::controller(ReporteDatosController::class)->group(function () {
    Route::get('datos/generarPdf', 'generarPDF');
    Route::get('situacion/generarPdfHistorial', 'generarHistorialPDF');
});

Route::controller(ReniecController::class)->group(function () {
    Route::get('reniec/buscarReniec', 'buscarDNI');

});
Route::controller(ExtranjeriaController::class)->group(function () {
    Route::get('extranjeria/buscarExtranjeria', 'buscarCarneExtranjeria');
});


Route::controller(MenuController::class)->group(function () {
    Route::get('configuracion/lista-menu', 'listaMenu');
    Route::post('configuracion/obtener-menu', 'obtenerMenu');
    Route::post('configuracion/editar-menu', 'editarMenu');
    Route::post('configuracion/guardar-menu', 'guardarMenu');
    Route::post('configuracion/anular-menu', 'anularMenu');
    Route::post('configuracion/activar-menu', 'activarMenu');
});

Route::controller(MenuController::class)->group(function () {
    Route::get('configuracion/combo-menu', 'listaMenuCombo');
});

Route::controller(AccionController::class)->group(function () {
    Route::get('configuracion/lista-accion', 'listaAccionXMenu');
    Route::post('configuracion/anular-accion', 'anularAccion');
    Route::post('configuracion/guardar-accion', 'guardarAccion');
});


Route::controller(PerfilController::class)->group(function () {
    Route::get('configuracion/perfil/lista-perfil', 'listaPerfil');
    Route::get('configuracion/perfil/obtener-perfil', 'obtenerPerfil');
    Route::post('configuracion/perfil/guardar-perfil', 'guardarPerfil');
    Route::post('configuracion/perfil/editar-perfil', 'editarPerfil');
    Route::post('configuracion/perfil/anular-perfil', 'anularPerfil');
    Route::post('configuracion/perfil/activar-perfil', 'activarPerfil');

    Route::get('configuracion/perfil/lista-perfil-usuario', 'listaPerfilUsuario');
    Route::get('configuracion/perfil/lista-perfil-combo', 'listaPerfilCombo');
});

Route::controller(AccesoController::class)->group(function () {
    Route::get('configuracion/accesos/lista-acceso', 'listaAcceso');
    Route::post('configuracion/accesos/agregar-acceso', 'agregarAcceso');
    Route::post('configuracion/accesos/anular-acceso', 'anularAcceso');
});


Route::controller(UsuarioController::class)->group(function () {
    Route::get('mantenimiento/usuarios/lista-usuario', 'listarUsuario');
    Route::get('mantenimiento/usuarios/obtener-usuario', 'obtenerUsuario');
    Route::post('mantenimiento/usuarios/anular-usuario', 'anularUsuario');
    Route::post('mantenimiento/usuarios/activar-usuario', 'activarUsuario');
    Route::post('mantenimiento/usuarios/reestablecer-usuario', 'reestablecerUsuario');

    Route::post('mantenimiento/usuarios/guardar-usuario', 'guardarUsuario');
    Route::post('mantenimiento/usuarios/editar-usuario', 'editarUsuario');

    Route::get('mantenimiento/usuarios/obtener-perfil', 'obtenerPerfil');
    Route::get('mantenimiento/usuarios/obtener-profesional', 'obtenerProfesional');
});

Route::controller(ListarController::class)->group(function () {
    Route::get('mantenimiento/lista-perfil', 'listaPerfil');
    Route::get('mantenimiento/lista-profesional', 'listaProfesional');

});
