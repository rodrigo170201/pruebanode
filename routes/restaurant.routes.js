const { requireUser } = require("../middlewares/requires-user");

module.exports = app => {
    let router = require("express").Router();
    const restaurantController = require("../controllers/restaurant.controller");

    router.get("/",requireUser,restaurantController.listRestaurant);
    router.get("/create",requireUser,restaurantController.createRestaurant);
    router.post("/create", requireUser,restaurantController.insertRestaurant);
    // Ruta para mostrar el formulario de edición de restaurante
    router.get('/:id/edit', requireUser, restaurantController.editRestaurant);
    // Ruta para actualizar un restaurante
    router.post('/:id/edit', requireUser, restaurantController.updateRestaurant);
    // Ruta para eliminar un restaurante
    router.post('/:id/delete', requireUser, restaurantController.deleteRestaurant);
    // Ruta para listar hamburguesas por restaurante
    router.get('/:id/burgers', requireUser, restaurantController.listBurgersByRestaurant);

    
    app.use('/restaurants',router);
}