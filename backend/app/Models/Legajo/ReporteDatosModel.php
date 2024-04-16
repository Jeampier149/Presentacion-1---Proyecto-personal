<?php

namespace App\Models\Legajo;

use App\Models\legajo\verDatosModel;
use Illuminate\Database\Eloquent\Model;


class ReporteDatosModel extends Model
{

    public function generarPDF($dni ,$imagen)
    {
        $data= new  verDatosModel();
        $datosPersonales= $data->listarDatosEmpleadoVer($dni)[0];
        $datosDiscapacidades= $data->listarDatosDiscapacidades($dni)[0]??[];
        $datosEmergencia= $data->listarDatosContactoEmergencia($dni)[0]??[];
        $datosFamiliares= $data->listarDatosFamiliares($dni)??[];
        $datosDomicilio= $data->listarDatosDomicilio($dni)[0]??[];
        $datosProfesion= $data->listarDatosProfesion($dni)[0]??[];
        $datosEstudioSuperior= $data->listarDatosEstudioSuperior($dni)??[];
        $datosEstudioPostgrado= $data->listarDatosEstudioPostgrado($dni)??[];
        $datosEstudioEspecializacion= $data->listarDatosEstudioEspecializacion($dni)??[];
        $datosEstudioCurso= $data->listarDatosEstudioCursos($dni)??[];
        $datosEstudioIdioma= $data->listarDatosEstudioIdioma($dni)??[];
        $datosExpeLaboral= $data->listarDatosExperienciaLaboral($dni)??[];
        $datosExpeDocencia= $data->listarDatosExperienciaDocencia($dni)??[];


        $nombreCompleto=empty($datosPersonales->nombreCompleto)?'sin datos': $datosPersonales->nombreCompleto;
        $numeroDoc=empty($datosPersonales->numeroDocumento)?'sin datos':$datosPersonales->numeroDocumento;
        $ruc=empty($datosPersonales->ruc)?'sin datos':$datosPersonales->ruc;
        $ruc=empty($datosPersonales->ruc)?'sin datos':$datosPersonales->ruc;
        $fechaNacimiento=empty($datosPersonales->fechaNacimiento)?'sin datos':$datosPersonales->fechaNacimiento;
        $nacionalidad=empty($datosPersonales->nacionalidad)?'sin datos':$datosPersonales->nacionalidad;
        $telFijo=empty($datosPersonales->telFijo)?'sin datos':$datosPersonales->telFijo;
        $telMovil=empty($datosPersonales->telMovil)?'sin datos':$datosPersonales->telMovil;
        $correo=empty($datosPersonales->correo)?'sin datos':$datosPersonales->correo;
        $grupSanguineo=empty($datosPersonales->grupSanguineo)?'sin datos':$datosPersonales->grupSanguineo;
        $enferAlergia=empty($datosPersonales->enferAlergia)?'sin datos':$datosPersonales->enferAlergia;
        $nombreContacto=empty($datosEmergencia->nombre)?'sin datos':$datosEmergencia->nombre;
        $parentescoE=empty($datosEmergencia->parentesco)?'sin datos':$datosEmergencia->parentesco;
        $telefonoE=empty($datosEmergencia->telefono)?'sin datos':$datosEmergencia->telefono;
        $estadoCivil=empty($datosPersonales->estadoCivil)?'sin datos':$datosPersonales->estadoCivil;
        $departamento=empty($datosDomicilio->departamento)?'sin datos':$datosDomicilio->departamento;
        $provincia=empty($datosDomicilio->provincia)?'sin datos':$datosDomicilio->provincia;
        $distrito=empty($datosDomicilio->distrito)?'sin datos':$datosDomicilio->distrito;
        $tipoVia=empty($datosDomicilio->tipoVia)?'sin datos':$datosDomicilio->tipoVia;
        $nombreVia=empty($datosDomicilio->nombreVia)?'sin datos':$datosDomicilio->nombreVia;
        $interiorVia=empty($datosDomicilio->interiorVia)?'sin datos':$datosDomicilio->interiorVia;
        $tipoZona=empty($datosDomicilio->tipoZona)?'sin datos':$datosDomicilio->tipoZona;
        $nombreZona=empty($datosDomicilio->nombreZona)?'sin datos':$datosDomicilio->nombreZona;
        $interiorZona=empty($datosDomicilio->interiorZona)?'sin datos':$datosDomicilio->interiorZona;
        $numeroZona=empty($datosDomicilio->numeroZona)?'sin datos':$datosDomicilio->numeroZona;
        $referencia=empty($datosDomicilio->referencia)?'sin datos':$datosDomicilio->referencia;
        
        $condicion=empty($datosPersonales->condicion)?'sin datos':$datosPersonales->condicion;
        $regimen=empty($datosPersonales->regimen)?'sin datos':$datosPersonales->regimen;
        $tipoRegimen=empty($datosPersonales->tipoRegimen)?'sin datos':$datosPersonales->tipoRegimen;
        $unidad=empty($datosPersonales->unidadOrganica)?'sin datos':$datosPersonales->unidadOrganica;
        $servicio=empty($datosPersonales->servicio)?'sin datos':$datosPersonales->servicio;
        $grupo=empty($datosPersonales->grupOcupacional)?'sin datos':$datosPersonales->grupOcupacional;
        $nivel=empty($datosPersonales->nivel_descripcion)?'sin datos':$datosPersonales->nivel_descripcion;
        $airhsp=empty($datosPersonales->codigoAirhsp)?'sin datos':$datosPersonales->codigoAirhsp;
        $fechaIngreso=empty($datosPersonales->fechaIngreso)?'sin datos':$datosPersonales->fechaIngreso;
        $profesion=empty($datosProfesion->profesion)?'sin datos':$datosProfesion->profesion;
        $inicio=empty($datosProfesion->fechaInicio)?'sin datos':$datosProfesion->fechaInicio;
        $lugar=empty($datosProfesion->lugar)?'sin datos':$datosProfesion->lugar;
        $fin=empty($datosProfesion->fechaTermino)?'sin datos':$datosProfesion->fechaTermino;
        $numero_cole=empty($datosProfesion->numeroCole)?'sin datos':$datosProfesion->numeroCole;
        $rutaFoto=storage_path().'/app/public/img/'.$numeroDoc.'.jpg';
        $html='
        <table class="encabezado">
         <tr>
            <td colspan="3" class="pega">
              <img width = "100" src = "'.resource_path().'/img/img_personal.png" class="pegantina" alt="imagen no ecnontrada">
            </td>
            <td class="logo"><img width = "60" src = "'.resource_path().'/img/logo-hsb.jpg" class="log" alt="imagen no ecnontrada"></td>  </tr>            
         </tr> 
        </table>
         <table style="width: 100%;margin-bottom:20px; border:none;" >        
            <tr>        
                <td  rowspan="6" class="logo"  style="text-align:center;width: 26%;"><img  class="perfil"  src = "'.$rutaFoto.'" alt="imagen no ecnontrada"></td>            
                <td  colspan="4" style="text-align:left;height:10px;background-color: #f2f2f2;"><b>SITUACIÓN LABORAL:</b></td>
               
            </tr>
            <tr>
            <td style="width: 20%; height:15px"><b>CONDICION:</b></td>
            <td style="width: 20%; height:15px">'.$condicion.'</td>
            <td style="width: 10%; height:15px"><b>G.OCUPACIONAL:</b></td>
            <td style="width: 10%; height:15px">'.$grupo.' </td>          
            </tr>  
            <tr>
            <td style="width: 20%;height:15px"><b>C.AIRHSP:</b></td>
            <td style="width: 20%; height:15px">'.$airhsp.'</td>
            <td style="width: 20%; height:15px"><b>FECHA INGRESO:</b></td>
            <td style="width: 20%; height:15px"> '.$fechaIngreso.'</td>
            </tr> 
            <tr>
            <td style="width: 20%;height:15px"><b>REGIMEN:</b></td>
            <td style="width: 20%; height:15px">'.$regimen.'</td>
            <td style="width: 20%; height:15px"><b>TIPO REGIMEN:</b></td>
            <td style="width: 20%; height:15px">'.$tipoRegimen.' </td>
            </tr>   
            <tr>
            <td style="width: 20%;height:15px"><b>CARGO:</b></td>
            <td style="width: 20%; height:15px">'.$condicion.'</td>
            <td style="width: 20%; height:15px"><b>NIVEL:</b></td>
            <td style="width: 20%; height:15px">'.$nivel.' </td>
            </tr>   
            <tr>
            <td style="width: 20%;height:15px"><b>UNIDAD ORGANICA:</b></td>
            <td style="width: 20%; height:15px">'.$unidad.'</td>
            <td style="width: 20%; height:15px"><b>SERVICIO:</b></td>
            <td style="width: 20%; height:15px">'.$servicio.' </td>
            </tr> 
        </table>  ';
        $html .= "<table  style=' width: 100%;margin-bottom:20px;' > ";
                                 
       $html.=" 
          
                <tr>
                    <td colspan='4'  style='text-align:left;background-color: #f2f2f2;'><b>DATOS PERSONALES</td>
                </tr>
                <tr>
                    <td style='width: 25%;text-align:left'><b>Apellidos y Nombres</b></td>
                    <td colspan='3'>".$nombreCompleto."</td>           
                </tr>
                <tr>
                    <td style='width: 25%;text-align:left'><b>DNI N°</td>
                    <td style='width: 25%;'>".$numeroDoc."</td>
                    <td style='width: 25%;text-align:left'><b>RUC N°</td>
                    <td style='width: 25%;'>".$ruc."</td>
                </tr>
                <tr>
                    <td style='width: 25%;text-align:left'><b>Fecha de Nacimiento</td>
                    <td style='width: 25%;'>".$fechaNacimiento."</td>
                    <td style='width: 25%;text-align:left'><b>Nacionalidad</td>
                    <td style='width: 25%;'>".$nacionalidad."</td>
                </tr>
                <tr>
                    <td style='width: 25%;text-align:left'><b>Telefono Fijo</td>
                    <td style='width: 25%;'>".$telFijo."</td>
                    <td style='width: 25%;text-align:left'><b>Telefono Movil</td>
                    <td style='width: 25%;'>".$telMovil."</td>
                </tr>
                <tr>
                    <td style='width: 25%;text-align:left'><b>Correo Electronico</td>
                    <td style='width: 25%;'>".$correo."</td>
                    <td style='width: 25%;text-align:left'><b>Grupo Sanguineo</td>
                    <td style='width: 25%;'>".$grupSanguineo."</td>
                </tr>
                <tr>
                    <td style='width: 25%;text-align:left'><b>Enfermedades / Alergias</td>
                    <td colspan='3'>".$enferAlergia."</td>

                </tr>         
                <tr>
                    <td style='width: 25%;text-align:left'><b>En Casos de Emergencia contactar a:</td>
                    <td colspan='3'>".$nombreContacto."</td>          
                </tr>
                <tr>
                    <td style='width: 25%;text-align:left'><b>Parentesco</td>
                    <td style='width: 25%;'>".$parentescoE."</td>
                    <td style='width: 25%;text-align:left'><b>Telefono del contacto de Emergencia</td>
                    <td style='width: 25%;'>".$telefonoE."</td>
                </tr>
                <tr>
                    <td style='width: 25%;text-align:left'><b>Estado Civil</td>
                    <td style='width: 25%;'>".$estadoCivil."</td>
                    <td style='width: 25%;text-align:left'><b>Discapacidad</td>
                    <td style='width: 25%;'></td>
                </tr>
      ";
             
       $html.= "</table>";

    $html.="
       <table style='margin-bottom:20px;'>
       <tr>
       <td colspan='4'  style='text-align:left;background-color: #f2f2f2;'><b>DOMICILIO</td>
      </tr>

   <tr>
       <td style='width: 25%;text-align:left'><b>Departamento</td>
       <td style='width: 25%;'>".$departamento."</td>
       <td style='width: 25%;text-align:left'><b>Provincia</td>
       <td style='width: 25%;'>".$provincia."</td>
   </tr>
   <tr>
       <td style='width: 25%;text-align:left'><b>Distrito</td>
       <td style='width: 25%;'>".$distrito."</td>
       <td style='width: 25%;text-align:left'><b>Tipo de Via</td>
       <td style='width: 25%;'>".$tipoVia."</td>
   </tr>
   <tr>
       <td style='width: 25%;text-align:left'><b>Nombre Via</td>
       <td style='width: 25%;'>".$nombreVia."</td>
       <td style='width: 25%;text-align:left' ><b>Interior Via</td>
       <td style='width: 25%;'>".$interiorVia."</td>

   </tr>
   <tr>
       <td style='width: 25%;text-align:left'><b>Tipo de Zona</td>
       <td style='width: 25%;'>".$tipoZona."</td>
       <td style='width: 25%;text-align:left'><b>Nombre de zona</td>
       <td style='width: 25%;'>".$nombreZona."</td>
   </tr>
   <tr>
       <td style='width: 25%;text-align:left'><b>Numero Zona</td>
       <td style='width: 25%;'>".$numeroZona."</td>
       <td style='width: 25%;text-align:left'><b>Interior zona</td>
       <td style='width: 25%;'>".$interiorZona."</td>

   </tr>

   <tr>
       <td style='width: 25%;text-align:left'><b>Referencia (Indicar Avenida/Calle y/o institucion cercana):</td>
       <td colspan='3'>".$referencia."</td>

   </tr>
      </table>";

     if(!empty($datosFamiliares)){
        $html.="
       <table>
       <tr>
        <td colspan='6' style='text-align:left;background-color: #f2f2f2;margin-top:20px;'><b>DATOS FAMILIARES</td>
                   </tr>
       </table>
        <table style='margin-bottom:20px;'>
      
          <thead>
           <tr>
           <td style='text-align:center'><b>Apellidos y Nombres</td>
           <td style='text-align:center'><b>Fecha de Nacimiento</td>
           <td style='text-align:center'><b>Tipo Doc</td>
           <td style='text-align:center'><b>N°Documento</td>
           <td style='text-align:center'><b>Parentesco</td>
           <td style='text-align:center'><b>Institucion Laboral</td>
        </tr>
      </thead>
      <tbody>";

    foreach($datosFamiliares as $familiar){

     $html.="
         <tr>
             <td style='text-align:center'>".$familiar->nombreC."</td>
             <td style='text-align:center'>".$familiar->fechaNacimiento."</td>
             <td style='text-align:center'>".$familiar->tipoD."</td>
             <td style='text-align:center'>".$familiar->dni."</td>
             <td style='text-align:center'>".$familiar->parentesco."</td>
             <td style='text-align:center'>".$familiar->centroLaboral."</td>
        </tr>";
    }     
              
   $html.= "  </tbody>
   
   </table>";

}

if(!empty($datosEstudioSuperior)){
    $html.="
    <table style='margin-bottom:20px;'>
    <tr>
                    <td colspan='5'  style='text-align:left;background-color: #f2f2f2;'><b>DATOS  PROFESIONALES/ACADEMICOS</td>

                </tr>
                <tr>
                    <td style='width: 25%;text-align:left'>Profesión</td>
                    <td colspan='4'>".$profesion."</td>           
                </tr>
               
                <tr>
                        <td style='width: 25%;text-align:left'>Fecha Colegiatura</td>
                        <td style='width: 25%;'>".$inicio."</td>
                        <td style='width: 25%;text-align:left'>Lugar Colegiatura</td>
                        <td colspan='2' >".$lugar."</td>
                </tr>
                <tr>
                        <td style='width: 25%;text-align:left'>Fecha Final de Hablitación</td>
                        <td style='width: 25%;'>".$fin."</td>
                        <td style='width: 25%;text-align:left'>N°Colegiatura</td>
                        <td colspan='2' >".$numero_cole."</td>
                </tr>
    </table>

    <table style='margin-bottom:20px;'>
    <tr>
    <td colspan='5'  style='text-align:left;background-color: #f2f2f2;'><b>ESTUDIOS SUPERIORES (UNIVERSITARIO - TECNICO) 

    </td>
  </tr> 
      <thead>
      <tr>
      <td style='width:5%;text-align:center'><b>CENTRO DE ESTUDIOS</td>
      <td style='text-align:center'><b>ESPECIALIDAD</td>
      <td style='text-align:center'><b>INICIO</td>
      <td style='text-align:center'><b>TERMINO</td>
      <td style='text-align:center'><b>NIVEL ALCANZADO</td>
  </tr>
  </thead>
  <tbody>";

  foreach($datosEstudioSuperior as $superior){
    $html.=" <tr>
    <td style='width:25%;text-align:center'>$superior->centro</td>
    <td style='text-align:center'>$superior->especialidad</td>
    <td style='text-align:center'>$superior->inicio</td>
    <td style='text-align:center'>$superior->termino</td>
    <td style='text-align:center'>$superior->nivel</td>
    </tr> " ;
}  
          
$html.= "  </tbody></table>";
}


if(!empty($datosEstudioPostgrado)){
    $html.="

    <table style='margin-bottom:20px;'>
    <tr>
    <td colspan='5'  style='text-align:left;background-color: #f2f2f2;'><b>ESTUDIOS POSTGRADO(MAESTRIA - DOCTORADO) 

    </td>
   </tr> 

  </tr> 
      <thead>
      <tr>
      <td style='width:5%;text-align:center'><b>CENTRO DE ESTUDIOS</td>
      <td style='text-align:center'><b>ESPECIALIDAD</td>
      <td style='text-align:center'><b>INICIO</td>
      <td style='text-align:center'><b>TERMINO</td>
      <td style='text-align:center'><b>NIVEL ALCANZADO</td>
  </tr> 
  </thead>
  <tbody>";

  foreach($datosEstudioPostgrado as $postgrado){
    $html.=" <tr>
    <td style='width:25%;text-align:center'>$superior->centro</td>
    <td style='text-align:center'>$postgrado->especialidad</td>
    <td style='text-align:center'>$postgrado->inicio</td>
    <td style='text-align:center'>$postgrado->termino</td>
    <td style='text-align:center'>$postgrado->nivel</td>
    </tr> " ;
}  
          
$html.= "  </tbody>

</table>";

}

if(!empty($datosEstudioEspecializacion)){
    $html.="

    <table style='margin-bottom:20px;'>
    <tr>
    <td colspan='5'  style='text-align:left;background-color: #f2f2f2;'><b>ESPECIALIZACIÓN - DIPLOMADOS

    </td>
</tr> 

  </tr> 
      <thead>
      <tr>
      <td style='width:5%;text-align:center'><b>CENTRO DE ESTUDIOS</td>
      <td style='text-align:center'><b>MATERIA</td>
      <td style='text-align:center'><b>INICIO</td>
      <td style='text-align:center'><b>TERMINO</td>
      <td style='text-align:center'><b>CERTIFICACIÓN OBTENIDA</td>
  </tr> 
  </thead>
  <tbody>";

  foreach($datosEstudioEspecializacion as $especializacion){
    $html.=" <tr>
    <td style='width:25%;text-align:center'>$superior->centro</td>
    <td style='text-align:center'>$especializacion->materia</td>
    <td style='text-align:center'>$especializacion->inicio</td>
    <td style='text-align:center'>$especializacion->termino</td>
    <td style='text-align:center'>$especializacion->certificacion</td>
    </tr> " ;
}  
          
$html.= "  </tbody></table>";

}
if(!empty($datosEstudioCurso)){
    $html.="

    <table style='margin-bottom:20px;'>
    <tr>
    <td colspan='5'  style='text-align:left;background-color: #f2f2f2;'><b>CURSOS -  SEMINARIOS

    </td>
</tr> 

  </tr> 
      <thead>
      <tr>
            <td style='width:5%;text-align:center'><b>CENTRO DE ESTUDIOS</td>
            <td style='text-align:center'><b>MATERIA</td>
            <td style='text-align:center'><b>INICIO</td>
            <td style='text-align:center'><b>TERMINO</td>
            <td style='text-align:center'><b>CERTIFICACIÓN OBTENIDA</td>
       </tr> 
  </thead>
  <tbody>";

  foreach($datosEstudioCurso as $curso){
    $html.=" <tr>
    <td style='width:25%;text-align:center'>$curso->centro</td>
    <td style='text-align:center'>$curso->materia</td>
    <td style='text-align:center'>$curso->inicio</td>
    <td style='text-align:center'>$curso->termino</td>
    <td style='text-align:center'>$curso->certificacion</td>
    </tr> " ;
}  
          
$html.= "  </tbody></table>";

}
if(!empty($datosEstudioIdioma)){
    $html.="

    <table style='margin-bottom:20px;'>
    <tr>
    <td colspan='2'  style='text-align:left;background-color: #f2f2f2;'><b>IDIOMAS

    </td>
</tr> 

  </tr> 
      <thead>
      <tr>
      <td style='text-align:center' ><b>LENGUA EXTRANJERA</td>
      <td style='text-align:center' ><b>NIVEL</td>
     </tr> 
  </thead>
  <tbody>";

  foreach($datosEstudioIdioma as $idioma){
    $html.=" 
    <tr>
    <td  style='text-align:center'>$idioma->lenguaE</td>
    <td  style='text-align:center'>$idioma->nivel</td>
    
    </tr> " ;
}  
          
$html.= "  </tbody></table>";

}
if(!empty($datosExpeLaboral)){
    $html.="
     <table >
     <tr>
     <td colspan='4'  style='text-align:left;background-color: #f2f2f2;'><b>DATOS LABORALES </td>
    </tr> 
     </table>

    <table >

    <tr>
    <td colspan='4'  style='text-align:left;background-color: #f2f2f2;'><b>Experiencia Laboral </td>
   </tr> 

      <thead>
      <tr>
      <td style='text-align:center'><b>INSTITUCIÓN/EMPRESA</td>
      <td style='text-align:center'><b>CARGO- ACTIVIDAD DESEMPEÑADA</td>
      <td style='text-align:center'><b>INICIO</td>
      <td style='text-align:center'><b>TERMINO</td>
  </tr> 
  </thead>
  <tbody>";

  foreach($datosExpeLaboral as $laboral){
    $html.=" <tr>
    <td style='text-align:center'>$laboral->institucion</td>
    <td style='text-align:center'>$laboral->cargo</td>
    <td style='text-align:center'>$laboral->inicio</td>
    <td style='text-align:center'>$laboral->termino</td>
    </tr> " ;
}  
          
$html.= "  </tbody></table>";

}

if(!empty($datosExpeDocencia)){
    $html.="
    <table>

    <tr>
    <td colspan='4'  style='text-align:left;background-color: #f2f2f2;'><b>Experiencia de Docencia </td>
   </tr> 

   <thead>
   <tr>
   <td style='text-align:center'><b>Centro de Enseñanza</td>
   <td style='text-align:center'><b>CURSO</td>
   <td style='text-align:center'><b>INICIO</td>
   <td style='text-align:center'><b>TERMINO</td>
</tr> 
</thead>
  <tbody>";

  foreach($datosExpeDocencia as $docencia){
    $html.=" 
    <tr>
    <td style='text-align:center'>$docencia->centro</td>
    <td style='text-align:center'>$docencia->curso</td>
    <td style='text-align:center'>$docencia->inicio</td>
    <td style='text-align:center'>$docencia->termino</td>
    </tr> " ;
}  
          
$html.= "  </tbody></table>";

}
        return $html;
    }
 
 
}