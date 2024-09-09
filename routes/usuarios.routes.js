const { requireUser } = require("../middlewares/requires-user.js");

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/usuario.controller.js");

    router.get("/", requireUser, controller.listUsuario);
    router.get("/:id/edit", requireUser, controller.editUsuario);
    router.post("/:id/edit", requireUser, controller.updateUsuario);
    router.post("/:id/delete", requireUser, controller.deleteUsuario);

    app.use('/usuarios', router);

};