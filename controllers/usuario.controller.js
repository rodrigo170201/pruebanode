const db = require("../models");
const sha1 = require('sha1');
exports.listUsuario = async function (req, res) {
    const usuarios = await db.usuarios.findAll({
        include: 'persona'
    });
    res.render('usuarios/list.ejs', { usuarios: usuarios });

}

exports.editUsuario = async function (req, res) {
    const id = req.params.id;
    const usuario = await db.usuarios.findByPk(id);

    res.render('usuarios/form.ejs', { usuario: usuario, errors: null });
}
exports.updateUsuario = async function (req, res) {
    const validacion = validateUsuarioForm(req);
    const errors = validacion.errors;
    const usuarioErrors = validacion.usuario;
    if (errors) {

        res.render('usuarios/form.ejs', { usuario: usuarioErrors, errors: errors });
        return;
    }
    const id = req.params.id;
    const usuario = await db.usuarios.findByPk(id);

    usuario.email = req.body.email;
    usuario.password = req.body.password;
    await usuario.save();
    res.redirect('/usuarios');
}
exports.deleteUsuario = async function (req, res) {
    const id = req.params.id;
    const usuario = await db.usuarios.findByPk(id);
    await usuario.destroy();
    res.redirect('/usuarios');
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