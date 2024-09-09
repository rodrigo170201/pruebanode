const db = require("../models");


exports.catalogoBurger = function (req, res) {
    db.burgers.findAll().then(burgers => {
        res.render('burger/catalogo.burger.ejs', { burgers: burgers });
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error al mostrar el catálogo de burgers");
    });
};

exports.listBurger = function (req, res) {
    db.burgers.findAll({
        include: [{
            model: db.restaurants, 
            as: 'restaurant' 
        }]
    }).then(burgers => {
        res.render('burger/list.ejs', { burgers: burgers });
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error al listar las burgers");
    });
};


exports.createBurger = async function (req, res) {
    const restaurants = await db.restaurants.findAll();
    res.render('burger/form.ejs', { burger: null,restaurants, errors: null });
};

exports.insertBurger = function (req, res) {
    const { errors, burger } = validateBurgerForm(req);
    if (errors) {
        res.render('burger/form.ejs', { burger: burger, errors: errors });
        return;
    }
    db.burgers.create({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        restaurantId:req.body.restaurantId
    }).then(() => {
        res.redirect('/burgers');
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error al insertar la burger");
    });
};

exports.editBurger = async function (req, res) {
    const id = req.params.id;
    try {
        const burger = await db.burgers.findByPk(id);
        if (!burger) {
            return res.status(404).send('Burger no encontrada');
        }

        // Obtener la lista de restaurantes
        const restaurants = await db.restaurants.findAll();

        // Renderizar la vista de edición con la burger y la lista de restaurantes
        res.render('burger/form.ejs', { burger: burger, restaurants: restaurants, errors: null });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener la hamburguesa para edición");
    }
};

exports.updateBurger = async function (req, res) {
    const { id } = req.params;
    const { nombre, descripcion, restaurantId } = req.body;

    // Validar campos requeridos
    if (!nombre || !descripcion || !restaurantId) {
        const errors = {
            message: 'Todos los campos son obligatorios',
            nombre: !nombre,
            descripcion: !descripcion,
            restaurantId: !restaurantId
        };
        // Renderiza el formulario con errores
        const restaurants = await db.restaurants.findAll();
        res.render('burger/form.ejs', { burger: { id, nombre, descripcion, restaurantId }, errors: errors, restaurants });
        return;
    }

    try {
        // Actualiza la hamburguesa en la base de datos
        await db.burgers.update({ nombre, descripcion, restaurantId }, { where: { id } });

        // Redirige a la lista de hamburguesas
        res.redirect('/burgers');
    } catch (err) {
        console.error('Error al actualizar la hamburguesa:', err);
        res.status(500).send('Error al actualizar la hamburguesa');
    }
};


exports.deleteBurger = async function (req, res) {
    const id = req.params.id;
    const burger = await db.burgers.findByPk(id);

    if (!burger) {
        return res.status(404).send('Burger no encontrada');
    }

    await burger.destroy();
    res.redirect('/burgers');
};

const validateBurgerForm = function (req) {
    if (!req.body.nombre || !req.body.descripcion) {
        const errors = {
            nombre: !req.body.nombre,
            descripcion: !req.body.descripcion
        };
        errors.message = 'Todos los campos son obligatorios';

        const burger = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion
        };
        return { errors, burger };
    }
    return { errors: null, burger: null };
};
exports.uploadPhotoGet = async function (req, res) {
    const id = req.params.id;
    const burger = await db.burgers.findByPk(id);
    res.render('burger/uploadPhoto', { burger: burger, errors: null }); // Sin extensión
};
exports.uploadPhotoPost = async function (req, res) {
    try {
        const id = req.params.id;
        const burger = await db.burgers.findByPk(id);

        if (!req.files?.photo) {
            res.render('burger/uploadPhoto.ejs', { errors: { message: 'Debe seleccionar una imagen' }, burger });
            return;
        }

        const image = req.files.photo;
        // eslint-disable-next-line no-undef
        const path = __dirname + '/../public/images/burgers/' + burger.id + '.jpg'; // Ruta a la carpeta de imágenes de hamburguesas

        image.mv(path, function (err) {
            if (err) {
                console.log(err);
                res.render('burger/uploadPhoto.ejs', { errors: { message: 'Error al subir la imagen' }, burger });
                return;
            }
            res.redirect('/burgers'); // Redirige a la lista de hamburguesas después de subir la imagen
        });

    } catch (error) {
        console.error('Error al procesar la carga de la imagen:', error);
        res.status(500).send('Error al procesar la carga de la imagen');
    }
};



// Método para mostrar reseñas de una hamburguesa
exports.reviewsByBurger = async (req, res) => {
    const burgerId = req.params.id;
    try {
        // Obtener la hamburguesa
        const burger = await db.burgers.findByPk(burgerId);

        if (!burger) {
            return res.status(404).send('Hamburguesa no encontrada');
        }

        // Obtener las reseñas de la hamburguesa e incluir el usuario que la escribió
        const reviews = await db.reviews.findAll({ 
            where: { burgerId: burgerId },
            include: [{
                model: db.usuarios, // Incluir el modelo de usuarios
                as: 'user', // Alias de la relación
                attributes: ['email'] // Solo obtener el campo email del usuario
            }]
        });
        // Renderizar la vista de reseñas
        res.render('burger/reviewbyburger', { burger, reviews });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener las reseñas");
    }
};
