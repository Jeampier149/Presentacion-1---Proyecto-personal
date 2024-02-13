<?php

namespace App\Models\Legajo;

use App\Models\Ftp\FtpModel;
use http\QueryString;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use PDO;
use stdClass;

/**
 *
 */
class LegajoModel extends Model
{
    use HasFactory;



    public function __construct()
    {

        parent::__construct();
        $this->conexion = DB::connection('personal');
    }

    /**
     * @param stdClass $params
     * @return array
     */
    public function listarEmpleado(stdClass $params): array
    {
        $smtp = $this->conexion->getPdo()->prepare(
            /** @lang SQL */
            'EXEC dbo.lg_sp_listar_empleados ?,?,?,?,?,?,?,?'
        );
        $smtp->bindParam(1, $params->documento);
        $smtp->bindParam(2, $params->apPaterno);
        $smtp->bindParam(3, $params->apMaterno);
        $smtp->bindParam(4, $params->nombres);
        $smtp->bindParam(5, $params->unidadOrganica);
        $smtp->bindParam(6, $params->equipoServicio);
        $smtp->bindParam(7, $params->longitud);
        $smtp->bindParam(8, $params->pagina);
        $smtp->execute();
        $resultados = $smtp->columnCount() > 0 ? $smtp->fetchAll(PDO::FETCH_ASSOC) : [];
        $smtp->closeCursor();
        return $resultados;
    }
    public function registrarEmpleado(

        array $datosPersonales,
        array $datosContacto,
        array $datosDiscapacidad,
        array $datosDomicilio,
        array $datosFamiliares,
        array $datosProfesion,
        array $datosEstudioSuperior

    ) {

        // Iniciar una transacción para asegurar que todas las inserciones se realicen correctamente
        DB::beginTransaction();

        try {

            // Iterar sobre los datos personales 
            try {
                DB::statement('EXEC dbo.pl_sp_insertar_personal ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?', [
                    $datosPersonales['tipoDocumento'],
                    $datosPersonales['numeroDocumento'],
                    $datosPersonales['codigoAirhsp'],
                    $datosPersonales['aPaterno'],
                    $datosPersonales['aMaterno'],
                    $datosPersonales['nombres'],
                    $datosPersonales['ruc'],
                    $datosPersonales['estadoCivil'],
                    $datosPersonales['sexo'],
                    $datosPersonales['gSanguineo'],
                    $datosPersonales['grupOcupacional'],
                    $datosPersonales['tipoEmpleado'],
                    $datosPersonales['regimen'],
                    $datosPersonales['tipoRegimen'],
                    $datosPersonales['fNacimiento'],
                    $datosPersonales['tFijo'],
                    $datosPersonales['tMovil'],
                    $datosPersonales['correoE'],
                    $datosPersonales['enfAlergias'],
                    $datosPersonales['fechaIngreso'],
                    $datosPersonales['unidadOrganica'],
                    $datosPersonales['servicio'],
                    $datosPersonales['foto']

                ]);
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado pl_sp_insertar_personal: ' . $e->getMessage();
            }

            //Insertar datos de  contacto de emergencia
            try {
                DB::statement('EXEC dbo.pl_sp_insertar_datos_contacto_emergencia ?,?,?,?', [
                    $datosContacto['nombreContacto'],
                    $datosContacto['parentesco'],
                    $datosContacto['numContacto'],
                    $datosContacto['numDocumento']
                ]);
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado pl_sp_insertar_datos_contacto_emergencia: ' . $e->getMessage();
            }

            //insertar datso de discapacidad 
            try {

                foreach ($datosDiscapacidad['tipos'] as $tipo) {
                    DB::statement('EXEC dbo.pl_sp_insertar_datos_discapacidad ?,?', [
                        $tipo,
                        $datosDiscapacidad['numDocumento']

                    ]);
                }
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado pl_sp_insertar_datos_discapacidad: ' . $e->getMessage();
            }

            //insertar datos domiclio
            try {

                DB::statement('EXEC dbo.pl_sp_insertar_datos_direccion ?,?,?,?,?,?,?,?,?,?,?,?,?,?', [
                    $datosDomicilio['departamento'],
                    $datosDomicilio['provincia'],
                    $datosDomicilio['distrito'],
                    $datosDomicilio['via'],
                    $datosDomicilio['nombreVia'],
                    $datosDomicilio['numeroVia'],
                    $datosDomicilio['interiorVia'],
                    $datosDomicilio['zona'],
                    $datosDomicilio['nombreZona'],
                    $datosDomicilio['numeroZona'],
                    $datosDomicilio['interiorZona'],
                    $datosDomicilio['referenciaDomicilio'],
                    $datosDomicilio['ubigeo'],
                    $datosDomicilio['numDocumento']
                ]);
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado  pl_sp_insertar_datos_direccion: ' . $e->getMessage();
            }

            //insertar datos familiares
            try {
                foreach ($datosFamiliares as $familiar) {
                    DB::statement('EXEC dbo.pl_sp_insertar_datos_familiar ?,?,?,?,?,?,?', [
                        $familiar['apellidos'],
                        $familiar['nombre'],
                        $familiar['fechaNacimiento'],
                        $familiar['dni'],
                        $familiar['parentesco'],
                        $familiar['centroLaboral'],
                        $familiar['pkEmpleado']

                    ]);
                }
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado pl_sp_insertar_datos_familiar: ' . $e->getMessage();
            }
            //insertar datos profesion
            try {

                DB::statement('EXEC dbo.pl_sp_insertar_datos_profesion ?,?,?,?,?,?', [
                    $datosProfesion['profesion'],
                    $datosProfesion['lugarColeg'],
                    $datosProfesion['fechColeg'],
                    $datosProfesion['fechTerColeg'],
                    $datosProfesion['numColeg'],
                    $datosProfesion['numDocEmp'],

                ]);
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado pl_sp_insertar_datos_profesion: ' . $e->getMessage();
            }
            //insertar datos estudio superior
            try {

                foreach ($datosEstudioSuperior as $superior) {
                    DB::statement('EXEC dbo.pl_sp_insertar_datos_estudio_superior ?,?,?,?,?,?,?', [
                        $superior['centro'],
                        $superior['especialidad'],
                        $superior['inicio'],
                        $superior['termino'],
                        $superior['nivel'],
                        $superior['ruta'],
                        $superior['pkEmpleado']
                    ]);
                }
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado: pl_sp_insertar_datos_estudio_superior' . $e->getMessage();
            }

            // Finalizar la transacción
            DB::commit();

            // Retornar true para indicar que la inserción fue exitosa
            return true;
        } catch (\Exception $e) {
            // Revertir la transacción si ocurre algún error
            DB::rollBack();

            // Loguear el error o manejarlo de alguna otra manera
            // ...

            // Retornar false para indicar que la inserción falló
            return false;
        }
    }
}
