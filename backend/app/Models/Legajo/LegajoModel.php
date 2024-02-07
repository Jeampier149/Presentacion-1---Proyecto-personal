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
        array $datosPersonales,
        array $datosContacto,
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
                DB::table('datos_personales')->insert($datoPersonal);
            }
            // Iterar sobre los datos de contacto y realizar la inserción
            foreach ($datosContacto as $datoContacto) {
                DB::table('datos_contacto')->insert($datoContacto);
            }
            // Iterar sobre los tipos de discapacidades y realizar la inserción
            foreach ($tiposDiscapacidades as $tipoDiscapacidad) {
                DB::table('tipos_discapacidades')->insert($tipoDiscapacidad);
            }
            // Iterar sobre los datos de domicilio y realizar la inserción
            foreach ($datosDomicilio as $datoDomicilio) {
                DB::table('datos_domicilio')->insert($datoDomicilio);
            }
            // Iterar sobre los datos familiares y realizar la inserción
            foreach ($datosFamiliares as $datoFamiliar) {
                DB::table('datos_familiares')->insert($datoFamiliar);
            }

            // Iterar sobre los datos profesionales y realizar la inserción
            $ftp = new FtpModel();
            foreach ($datosProfesionales as $datoProfesional) {
                // Subir el archivo al servidor FTP
                $rutaArchivoFTP = $datoProfesional['ruta'];
                $nombreArchivo = $datoProfesional['archivo']->getClientOriginalName();
                $rutaArchivoLocal = $datoProfesional['archivo']->getPathname();
                $ftp->subirArchivo($rutaArchivoFTP, $nombreArchivo, $rutaArchivoLocal);

                // Actualizar el arreglo $datoProfesional con la ruta del archivo en el servidor FTP
                $datoProfesional['archivo'] = $rutaArchivoFTP . '/' . $nombreArchivo;

                // Insertar los datos actualizados en la tabla datos_profesionales
                DB::table('datos_profesionales')->insert($datoProfesional);
            }

            // Iterar sobre los datos de postgrado y realizar la inserción
            foreach ($datosPostgrado as $datoPostgrado) {
                DB::table('datos_postgrado')->insert($datoPostgrado);
            }

            // Iterar sobre los datos de especialización y realizar la inserción
            foreach ($datosEspecializacion as $datoEspecializacion) {
                DB::table('datos_especializacion')->insert($datoEspecializacion);
            }

            // Iterar sobre los datos de cursos y realizar la inserción
            foreach ($datosCursos as $datoCurso) {
                DB::table('datos_cursos')->insert($datoCurso);
            }

            // Iterar sobre los datos de idiomas y realizar la inserción
            foreach ($datosIdiomas as $datoIdioma) {
                DB::table('datos_idiomas')->insert($datoIdioma);
            }

            // Iterar sobre la experiencia laboral y realizar la inserción
            foreach ($experienciaLaboral as $experiencia) {
                DB::table('experiencia_laboral')->insert($experiencia);
            }

            // Iterar sobre la labor de docencia y realizar la inserción
            foreach ($laborDocencia as $docencia) {
                DB::table('labor_docencia')->insert($docencia);
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
