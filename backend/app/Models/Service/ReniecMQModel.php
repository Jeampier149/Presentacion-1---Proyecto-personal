<?php

namespace App\Models\Service;

use Illuminate\Support\Facades\DB;
use PDO;
use SoapClient;
use SoapFault;
use SoapHeader;

class ReniecMQModel
{
    private string|null $fuente;
    private string|null $codigoRespuesta;
    private string|null $mensajeRespuesta;
    private string|null $numDNI;
    private string|null $digVerificacion;
    private string|null $apellidoPat;
    private string|null $apellidoMat;
    private string|null $apellidoCas;
    private string|null $nombres;
    private string|null $ubiDomContinente;
    private string|null $domContinente;
    private string|null $ubiDomPais;
    private string|null $domPais;
    private string|null $ubiDomDepartamento;
    private string|null $domDepartamento;
    private string|null $ubiDomProvincia;
    private string|null $domProvincia;
    private string|null $ubiDomDistrito;
    private string|null $domDistrito;
    private string|null $ubiDomLocalidad;
    private string|null $domLocalidad;
    private string|null $estadoCivil;
    private string|null $gradoInstruccion;
    private string|null $sexo;
    private string|null $ubiNacDepartamento;
    private string|null $nacDepartamento;
    private string|null $ubiNacProvincia;
    private string|null $nacProvincia;
    private string|null $ubiNacDistrito;
    private string|null $nacDistrito;
    private string|null $fechaNacimiento;
    private string|null $nombrePadre;
    private string|null $nombreMadre;
    private string|null $fechaInscripcion;
    private string|null $fechaExpedicion;
    private string|null $restriccion;
    private string|null $prefijoDir;
    private string|null $direccion;
    private string|null $numDireccion;
    private string|null $block;
    private string|null $prefijoBlock;
    private string|null $interior;
    private string|null $urbanizacion;
    private string|null $etapa;
    private string|null $manzana;
    private string|null $lote;
    private string|null $prefijoDep;
    private string|null $prefijoUrb;
    private string|null $foto;
    private string|null $firma;

    public function getMensajeError(): string
    {
        return $this->mensajeRespuesta ?? '';
    }

    public function __construct()
    {

    }

    /**
     * Consulta de datos del DNI en local o al servicio
     * @param string $dni DNI Buscado
     * @param int $tipo 1: Datos básico 2: Datos Completos
     * @param string $modulo Módulo que realiza la petición
     * @return bool Devuelve true si la consulta fue exitosa
     */
    public function busquedaDNI(string $dni, int $tipo, string $modulo): bool
    {
        $response = $this->consultaLocal($dni, $tipo);
         if (!$response) {
            if ($tipo === 2) {
                return $this->consultaCompletaServicio($dni, $modulo);
            } else {
                return $this->consultaBasicaServicio($dni, $modulo);
            }
         }
        return true;
    }

