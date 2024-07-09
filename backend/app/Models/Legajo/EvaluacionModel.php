<?php

namespace App\Models\Legajo;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
class EvaluacionModel extends Model
{
    use HasFactory;
    public function __construct()
    {
  
      parent::__construct();
      $this->conexion = DB::connection('personal');
    }

    public function listarEvalDoc()
  {
    return $this->conexion->select(
    /** @lang SQL */
    'EXEC dbo.pl_eval_sp_select_documento_evaluacion');
  }
  public function listarEvalTipoDoc($id)
  {
    return $this->conexion->select(
    /** @lang SQL */
    'EXEC dbo.pl_eval_sp_select_tipo_documento_evaluacion ?', [$id]);
  }
  public function obtenerEvaluacion($id)
  {
    return $this->conexion->selectOne(
    /** @lang SQL */
    'EXEC dbo.pl_eval_sp_obtener_evaluacion ?', [$id]);
  }
  public function listarEvaluaciones($documento,$desDocumento,$tipo,$asunto,$fecha,$dni,$pagina,$longitud)
    
  {
      return $this->conexion->select(
          /** @lang SQL */
          'EXEC dbo.pl_eval_sp_listar_evaluaciones ?,?,?,?,?,?,?,?', [$dni,$tipo,$documento,$desDocumento,$asunto,$fecha,$longitud,$pagina]
      );
     
  }
  public function registrarEvaluacion(array $datos,$usuario,$equipo,$perfil){

    try {
        
        DB::statement('EXEC dbo.pl_eval_sp_grabar_evaluacion ?,?,?,?,?,?,?,?,?,?,?', [
            $datos['id'],
            $datos['documento'],
            $datos['descripcion_doc'],
            $datos['asunto'],
            $datos['ruta'],
            $datos['tipo_doc'],
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

public function editarEvaluacion(array $datos,$usuario,$equipo,$perfil){

  try {
      
      DB::statement('EXEC dbo.pl_eval_sp_grabar_evaluacion ?,?,?,?,?,?,?,?,?,?,?', [
          $datos['id'],
          $datos['documento'],
          $datos['descripcion_doc'],
          $datos['asunto'],
          $datos['ruta'],
          $datos['tipo_doc'],
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
