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
            'EXEC dbo.lg_sp_listar_empleados ?,?,?,?,?,?,?,?,?'
        );
        $smtp->bindParam(1, $params->documento);
        $smtp->bindParam(2, $params->apPaterno);
        $smtp->bindParam(3, $params->apMaterno);
        $smtp->bindParam(4, $params->nombres);
        $smtp->bindParam(5, $params->unidadOrganica);
        $smtp->bindParam(6, $params->equipoServicio);
        $smtp->bindParam(7, $params->longitud);
        $smtp->bindParam(8, $params->pagina);
        $smtp->bindParam(9, $params->estado);
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
        array $datosEstudioSuperior,
        array $datosPostgrado,
        array $datosEspecialidades,
        array $datosCursos,
        array $datosIdiomas,
        array $datosExpLaboral,
        array $datosLaborDocencia,
        $usuario,
        $equipo,
        $perfil

    ) {
        $numDocumento = $datosPersonales['numeroDocumento'];
        // Iniciar una transacción para asegurar que todas las inserciones se realicen correctamente
        DB::beginTransaction();

        try {


            // Iterar sobre los datos personales 
            try {
                $resultado = DB::selectOne('EXEC dbo.pl_sp_insertar_personal ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?', [
                    $datosPersonales['tipoDocumento'],
                    $datosPersonales['numeroDocumento'],
                    $datosPersonales['codigoAirhsp'],
                    $datosPersonales['apellidoPaterno'],
                    $datosPersonales['apellidoMaterno'],
                    $datosPersonales['nombres'],
                    $datosPersonales['ruc'],
                    $datosPersonales['estadoCivil'],
                    $datosPersonales['sexo'],
                    $datosPersonales['grupoSanguineo'],
                    $datosPersonales['grupOcupacional'],
                    $datosPersonales['tipoEmpleado'],
                    $datosPersonales['regimen'],
                    $datosPersonales['tipoRegimen'],
                    $datosPersonales['fechaNacimiento'],
                    $datosPersonales['telefonoFijo'],
                    $datosPersonales['telefonoMovil'],
                    $datosPersonales['correoElectronico'],
                    $datosPersonales['enfAlergias'],
                    $datosPersonales['fechaIngreso'],
                    $datosPersonales['unidadOrganica'],
                    $datosPersonales['servicio'],
                    $datosPersonales['rutaFoto'],
                    $datosPersonales['nacionalidad'],
                    $datosPersonales['cargo'],
                    $datosPersonales['nivel'],
                    $usuario,
                    $equipo,
                    $perfil

                ]);
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado pl_sp_insertar_personal: ' . $e->getMessage();
            }
            $dato=$resultado->dato;

            if ($dato=='1') {
                try {
                    DB::statement('EXEC dbo.pl_sp_insertar_datos_contacto_emergencia ?,?,?,?,?,?,?', [
                        $datosContacto['nombreContacto'],
                        $datosContacto['parentesco'],
                        $datosContacto['numContacto'],
                        $numDocumento,
                        $usuario,
                        $equipo,
                        $perfil
    
                    ]);
                } catch (\Exception $e) {
                    echo 'Error al ejecutar el procedimiento almacenado pl_sp_insertar_datos_contacto_emergencia: ' . $e->getMessage();
                }

                //insertar datso de discapacidad 
                try {

                    foreach ($datosDiscapacidad['tipos'] as $tipo) {
                        DB::statement('EXEC dbo.pl_sp_insertar_datos_discapacidad ?,?,?,?,?,?', [
                            $tipo,
                            $datosDiscapacidad['ruta'],
                            $numDocumento,
                            $usuario,
                            $equipo,
                            $perfil
        

                        ]);
                    }
                } catch (\Exception $e) {
                    echo 'Error al ejecutar el procedimiento almacenado pl_sp_insertar_datos_discapacidad: ' . $e->getMessage();
                }

                //insertar datos domiclio
                try {

                    DB::statement('EXEC dbo.pl_sp_insertar_datos_direccion ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?', [
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
                        $numDocumento,
                        $usuario,
                        $equipo,
                        $perfil
    
                    ]);
                } catch (\Exception $e) {
                    echo 'Error al ejecutar el procedimiento almacenado  pl_sp_insertar_datos_direccion: ' . $e->getMessage();
                }

                //insertar datos familiares
                try {
                    foreach ($datosFamiliares as $familiar) {
                        DB::statement('EXEC dbo.pl_sp_insertar_datos_familiar ?,?,?,?,?,?,?,?,?,?,?', [
                            $familiar['apellidos'],
                            $familiar['nombre'],
                            $familiar['fechaNacimiento'],
                            $familiar['tipoD'],
                            $familiar['dni'],
                            $familiar['parentesco'],
                            $familiar['centroLaboral'],
                            $numDocumento,
                            $usuario,
                            $equipo,
                            $perfil
        

                        ]);
                    }
                } catch (\Exception $e) {
                    echo 'Error al ejecutar el procedimiento almacenado pl_sp_insertar_datos_familiar: ' . $e->getMessage();
                }
                //insertar datos profesion
                try {
                    if(!empty($datosProfesion)){
                        DB::statement('EXEC dbo.pl_sp_insertar_datos_profesion ?,?,?,?,?,?,?,?,?', [
                            $datosProfesion['profesion'],
                            $datosProfesion['lugarColeg'],
                            $datosProfesion['fechColeg'],
                            $datosProfesion['fechTerColeg'],
                            $datosProfesion['numColeg'],
                            $numDocumento,
                            $usuario,
                            $equipo,
                            $perfil
        
    
                        ]);
                    }

                  
                } catch (\Exception $e) {
                    echo 'Error al ejecutar el procedimiento almacenado pl_sp_insertar_datos_profesion: ' . $e->getMessage();
                }
                //insertar datos estudio superior
                try {
                     if(!empty($datosEstudioSuperior)){
                        foreach ($datosEstudioSuperior as $superior) {
                            DB::statement('EXEC dbo.pl_sp_insertar_datos_estudio_superior ?,?,?,?,?,?,?,?,?,?,?', [
                                $superior['tipo'],
                                $superior['centro'],
                                $superior['especialidad'],
                                $superior['inicio'],
                                $superior['termino'],
                                $superior['nivel'],
                                $superior['ruta'],
                                $numDocumento,
                                $usuario,
                                $equipo,
                                $perfil
            
                            ]);
                        }
                     }
                  
                } catch (\Exception $e) {
                    echo 'Error al ejecutar el procedimiento almacenado: pl_sp_insertar_datos_estudio_superior' . $e->getMessage();
                }

                //insertar datos  postgrado
                try {
                    if(!empty($datosPostgrado)){
                        foreach ($datosPostgrado as $postgrado) {
                            DB::statement('EXEC dbo.pl_sp_insertar_datos_estudio_postgrado ?,?,?,?,?,?,?,?,?,?,?', [
                                $postgrado['tipo'],
                                $postgrado['centro'],
                                $postgrado['especialidad'],
                                $postgrado['inicio'],
                                $postgrado['termino'],
                                $postgrado['nivel'],
                                $postgrado['ruta'],
                                $numDocumento,
                                $usuario,
                                $equipo,
                                $perfil
            
                            ]);
                        }
                    }
                   
                } catch (\Exception $e) {
                    echo 'Error al ejecutar el procedimiento almacenado: pl_sp_insertar_datos_estudio_postgrado' . $e->getMessage();
                }
                //insertar Especialidades 
                try {
                    if(!empty($datosEspecialidades)){
                        foreach ($datosEspecialidades as $especialidad) {
                            DB::statement('EXEC dbo.pl_sp_insertar_datos_estudio_especialidad ?,?,?,?,?,?,?,?,?,?,?', [
                                $especialidad['tipo'],
                                $especialidad['centro'],
                                $especialidad['materia'],
                                $especialidad['inicio'],
                                $especialidad['termino'],
                                $especialidad['certificacion'],
                                $especialidad['ruta'],
                                $numDocumento,
                                $usuario,
                                $equipo,
                                $perfil
            
                            ]);
                        }
                    }
                   
                } catch (\Exception $e) {
                    echo 'Error al ejecutar el procedimiento almacenado: pl_sp_insertar_datos_estudio_especialidad' . $e->getMessage();
                }

                //insertar Cursos
                try {
                    if(!empty($datosCursos)){
                        foreach ($datosCursos as $curso) {
                            DB::statement('EXEC dbo.pl_sp_insertar_datos_estudio_curso ?,?,?,?,?,?,?,?,?,?,?', [
                                $curso['tipo'],
                                $curso['centro'],
                                $curso['materia'],
                                $curso['inicio'],
                                $curso['termino'],
                                $curso['certificacion'],
                                $curso['ruta'],
                                $numDocumento,
                                $usuario,
                                $equipo,
                                $perfil
            
                            ]);
                        }
                    }
    
                } catch (\Exception $e) {
                    echo 'Error al ejecutar el procedimiento almacenado: pl_sp_insertar_datos_estudio_curso' . $e->getMessage();
                }

                //insertar idiomas
                try {
                    if(!empty($datosIdiomas)){
                        foreach ($datosIdiomas as $idioma) {
                            DB::statement('EXEC dbo.pl_sp_insertar_datos_estudio_idioma ?,?,?,?,?,?,?', [
                                $idioma['lenguaE'],
                                $idioma['nivel'],
                                $idioma['ruta'],
                                $numDocumento,
                                $usuario,
                                $equipo,
                                $perfil
            
                            ]);
                        }
                    }
                  
                } catch (\Exception $e) {
                    echo 'Error al ejecutar el procedimiento almacenado: pl_sp_insertar_datos_estudio_idioma' . $e->getMessage();
                }
                //insertar expLaboral
                try {
                    if(!empty($datosExpLaboral)){
                        foreach ($datosExpLaboral as $laboral) {
                            DB::statement('EXEC dbo.pl_sp_insertar_datos_experiencia_laboral ?,?,?,?,?,?,?,?,?', [
                                $laboral['institucion'],
                                $laboral['cargo'],
                                $laboral['inicio'],
                                $laboral['termino'],
                                $laboral['ruta'],
                                $numDocumento,
                                $usuario,
                                $equipo,
                                $perfil
            
                            ]);
                        }
                    }
                  
                } catch (\Exception $e) {
                    echo 'Error al ejecutar el procedimiento almacenado: pl_sp_insertar_datos_estudio_exp_laboral' . $e->getMessage();
                }
                //inserta exp docencia
                //insertar expLaboral
                try {
                    if(!empty($datosLaborDocencia)){
                        foreach ($datosLaborDocencia as $docencia) {
                            DB::statement('EXEC dbo.pl_sp_insertar_datos_experiencia_docencia ?,?,?,?,?,?,?,?,?', [
                                $docencia['centro'],
                                $docencia['curso'],
                                $docencia['inicio'],
                                $docencia['termino'],
                                $docencia['ruta'],
                                $numDocumento,
                                $usuario,
                                $equipo,
                                $perfil
            
                            ]);
                        }
                    }
              
                } catch (\Exception $e) {
                    echo 'Error al ejecutar el procedimiento almacenado: pl_sp_insertar_datos_estudio_exp_docencia' . $e->getMessage();
                }
       
            }
         
            DB::commit();
            return $resultado;
        } catch (\Exception $e) {
            DB::rollBack();

            return $resultado;
        }
    }

    public function editarEmpleado(

        array $datosPersonales,
        array $datosSituacionLaboral,
        array $datosContacto,
        array $datosDomicilio,
        array $datosFamiliares,
        array $datosProfesion,
        array $datosEstudioSuperior,
        array $datosPostgrado,
        array $datosEspecialidades,
        array $datosCursos,
        array $datosIdiomas,
        array $datosExpLaboral,
        array $datosLaborDocencia,
        $usuario,
        $equipo,
        $perfil
    ) {
        $numDocumento = $datosPersonales['numDoc'];
        // Iniciar una transacción para asegurar que todas las inserciones se realicen correctamente
        DB::beginTransaction();

        try {
            // Iterar sobre los datos personales 
            try {
                $resultado = DB::selectOne('EXEC dbo.pl_sp_editar_personal ?,?,?,?,?,?,?,?,?,?,?,?,?,?', [
                    $datosPersonales['numDoc'],
                    $datosPersonales['sexo']??'',
                    $datosPersonales['fechaNacimiento']??'',
                    $datosPersonales['grupoSanguineo']??'',
                    $datosPersonales['ruc']??'',
                    $datosPersonales['estadoCivil']??'',
                    $datosPersonales['telFijo']??'',
                    $datosPersonales['telMovil']??'',
                    $datosPersonales['correo']??'',
                    $datosPersonales['enfAlergias']??'',
                    $datosPersonales['rutaFoto']??'',
                    $usuario,
                    $equipo,
                    $perfil

                ]);
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado pl_sp_editar_personal: ' . $e->getMessage();
            }

            //Insertar datos de  contacto de emergencia
            try {
                if(!empty($datosContacto)){
                    DB::statement('EXEC dbo.pl_sp_editar_datos_contacto_emergencia ?,?,?,?,?,?,?,?', [
                        $datosContacto['nombreContacto']??'',
                        $datosContacto['parentesco']??'',
                        $datosContacto['numContacto']??'',
                        $numDocumento,
                        $datosContacto['id']??'',
                        $usuario,
                        $equipo,
                        $perfil
    
                    ]);
                }
              
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado pl_sp_editar_datos_contacto_emergencia: ' . $e->getMessage();
            }

            //editar situacion laboral
            try {
                   DB::statement('EXEC dbo.pl_sp_editar_situacion_laboral ?,?,?,?,?,?,?,?,?,?,?,?,?,?', [
                    $datosSituacionLaboral['condicion']??'',
                    $datosSituacionLaboral['grupOcup']??'',
                    $datosSituacionLaboral['regimen']??'',
                    $datosSituacionLaboral['tipoRegimen']??'',
                    $datosSituacionLaboral['unidad']??'',
                    $datosSituacionLaboral['servicio']??'',
                    $datosSituacionLaboral['cargo']??'',
                    $datosSituacionLaboral['nivelCargo']??'',
                    $datosSituacionLaboral['airhsp']??'',
                    $datosSituacionLaboral['fechaIngreso']??'',
                    $datosSituacionLaboral['id']??'',
                    $usuario,
                    $equipo,
                    $perfil

                ]);

            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado pl_sp_editar_situacion_laboral: ' . $e->getMessage();

            }

            //editar datos domiclio
            try {
          
                DB::statement('EXEC dbo.pl_sp_editar_datos_direccion ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?', [
                    $datosDomicilio['departamento']??'',
                    $datosDomicilio['provincia']??'',
                    $datosDomicilio['distrito']??'',
                    $datosDomicilio['via']??'',
                    $datosDomicilio['nombreVia']??'',
                    $datosDomicilio['numeroVia']??'',
                    $datosDomicilio['interiorVia']??'',
                    $datosDomicilio['zona']??'',
                    $datosDomicilio['nombreZona']??'',
                    $datosDomicilio['numeroZona']??'',
                    $datosDomicilio['interiorZona']??'',
                    $datosDomicilio['referencia']??'',
                    $datosDomicilio['ubigeo']??'',
                    $numDocumento,
                    $datosDomicilio['id']??'',
                    $usuario,
                    $equipo,
                    $perfil
                ]);
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado  pl_sp_editar_datos_direccion: ' . $e->getMessage();
            }

            //insertar datos familiares
            try {
                foreach ($datosFamiliares as $familiar) {
                    DB::statement('EXEC dbo.pl_sp_editar_datos_familiar ?,?,?,?,?,?,?,?,?,?,?,?,?', [
                        $familiar['apellidos']??'',
                        $familiar['nombre']??'',
                        $familiar['fechaNacimiento']??'',
                        $familiar['tipoD']??'',
                        $familiar['dni']??'',
                        $familiar['parentesco']??'',
                        $familiar['centroLaboral']??'',
                        $numDocumento,
                        $familiar['estado']??'',
                        $familiar['id']??'',
                        $usuario,
                        $equipo,
                        $perfil
                    ]);
                }
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado pl_sp_editar_datos_familiar: ' . $e->getMessage();
            }
            //insertar datos profesion
            try {
               if(!empty($datosProfesion)){
                DB::statement('EXEC dbo.pl_sp_editar_datos_profesion ?,?,?,?,?,?,?,?,?,?', [                              
                    $datosProfesion['profesion']??'',
                    $datosProfesion['lugarColeg']??'',
                    $datosProfesion['fechColeg']??'',
                    $datosProfesion['fechTerColeg']??'',
                    $datosProfesion['numColeg']??'',
                    $numDocumento,
                    $datosProfesion['id']??'',
                    $usuario,
                    $equipo,
                    $perfil
                ]);
               }
               
               
              
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado pl_sp_editar_datos_profesion: ' . $e->getMessage();
            }
            //insertar datos estudio superior
            try {
                if(!empty($datosEstudioSuperior)){
                    foreach ($datosEstudioSuperior as $superior) {
                        DB::statement('EXEC dbo.pl_sp_editar_datos_estudio_superior ?,?,?,?,?,?,?,?,?,?,?,?,?', [
                            $superior['tipo']??'',
                            $superior['centro']??'',
                            $superior['especialidad']??'',
                            $superior['inicio']??'',
                            $superior['termino']??'',
                            $superior['nivel']??'',
                            $superior['ruta']??'',
                            $numDocumento,
                            $superior['estado']??'',
                            $superior['id']??'',
                            $usuario,
                            $equipo,
                            $perfil
                        ]);
                    }
                }
    
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado: pl_sp_editar_datos_estudio_superior' . $e->getMessage();
            }

            //insertar datos  postgrado
            try {
                if(!empty($datosPostgrado)){
                    foreach ($datosPostgrado as $postgrado) {
                        DB::statement('EXEC dbo.pl_sp_editar_datos_estudio_postgrado ?,?,?,?,?,?,?,?,?,?,?,?,?', [
                            $postgrado['tipo']??'',
                            $postgrado['centro']??'',
                            $postgrado['especialidad']??'',
                            $postgrado['inicio']??'',
                            $postgrado['termino']??'',
                            $postgrado['nivel']??'',
                            $postgrado['ruta']??'',
                            $numDocumento??'',
                            $postgrado['estado']??'',
                            $postgrado['id']??'',
                            $usuario,
                            $equipo,
                            $perfil
                        ]);
                    }
                }
                
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado: pl_sp_editar_datos_estudio_postgrado' . $e->getMessage();
            }
            //insertar Especialidades 
            try {
                if(!empty($datosEspecialidades)){
                    foreach ($datosEspecialidades as $especialidad) {
                        DB::statement('EXEC dbo.pl_sp_editar_datos_estudio_especialidad ?,?,?,?,?,?,?,?,?,?,?,?,?', [
                            $especialidad['tipo']??'',
                            $especialidad['centro']??'',
                            $especialidad['materia']??'',
                            $especialidad['inicio']??'',
                            $especialidad['termino']??'',
                            $especialidad['certificacion']??'',
                            $especialidad['ruta']??'',
                            $numDocumento,
                            $especialidad['estado']??'',
                            $especialidad['id']??'',
                            $usuario,
                            $equipo,
                            $perfil
                        ]);
                    }
                }
               
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado: pl_sp_editar_datos_estudio_especialidad' . $e->getMessage();
            }

            //insertar Cursos
            try {
                if(!empty($datosCursos)){
                    foreach ($datosCursos as $curso) {
                        DB::statement('EXEC dbo.pl_sp_editar_datos_estudio_curso ?,?,?,?,?,?,?,?,?,?,?,?,?', [
                            $curso['tipo']??'',
                            $curso['centro']??'',
                            $curso['materia']??'',
                            $curso['inicio']??'',
                            $curso['termino']??'',
                            $curso['certificacion']??'',
                            $curso['ruta']??'',
                            $numDocumento,
                            $curso['estado']??'',
                            $curso['id']??'',
                            $usuario,
                            $equipo,
                            $perfil
                        ]);
                    }
                }
               
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado: pl_sp_editar_datos_estudio_curso' . $e->getMessage();
            }

            //insertar idiomas
            try {
                if(!empty($datosIdiomas)){
                    foreach ($datosIdiomas as $idioma) {
                        DB::statement('EXEC dbo.pl_sp_editar_datos_estudio_idioma ?,?,?,?,?,?,?,?,?', [
                            $idioma['lenguaE']??'',
                            $idioma['nivel']??'',
                            $idioma['ruta']??'',
                            $numDocumento,
                            $idioma['estado']??'',
                            $idioma['id']??'',
                            $usuario,
                            $equipo,
                            $perfil
                        ]);
                    }
                }
              
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado: pl_sp_ieditar_datos_estudio_idioma' . $e->getMessage();
            }
            //insertar expLaboral
            try {
                if(!empty($datosExpLaboral)){
                    foreach ($datosExpLaboral as $laboral) {
                        DB::statement('EXEC dbo.pl_sp_editar_datos_experiencia_laboral ?,?,?,?,?,?,?,?,?,?,?', [
                            $laboral['institucion']??'',
                            $laboral['cargo']??'',
                            $laboral['inicio']??'',
                            $laboral['termino']??'',
                            $laboral['ruta']??'',
                            $numDocumento,
                            $laboral['estado']??'',
                            $laboral['id']??'',
                            $usuario,
                            $equipo,
                            $perfil
                        ]);
                    }
                }
              
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado: pl_sp_editar_datos_estudio_exp_laboral' . $e->getMessage();
            }
            //inserta exp docencia
            //insertar expLaboral
            try {
                if(!empty($datosLaborDocencia)){
                    foreach ($datosLaborDocencia as $docencia) {
                        DB::statement('EXEC dbo.pl_sp_editar_datos_experiencia_docencia ?,?,?,?,?,?,?,?,?,?,?', [
                            $docencia['centro']??'',
                            $docencia['curso']??'',
                            $docencia['inicio']??'',
                            $docencia['termino']??'',
                            $docencia['ruta']??'',
                            $numDocumento,
                            $docencia['estado']??'',
                            $docencia['id']??'',
                            $usuario,
                            $equipo,
                            $perfil
                        ]);
                    }
                }
                
            } catch (\Exception $e) {
                echo 'Error al ejecutar el procedimiento almacenado: pl_sp_editar_datos_estudio_exp_docencia' . $e->getMessage();
            }
            DB::commit();
            return $resultado;
        } catch (\Exception $e) {
            // Revertir la transacción si ocurre algún error
            DB::rollBack();
            // Retornar false para indicar que la inserción falló
            return false;
        }
    }
    public function editarDiscapacidad($datosDiscapacidad,$usuario,$equipo,$perfil,$numDocumento){
        try {
            DB::statement('EXEC dbo.pl_sp_eliminar_detalle_discapacidad ?',[$numDocumento] );

            foreach ($datosDiscapacidad['tipos'] as $tipo) {
                DB::statement('EXEC dbo.pl_sp_insertar_datos_discapacidad ?,?,?,?,?,?', [
                    $tipo,
                    $datosDiscapacidad['ruta'],
                    $numDocumento,
                    $usuario,
                    $equipo,
                    $perfil
                ]);
            }
        } catch (\Exception $e) {
            echo 'Error al ejecutar el procedimiento almacenado pl_sp_insertar_datos_discapacidad: ' . $e->getMessage();
        }
        
    }
}
