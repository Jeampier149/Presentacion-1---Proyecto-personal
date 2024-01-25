<?php

namespace App\Models\Legajo;

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

    public string|null $historia;
    public string|null $estadoSituacional;
    public string $tipoDocumento;
    public string $documento;
    public string $apellidoPaterno;
    public string $apellidoMaterno;
    public string $primerNombre;
    public string $segundoNombre;
    public string $fechaNacimiento;
    public string $sexo;
    public string $email;
    public string $telefono;
    public string $estadoCivil;
    public string $nivelInstruccion;
    public string $ocupacion;
    public string $centroLaboral;
    public string $observaciones;

    // Nacimiento
    public string $horaNacimiento;
    public string $tipoParto;
    public string $tiempoGestacion;
    public string $pesoNacimiento;
    public string $lugarNacimiento;
    public string $ubigeoNacimiento;


    // Dirección
    public string $tipoDireccion;
    public string $numero;
    public string $interior;
    public string $manzana;
    public string $lote;
    public string $direccion;
    public string $tipoLocalidad;
    public string $localidad;
    public string $ubigeo;

    // Cónyuge
    public string $nombreConyuge;
    public string $tipoFinanciadorConyuge;

    // Acompañante
    public string $nombreAcompaniante;
    public string $parentescoAcompaniante;

    // Madre
    public string $historiaMadre;
    public string $nombreMadre;
    public string $estadoMadre;
    public string $telefonoMadre;

    // Padre
    public string $tipoDocumentoPadre;
    public string $documentoPadre;
    public string $nombrePadre;
    public string $estadoPadre;
    public string $telefonoPadre;

    public function setHistoria(?string $historia): LegajoModel
    {
        $this->historia = $historia;
        return $this;
    }

    public function setEstadoSituacional(?string $estadoSituacional): LegajoModel
    {
        $this->estadoSituacional = $estadoSituacional;
        return $this;
    }


    public function setTipoDocumento(string $tipoDocumento): LegajoModel
    {
        $this->tipoDocumento = $tipoDocumento;
        return $this;
    }

    public function setDocumento(string $documento): LegajoModel
    {
        $this->documento = $documento;
        return $this;
    }

    public function setApellidoPaterno(string $apellidoPaterno): LegajoModel
    {
        $this->apellidoPaterno = $apellidoPaterno;
        return $this;
    }

    public function setApellidoMaterno(string $apellidoMaterno): LegajoModel
    {
        $this->apellidoMaterno = $apellidoMaterno;
        return $this;
    }

    public function setPrimerNombre(string $primerNombre): LegajoModel
    {
        $this->primerNombre = $primerNombre;
        return $this;
    }

    public function setSegundoNombre(string $segundoNombre): LegajoModel
    {
        $this->segundoNombre = $segundoNombre;
        return $this;
    }

    public function setFechaNacimiento(string $fechaNacimiento): LegajoModel
    {
        $this->fechaNacimiento = $fechaNacimiento;
        return $this;
    }

    public function setSexo(string $sexo): LegajoModel
    {
        $this->sexo = $sexo;
        return $this;
    }

    public function setEmail(string $email): LegajoModel
    {
        $this->email = $email;
        return $this;
    }

    public function setTelefono(string $telefono): LegajoModel
    {
        $this->telefono = $telefono;
        return $this;
    }

    public function setEstadoCivil(string $estadoCivil): LegajoModel
    {
        $this->estadoCivil = $estadoCivil;
        return $this;
    }

    public function setNivelInstruccion(string $nivelInstruccion): LegajoModel
    {
        $this->nivelInstruccion = $nivelInstruccion;
        return $this;
    }

    public function setOcupacion(string $ocupacion): LegajoModel
    {
        $this->ocupacion = $ocupacion;
        return $this;
    }

    public function setCentroLaboral(string $centroLaboral): LegajoModel
    {
        $this->centroLaboral = $centroLaboral;
        return $this;
    }

    public function setObservaciones(string $observaciones): LegajoModel
    {
        $this->observaciones = $observaciones;
        return $this;
    }

    public function setHoraNacimiento(string $horaNacimiento): LegajoModel
    {
        $this->horaNacimiento = $horaNacimiento;
        return $this;
    }

    public function setTipoParto(string $tipoParto): LegajoModel
    {
        $this->tipoParto = $tipoParto;
        return $this;
    }

    public function setTiempoGestacion(string $tiempoGestacion): LegajoModel
    {
        $this->tiempoGestacion = $tiempoGestacion;
        return $this;
    }

    public function setPesoNacimiento(string $pesoNacimiento): LegajoModel
    {
        $this->pesoNacimiento = $pesoNacimiento;
        return $this;
    }

    public function setLugarNacimiento(string $lugarNacimiento): LegajoModel
    {
        $this->lugarNacimiento = $lugarNacimiento;
        return $this;
    }

    public function setUbigeoNacimiento(string $ubigeoNacimiento): LegajoModel
    {
        $this->ubigeoNacimiento = $ubigeoNacimiento;
        return $this;
    }

    public function setTipoDireccion(string $tipoDireccion): LegajoModel
    {
        $this->tipoDireccion = $tipoDireccion;
        return $this;
    }

    public function setNumero(string $numero): LegajoModel
    {
        $this->numero = $numero;
        return $this;
    }

    public function setInterior(string $interior): LegajoModel
    {
        $this->interior = $interior;
        return $this;
    }

    public function setManzana(string $manzana): LegajoModel
    {
        $this->manzana = $manzana;
        return $this;
    }

    public function setLote(string $lote): LegajoModel
    {
        $this->lote = $lote;
        return $this;
    }

    public function setDireccion(string $direccion): LegajoModel
    {
        $this->direccion = $direccion;
        return $this;
    }

    public function setTipoLocalidad(string $tipoLocalidad): LegajoModel
    {
        $this->tipoLocalidad = $tipoLocalidad;
        return $this;
    }

    public function setLocalidad(string $localidad): LegajoModel
    {
        $this->localidad = $localidad;
        return $this;
    }

    public function setUbigeo(string $ubigeo): LegajoModel
    {
        $this->ubigeo = $ubigeo;
        return $this;
    }

    public function setNombreConyuge(string $nombreConyuge): LegajoModel
    {
        $this->nombreConyuge = $nombreConyuge;
        return $this;
    }

    public function setTipoFinanciadorConyuge(string $tipoFinanciadorConyuge): LegajoModel
    {
        $this->tipoFinanciadorConyuge = $tipoFinanciadorConyuge;
        return $this;
    }

    public function setNombreAcompaniante(string $nombreAcompaniante): LegajoModel
    {
        $this->nombreAcompaniante = $nombreAcompaniante;
        return $this;
    }

    public function setParentescoAcompaniante(string $parentescoAcompaniante): LegajoModel
    {
        $this->parentescoAcompaniante = $parentescoAcompaniante;
        return $this;
    }

    public function setHistoriaMadre(string $historiaMadre): LegajoModel
    {
        $this->historiaMadre = $historiaMadre;
        return $this;
    }

    public function setNombreMadre(string $nombreMadre): LegajoModel
    {
        $this->nombreMadre = $nombreMadre;
        return $this;
    }

    public function setEstadoMadre(string $estadoMadre): LegajoModel
    {
        $this->estadoMadre = $estadoMadre;
        return $this;
    }

    public function setTelefonoMadre(string $telefonoMadre): LegajoModel
    {
        $this->telefonoMadre = $telefonoMadre;
        return $this;
    }

    public function setTipoDocumentoPadre(string $tipoDocumentoPadre): LegajoModel
    {
        $this->tipoDocumentoPadre = $tipoDocumentoPadre;
        return $this;
    }

    public function setDocumentoPadre(string $documentoPadre): LegajoModel
    {
        $this->documentoPadre = $documentoPadre;
        return $this;
    }

    public function setNombrePadre(string $nombrePadre): LegajoModel
    {
        $this->nombrePadre = $nombrePadre;
        return $this;
    }


    public function setEstadoPadre(string $estadoPadre): LegajoModel
    {
        $this->estadoPadre = $estadoPadre;
        return $this;
    }

    public function setTelefonoPadre(string $telefonoPadre): LegajoModel
    {
        $this->telefonoPadre = $telefonoPadre;
        return $this;
    }


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
        $smtp = $this->conexion->getPdo()->prepare(/** @lang SQL */ 'EXEC dbo.lg_sp_listar_empleados ?,?,?,?,?,?,?,?,?');
        $smtp->bindParam(1, $params->documento);
        $smtp->bindParam(2, $params->apPaterno);
        $smtp->bindParam(3, $params->apMaterno);
        $smtp->bindParam(4, $params->priNombre);
        $smtp->bindParam(5, $params->segNombre);
        $smtp->bindParam(6, $params->unidadOrganica);
        $smtp->bindParam(7, $params->serviciosEquipos);
        $smtp->bindParam(8, $params->longitud);
        $smtp->bindParam(9, $params->pagina);
        $smtp->execute();
        $resultados = $smtp->columnCount() > 0 ? $smtp->fetchAll(PDO::FETCH_ASSOC) : [];
        $smtp->closeCursor();
        return $resultados;
    }

    public function listarHistoriaXNombres(string $appPaterno, string $appMaterno, string $nomPrimer, string $nomSegundo,
                                           string $estado, int $pagina, int $longitud): array
    {
        return $this->conexion->select('EXEC dbo_web.fil_sp_lst_x_nombres_rm_hclinica ?,?,?,?,?,?,?,?',
            [$appPaterno, $appMaterno, $nomPrimer, $nomSegundo, 1, $estado, $longitud, $pagina]);
    }

   
   
}
