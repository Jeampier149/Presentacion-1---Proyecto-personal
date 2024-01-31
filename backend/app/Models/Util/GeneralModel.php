<?php

namespace App\Models\Util;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use PDO;
class GeneralModel extends Model
{
    use HasFactory;
    public function __construct()
    {

        parent::__construct();
        $this->conexion = DB::connection('personal');
    }

  public function listarTipoDocumento(){
  return $this->conexion->select(/** @lang SQL */ 'EXEC dbo.g_sp_listar_tipo_documento');
    
        
  }
}