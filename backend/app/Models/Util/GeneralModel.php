<?php

namespace App\Models\Util;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class GeneralModel extends Model
{
    use HasFactory;
    public function __construct()
    {

        parent::__construct();
        $this->conexion = DB::connection('personal');
    }

  public function listarTipoDocumento(){ return $this->conexion->select(/** @lang SQL */ 'EXEC dbo.g_sp_listar_tipo_documento');}
  public function listarTipoEmpleado(){ return $this->conexion->select(/** @lang SQL */ 'EXEC dbo.g_sp_listar_tipo_empleado');}
  public function listarGrupo(){ return $this->conexion->select(/** @lang SQL */ 'EXEC dbo.g_sp_listar_tipo_grupo_ocupacional');}
  public function listarRegimen(){ return $this->conexion->select(/** @lang SQL */ 'EXEC dbo.g_sp_listar_regimen');}
  public function listarTipoRegimen($id){  return $this->conexion->select(/** @lang SQL */ 'EXEC dbo.g_sp_listar_tipo_regimen ?',[$id]);}
}
