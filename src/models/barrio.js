//Importamos los datos de la conexión
const mysqlConnection = require('../database');
//Creamos la conexión a nuestra base de datos con los datos almacenados en conn

 
//Creamos un objeto al que llamaremos usuarios
var barrios = {};
 
//Obtenemos todos los barrios
barrios.getbarrios = function(callback)
{
	if (mysqlConnection) 
	{
		mysqlConnection.query('SELECT * FROM barrio', function(error, rows) {
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
barrios.getBarrioById = function(id,callback)
{
	
    if (mysqlConnection) 
	{    
    mysqlConnection.query('SELECT * FROM barrio where ID_BARRIO = ?',[id],(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows[0]);
        }else{
            throw err;
        }
    });
}

}

//Añadir un nuevo barrio
barrios.insertBarrio = function(BarrioData,callback)
{
        
    mysqlConnection.query('INSERT INTO barrio SET ?', BarrioData.body,(err, rows, fields) =>{
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

}

//Actualizar un barrio
barrios.updateBarrio = function(req, callback)
{
    const {ID_BARRIO, BARRIO, COMUNA, ESTRATO} = req.body;
  
    const query ='UPDATE barrio SET BARRIO  = ?, COMUNA = ?, ESTRATO = ? WHERE ID_BARRIO = ?';

    mysqlConnection.query(
        query, [BARRIO, COMUNA, ESTRATO, ID_BARRIO],(err, rows, fields) =>{
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
barrios.deleteBarrio = function(id, callback)
{
   
    mysqlConnection.query('DELETE FROM barrio WHERE ID_BARRIO = ?',[id],(err, rows, fields) =>{
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
module.exports = barrios;