<?php

namespace App\Models\legajo;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class verDatosModel extends Model
{
    use HasFactory;
    public function listarDatosEmpleado($id){  return $this->conexion->select(/** @lang SQL */ 'EXEC dbo.pl_sp_listar_datos_empleado ?',[$id]);}
}
