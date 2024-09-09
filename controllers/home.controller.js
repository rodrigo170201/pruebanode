const db = require("../models");
const sha1 = require('sha1');

exports.concatenar = (req, res) => {
    // eslint-disable-next-line no-undef
    res.sendFile(__dirname + '/views/index.html')
}
exports.holamundo = (req, res) => {
    res.send('Hola Mundo');
}
exports.respuestaPost = (req, res) => {
    console.log('Su nombre es: ' + req.body.nombre)
    res.send('Su nombre es: ' + req.body.nombre + ' ' + req.body.apellido)
}
exports.respuestaGet = (req, res) => {
    const nombre = req.query.nombre;
    const apellido = req.query.apellido;
    res.send('Su nombre es: ' + nombre + ' ' + apellido)
}
exports.respuestaTexto = (req, res) => {
    const nombre = req.query.nombre;
    const apellido = req.query.apellido;
    res.render('respuesta.ejs', { nombre: nombre, apellido: apellido });
}
exports.login = async function (req, res) {
    res.render('usuarios/login.ejs', { errors: null });
}
exports.authenticate = async function (req, res) {
    const usuario = await db.usuarios.findOne({
        where: {
            email: req.body.email,
            password: sha1(req.body.password)
        }
    });
    if (usuario) {
        req.session.usuario = usuario;
        req.session.userId = usuario.id;
        res.redirect('/');
    } else {
        res.render('usuarios/login.ejs', { errors: { message: 'Usuario o contraseña incorrectos' } });
    }
}
exports.logout = async function (req, res) {
    req.session.usuario = null;
    res.redirect('/login');
}
exports.index = async function (req, res) {
    res.render('dashboard.ejs');
}
exports.createUsuario = async function (req, res) {
    res.render('usuarios/form.ejs', { usuario: null, errors: null });
}
exports.insertUsuario = async function (req, res) {
    const { errors, usuario } = validateUsuarioForm(req);
    if (errors) {
        res.render('usuarios/form.ejs', { usuario: usuario, errors: errors });
        return;
    }
    db.usuarios.create({
        email: req.body.email,
        password: sha1(req.body.password),
    }).then(() => {
        res.redirect('/usuarios');
    });
}
const validateUsuarioForm = function (req) {
    if (!req.body.email || !req.body.password) {
        const errors = {
            email: !req.body.email,
            password: !req.body.password
        };
        errors.message = 'Todos los campos son obligatorios';
        const usuario = {
            email: req.body.email,
            password: req.body.password
        };
        return { errors, usuario };
    }
    return { errors: null, usuario: null };
}