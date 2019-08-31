var bcrypt = require( 'bcrypt');
var jwt  = require(  'jsonwebtoken');
require('dotenv').config();
var User  = require(  './models/user');

const auth = {
    checkHeaders: async (req, res, next) =>{
        const token = req.headers["x-token"]
        
        if(token){
            try{
                const {user} = jwt.verify(token, process.env.SECRET)
                req.user = user
                
            }catch(error){
                //INVALID token
                const newToken = await auth.checkToken(token);
                req.user = newToken.user
               
                if(newToken.token){
                    res.set("Access-Control-Expose-Headers", "x-token")
                    res.set("x-token", newToken.token)
                }
            }
        }
        
        next()
    },
    checkToken: async (token) =>{
        
        let idUser=null;
        try{
            const {user} = jwt.decode(token);
            idUser = user;
        }catch(e){
            return {}
        }
        const user = await models.User.findOne({_id:idUser});
        const [newToken] = auth.getToken(user);
        return {
            user: user._id,
            token: newToken
        }
    },
    getToken: async (user)=>{
        const newToken = await jwt.sign(user, process.env.SECRET, { expiresIn: '5d'})
        
        return [newToken];

    },
    
    login: async (usuario, password)=>{
        
        User.getUserLogin(usuario, function(error, datos)
        {            
          if (datos)
          {
            const validPassword =  await bcrypt.compare(password, datos.PASS);
            if(validPassword){
                

                const [newToken] = await auth.getToken({id: datos.ID_USUARIO, user: datos.USUARIO, rol: datos.ROL}, process.env.SECRET);

        
                return{
                    success: true,
                    token: newToken,
                    errors: []
                }

               
            }else{
                return{
                    success: false,
                    token: null,
                    errors: []
                }
            }
            
          }
          else
          {
            return{
                success: false,
                token: null,
                errors: []
            }          
        }
        
    });

       

        
        }

    }
    
    



export default auth