    /**
     * Consulta de datos básicos en LOCAL
     * @param string $dni
     * @param int $tipo 1: Simple 2: Completa
     * @return bool
     */
    public function consultaLocal(string $dni, int $tipo): bool
    {
        $smtp = DB::connection('personal')
            ->getPdo()->prepare(/** @lang SQL */ 'EXEC dbo.gral_sp_get_rm_consultas_dni ?,?');
        $smtp->bindParam(1, $dni);
        $smtp->bindValue(2, $tipo, PDO::PARAM_INT);
        $smtp->execute();
        $resultados = $smtp->columnCount() > 0 ? $smtp->fetch(PDO::FETCH_ASSOC) : [];
        $smtp->closeCursor();
        if (!$resultados) {
            return false;
        }
        if ($tipo === 2) {
            $this->digVerificacion = $resultados['CODIGO_VER'];
            $this->gradoInstruccion = $resultados['GRADO_INSTRU'];
            $this->estadoCivil = $resultados['ESTADO_CIVIL'];
            $this->ubiNacDepartamento = $resultados['UBI_NAC_DEP'];
            $this->ubiNacProvincia = $resultados['UBI_NAC_DEP'];
            $this->ubiNacDistrito = $resultados['UBI_NAC_DIS'];
            $this->nacDepartamento = $resultados['DEPARTAMENTO_NAC'];
            $this->nacProvincia = $resultados['PROVINCIA_NAC'];
            $this->nacDistrito = $resultados['DISTRITO_NAC'];
            $this->nombrePadre = $resultados['PADRE'];
            $this->nombreMadre = $resultados['MADRE'];
            $this->restriccion = $resultados['RESTRICCION'];
            $this->prefijoDir = $resultados['PREF_DIRECCION'];
            $this->numDireccion = $resultados['NRO_DIRECCION'];
            $this->prefijoBlock = $resultados['PREF_BLOCK'];
            $this->block = $resultados['BLOCK'];
            $this->interior = $resultados['INTERIOR'];
            $this->urbanizacion = $resultados['URBANIZACION'];
            $this->etapa = $resultados['ETAPA'];
            $this->manzana = $resultados['MANZANA'];
            $this->lote = $resultados['LOTE'];
            $this->prefijoDep = $resultados['PREF_DEPARTAMENTO'];
            $this->prefijoUrb = $resultados['PREF_URBANIZACION'];
            $this->fechaInscripcion = $resultados['FECHA_INSCRIPCION'];
            $this->foto = $resultados['IMG_FOTO'];
            $this->firma = $resultados['IMG_FIRMA'];
        }
        $this->apellidoPat = $resultados['APP'];
        $this->apellidoMat = $resultados['APM'];
        $this->apellidoCas = $resultados['APC'];
        $this->nombres = $resultados['NOMBRES'];
        $this->ubiDomContinente = $resultados['UBI_CONTINENTE'];
        $this->ubiDomPais = $resultados['UBI_PAIS'];
        $this->ubiDomDepartamento = $resultados['UBI_DEP'];
        $this->ubiDomProvincia = $resultados['UBI_PRO'];
        $this->ubiDomDistrito = $resultados['UBI_DIS'];
        $this->ubiDomLocalidad = $resultados['UBI_LOC'];
        $this->domContinente = $resultados['CONTINENTE'];
        $this->domPais = $resultados['PAIS'];
        $this->domDepartamento = $resultados['DEPARTAMENTO'];
        $this->domProvincia = $resultados['PROVINCIA'];
        $this->domDistrito = $resultados['DISTRITO'];
        $this->domLocalidad = $resultados['LOCALIDAD'];
        $this->direccion = $resultados['DIRECCION'];
        $this->sexo = $resultados['GENERO'];
        $this->fechaNacimiento = $resultados['FECHA_NACIMIENTO'];
        $this->fechaExpedicion = $resultados['FECHA_EMISION'];
        $this->numDNI = $resultados['DNI'];
        $this->fuente = 'LOCAL';
        return true;

    }

    /**
     *  Consulta de datos completa en RENIEC y se guarda en el log de consultas
     * @param $dni
     * @param $modulo
     * @return bool Devuelve true si es correcto
     */
    public function consultaCompletaServicio($dni, $modulo): bool
    {
        $client = $this->conexionSOAP();
        $parametros = [
            'nrodoc' => $dni
        ];
        if (!$client instanceof SoapClient) {
            $this->mensajeRespuesta = 'No se pudo conectar con el servicio de RENIEC.';
//            $this->mensajeRespuesta = $client;
            return false;
        }
        $response = $client->obtenerDatosCompletos($parametros);
        $datos = $response->obtenerDatosCompletosResult->string;
        $this->codigoRespuesta = trim($datos[0]);
        $this->mensajeRespuesta = $this->getError($datos[0]);
        if ($this->codigoRespuesta !== '0000') {
            return false;
        }
        $this->numDNI = $datos[2];
        $this->digVerificacion = $datos[3];
        $this->apellidoPat = $datos[4];
        $this->apellidoMat = $datos[5];
        $this->apellidoCas = $datos[6];
        $this->nombres = $datos[7];
        $this->ubiDomContinente = $datos[8];
        $this->ubiDomPais = $datos[9];
        $this->ubiDomDepartamento = $datos[10];
        $this->ubiDomProvincia = $datos[11];
        $this->ubiDomDistrito = $datos[12];
        $this->ubiDomLocalidad = $datos[13];
        $this->domContinente = $datos[14];
        $this->domPais = $datos[15];
        $this->domDepartamento = $datos[16];
        $this->domProvincia = $datos[17];
        $this->domDistrito = $datos[18];
        $this->domLocalidad = $datos[19];
        $this->estadoCivil = $datos[20];
        $this->gradoInstruccion = $datos[21];
        $this->sexo = $datos[22];
        $this->ubiNacDepartamento = $datos[23];
        $this->ubiNacProvincia = $datos[24];
        $this->ubiNacDistrito = $datos[25];
        $this->nacDepartamento = $datos[26];
        $this->nacProvincia = $datos[27];
        $this->nacDistrito = $datos[28];
        $this->fechaNacimiento = $datos[29];
        $this->nombrePadre = $datos[30];
        $this->nombreMadre = $datos[31];
        $this->fechaInscripcion = $datos[32];
        $this->fechaExpedicion = $datos[33];
        $this->restriccion = $datos[34];
        $this->prefijoDir = $datos[35];
        $this->direccion = $datos[36];
        $this->numDireccion = $datos[37];
        $this->block = $datos[38];
        $this->prefijoBlock = $datos[39];
        $this->interior = $datos[40];
        $this->urbanizacion = $datos[41];
        $this->etapa = $datos[42];
        $this->manzana = $datos[43];
        $this->lote = $datos[44];
        $this->prefijoDep = $datos[45];
        $this->prefijoUrb = $datos[46];
        $this->foto = base64_decode($datos[47]);
        $this->firma = base64_decode($datos[48]);
        $this->fuente = 'EN LINEA';

        // Guardar en la base de datos
        $this->guardarDatosEnLocal($modulo);

        $this->foto = $datos[47];
        $this->firma = $datos[48];
        return true;
    }

