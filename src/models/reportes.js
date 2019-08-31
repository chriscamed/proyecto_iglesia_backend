//Importamos los datos de la conexión
const mysqlConnection = require('../database');
//Creamos la conexión a nuestra base de datos con los datos almacenados en conn

 
//Creamos un objeto al que llamaremos asistencias
var reportes = {};
 
//Obtenemos todos los asistencias

//Obtenemos un asistencia por su id
reportes.getAsistenciasRpt = function(fechaInicio,fechaFin,callback)
{
	
    if (mysqlConnection) 
	{    
     let qr =`
    SELECT a.evento , a.Cant_asistencias, (CASE WHEN b.Cant_Hombres IS NULL THEN 0 ELSE b.Cant_Hombres END) AS Cant_Hombres ,
(CASE WHEN b.Cant_Mujeres IS NULL THEN 0 ELSE b.Cant_Mujeres END) AS Cant_Mujeres, a.fecha
FROM
(SELECT DATE(b.FECHA_EVENTO) fecha, COUNT(a.ID_ASISTENCIA) AS Cant_asistencias, (CASE WHEN a.asistente > 0 AND c.genero = 'M' THEN SUM(1) ELSE SUM(0) END) AS Hombres, b.nombre evento
FROM eventos b , asistencia a 
LEFT JOIN persona c ON a.asistente = c.id_miembro
WHERE a.EVENTO = b.ID_EVENTO
AND DATE(a.FECHA_CREACION) BETWEEN '2016-01-01' AND '2019-12-31'
GROUP BY a.EVENTO ORDER BY fecha) a
LEFT JOIN
(SELECT a.evento, SUM(a.cant_hombres) Cant_hombres , SUM(a.cant_mujeres) Cant_mujeres
FROM (SELECT c.nombre evento ,(CASE WHEN b.genero = 'M' THEN SUM(1) ELSE SUM(0) END) AS Cant_Hombres ,
(CASE WHEN b.genero = 'F' THEN SUM(1) ELSE SUM(0) END) AS Cant_Mujeres,DATE(a.fecha_creacion) fecha
FROM asistencia a , persona b , eventos c
WHERE a.asistente = b.id_miembro
AND a.evento = c.id_evento
GROUP BY a.evento , a.asistente) a
GROUP BY 1) b
ON a.evento = b.evento;`   
    mysqlConnection.query(qr,[fechaInicio,fechaFin,],(err, rows, fields) =>{
        if(!err){
         

            callback(null, rows);
        }else{
            throw err;
        }
    });
}

}

reportes.getAsistenciasMinisterioRpt = function(fechaInicio,fechaFin,callback)
{
	
    if (mysqlConnection) 
	{    
     let qr =`
     SELECT b.nombre Evento,d.nombre Ministerio, COUNT(a.asistente) cantidad_asistencia , DATE(a.fecha_creacion) fecha_asistencia FROM asistencia a , eventos b , persona c , ministerio d WHERE a.evento = b.id_evento AND a.asistente = c.id_miembro AND c.ministerio = d.id_ministerio AND DATE(a.FECHA_CREACION) BETWEEN ? AND ? GROUP BY c.ministerio,a.evento; 
     `   
    mysqlConnection.query(qr,[fechaInicio,fechaFin],(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows);
        }else{
            throw err;
        }
    });
}

}


reportes.getInvitados = function(fechaInicio,fechaFin,callback)
{
	
    if (mysqlConnection) 
	{    
     let qr =`
     SELECT e.NOMBRE, e.FECHA_EVENTO, a.NOMBRE_INVITADO, a.TELEFONO_INVITADO FROM eventos e, asistencia a WHERE e.FECHA_EVENTO BETWEEN ? and ? and e.ID_EVENTO = a.EVENTO and a.INVITADO = 'SI'`   
    mysqlConnection.query(qr,[fechaInicio,fechaFin,],(err, rows, fields) =>{
        if(!err){
         

            callback(null, rows);
        }else{
            throw err;
        }
    });
}

}

reportes.getTotalGeneros = function(callback)
{
	
    if (mysqlConnection) 
	{    
     let qr =`
     SELECT genero, COUNT(id_miembro) catidad_registrados
     FROM persona 
     GROUP BY genero;
     `   
    mysqlConnection.query(qr,(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows);
        }else{
            throw err;
        }
    });
}

}






//otra
reportes.getAsistenciaPersona = function(fechaInicio,fechaFin,cedula,callback)
{
	
    if (mysqlConnection) 
	{    
     let qr =`
     SELECT
  (SELECT COUNT(*) FROM eventos e WHERE e.FECHA_EVENTO BETWEEN ? AND ?) as eventos, 
  (SELECT COUNT(*) FROM asistencia  WHERE asistencia.ASISTENTE = ? AND asistencia.FECHA_CREACION BETWEEN ? AND ?) as asistencias;
     `   
    mysqlConnection.query(qr,[fechaInicio,fechaFin,cedula,fechaInicio,fechaFin],(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows);
        }else{
            throw err;
        }
    });
}

}

module.exports = reportes;