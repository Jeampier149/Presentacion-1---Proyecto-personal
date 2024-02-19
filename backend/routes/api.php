<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Legajo\LegajoController;
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


Route::controller(LegajoController::class)->group(function () {
    Route::get('legajo/listar-empleado', 'listarEmpleados'); 
    Route::post('legajo/registrar-empleado', 'registrarEmpleado');
    Route::post('legajo/editar-empleado', 'editarEmpleado');
});

Route::controller(GeneralController::class)->group(function () {
    Route::post('general/listarTipoDoc', 'listarTipoDocumento');
    Route::post('general/listarTipoEmp', 'listarTipoEmpleado');
    Route::post('general/listarRegimen', 'listarRegimen');
    Route::post('general/listarTipoGrupo', 'listarGrupo');
    Route::post('general/listarTipoRegimen', 'listarTipoRegimen');
    Route::post('general/listarSexo', 'listarSexo');
    Route::post('general/listarGrupoSanguineo', 'listarGrupoSanguineo');
    Route::post('general/listarEstadoCivil', 'listarEstadoCivil');

});

Route::controller(ReniecController::class)->group(function () {
    Route::get('reniec/buscarReniec', 'buscarDNI');

});
Route::controller(ExtranjeriaController::class)->group(function () {
    Route::get('extranjeria/buscarExtranjeria', 'buscarCarneExtranjeria');
});