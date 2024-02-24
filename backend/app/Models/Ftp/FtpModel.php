<?php

namespace App\Models\Ftp;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FtpModel extends Model
{
    use HasFactory;
    /**
     * @param string $rutaOrigen Ubicación del documento en FTP incluir slash al final
     * @param string $nomArchivo Nombre del archivo a obtener incluid extension
     * @param string $destino Ruta local de descarga del archivo
     * @return bool
     */
    private $ftp;
    private $usuario;
    private $contrasena;

    public function __construct()
    {
        $this->usuario = 'jeampier';
        $this->contrasena = 'root123';
        $servidor = '192.168.11.133';
        $this->ftp = ftp_connect($servidor);
        return ftp_login($this->ftp, $this->usuario, $this->contrasena);
    }


    public function obtenerArchivo(string $rutaOrigen, string $nomArchivo, string $destino): bool
    {
        $flag = ftp_get($this->ftp, $destino . $nomArchivo, $rutaOrigen . $nomArchivo, FTP_BINARY);
        return $flag;
    }


    public function closeFTP()
    {
        ftp_close($this->ftp);
    }
}
