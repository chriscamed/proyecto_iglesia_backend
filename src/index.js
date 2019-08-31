const express = require('express');
const app = express();
const cors= require('cors');

var checkAuth = require('./middleware/check-auth');
// Settings
app.set('port', process.env.PORT || 5000);

app.use(cors());
// Middlewares

//permite recibir Json
app.use(express.json());

//Routes
app.use('/uploads', checkAuth, express.static('src/uploads'));

app.use(require('./routes'));

app.listen(app.get('port'), ()=>{
    console.log('server run ', app.get('port'));
});