    private function conexionSOAP(): SoapClient|string
    {
        try {
            $wsdl = "https://wsvmin.minsa.gob.pe/wsreniecmq/serviciomq.asmx?wsdl";
            $options = [
                'trace' => true,      // Muestra la solicitud y respuesta
                'exceptions' => true, // Maneja excepciones de SOAP
                'soap_version' => SOAP_1_2 // Especifica la versión SOAP 1.2 (SOAP 1.2 = 2003)
            ];
            $credenciales = [
                'app' => 'HDMNSB',
                'usuario' => '08300783',
                'clave' => 'H@94%F1qs?'
            ];
            $header = new SoapHeader('http://tempuri.org/', 'Credencialmq', $credenciales);
            $client = new SoapClient($wsdl, $options);
            $client->__setSoapHeaders($header);
            return $client;
        } catch (SoapFault $e) {
            return $e->getMessage();
        }
    }

    private function getError(string $codigo): string
    {
        return match ($codigo) {
            '0000' => 'SIN NINGUN ERROR',
            '5002' => 'VERSION INVALIDAD',
            '5003' => 'LONGITUD DE CABECERA INVALIDA',
            '5004' => 'CARACTERES DE VERIFICACION INCORRECTOS',
            '5008' => 'SERVIDOR NO VALIDO',
            '5009' => 'TIPO DE CONSULTA INVALIDO',
            '5010' => 'TIPO DE CONSULTA NO PERMITIDA',
            '5011' => 'NO SE HA INGRESADO SUBTIPO DE CONSULTA',
            '5020' => 'NO EXISTE LA EMPRESA INGRESADA PARA USAR EL SERVICIO',
            '5021' => 'LA EMPRESA REGISTRADA NO ESTA HABILITADA PARA USAR EL SERVICIO',
            '5030' => 'EL USUARIO FINAL DE CONSULTA INGRESADO NO ES VALIDO',
            '5031' => 'NO SE TIENE LA INFORMACION SOLICITADA DEL USUARIO INGRESADO',
            '5032' => 'EL DNI NO PUEDE REALIZAR CONSULTAS POR ENCONTRARSE CANCELADO EN EL RUIPN',
            '5033' => 'EL DNI NO PUEDE REALIZAR CONSULTAS POR ENCONTRARSE RESTRINGIDO EN EL RUIPN',
            '5034' => 'EL DNI NO PUEDE REALIZAR CONSULTAS POR ENCONTRARSE OBSERVADO EN EL RUIPN',
            '5036' => 'EL DNI SE ENCUENTRA DE BAJA TEMPORAL EN EL SERVICIO',
            '5037' => 'EL DNI SE ENCUENTRA DE BAJA DEFINITIVA EN EL SERVICIO',
            '5100' => 'LONGITUD DE TRAMA DE CONSULTA INVALIDA',
            '5101' => 'ERROR EN NUMERO DE COINCIDENCIAS SOLICITADAS O INICIO DE GRUPO',
            '5102' => 'COINCIDENCIA SUPERAN EL LIMITE ESTABLECIDO',
            '5103' => 'ERROR EN LA BASE DE DATOS',
            '5104' => 'NO SE ENCONTRO LA INFORMACION DE LA ESTRUCTURA SOLICITADA',
            '5105' => 'NO SE ENCONTRO LOS CAMPOS A MOSTRAR PARA LA ESTRUCTURA SOLICITADA',
            '5108' => 'CARACTER INGRESADO EN APELLIDO PATERNO ES INVALIDO',
            '5109' => 'CARACTER INGRESADO EN APELLIDO MATERNO ES INVALIDO',
            '5110' => 'CARACTER INGRESADO EN NOMBRE ES INVALIDO',
            '5111' => 'EL DNI SOLICITADO SE ENCUENTRA CANCELADO EN EL ARCHIVO MAGNETICO DEL RUIPN',
            '5112' => 'EL DNI SOLICITADO SE ENCUENTRA RESTRINGIDO EN EL ARCHIVO MAGNETICO DEL RUIPN',
            '5113' => 'EL DNI SOLICITADO SE ENCUENTRA OBSERVADO EN EL ARCHIVO MAGNETICO DEL RUIPN',
            '5114' => 'EL DNI INGRESADO NO ES VALIDO O EL DNI INGRESADO ES DE UN MENOR DE EDAD',
            '5200' => 'NO EXISTEN LOS DATOS SOLICITADOS',
            '8000' => 'PROBLEMAS DE COMUNICACION DE MQ ENTRE EL MINSA Y RENIEC, NOTIFICAR AL ADMINISTRADOR DE MQ DE MINSA',
            '8100' => 'PROBLEMAS CON EL MQ DE MINSA, NOTIFICAR AL ADMINISTRADOR MQ',
            '9991' => 'ERROR EN LOS DATOS DE AUTENTICACION, REVISAR LOS DATOS ENVIADOS',
            '9992' => 'HAY RESTRICCIONES EN EL HORARIO EN ENVIO, CONSULTAR CON EL ADMINISTRADOR DEL WEBSERVICE',
            '9993' => 'SE ALCANZO LA CANTIDAD MAXIMA DE INVOCACIONES POR DIA, CONSULTAR CON EL ADMINISTRADO DEL WEBSERVICE',
            '9994' => 'ERROR EN EL DNI DEL USUARIO AUTORIZADOR, CONSULTAR CON EL ADMINISTRADOR DEL WEBSERVICE',
            '9999' => 'ERROR INTERNO, NOTIFICAR AL ADMINISTRADOR DE SERVIDORES DEL MINSA',
            default => 'ERROR NO IDENTIFICADO'
        };
    }

