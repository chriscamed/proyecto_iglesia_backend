//Importamos express
var express = require('express');
//Creamos el objeto para definir las rutas
var router = express.Router();
var bcrypt = require('bcrypt');
require('dotenv').config();
var jwt = require('jsonwebtoken');

//Importamos el modelo que ejecutará las sentencias SQL
var personasModel = require('../models/persona');
var ocupacionesModel = require('../models/ocupacion');
var profesionesModel = require('../models/profesion');
var barriosModel = require('../models/barrio');
var estadosModel = require('../models/estado');
var ministeriosModel = require('../models/ministerio');
var eventosModel = require('../models/evento');
var asistenciasModel = require('../models/asistencia');
var logisticasModel = require('../models/logistica');
var reportesModel = require('../models/reportes');




var user = require('../models/user');
var checkAuth = require('../middleware/check-auth')
const multer = require('multer');

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, JSON.parse(req.body.persona).IDENTIFICACION + file.originalname);
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 20 },
  fileFilter: fileFilter
});


router.post('/login', function (request, response) {
  user.getUserLogin(request.body.USUARIO, function (error, data) {
    if (data) {

      bcrypt.compare(request.body.PASS, data.PASS, (err, result) => {
        if (err) {

          response.status(401).json(
            {
              success: false,
              message: "Datos invalidos"
            }
          );
        } else {


          if (result) {
            const token = jwt.sign({
              user: data.USUARIO,
              roll: data.ROL
            }, process.env.SECRET, { expiresIn: '5d' })

            response.status(200).json(
              {

                success: true,
                message: "Datos correctos",
                token
              });
          } else {
            response.status(401).json(
              {
                success: false,
                message: "Datos invalidos"
              });
          }
        }
      }
      );


    } else {
      response.status(401).json(
        {
          success: false,
          message: "Datos invalidos"
        }
      );
    }


  });
});


//0 registrador de asistencias
//1 para administrador
//2 registrador de personas
router.post('/user/create', checkAuth, function (request, response) {

  if (request.userData.roll == 1) {
    user.insertUsuario(request, function (error, datos) {

      if (datos) {
        response.status(200).json(datos);
      }
      else {
        response.status(500).json(datos);
      }
    });

  } else {
    response.status(401).json(
      {
        message: 'No autorizado'
      }
    )
  }
});

router.get('/user/individual/:id', checkAuth,function (request, response) {
  const { id } = request.params;

  user.getUserById(id, function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No existe"
      });
    }
  });
});

router.get('/user/alluser', checkAuth, function (request, response) {

  if (request.userData.roll == 1) {
    user.getListUser( function (error, datos) {

      if (datos) {
        response.status(200).json(datos);
      }
      else {
        response.status(500).json(datos);
      }
    });

  } else {
    response.status(401).json(
      {
        message: 'No autorizado'
      }
    )
  }
});

router.post('/user/update', checkAuth, function (request, response) {

  if (request.userData.roll == 1) {
    user.updateUsuario(request, function (error, datos) {

      if (datos) {
        response.status(200).json(datos);
      }
      else {
        response.status(500).json(datos);
      }
    });

  } else {
    response.status(401).json(
      {
        message: 'No autorizado'
      }
    )
  }
});


//CRUD PERSONA
//Todos los usuarios
router.get('/personas', checkAuth, function (request, response) {
  
    personasModel.getPersonas(function (error, data) {
      response.status(200).json(data);
    });
  
});
//Todos los usuarios

router.get('/personas/total', checkAuth,function (request, response) {
  
  
  personasModel.getTotalPersonas(function (error, data) {

    response.status(200).json(data);
  });

});

//personas paginados
router.get('/personas/paginado/', checkAuth, function (request, response) {

  const { offset, limit } = request.query;
  personasModel.getPersonaPaginate(parseInt(offset), parseInt(limit), function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No eventos"
      });
    }
  });
});



//Un usuario
router.get('/persona/:id', checkAuth, function (request, response) {
  const { id } = request.params;

  personasModel.getPersonaById(id, function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No existe"
      });
    }
  });
});

router.get('/persona/simple/:id', checkAuth, function (request, response) {
  const { id } = request.params;

  personasModel.getPersonaByIdHuman(id, function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No existe"
      });
    }
  });
});



router.get('/imagen/:id', checkAuth,function (request, response) {
  var imageBuffer = request.file.buffer;
  var imageName = '../uploads/base,jpg';

  fs.createWriteStream(imageName).write(imageBuffer);

});
//insertar usuario
router.post('/persona/crear', checkAuth, upload.single('fotopersona'), function (request, response) {
  if (request.userData.roll >= 1) {
  var persona = JSON.parse(request.body.persona);
  if (persona.fotopersona != null) {
    persona.fotopersona = persona.IDENTIFICACION + request.file.originalname;
  }
  personasModel.insertPersona(persona, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  )
}
});
//editar persona
router.post('/persona/editar/conarchivo/',checkAuth , upload.single('fotopersona'), function (request, response) {
  if (request.userData.roll >= 1) {
    var persona = JSON.parse(request.body.persona);
    persona.fotopersona = persona.IDENTIFICACION + request.file.originalname;
    
  personasModel.updatePersonaArc(persona, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });

}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  )
}
});

