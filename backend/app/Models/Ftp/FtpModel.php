<?php

namespace App\Models\Ftp;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
class FtpModel extends Model
{
    use HasFactory;
    /**
     * @param string $rutaOrigen Ubicación del documento en FTP incluir slash al final
     * @param string $nomArchivo Nombre del archivo a obtener incluid extension
     * @param string $destino Ruta local de descarga del archivo
     * @return bool
     */
  
    public function __construct()
    {
       
    }
    public function obtenerArchivo($ruta){
        try {
     
            if (empty(trim($ruta))) {
                return;
            }
            $archivo = Storage::disk('ftp')->get($ruta);
            $tipo = Storage::disk('ftp')->mimeType($ruta);
            return response($archivo, 200)->header('Content-Type', $tipo);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener el archivo desde FTP: ' . $e->getMessage()], 500);
        }  
    }

}