    /**
     * @param string $modulo Módulo de la aplicación
     * @return void
     */
    private function guardarDatosEnLocal(string $modulo): void
    {
        $request = \request()->user();
        $usuario = 'SIN USUARIO';
        $perfil = 'SIN PERFIL';
        if ($request) {
            $usuario = $request->xg_Cod_Usuario;
            $perfil = $request->xg_Cod_Perfil;
        }
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'];
        $equipo = strtoupper(preg_replace('/(.sbdomain.local)/', "", gethostbyaddr($ip)));
        $url = $_SERVER["HTTP_REFERER"] ?? $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"];

        $smtp = DB::connection('sighos')
            ->getPdo()->prepare(/** @lang SQL */ 'EXEC dbo.gral_sp_insupd_rm_consultas_dni ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?');
        $smtp->bindParam(1, $this->numDNI);
        $smtp->bindParam(2, $this->digVerificacion);
        $smtp->bindParam(3, $this->codigoRespuesta);
        $smtp->bindParam(4, $this->mensajeRespuesta);
        $smtp->bindParam(5, $this->apellidoPat);
        $smtp->bindParam(6, $this->apellidoMat);
        $smtp->bindParam(7, $this->apellidoCas);
        $smtp->bindParam(8, $this->nombres);
        $smtp->bindParam(9, $this->estadoCivil);
        $smtp->bindParam(10, $this->gradoInstruccion);
        $smtp->bindParam(11, $this->ubiDomContinente);
        $smtp->bindParam(12, $this->domContinente);
        $smtp->bindParam(13, $this->ubiDomPais);
        $smtp->bindParam(14, $this->domPais);
        $smtp->bindParam(15, $this->ubiDomDepartamento);
        $smtp->bindParam(16, $this->domDepartamento);
        $smtp->bindParam(17, $this->ubiDomProvincia);
        $smtp->bindParam(18, $this->domProvincia);
        $smtp->bindParam(19, $this->ubiDomDistrito);
        $smtp->bindParam(20, $this->domDistrito);
        $smtp->bindParam(21, $this->ubiDomLocalidad);
        $smtp->bindParam(22, $this->domLocalidad);
        $smtp->bindParam(23, $this->prefijoDir);
        $smtp->bindParam(24, $this->direccion);
        $smtp->bindParam(25, $this->numDireccion);
        $smtp->bindParam(26, $this->block);
        $smtp->bindParam(27, $this->prefijoBlock);
        $smtp->bindParam(28, $this->interior);
        $smtp->bindParam(29, $this->urbanizacion);
        $smtp->bindParam(30, $this->etapa);
        $smtp->bindParam(31, $this->manzana);
        $smtp->bindParam(32, $this->lote);
        $smtp->bindParam(33, $this->prefijoDep);
        $smtp->bindParam(34, $this->prefijoUrb);
        $smtp->bindParam(35, $this->ubiNacDepartamento);
        $smtp->bindParam(36, $this->nacDepartamento);
        $smtp->bindParam(37, $this->ubiNacProvincia);
        $smtp->bindParam(38, $this->nacProvincia);
        $smtp->bindParam(39, $this->ubiNacDistrito);
        $smtp->bindParam(40, $this->nacDistrito);
        $smtp->bindParam(41, $this->sexo);
        $smtp->bindParam(42, $this->fechaNacimiento);
        $smtp->bindParam(43, $this->fechaExpedicion);
        $smtp->bindParam(44, $this->fechaInscripcion);
        $smtp->bindParam(45, $this->nombrePadre);
        $smtp->bindParam(46, $this->nombreMadre);
        $smtp->bindParam(47, $this->restriccion);
        $smtp->bindParam(48, $this->foto, PDO::PARAM_LOB | PDO::PARAM_NULL, 0, PDO::SQLSRV_ENCODING_BINARY);
        $smtp->bindParam(49, $this->firma, PDO::PARAM_LOB | PDO::PARAM_NULL, 0, PDO::SQLSRV_ENCODING_BINARY);
        $smtp->bindValue(50, 'SISPER WEB');
        $smtp->bindParam(51, $ip);
        $smtp->bindParam(52, $url);
        $smtp->bindParam(53, $modulo);
        $smtp->bindParam(54, $usuario);
        $smtp->bindParam(55, $perfil);
        $smtp->bindParam(56, $equipo);
        $smtp->execute();
        $smtp->closeCursor();
    }

