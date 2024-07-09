<?php

namespace App\Models\Legajo;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
class ReconocimientoSancionModel extends Model
{
    use HasFactory;
    public function __construct()
    {
  
      parent::__construct();
      $this->conexion = DB::connection('personal');
    }


  public function obtenerReconocimientoSancion($id)
  {
    return $this->conexion->selectOne(
    /** @lang SQL */
    'EXEC dbo.pl_reco_san_sp_obtener_reconocimiento_sancion ?', [$id]);
  }
  public function listarReconocimientoSanciones($documento,$tipo,$asunto,$fecha,$dni,$pagina,$longitud)
    
  {
      return $this->conexion->select(
          /** @lang SQL */
          'EXEC dbo.pl_reco_san_sp_listar_reconocimientos_sanciones ?,?,?,?,?,?,?', [$dni,$tipo,$documento,$asunto,$fecha,$longitud,$pagina]
      );
     
  }
  public function registrarReconocimientoSancion(array $datos,$usuario,$equipo,$perfil){

    try {
        
        DB::statement('EXEC dbo.pl_reco_san_sp_grabar_reconocimiento_sancion ?,?,?,?,?,?,?,?,?,?', [
            $datos['id'],
            $datos['documento'],
            $datos['asunto'],
            $datos['ruta'],
            $datos['tipo'],
            $datos['numeroDocumento'],          
            $datos['fecha'],           
            $usuario,
            $equipo,
            $perfil

        ]);
    } catch (\Exception $e) {
        echo 'Error al ejecutar el procedimiento almacenado pl_eval_sp_grabar_evaluacion: ' . $e->getMessage();
    }
}

public function editarReconocimientoSancion(array $datos,$usuario,$equipo,$perfil){

  try {
      
      DB::statement('EXEC dbo.pl_reco_san_sp_grabar_reconocimiento_sancion ?,?,?,?,?,?,?,?,?,?', [
        $datos['id'],
        $datos['documento'],
        $datos['asunto'],
        $datos['ruta'],
        $datos['tipo'],
        $datos['numeroDocumento'],          
        $datos['fecha'],           
        $usuario,
        $equipo,
        $perfil

      ]);
  } catch (\Exception $e) {
      echo 'Error al ejecutar el procedimiento almacenado pl_eval_sp_grabar_evaluacion: ' . $e->getMessage();
  }
}
}
