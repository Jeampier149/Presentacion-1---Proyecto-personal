<?php

namespace App\Models\Legajo;

use Illuminate\Database\Eloquent\Model;
use stdClass;
use PDO;
use Illuminate\Support\Facades\DB;
class CompensacionModel extends Model
{
 
    public function __construct()
    {

        parent::__construct();
        $this->conexion = DB::connection('personal');
    }

    public function listarCompensaciones($documento,$tipo,$asunto,$fecha,$dni,$pagina,$longitud)
    
    {
        return $this->conexion->select(
            /** @lang SQL */
            'EXEC dbo.lgc_sp_listar_compensaciones ?,?,?,?,?,?,?', [$dni,$tipo,$documento,$asunto,$fecha,$longitud,$pagina]
        );
       
    }

    public function registrarCompensacion(array $datos ,$usuario,$equipo,$perfil){

        try {
            
            DB::statement('EXEC dbo.plc_sp_insertar_compensacion ?,?,?,?,?,?,?,?,?', [
                $datos['dni'],
                $datos['asunto'],
                $datos['documento'],
                $datos['fecha'],
                $datos['ruta'],
                $datos['tipo'],
                $usuario,
                $equipo,
                $perfil

            ]);
        } catch (\Exception $e) {
            echo 'Error al ejecutar el procedimiento almacenado pl_sp_insertar_compensacion: ' . $e->getMessage();
        }
    }
    public function getCompensacion($id){
        return $this->conexion->select(
            /** @lang SQL */
            'EXEC dbo.lgc_sp_listar_compensacion_emp ?', [$id]
        );
    }
    public function editarCompensacion(array $datos ,$usuario,$equipo,$perfil){

        try {
            
            DB::statement('EXEC dbo.plc_sp_editar_compensacion ?,?,?,?,?,?,?,?,?,?', [
                $datos['id'],
                $datos['dni'],
                $datos['asunto'],
                $datos['documento'],
                $datos['fecha'],
                $datos['ruta'],
                $datos['tipo'],
                $usuario,
                $equipo,
                $perfil

            ]);
        } catch (\Exception $e) {
            echo 'Error al ejecutar el procedimiento almacenado pl_sp_editar_datos_contacto_emergencia: ' . $e->getMessage();
        }
    }
}
