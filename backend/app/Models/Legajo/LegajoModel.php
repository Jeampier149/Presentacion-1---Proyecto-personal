<?php

namespace App\Models\Legajo;

use App\Models\Ftp\FtpModel;
use http\QueryString;
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
        string $numero_doc,
        object $datosPersonales,
        object $datosContacto,
        array $tiposDiscapacidades,
        array $datosDomicilio,
        array $datosFamiliares,
        array $datosProfesionales,
        array $datosPostgrado,
        array $datosEspecializacion,
        array $datosCursos,
        array $datosIdiomas,
        array $experienciaLaboral,
        array $laborDocencia
    ): bool {
        // Iniciar una transacción para asegurar que todas las inserciones se realicen correctamente
        DB::beginTransaction();

        try {
            // Iterar sobre los datos personales y realizar la inserción
            foreach ($datosPersonales as $datoPersonal) {
                DB::statement('CALL dbo.pl_sp_insertar_personal(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
                    $datoPersonal->tipoDocumento,
                    $datoPersonal->numeroDocumento,
                    $datoPersonal->tipoEmpleado,
                    $datoPersonal->grupOcupacional,
                    $datoPersonal->regimen,
                    $datoPersonal->tipoRegimen,
                    $datoPersonal->aPaterno,
                    $datoPersonal->aMaterno,
                    $datoPersonal->nombres,
                    $datoPersonal->sexo,
                    $datoPersonal->ruc,
                    $datoPersonal->fNacimiento,
                    $datoPersonal->tFijo,
                    $datoPersonal->tMovil,
                    $datoPersonal->correoE,
                    $datoPersonal->Sanguineo,
                    $datoPersonal->enfAlergias,
                    $datoPersonal->estadoCivil,
                ]);
            }
            // Iterar sobre los datos de contacto y realizar la inserción
            foreach ($datosContacto as $datoContacto) {
                DB::statement('CALL dbo.pl_sp_insertar_datos_contacto(?,?)', [
                    $numero_doc,
                    $datoContacto                   
                ]);
            }
          
            // Confirmar la transacción si todas las inserciones se realizaron correctamente
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
