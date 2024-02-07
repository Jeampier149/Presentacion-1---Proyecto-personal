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
        $smtp = $this->conexion->getPdo()->prepare(/** @lang SQL */ 'EXEC dbo.lg_sp_listar_empleados ?,?,?,?,?,?,?,?');
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

   
   
   
}