    /**
     * Consulta de datos básica en RENIEC y se guarda en el log de consultas
     * @param $dni
     * @param $modulo
     * @return bool Devuelve true si es correcto
     */
    public function consultaBasicaServicio($dni, $modulo): bool
    {
        $client = $this->conexionSOAP();
        $parametros = [
            'nrodoc' => $dni
        ];
        if (!$client instanceof SoapClient) {
//            $this->mensajeRespuesta = $client;
            $this->mensajeRespuesta = 'No se pudo conectar con el servicio de RENIEC.';
            return false;
        }
        $response = $client->obtenerDatosBasicos($parametros);
        $datos = $response->obtenerDatosBasicosResult->string;
        $this->codigoRespuesta = trim($datos[0]);
        $this->mensajeRespuesta = $this->getError($datos[0]);
        if ($this->codigoRespuesta !== '0000') {
            return false;
        }
        $this->apellidoPat = $datos[2];
        $this->apellidoMat = $datos[3];
        $this->apellidoCas = $datos[4];
        $this->nombres = $datos[5];
        $this->ubiDomContinente = $datos[6];
        $this->ubiDomPais = $datos[7];
        $this->ubiDomDepartamento = $datos[8];
        $this->ubiDomProvincia = $datos[9];
        $this->ubiDomDistrito = $datos[10];
        $this->ubiDomLocalidad = $datos[11];
        $this->domContinente = $datos[12];
        $this->domPais = $datos[13];
        $this->domDepartamento = $datos[14];
        $this->domProvincia = $datos[15];
        $this->domDistrito = $datos[16];
        $this->domLocalidad = $datos[17];
        $this->direccion = $datos[18];
        $this->sexo = $datos[19];
        $this->fechaNacimiento = $datos[20];
        $this->fechaExpedicion = $datos[21];
        $this->numDNI = $datos[22];
        $this->fuente = 'EN LINEA';

        // Guardar en la base de datos
        $this->guardarDatosEnLocal($modulo);

        return true;
    }

