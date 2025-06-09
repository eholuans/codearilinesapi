const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const { testConnection } = require('./config/database');
const apiRoutes = require('./routes/apiRoutes');

const app = express();


app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


testConnection()
  .then(connected => {
    if (connected) {
      console.log('Banco de dados conectado com sucesso!');
    } else {
      console.warn('Não foi possível conectar ao banco de dados. Verifique as configurações.');
    }
  })
  .catch(err => {
    console.error('Erro ao testar conexão com o banco de dados:', err);
  });


app.post('/api/buscar-passageiro', apiRoutes.buscarPassageiro);
app.post('/api/registrar-bagagem', apiRoutes.registrarBagagem);
app.put('/api/bagagem/:id/status', apiRoutes.atualizarStatusBagagem);
app.get('/api/voos', apiRoutes.listarVoos);


app.get('/', (req, res) => {
  res.render('splash');
});

app.get('/inicio', (req, res) => {
  res.render('inicio');
});

app.get('/etiqueta', (req, res) => {
  res.render('etiqueta');
});

app.get('/codigo', (req, res) => {
  const tipo = req.query.tipo || 'reserva';
  res.render('codigo', { tipo });
});


app.get('/resultado', (req, res) => {
  res.render('resultado');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
