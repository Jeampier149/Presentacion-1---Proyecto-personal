<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Legajo\LegajoController;
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
    Route::post('legajo/listarTipoDoc', 'listarEmpleados');
    
    Route::post('legajo/guardar-empleado', 'guardarEmpleado');
    Route::post('legajo/editar-empleado', 'editarEmpleado');
});

Route::controller(GeneralController::class)->group(function () {
    Route::post('general/listarTipoDoc', 'listarTipoDocumento');
    

});

Route::controller(ReniecController::class)->group(function () {
    Route::post('reniec/buscarReniec', 'buscarDNI');
});