//editar sin archivo
router.post('/persona/editar',checkAuth , function (request, response) {
  if (request.userData.roll >= 1) {

  personasModel.updatePersona(request, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });

}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  )
}
});


//eliminar persona
router.delete('/persona/eliminar/:id', checkAuth, function (request, response) {
  if (request.userData.roll >= 1) {
  const { id } = request.params;
  personasModel.deletePersona(id, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
  }else{
    response.status(401).json(
      {
        message: 'No autorizado'
      }
    ) 
  }

});

//CRUD OCUPACIONES
router.get('/ocupaciones', checkAuth, function (request, response) {
  ocupacionesModel.getOcupaciones(function (error, data) {
    response.status(200).json(data);
  });
});
//Un ocupacion
router.get('/ocupacion/:id', checkAuth, function (request, response) {
  const { id } = request.params;

  ocupacionesModel.getOcupacionById(id, function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No existe"
      });
    }
  });
});
//insertar ocupacion
router.post('/ocupacion/crear', checkAuth, function (request, response) {
  if (request.userData.roll >= 1) {
  ocupacionesModel.insertOcupacion(request, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});
//editar ocupacion
router.post('/ocupacion/editar', checkAuth, function (request, response) {
  if (request.userData.roll >= 1) {
  ocupacionesModel.updateOcupacion(request, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});
//eliminar ocupacion
router.delete('/ocupacion/eliminar/:id',checkAuth, function (request, response) {
  if (request.userData.roll >= 1) {
  const { id } = request.params;
  ocupacionesModel.deleteOcupacion(id, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});

//crud PROFESIONES
router.get('/profesiones',checkAuth, function (request, response) {
  profesionesModel.getprofesiones(function (error, data) {
    response.status(200).json(data);
  });
});
//Un profesion
router.get('/profesion/:id', checkAuth,function (request, response) {
  const { id } = request.params;

  profesionesModel.getProfesionById(id, function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No existe"
      });
    }
  });
});
//insertar profesion
router.post('/profesion/crear', checkAuth,function (request, response) {
  if (request.userData.roll >= 1) {
  profesionesModel.insertProfesion(request, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});
//editar profesion
router.post('/profesion/editar', checkAuth,function (request, response) {
  if (request.userData.roll >= 1) {
  profesionesModel.updateProfesion(request, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});
//eliminar profesion
router.delete('/profesion/eliminar/:id',checkAuth, function (request, response) {
  if (request.userData.roll >= 1) {
  const { id } = request.params;
  profesionesModel.deleteProfesion(id, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});


//crud BARRIOS
router.get('/barrios', checkAuth,function (request, response) {
  barriosModel.getbarrios(function (error, data) {
    response.status(200).json(data);
  });
});
//Un barrio
router.get('/barrio/:id', checkAuth,function (request, response) {
  const { id } = request.params;

  barriosModel.getBarrioById(id, function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No existe"
      });
    }
  });
});
//insertar barrios
router.post('/barrio/crear',checkAuth, function (request, response) {
  if (request.userData.roll >= 1) {
  barriosModel.insertBarrio(request, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});
//editar barrio
router.post('/barrio/editar',checkAuth, function (request, response) {
  if (request.userData.roll >= 1) {
  barriosModel.updateBarrio(request, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});
//eliminar barrio
router.delete('/barrio/eliminar/:id',checkAuth, function (request, response) {
  if (request.userData.roll >= 1) {
  const { id } = request.params;
  barriosModel.deleteBarrio(id, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});

//crud ESTADO
router.get('/estados',checkAuth, function (request, response) {
  estadosModel.getestados(function (error, data) {
    response.status(200).json(data);
  });
});
//Un estados
router.get('/estado/:id', checkAuth,function (request, response) {
  const { id } = request.params;

  estadosModel.getEstadoById(id, function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No existe"
      });
    }
  });
});
//insertar estados
router.post('/estado/crear', checkAuth,function (request, response) {
  if (request.userData.roll >= 1) {
  estadosModel.insertEstado(request, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});
//editar estados
router.post('/estado/editar', checkAuth,function (request, response) {
  if (request.userData.roll >= 1) {
  estadosModel.updateEstado(request, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});
//eliminar estado
router.delete('/estado/eliminar/:id',checkAuth, function (request, response) {
  if (request.userData.roll >= 1) {
  const { id } = request.params;
  estadosModel.deleteEstados(id, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});

//crud Ministerio 
router.get('/ministerios', checkAuth,function (request, response) {
  ministeriosModel.getMinisterios(function (error, data) {
    response.status(200).json(data);
  });
});
//Un ministerio
router.get('/ministerio/:id', checkAuth,function (request, response) {
  const { id } = request.params;

  ministeriosModel.getMinisterioById(id, function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No existe"
      });
    }
  });
});
//insertar ministerio
router.post('/ministerio/crear', checkAuth,function (request, response) {
  if (request.userData.roll >= 1) {
  ministeriosModel.insertMinisterio(request, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});
//editar ministerio
router.post('/ministerio/editar',checkAuth, function (request, response) {
  if (request.userData.roll >= 1) {
  ministeriosModel.updateMinisterio(request, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});
//eliminar ministerio
router.delete('/ministerio/eliminar/:id',checkAuth, function (request, response) {
  if (request.userData.roll >= 1) {
  const { id } = request.params;
  ministeriosModel.deleteMinisterios(id, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});



//crud Eventos 
router.get('/eventos', checkAuth,function (request, response) {
  eventosModel.getEventos(function (error, data) {
    response.status(200).json(data);
  });
});
//Un eventos
router.get('/evento/:id', checkAuth,function (request, response) {
  const { id } = request.params;

  eventosModel.getEventoById(id, function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No existe"
      });
    }
  });
});
//ver total de evento los eventos
router.get('/eventos/total',checkAuth, function (request, response) {
  eventosModel.getTotalEventos(function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No eventos"
      });
    }
  });
});

router.get('/eventos/paginado/', checkAuth,function (request, response) {

  const { offset, limit } = request.query;
  eventosModel.getEventoPaginate(parseInt(offset), parseInt(limit), function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No eventos"
      });
    }
  });
});

//insertar eventos
router.post('/evento/crear', checkAuth,function (request, response) {
  if (request.userData.roll >= 1) {
  eventosModel.insertEvento(request, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});
//editar eventos
router.post('/evento/editar', checkAuth,function (request, response) {
  if (request.userData.roll >= 1) {
  eventosModel.updateEventos(request, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});
//eliminar eventos
router.delete('/evento/eliminar/:id',checkAuth, function (request, response) {
  if (request.userData.roll >= 1) {
  const { id } = request.params;
  eventosModel.deleteEventos(id, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});



//crud Asistencia 
router.get('/asistencias', checkAuth,function (request, response) {
  asistenciasModel.getAsistencias(function (error, data) {
    response.status(200).json(data);
  });
});
//Un asistencias
router.get('/asistencia/:id', checkAuth,function (request, response) {
  const { id } = request.params;

  asistenciasModel.getAsistenciaById(id, function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No existe"
      });
    }
  });
});
//insertar asistencias
router.post('/asistencia/crear',checkAuth, function (request, response) {
  if (request.userData.roll >= 1) {

    
    
  asistenciasModel.insertAsistencia(request, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});

//eliminar asistencias
router.delete('/asistencia/eliminar/:id',checkAuth, function (request, response) {
  if (request.userData.roll >= 1) {
  const { id } = request.params;
  asistenciasModel.deleteAsistencia(id, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});


//crud Logistica 
router.get('/logisticas', checkAuth,function (request, response) {
  logisticasModel.getLogisticas(function (error, data) {
    response.status(200).json(data);
  });
});
//Un logisticas
router.get('/logistica/:id', checkAuth,function (request, response) {
  const { id } = request.params;

  logisticasModel.getLogisticasById(id, function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No existe"
      });
    }
  });
});
//insertar logisticas
router.post('/logistica/crear', checkAuth,function (request, response) {
  if (request.userData.roll >= 1) {
  logisticasModel.insertLogistica(request, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});

//eliminar logisticas
router.delete('/logistica/eliminar/:id', checkAuth,function (request, response) {
  if (request.userData.roll >= 1) {
  const { id } = request.params;
   
  logisticasModel.deleteLogistica(id, function (error, datos) {

    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(500).json(datos);
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});


//Crud Reportes
//validado
router.get('/reportes/asistencias/', checkAuth, function (request, response) {
  if (request.userData.roll == 1) {
  const { fechaInicio,fechaFin } = request.query;
  reportesModel.getAsistenciasRpt(fechaInicio,fechaFin, function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No eventos"
      });
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});

router.get('/reportes/asistencias/ministerios/', checkAuth, function (request, response) {
  if (request.userData.roll == 1) {
  const { fechaInicio, fechaFin } = request.query;
  reportesModel.getAsistenciasMinisterioRpt(fechaInicio,fechaFin, function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No eventos"
      });
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});



router.get('/reportes/totalgeneros', checkAuth, function (request, response) {
  if (request.userData.roll == 1) {

  reportesModel.getTotalGeneros( function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No eventos"
      });
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});

router.get('/reportes/asistenciapersona/', checkAuth, function (request, response) {
  if (request.userData.roll == 1) {

    const {fechaInicio,fechaFin,cedula} = request.query;
  reportesModel.getAsistenciaPersona( fechaInicio,fechaFin,cedula,function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No eventos"
      });
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});

router.get('/reportes/asistenciainvitados/', checkAuth, function (request, response) {
  if (request.userData.roll == 1) {

    const {fechaInicio,fechaFin} = request.query;
  reportesModel.getInvitados( fechaInicio,fechaFin, function (error, datos) {
    if (datos) {
      response.status(200).json(datos);
    }
    else {
      response.status(404).json({
        "Mensaje": "No eventos"
      });
    }
  });
}else{
  response.status(401).json(
    {
      message: 'No autorizado'
    }
  ) 
}

});








module.exports = router;