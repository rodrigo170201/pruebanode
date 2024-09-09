const { requireUser } = require("../middlewares/requires-user.js");
const express = require('express');

module.exports = app => {
    let router = express.Router();
    const burgerController = require("../controllers/burger.controller.js");

    
    router.get("/", requireUser, burgerController.listBurger);
    router.get("/create", requireUser, burgerController.createBurger);
    router.post("/create", requireUser, burgerController.insertBurger);
    
    router.get("/:id/edit", requireUser, burgerController.editBurger);
    router.post("/:id/edit", requireUser, burgerController.updateBurger);
    
    router.post("/:id/delete", requireUser, burgerController.deleteBurger);
    router.get("/catalogo", requireUser, burgerController.catalogoBurger);
    
    router.get('/:id/upload-photo', requireUser, burgerController.uploadPhotoGet);
    router.post('/:id/upload-photo', requireUser, (req, res, next) => {
        console.log(req.files); // Verifica si el archivo se está recibiendo
        next();
    }, burgerController.uploadPhotoPost);

    router.get('/:id/reviews',requireUser, burgerController.reviewsByBurger);
    app.use('/burgers', router);
};
