<?php

namespace App\Models\legajo;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
class verDatosModel extends Model
{
    use HasFactory;
    public function __construct()
    {

        parent::__construct();
        $this->conexion = DB::connection('personal');
    }
    public function listarDatosEmpleado($id){  return $this->conexion->select(/** @lang SQL */ 'EXEC dbo.pl_sp_listar_datos_empleado ?',[$id]);}
    public function listarDatosDiscapacidades($id){  return $this->conexion->select(/** @lang SQL */ 'EXEC dbo.pl_sp_listar_datos_empleado_discapacidades ?',[$id]);}
    public function listarDatosContactoEmergencia($id){  return $this->conexion->select(/** @lang SQL */ 'EXEC dbo.pl_sp_listar_datos_empleado_contacto_emergencia ?',[$id]);}
    public function listarDatosFamiliares($id){  return $this->conexion->select(/** @lang SQL */ 'EXEC dbo.pl_sp_listar_datos_empleado_familiares ?',[$id]);}
    public function listarDatosDomicilio($id){  return $this->conexion->select(/** @lang SQL */ 'EXEC dbo.pl_sp_listar_datos_empleado_domicilio ?',[$id]);}
    public function listarDatosEm($id){  return $this->conexion->select(/** @lang SQL */ 'EXEC dbo.pl_sp_listar_datos_empleado ?',[$id]);}

    }
