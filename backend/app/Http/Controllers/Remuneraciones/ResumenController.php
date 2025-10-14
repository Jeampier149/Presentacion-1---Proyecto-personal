 <?php
/** 
namespace App\Http\Controllers\Remuneraciones;

use App\Http\Controllers\Controller;
use App\Models\Remuneraciones\ResumenModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class ResumenController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }
    public function listarResumen(Request $request): JsonResponse
    {

        $validacion = Validator::make($request->only([
            'mes', 'year', 'fecha', 'pagina', 'longitud'
        ]), [
            'mes' => 'nullable|string',
            'year' => 'nullable|string',
            'fecha' => 'nullable|string',
            'pagina' => 'required|integer',
            'longitud' => 'required|integer',

        ]);

        if ($validacion->fails()) {
            return $this->sendResponse(200, false, 'Error de validación', $validacion->errors());
        }

        $evalModel = new ResumenModel();
        $documento = $request->get('documento') ?? '';
        $desDocumento = $request->get('desDocumento') ?? '';
        $tipo = $request->get('tipo') ?? '';
        $asunto = $request->get('asunto') ?? '';
        $fecha = $request->get('fecha') ?? '';
        $dni = $request->get('dni') ?? '';
        $pagina = $request->get('pagina');
        $longitud = $request->get('longitud');
        $resultado = $evalModel->listarEvaluaciones($documento,$desDocumento,$tipo,$asunto,$fecha,$dni,$pagina,$longitud);
        
        return $this->sendResponse(200, true, '', $resultado);
    }
    public function obtenerEvaluacion(Request $request){
        $id=$request->post('id');
        $empleado=new ResumenModel();
        $resultado=$empleado->obtenerEvaluacion($id);
        return $this->sendResponse(200, true, '', $resultado);
    }

    public function generarResumen(Request $request): JsonResponse{
       // [$usuario, $perfil, $equipo] = $this->getHost($request);
         $datos = json_decode($request->post('datos'), true);

         if ($request->hasFile('archivo')) {
         
            // $ruta = $datos['ruta'];
            // $sbn=explode('/',$ruta)[2];
            $mes=$datos['mes'];
            $year=$datos['year'];
            $validacion = Validator::make($request->all(), [
                'fileplh' => 'required|file|mimes:xlsx,xls',
                'year' => 'required|integer',
                'month' => 'required|integer',
            ]);
    
            if ($validacion->fails()) {
                return $this->sendResponse(200, false, 'Error de validación', $validacion->errors());
            }
    
            $file = $request->file('archivo');
            $path = $file->getPathname();

    
            $doc = IOFactory::load($path);
            $hojaActual = $doc->getSheet(0);
            $numFilas = $hojaActual->getHighestDataRow();
            $letra = $hojaActual->getHighestColumn();
            $numLetra = Coordinate::columnIndexFromString($letra);
            $header = '';
            $matriz = [];
    
            for ($indiceFila = 1; $indiceFila <= $numFilas; $indiceFila++) {
                $fila = '';
                for ($indiceColumna = 1; $indiceColumna <= $numLetra; $indiceColumna++) {
                    $datoCelda = $hojaActual->getCellByColumnAndRow($indiceColumna, $indiceFila);
                    if ($indiceColumna <= $numLetra && $indiceFila == 1) {
                        $header .= $datoCelda . ',';
                    }
                    if ($indiceFila != 1) {
                        if ($datoCelda == '') {
                            $datoCelda = 0;
                        }
                        $fila .= $datoCelda . ',';
                        if ($indiceColumna == $numLetra) {
                            array_push($matriz, $fila);
                        }
                    }
                }
            }
    
            $header = rtrim($header, ',');
            $header = explode(',', $header);
            $table = 'CREATE TABLE plh (';
            $c = 0;
            foreach ($header as $head) {
                if ($c < 34) {
                    $table .= $head . ' VARCHAR(255),';
                } else {
                    $table .= $head . ' DECIMAL(8,2),';
                }
                $c++;
            }
            $table = rtrim($table, ',');
            $table .= ') ENGINE=INNODB;';
    
            DB::statement('DROP TABLE IF EXISTS plh');
            DB::statement($table);
    
            $limit = $numLetra - 1;
            $insert = 'INSERT INTO plh VALUES '; 
    
            foreach ($matriz as $mat) {
                $mat = rtrim($mat, ',');
                $mat = explode(',', $mat);
                $a = 0;
                $values = '(';
                foreach ($mat as $m) {
                    if ($a < 34) {
                        $values .= '"' . $m . '",';
                    } else {
                        $values .= $m . ',';
                    }
                    $a++;
                }
                $values = rtrim($values, ',') . '),';
                $insert .= $values;
            }
            $insert = rtrim($insert, ',');
    
            DB::statement($insert);
            $resultado=$this->crearResumen($mes,$year);
            return $resultado;

         }
         print "no hay archivo";
         return 'No se encontro ningun archivo';
        
     }
     protected function funcFind1($con1, $con2, $tipopla, $condic)
     {
         // Obtener la suma del primer campo
         $c1 = DB::table('plh')
                   ->where('TIPOPLA', $tipopla)
                   ->where('CONDIC', $condic)
                   ->sum($con1);
 
         // Obtener todas las columnas de la tabla plh
         $columns = DB::getSchemaBuilder()->getColumnListing('plh');
 
         if (in_array($con2, $columns)) {
             // Obtener la suma del segundo campo si existe
             $c2 = DB::table('plh')
                       ->where('TIPOPLA', $tipopla)
                       ->where('CONDIC', $condic)
                       ->sum($con2);
 
             return $c2 + $c1;
         } else {
             return $c1;
         }
     }


    protected function funcFind2($con1, $con2, $codniv)
    {
        // Obtener la suma de $con1
        $c1 = DB::table('plh')
            ->where('CODNIV', $codniv)
            ->sum($con1);

        // Obtener todas las columnas de la tabla 'plh'
        $columns = DB::select('SELECT COLUMN_NAME AS c FROM information_schema.columns WHERE table_schema = ? AND table_name = ?', ['of_personal', 'plh']);
        
        // Convertir las columnas en un array simple
        $columnNames = array_map(function($column) {
            return $column->c;
        }, $columns);

        // Verificar si $con2 existe en las columnas
        if (in_array($con2, $columnNames)) {
            // Obtener la suma de $con2
            $c2 = DB::table('plh')
                ->where('CODNIV', $codniv)
                ->sum($con2);

            return $c2 + $c1;
        } else {
            return $c1;
        }
    }

    protected function funcFind3($con, $tipopla, $condic)
    {
        // Obtener todas las columnas de la tabla plh
        $columns = DB::getSchemaBuilder()->getColumnListing('plh');

        if (in_array($con, $columns)) {
            // Obtener la suma del campo especificado si existe
            $c = DB::table('plh')
                    ->where('TIPOPLA', $tipopla)
                    ->where('CONDIC', $condic)
                    ->sum($con);

            return $c;
        } else {
            return 0;
        }
    }
    protected function funcFind4($con1, $con2)
    {
        // Obtener todas las columnas de la tabla plh
        $columns = DB::getSchemaBuilder()->getColumnListing('plh');

        $c1 = 0;
        if (in_array($con1, $columns)) {
            // Obtener la suma del primer campo si existe
            $c1 = DB::table('plh')
                  ->sum($con1);
        }

        if (in_array($con2, $columns)) {
            // Obtener la suma del segundo campo si existe
            $c2 = DB::table('plh')
                ->sum($con2);

            return $c2 + $c1;
        } else {
            return $c1;
        }
    }
 

   protected function crearResumen($mes,$year){

        $fieldAA = $this->funcFind4('C1054', 'C1154');
        
        $fieldZ = $this->funcFind4('C1056', 'C1156');
        $fieldY = $this->funcFind1('C1025', 'C1125', '2', '1') + $this->funcFind1('C1025', 'C1125', '4', '1');
        $fieldX = $this->funcFind1('C1029', 'C1129', '2', '1') + $this->funcFind1('C1029', 'C1129', '4', '1');
        $fieldT = $this->funcFind1('C1011', 'C1111', '1', '1') + $this->funcFind1('C1011', 'C1111', '3', '1');
        $fieldU = $this->funcFind1('C1012', 'C1112', '1', '1') + $this->funcFind1('C1012', 'C1112', '3', '1');
        $fieldV = $this->funcFind1('C1029', 'C1129', '1', '1') + $this->funcFind1('C1029', 'C1129', '3', '1');
        $fieldW = $this->funcFind1('C1032', 'C1132', '1', '1') + $this->funcFind1('C1032', 'C1132', '3', '1');
        
        $fieldS = $this->funcFind4('C1047', 'C1147');
        $fieldR = $this->funcFind1('C1002', 'C1102', '4', '1');
        $fieldQ = $this->funcFind1('C1001', 'C1101', '4', '1');
        $fieldO = $this->funcFind1('C1001', 'C1101', '2', '1');   
        $fieldP = $this->funcFind1('C1002', 'C1102', '2', '1');
        $fieldN = $this->funcFind1('C1002', 'C1102', '3', '1');
        $fieldM = $this->funcFind1('C1001', 'C1101', '3', '1');
        $fieldL = $this->funcFind1('C1002', 'C1102', '1', '1');
        $fielnI = $this->funcFind3('C1151', '1', '1');
        $fieldK = $this->funcFind1('C1001', 'C1101', '1', '1');
        $fieldJ = $this->funcFind2('C1083', 'C1183', 'C3')+$this->funcFind2('C1084', 'C1184', 'C3')+$this->funcFind2('C1088', 'C1188', 'C3');
        $fieldI = $this->funcFind2('C1080', 'C1082', 'C3');
        $fieldH = $this->funcFind1('C1083', 'C1183', '4', '2') +$this->funcFind1('C1084', 'C1184', '4', '2')+$this->funcFind1('C1085', 'C1185', '4', '2')+$this->funcFind1('C1088', 'C1188', '4', '2');
        $fieldG = $this->funcFind1('C1082', 'C1182', '4', '2');
        //  $fieldF = funcFind1('C1081', 'C1181', '4', '2');
        $fieldE = $this->funcFind1('C1080', 'C1180', '4', '2');
            
        $fieldD = $this->funcFind1('C1083', 'C1183', '2', '2') +$this->funcFind1('C1084', 'C1184', '2', '2')+$this->funcFind1('C1085', 'C1185', '2', '2')+$this->funcFind1('C1088', 'C1188', '2', '2')+ $this->funcFind3('C1010', '2', '2') - $this->funcFind2('C1083', 'C1183', 'C3')- $this->funcFind2('C1084', 'C1184', 'C3')-$this->funcFind2('C1088', 'C1188', 'C3');
        $fieldC = $this->funcFind1('C1082', 'C1182', '2', '2');
        //$fieldB = funcFind1('C1081', 'C1181', '2', '2');
        $fieldA = $this->funcFind1('C1080', 'C1180', '2', '2') - $this->funcFind2('C1082', 'C96666', 'C3') - $this->funcFind2('C1080', 'C1182', 'C3');
        
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
    
        $arrayData = [
            ['MINISTERIO DE SALUD', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL],
            ['HOSPITAL NACIONAL DOCENTE MADRE NIÑO SAN BARTOLOME', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL],
            [NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL],
            ["RESUMEN DE PLANILLA DE PAGO DE REMUNERACIONES - PERSONAL ACTIVO $mes $year", NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL],
            [NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL],
            ['UNIDAD EJECUTORA : 033 HOSPITAL NACIONAL DOCENTE MADRE NIÑO SAN BARTOLOME', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL],
            [NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL],
            ['CONCEPTOS REMUNERATIVOS', 'NOMB. ADMINIST. 21.11.12', 'CONT. ADMINIST. 21.11.13','PERSONAL DE CONFIANZA (REG.LAB.PUB.) 21.11.19', 'PROF. DE LA SALUD 21.13.11', 'CONT. PROF DE LA SALUD 21.13.12', '"NOMB. NO PROF. ASIST. 21.13.21', 'CONT. NO  PROF. ASIST. 21.13.22', 'GUARDIAS HOSPITAL 21.13.31', 'ENTREGA ECONOMICA PROFESIONALES 21.13.33', 'ENTREGA ECONOMICA NO PROFES. 21.13.34', 'BONIFICACION ESCOLARIDAD O AGUINALDO (JULIO - DICIEMBRE) 21.19.13', 'TOTAL'],
            ['MONTO UNICO CONSOL. PENS. DS-42', $fieldA, $fieldE, $fieldI, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '=SUM(E9:O9)'],
            ['MONTO UNICO CONSOL. NO PENS. DS-42', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '=SUM(E10:O10)'],
            ['BEN. EXTRAOR. TRANSITORIO. PENS. DS-42', $fieldC, $fieldG, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '=SUM(E11:O11)'],
            ['BEN. EXTRAOR. TRANSITORIO. NO PENS. DS-42', $fieldD, $fieldH, $fieldJ, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '=SUM(E12:O12)'],
            ['BONIFICACIONES', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '=SUM(E13:O13)'],
            ['NIVELACION IPSS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '=SUM(E14:O14)'],
            ['ASIGNACION (2 Y 3 SUELDOS)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '=SUM(E15:O15)'],
            ['BONIF. EXTRA x TRANS. (DU.072-09)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '=SUM(E16:O16)'],
            ['VALORIZ. PRINCIPAL 65% D. LEG. 1153', NULL, NULL, NULL, $fieldK, $fieldM, $fieldO, $fieldQ, NULL, NULL, NULL, NULL, '=SUM(E17:O17)'],
            ['VALORIZ. PRINCIPAL 35% D. LEG. 1153', NULL, NULL, NULL, $fieldL + $fielnI, $fieldN, $fieldP, $fieldR, NULL, NULL, NULL, NULL, '=SUM(E18:O18)'],
            ['ASIGNACION TRANSITORIA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '=SUM(E19:O19)'],
            ['REINT. VALORIZ. PRINCIPAL 65% D. LEG. 1153', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '=SUM(E20:O20)'],
            ['REINT. VALORIZ. PRINCIPAL 35% D. LEG. 1153', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '=SUM(E21:O21)'],
            ['V.A. RES. JEFE DPTO. 65% DS. 260-1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, $fieldT, NULL, NULL, '=SUM(E22:O22)'],
            ['V.A. RES. JEFE DPTO. 35% DS. 260-1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, $fieldU, NULL, NULL, '=SUM(E23:O23)'],
            ['V.P. ATENC. EN SERV. CRITICOS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, $fieldV, $fieldX, NULL, '=SUM(E24:O24)'],
            ['V.P. AT. ESP. HOSP/INS. N. II N-III', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, $fieldW, NULL, NULL, '=SUM(E25:O25)'],
            ['BONIF. SOPORTE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, $fieldY, NULL, '=SUM(E26:O26)'],
            ['GUARDIAS HOSPITALARIAS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, $fieldS, NULL, NULL, NULL, '=SUM(E27:O27)'],
            ['BONIFICACION ESCOLARIDAD', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, $fieldZ, '=SUM(E28:O28)'],
            ['AGUINALDOS FIESTAS PATRIAS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, $fieldAA, '=SUM(E29:O29)'],
            ['COMPENS. TIEMPO SERVICIO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '=SUM(E30:O30)'],
            ['TOTAL', '=SUM(E9:E30)', '=SUM(F9:F30)', '=SUM(G9:G30)', '=SUM(H9:H30)', '=SUM(I9:I30)', '=SUM(J9:J30)', '=SUM(K9:K30)', '=SUM(L9:L30)', '=SUM(M9:M30)', '=SUM(N9:N30)', '=SUM(O9:O30)', '=SUM(P9:P30)'],
        ];
    
        $sheet->fromArray(
                $arrayData,
                NULL,
                'D1'
            );
        
        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    'color' => ['argb' => '00000000'],
                ],
            ],
        ];
    
        $sheet->getStyle('D8:P31')->applyFromArray($styleArray);

          // ... (código para poblar el contenido del Excel)

         
          $file = 'resumen_' . $mes . '_' . $year . '.xlsx';
          header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          header('Content-Disposition: attachment; filename=' . $file);
          header('Cache-Control: must-revalidate');
          header('Pragma: public');
          $writer = new Xlsx($spreadsheet);
          $writer->save('php://output');
  
        //   // Subir el archivo al servidor FTP
        //   $ftpPath = 'resumenes/' . $filePath;
        //   Storage::disk('ftp')->put($ftpPath, file_get_contents($filePath));
  
        //   // Eliminar el archivo local después de subirlo
        //   unlink($filePath);
  
        //   // Devolver la URL del archivo
        //   $ftpBaseUrl = config('filesystems.disks.ftp.url');
        //   $fileUrl = $ftpBaseUrl . '/' . $ftpPath;
    }
   
    

    public function guardarResumen(){

    }

     public function verArchivo(Request $request)
     {
         try {
             $ruta = $request->get('ruta');
             if (empty(trim($ruta))) {
                 return;
             }
             $archivo = Storage::disk('ftp')->get($ruta);
             $tipo = Storage::disk('ftp')->mimeType($ruta);
             return response($archivo, 200)->header('Content-Type', $tipo);
         } catch (\Exception $e) {
             return response()->json(['error' => 'Error al obtener el archivo desde FTP: ' . $e->getMessage()], 500);
         }
     }
     
} */ ?>
