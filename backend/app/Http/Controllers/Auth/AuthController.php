<?php

namespace App\Http\Controllers\Auth;


use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Respuesta\JSONResponseController;
use App\Models\Auth\AuthModel;
use Illuminate\Support\Facades\Hash;

    class AuthController extends JSONResponseController

    {
    
        public function __construct()
        {
    //        $this->middleware('auth:sanctum', ['only' => ['cerrarSesion']]);
        }
    
        public function register(Request $request): JsonResponse
        {
    
            // Crear el usuario
           User::create([
                'username' => $request->username,
                'password' => Hash::make($request->password),
    
            ]);
    
           
            return $this->sendResponse(200, 1, 'Usaurio Creado exitosamente.');
            
        }
        public function login(Request $request): JsonResponse
        {
            $validator = Validator::make($request->only(['username', 'password']), [
                'username' => 'required|string',
                'password' => 'required|string',
            ]);
    
            if ($validator->fails()) {
                return $this->sendResponse(200, 3, 'Error de validación.', $validator->errors());
            }
    
            if (!Auth::attempt(['username' => $request->post('username'), 'password' => $request->post('password')])) {
                return $this->sendResponse(200, 0, 'Usuario o contraseña incorrectos.');
            }
    
            $expirationDate = Carbon::now()->addHours(8);
            $user = Auth::user();
            $token = $user->createToken('personal', ["*"], $expirationDate)->plainTextToken;
            $auth = new AuthModel();
            $menus = $auth->obtenerMenu($user->id_perfil);
            $userData = [
                'username' => $user->username,
                'menu' => $menus,
                'token' => $token,
                'fecha_expiracion' => $expirationDate,
            ];
    
            return $this->sendResponse(200, 1, 'Sesión creada.', $userData);
        }
        public function logout(Request $request)
        {
            if ($request->user()) {
                $request->user()->tokens()->delete();
            }
            return $this->sendResponse(200, true, 'Sesión cerrada.');
        }
    
    
    }
    

