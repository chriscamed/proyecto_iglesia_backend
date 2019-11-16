//Importamos los datos de la conexión
const mysqlConnection = require('../database');
//Creamos la conexión a nuestra base de datos con los datos almacenados en conn

 
//Creamos un objeto al que llamaremos usuarios
var personas = {};
 
//Obtenemos todos los usuarios
personas.getPersonas = function(callback)
{
	if (mysqlConnection) 
	{
		mysqlConnection.query('SELECT * FROM PERSONAS', function(error, rows) {
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null, rows);
			}
		});
	}
}
 
//Obtenemos un usuario por su id
personas.getPersonaById = function(id,callback)
{
	
    if (mysqlConnection) 
	{    
    mysqlConnection.query("SELECT ID_PERSONA,PRIMER_NOMBRE, SEGUND_NOMBRE, PRIMER_APELLIDO, SEGUND_APELLIDO, TIPO_IDENTIFICACION, IDENTIFICACION, DATE_FORMAT(FECHA_NACIMIENTO,'%Y-%m-%d') as FECHA_NACIMIENTO, GENERO, ESTADO_CIVIL, CORREO, CELULAR_1, CELULAR_2, TELEFONO_FIJO, DIRECCION_CASA, ID_BARRIO, EMPRESA, TELEFONO_EMPRESA, DATE_FORMAT(FECHA_BAUTIZO,'%Y-%m-%d') as FECHA_BAUTIZO, ID_OCUPACION, ID_PROFESION, ID_MINISTERIO, TIPO_PERSONA FROM PERSONAS where ID_PERSONA = ?",[id],(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows[0]);
        }else{
            throw err;
        }
    });
}

}

personas.getMembers = function(callback)
{
    
    if (mysqlConnection) 
    {    
    mysqlConnection.query('SELECT * FROM PERSONAS p WHERE p.ID_PERSONA NOT IN (SELECT ID_PERSONA FROM USERS)',(err, rows) =>{
        if(!err){
           
            callback(null, rows);
        }else{
            throw err;
        }
    });
}

}


personas.getPersonaByIdHuman = function(id,callback)
{
	
    if (mysqlConnection) 
	{    
     var sql = `SELECT b.BARRIO,a.CELULAR1,a.CELULAR2,a.CORREO,a.DIRECCION_CASA,a.EMPRESA,c.ESTADO,a.ESTADO_CIVIL,
     a.FECHA_BAUTIZO,a.FECHA_CREACION,a.FECHA_NACIMIENTO,a.FOTOPERSONA,a.GENERO,a.ID_MIEMBRO,a.IDENTIFICACION,
     CONCAT(a.primer_nombre,' ',a.primer_apellido) invitado_por,g.MINISTERIO,d.OCUPACION,a.PRIMER_APELLIDO,a.PRIMER_NOMBRE,e.PROFESION,a.SEGUND_APELLIDO,
     a.SEGUND_NOMBRE,a.TELEFONO_EXT,a.TELEFONO_FIJO,a.TIPO_IDENTIFICACION
     FROM PERSONAS a 
     LEFT JOIN barrio b ON a.barrio = b.id_barrio
     LEFT JOIN estado c ON a.estado = c.id_estado
     LEFT JOIN ocupaciones d ON a.estado = d.id_ocupacion
     LEFT JOIN profesiones e ON a.estado = e.id_profesion
     LEFT JOIN ministerio f ON a.estado = f.id_ministerio
     LEFT JOIN persona g ON a.estado = g.id_miembro
     WHERE a.id_miembro = ?`    
    mysqlConnection.query(sql,[id],(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows[0]);
        }else{
            throw err;
        }
    });
}

}

//get total personas
personas.getTotalPersonas = function(callback)
{
	
    if (mysqlConnection) 
	{    
    mysqlConnection.query('SELECT count(*) as total FROM PERSONAS',(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows[0]);
        }else{
            throw err;
        }
    });
}

}

//get personas paginacion

personas.getPersonaPaginate = function(offset, limit, callback)
{
	
    if (mysqlConnection) 
	{    
    mysqlConnection.query('SELECT * FROM PERSONAS LIMIT  ? , ?  ',[offset,limit],(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows);
        }else{
            throw err;
        }
    });
}

}


//Añadir un nuevo usuario
personas.insertPersona = function(usuarioData,callback)
{
    
        let objErrors = {};

    
    const errores = Object.getOwnPropertyNames(objErrors);
    console.log(usuarioData);
    
    if(errores.length <= 0 ){
        
    mysqlConnection.query('INSERT INTO PERSONAS SET ?', usuarioData,(err, rows, fields) =>{
        if(!err){
            callback(null, {
                success: true,
                errors: null
            });
           
        }else{
            callback(null, {
                success: false,
                errors: {err}
            });
        }
    });
}else{
    callback(null, {
        success:false,
        errors: objErrors
    });
}
}


//actualizar persona con archivo

