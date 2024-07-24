<?php

namespace App\Models\Legajo;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class RelacionLaboralModel extends Model
{
    use HasFactory;
    use HasFactory;
    public function __construct()
    {
  
      parent::__construct();
      $this->conexion = DB::connection('personal');
    }


  public function obtenerRelacionLaboral($id)
  {
    return $this->conexion->selectOne(
    /** @lang SQL */
    'EXEC dbo.pl_rela_labo_sp_obtener_relacion_laboral ?', [$id]);
  }
  public function listarRelacionLaboral($documento,$asunto,$fecha,$dni,$pagina,$longitud)
    
  {
      return $this->conexion->select(
          /** @lang SQL */
          'EXEC dbo.pl_rela_labo_sp_listar_relaciones_laborales ?,?,?,?,?,?', [$dni,$documento,$asunto,$fecha,$longitud,$pagina]
      );
     
  }
  public function registrarRelacionLaboral(array $datos,$usuario,$equipo,$perfil){

    try {
        
        DB::statement('EXEC dbo.pl_rela_labo_sp_grabar_relacion_laboral ?,?,?,?,?,?,?,?,?', [
            $datos['id'],
            $datos['documento'],
            $datos['asunto'],
            $datos['ruta'],
            $datos['numeroDocumento'],          
            $datos['fecha'],           
            $usuario,
            $equipo,
            $perfil

        ]);
    } catch (\Exception $e) {
        echo 'Error al ejecutar el procedimiento almacenado pl_rela_labo_sp_grabar_relacion_laboral: ' . $e->getMessage();
    }
}

public function editarRelacionLaboral(array $datos,$usuario,$equipo,$perfil){
  try {
      
    DB::statement('EXEC dbo.pl_rela_labo_sp_grabar_relacion_laboral ?,?,?,?,?,?,?,?,?', [
        $datos['id'],
        $datos['documento'],
        $datos['asunto'],
        $datos['ruta'],
        $datos['numeroDocumento'],          
        $datos['fecha'],           
        $usuario,
        $equipo,
        $perfil

      ]);
  } catch (\Exception $e) {
      echo 'Error al ejecutar el procedimiento almacenado pl_rela_labo_sp_grabar_relacion_laboral: ' . $e->getMessage();
  }
}
}