    public function toArray(): array
    {
        $datos = [];
        $datos['modo'] = $this->fuente;
        $datos['dni'] = $this->numDNI;
        if (isset($this->digVerificacion)) {
            $datos['digitoVer'] = $this->digVerificacion;
        }
        $datos['appPaterno'] = $this->apellidoPat;
        $datos['appMaterno'] = $this->apellidoMat;
        $datos['appCasado'] = $this->apellidoCas;
        $datos['nombres'] = $this->nombres;
        $datos['ubiContinente'] = $this->ubiDomContinente;
        $datos['ubiPais'] = $this->ubiDomPais;
        $datos['ubiDepartamento'] = $this->ubiDomDepartamento;
        $datos['ubiProvincia'] = $this->ubiDomProvincia;
        $datos['ubiDistrito'] = $this->ubiDomDistrito;
        $datos['ubiLocalidad'] = $this->ubiDomLocalidad;
        $datos['continente'] = $this->domContinente;
        $datos['pais'] = $this->domPais;
        $datos['departamento'] = $this->domDepartamento;
        $datos['provincia'] = $this->domProvincia;
        $datos['distrito'] = $this->domDistrito;
        $datos['localidad'] = $this->domLocalidad;
        $datos['sexo'] = $this->sexo;
        if (isset($this->estadoCivil)) {
            $datos['estadoCivil'] = $this->estadoCivil;
        }
        if (isset($this->gradoInstruccion)) {
            $datos['gradoInstruccion'] = $this->gradoInstruccion;
        }
        if (isset($this->ubiNacDepartamento)) {
            $datos['ubiNacDepartamento'] = $this->ubiNacDepartamento;
        }
        if (isset($this->ubiNacProvincia)) {
            $datos['ubiNacProvincia'] = $this->ubiNacProvincia;
        }
        if (isset($this->ubiNacDistrito)) {
            $datos['ubiNacDistrito'] = $this->ubiNacDistrito;
        }
        if (isset($this->nacDepartamento)) {
            $datos['departamentoNac'] = $this->nacDepartamento;
        }
        if (isset($this->nacProvincia)) {
            $datos['provinciaNac'] = $this->nacProvincia;
        }
        if (isset($this->nacDistrito)) {
            $datos['distritoNac'] = $this->nacDistrito;
        }
        if (isset($this->fechaNacimiento)) {
            $datos['fechaNacimiento'] = $this->fechaNacimiento;
        }
        if (isset($this->fechaInscripcion)) {
            $datos['fechaInscripcion'] = $this->fechaInscripcion;
        }
        if (isset($this->fechaExpedicion)) {
            $datos['fechaExpedicion'] = $this->fechaExpedicion;
        }
        if (isset($this->restriccion)) {
            $datos['restriccion'] = $this->restriccion;
        }
        if (isset($this->nombrePadre)) {
            $datos['nombrePadre'] = $this->nombrePadre;
        }
        if (isset($this->nombreMadre)) {
            $datos['nombreMadre'] = $this->nombreMadre;
        }
        if (isset($this->prefijoDir)) {
            $datos['prefDireccion'] = $this->prefijoDir;
        }
        if (isset($this->direccion)) {
            $datos['direccion'] = $this->direccion;
        }
        if (isset($this->numDireccion)) {
            $datos['nroDireccion'] = $this->numDireccion;
        }
        if (isset($this->prefijoBlock)) {
            $datos['prefBlock'] = $this->prefijoBlock;
        }
        if (isset($this->block)) {
            $datos['block'] = $this->block;
        }
        if (isset($this->interior)) {
            $datos['interior'] = $this->interior;
        }
        if (isset($this->urbanizacion)) {
            $datos['urbanizacion'] = $this->urbanizacion;
        }
        if (isset($this->etapa)) {
            $datos['etapa'] = $this->etapa;
        }
        if (isset($this->manzana)) {
            $datos['manzana'] = $this->manzana;
        }
        if (isset($this->lote)) {
            $datos['lote'] = $this->lote;
        }
        if (isset($this->prefijoDep)) {
            $datos['prefDepartamento'] = $this->prefijoDep;
        }
        if (isset($this->prefijoUrb)) {
            $datos['prefUrbanizacion'] = $this->prefijoUrb;
        }
        if (isset($this->foto)) {
            $datos['foto'] = $this->foto;
        }
        if (isset($this->firma)) {
            $datos['firma'] = $this->firma;
        }
        return $datos;
    }
}
