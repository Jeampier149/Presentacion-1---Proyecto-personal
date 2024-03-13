<?php

namespace App\Models\Legajo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use stdClass;

class SituacionLaboralModel extends Model
{

    public function __construct()
    {
  
      parent::__construct();
      $this->conexion = DB::connection('personal');
    }
    public function listarSituacionLaboral($id)
    {
        return $this->conexion->select(
        /** @lang SQL */
        'EXEC dbo.pl_sp_listar_datos_empleado_situacion_laboral ?', [$id]);
    }
    public function listarSituacionLaboralHistorial($id)
    {
        return $this->conexion->select(
        /** @lang SQL */
        'EXEC dbo.pl_sp_listar_datos_empleado_situacion_laboral_historial ?', [$id]);
    }
    public function registrarTermino($idHistorial,$motivo,$fechaTermino,$usuario,$equipo,$perfil)
    {
        return $this->conexion->select(
        /** @lang SQL */
        'EXEC dbo.pl_sp_situacion_laboral_dar_termino ?,?,?,?,?,?', [$idHistorial,$motivo,$fechaTermino,$usuario,$equipo,$perfil]);
    }
    public function actualizarSituacion($numDoc,$grupOcup,$regimen,$tipoRegimen,$unidad,$servicio,$cargo,$nivel,$codAir,$fechaIngreso,$condicion,$usuario,$equipo,$perfil)
    {
        return $this->conexion->selectOne(
        /** @lang SQL */
        'EXEC dbo.pl_sp_situacion_laboral_actualizar ?,?,?,?,?,?,?,?,?,?,?,?,?,?', [$numDoc,$grupOcup,$regimen,$tipoRegimen,$unidad,$servicio,$cargo,$nivel,$codAir,$fechaIngreso,$condicion,$usuario,$equipo,$perfil]);
    }
}
