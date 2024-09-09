const express = require('express');
const reviewController = require('../controllers/review.controller.js');
const { requireUser } = require("../middlewares/requires-user");

module.exports = app => {
    const router = express.Router();

    router.get("/", requireUser, reviewController.listReviews);
    // Ruta para mostrar el formulario
    router.get('/create',requireUser, reviewController.showReviewForm);

    router.post("/create",requireUser, reviewController.createReview);
    //Ruta para obtener las hamburguesas del restaurant seleccionado
    router.get('/api/burgers',requireUser,reviewController.getBurgersByRestaurant);
    //Ruta para eliminar un review
    router.post('/:id/delete',requireUser, reviewController.deleteReview);




    app.use('/reviews', router);
};
