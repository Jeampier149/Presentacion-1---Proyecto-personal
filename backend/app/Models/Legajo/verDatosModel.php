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
    public function listarDatosEmpleadoVer($id)
    {
        return $this->conexion->select(
        /** @lang SQL */
        'EXEC dbo.pl_sp_listar_datos_empleado_mv ?', [$id]);
    }
    public function listarDatosDiscapacidades($id)
    {
        return $this->conexion->select(
        /** @lang SQL */
        'EXEC dbo.pl_sp_listar_datos_empleado_discapacidades ?', [$id]);
    }
    public function listarDatosContactoEmergencia($id)
    {
        return $this->conexion->select(
        /** @lang SQL */
        'EXEC dbo.pl_sp_listar_datos_empleado_contacto_emergencia ?', [$id]);
    }
    public function listarDatosFamiliares($id)
    {
        return $this->conexion->select(
        /** @lang SQL */
        'EXEC dbo.pl_sp_listar_datos_empleado_familiares ?', [$id]);
    }
    public function listarDatosDomicilio($id)
    {
        return $this->conexion->select(
        /** @lang SQL */
        'EXEC dbo.pl_sp_listar_datos_empleado_domicilio ?', [$id]);
    }
    public function listarDatosProfesion($id)
    {
        return $this->conexion->select(
        /** @lang SQL */
        'EXEC dbo.pl_sp_listar_datos_empleado_profesion ?', [$id]);
    }
    public function listarDatosEstudioSuperior($id)
    {
        return $this->conexion->select(
        /** @lang SQL */
        'EXEC dbo.pl_sp_listar_datos_empleado_estudio_superior ?', [$id]);
    }
    public function listarDatosEstudioPostgrado($id)
    {
        return $this->conexion->select(
        /** @lang SQL */
        'EXEC dbo.pl_sp_listar_datos_empleado_estudio_postgrado ?', [$id]);
    }
    public function listarDatosEstudioEspecializacion($id)
    {
        return $this->conexion->select(
        /** @lang SQL */
        'EXEC dbo.pl_sp_listar_datos_empleado_estudio_especializacion ?', [$id]);
    }
    public function listarDatosEstudioCursos($id)
    {
        return $this->conexion->select(
        /** @lang SQL */
        'EXEC dbo.pl_sp_listar_datos_empleado_estudio_curso ?', [$id]);
    }
    public function listarDatosEstudioIdioma($id)
    {
        return $this->conexion->select(
        /** @lang SQL */
        'EXEC dbo.pl_sp_listar_datos_empleado_estudio_idioma ?', [$id]);
    }
    public function listarDatosExperienciaLaboral($id)
    {
        return $this->conexion->select(
        /** @lang SQL */
        'EXEC dbo.pl_sp_listar_datos_empleado_experiencia_laboral ?', [$id]);
    }
    public function listarDatosExperienciaDocencia($id)
    {
        return $this->conexion->select(
        /** @lang SQL */
        'EXEC dbo.pl_sp_listar_datos_empleado_experiencia_docencia ?', [$id]);
    }
   

}
