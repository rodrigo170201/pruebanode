const db = require("../models");

//Endpoint para ver la lista de restaurants que hay
exports.listRestaurant = function (req, res) {
    db.restaurants.findAll()
        .then(restaurants => {
            res.render('restaurant/list.ejs', { restaurants: restaurants });
        })
        .catch(error => {
            res.status(500).send({ message: 'Error al listar los restaurantes', error });
        });
};

//Endpoint para ingresar al formulario para insertar restaurant
exports.createRestaurant = function (req, res) {
    res.render('restaurant/form.ejs', { restaurant: null, errors: null });
};

//Endpoint para insertar Restaurant
exports.insertRestaurant = function (req, res) {
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
        const errors = {
            message: 'Todos los campos son obligatorios',
            nombre: !nombre,
            descripcion: !descripcion
        };
        res.render('restaurant/form.ejs', { restaurant: req.body, errors: errors });
        return;
    }

    db.restaurants.create({
        nombre: nombre,
        descripcion: descripcion
    }).then(() => {
        res.redirect('/restaurants');
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error al crear el restaurante");
    });
};


// Endpoint para ingresar al formulario para editar un restaurante
exports.editRestaurant = function (req, res) {
    const { id } = req.params;
    db.restaurants.findByPk(id)
        .then(restaurant => {
            if (restaurant) {
                res.render('restaurant/form.ejs', { restaurant: restaurant, errors: null });
            } else {
                res.status(404).send("Restaurante no encontrado");
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error al obtener el restaurante");
        });
};

// Endpoint para actualizar un restaurante
exports.updateRestaurant = function (req, res) {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
        const errors = {
            message: 'Todos los campos son obligatorios',
            nombre: !nombre,
            descripcion: !descripcion
        };
        res.render('restaurant/form.ejs', { restaurant: { id, nombre, descripcion }, errors: errors });
        return;
    }

    db.restaurants.update({ nombre, descripcion }, { where: { id } })
        .then(() => {
            res.redirect('/restaurants');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error al actualizar el restaurante");
        });
};

// Endpoint para eliminar un restaurante
exports.deleteRestaurant = function (req, res) {
    const { id } = req.params;
    db.restaurants.destroy({ where: { id } })
        .then(() => {
            res.redirect('/restaurants');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error al eliminar el restaurante");
        });
};

// Endpoint para listar hamburguesas por restaurante
exports.listBurgersByRestaurant = async (req, res) => {
    const { id } = req.params;
    try {
        // Obtener el restaurante
        const restaurant = await db.restaurants.findByPk(id);

        if (!restaurant) {
            return res.status(404).send('Restaurante no encontrado');
        }

        // Obtener las hamburguesas asociadas al restaurante
        const burgers = await db.burgers.findAll({ where: { restaurantId: id } });

        res.render('restaurant/listbyburger.ejs', { restaurant, burgers });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener las hamburguesas");
    }
};
