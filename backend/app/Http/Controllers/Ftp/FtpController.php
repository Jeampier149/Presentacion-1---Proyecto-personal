<?php

namespace App\Http\Controllers\Ftp;

use App\Http\Controllers\Controller;
use App\Models\Ftp\FtpModel;
use Illuminate\Http\Request;

class FtpController extends Controller
{
    public function crearEmpleadoCarpeta(Request $request)
    {
        $dni = $request->input('dni');
        $ftp = new FtpModel();
        $ftp->crearEmpleadoFolder($dni);
        $ftp->disconnect();

        return response()->json(['mensaje' => 'carpetas creadas correctamente']);
    }
}
