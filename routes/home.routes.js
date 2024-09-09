module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/home.controller.js");

    router.get("/login", controller.login);
    router.post("/login", controller.authenticate);
    router.get("/register", controller.createUsuario);
    router.post("/register", controller.insertUsuario);
    router.get("/logout", controller.logout);
    router.get('/concatenar', controller.concatenar);
    router.get('/holamundo', controller.holamundo);
    router.post('/respuesta', controller.respuestaPost);
    router.get('/respuesta', controller.respuestaGet);
    router.get('/respuestatexto', controller.respuestaTexto);
    router.get('/', controller.index);
    app.use('/', router);

};