//Actualizar un usuario
personas.updatePersona = function(req, callback)
{
	
	const { 
        ID_PERSONA,
        PRIMER_NOMBRE,
        SEGUND_NOMBRE, 
        PRIMER_APELLIDO, 
        SEGUND_APELLIDO, 
        IDENTIFICACION, 
        TIPO_IDENTIFICACION, 
        FECHA_NACIMIENTO,
        GENERO,
        ESTADO_CIVIL,
        CORREO,
        CELULAR_1,
        CELULAR_2,
        TELEFONO_FIJO,
        DIRECCION_CASA,
        EMPRESA,
        TELEFONO_EMPRESA,
        FECHA_BAUTIZO,
        ID_OCUPACION,
        ID_BARRIO,
        ID_PROFESION,
        ID_MINISTERIO} = req;


        
  
 const query =`UPDATE PERSONAS SET PRIMER_NOMBRE = ?, SEGUND_NOMBRE = ?, PRIMER_APELLIDO = ?, SEGUND_APELLIDO = ?, 
 IDENTIFICACION = ?, TIPO_IDENTIFICACION = ?, FECHA_NACIMIENTO = ?, GENERO = ?, ESTADO_CIVIL = ?, 
 CORREO = ?, CELULAR_1 = ?, CELULAR_2 = ?, TELEFONO_FIJO = ?, DIRECCION_CASA = ?, EMPRESA = ?, 
 TELEFONO_EMPRESA = ?, FECHA_BAUTIZO = ?, ID_OCUPACION = ?, ID_BARRIO = ?, ID_PROFESION = ?, 
 ID_MINISTERIO = ? WHERE ID_PERSONA = ?`
 

    mysqlConnection.query(
        query, [PRIMER_NOMBRE,
            SEGUND_NOMBRE, 
            PRIMER_APELLIDO, 
            SEGUND_APELLIDO, 
            IDENTIFICACION, 
            TIPO_IDENTIFICACION, 
            FECHA_NACIMIENTO,
            GENERO,
            ESTADO_CIVIL,
            CORREO,
            CELULAR_1,
            CELULAR_2,
            TELEFONO_FIJO,
            DIRECCION_CASA,
            EMPRESA,
            TELEFONO_EMPRESA,
            FECHA_BAUTIZO,
            ID_OCUPACION,
            ID_BARRIO,
            ID_PROFESION,
            ID_MINISTERIO, ID_PERSONA],(err, rows, fields) =>{
        if(!err){
            callback(null, {
                success: true,
                errors: null
            });
        }else{
            callback(null, {
                success:false,
                errors:{err}
            });
        }
    });

    
}


personas.updatePersonaArc = function(req, callback)
{
	const { 
        ID_MIEMBRO,
        PRIMER_NOMBRE,
        SEGUND_NOMBRE, 
        PRIMER_APELLIDO, 
        SEGUND_APELLIDO, 
        IDENTIFICACION, 
        TIPO_IDENTIFICACION, 
        FECHA_NACIMIENTO,
        ESTADO_CIVIL,
        CORREO,
        CELULAR1,
        CELULAR2,
        TELEFONO_FIJO,
        DIRECCION_CASA,
        EMPRESA,
        TELEFONO_EXT,
        FECHA_BAUTIZO,
        OCUPACION,
        BARRIO,
        PROFESION,
        ESTADO,
        MINISTERIO, fotopersona} = req;
	

        
  
 const query =`UPDATE PERSONAS SET PRIMER_NOMBRE = ?, SEGUND_NOMBRE = ?, PRIMER_APELLIDO = ?, SEGUND_APELLIDO = ?, 
 IDENTIFICACION = ?, TIPO_IDENTIFICACION = ?, FECHA_NACIMIENTO = ?, GENERO = ?, ESTADO_CIVIL = ?, 
 CORREO = ?, CELULAR1 = ?, CELULAR2 = ?, TELEFONO_FIJO = ?, DIRECCION_CASA = ?, EMPRESA = ?, 
 TELEFONO_EXT = ?, FECHA_BAUTIZO = ?, OCUPACION = ?, BARRIO = ?, PROFESION = ?, ESTADO = ?, MINISTERIO = ?, fotopersona = ? WHERE ID_MIEMBRO = ?`
 

    mysqlConnection.query(
        query,[PRIMER_NOMBRE,
            SEGUND_NOMBRE, 
            PRIMER_APELLIDO, 
            SEGUND_APELLIDO, 
            IDENTIFICACION, 
            TIPO_IDENTIFICACION, 
            FECHA_NACIMIENTO,
            GENERO,
            ESTADO_CIVIL,
            CORREO,
            CELULAR1,
            CELULAR2,
            TELEFONO_FIJO,
            DIRECCION_CASA,
            EMPRESA,
            TELEFONO_EXT,
            FECHA_BAUTIZO,
            OCUPACION,
            BARRIO,
            PROFESION,
            ESTADO, 
            fotopersona,
            MINISTERIO, 
            ID_MIEMBRO] ,(err, rows, fields) =>{
        if(!err){
            callback(null, {
                success: true,
                errors: null
            });
        }else{
            callback(null, {
                success:false,
                errors:{err}
            });
        }
    });

    
}

//Eliminar un usuario por su id
personas.deletePersona = function(id, callback)
{
   
    mysqlConnection.query('DELETE FROM PERSONAS WHERE ID_MIEMBRO = ?',[id],(err, rows, fields) =>{
    if(!err){
        callback(null, {
            success:true,
            errors: null
        });
    }else{
        callback(null, {
            success:false,
            errors: err
        });
    }
});

			
}
module.exports = personas;
