const db = require("../models");
exports.listReviews = async (req, res) => {
    try {
        const reviews = await db.reviews.findAll({
            include: [
                {
                    model: db.burgers,
                    as: 'burger',
                    include: [
                        {
                            model: db.restaurants,
                            as: 'restaurant', // Incluye el restaurante asociado
                            attributes: ['nombre']
                        }
                    ],
                    attributes: ['nombre']
                },
                {
                    model: db.usuarios, // Incluye el usuario asociado
                    as: 'user',
                    attributes: ['email']
                }
            ],
            attributes: ['puntuacion', 'descripcion','userId']
        });
        res.render('review/list.ejs', { reviews,loggedInUserId:req.session.userId });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al listar las reseñas");
    }
};

exports.showReviewForm = async (req, res) => {
    try {
        // Obtener todos los restaurantes para el select
        const restaurants = await db.restaurants.findAll({
            attributes: ['id', 'nombre']
        });

        res.render('review/form.ejs', { restaurants });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al mostrar el formulario de reseñas");
    }
};


exports.createReview = async (req, res) => {
    try {
        const { puntuacion, descripcion, burgerId} = req.body;
        const userId = req.session.userId; // Supongamos que usas sesiones

        // Verifica si el usuario ya ha dejado una reseña para esta hamburguesa
        const existingReview = await db.reviews.findOne({
            where: { userId, burgerId }
        });

        if (existingReview) {
            res.status(400).send("Ya has dejado una reseña para esta hamburguesa");
            return;
        }

        // Crear la reseña si no existe una previa
        await db.reviews.create({
            puntuacion,
            descripcion,
            burgerId,
            userId
        });

        res.redirect('/reviews');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al crear la reseña");
    }
};

exports.getBurgersByRestaurant = async (req, res) => {
    try {
        const restaurantId = req.query.restaurantId;
        console.log("Restaurant ID recibido: ", restaurantId); // Para verificar si llega bien
        
        if (!restaurantId) {
            return res.status(400).json({ message: 'Restaurant ID is required' });
        }

        const burgers = await db.burgers.findAll({
            where: { restaurantId: restaurantId }
        });

        console.log("Hamburguesas obtenidas: ", burgers); // Verificar si se obtienen hamburguesas
        res.json(burgers);
    } catch (error) {
        console.error('Error al obtener hamburguesas:', error);
        res.status(500).json({ message: 'Error al obtener hamburguesas' });
    }
};


// Método para eliminar una reseña
exports.deleteReview = async (req, res) => {
    const { id } = req.params; // Obtén el ID de la reseña desde los parámetros de la URL
    const userId = req.session.userId; // Obtén el ID del usuario logueado desde la sesión

    try {
        // Verifica si la reseña existe
        const review = await db.reviews.findByPk(id);

        if (!review) {
            console.log('El id es: ', review)
            return res.status(404).send('Reseña no encontrada'); // Si la reseña no existe, retorna un error 404
        }

        // Verifica si el usuario logueado es el autor de la reseña
        if (review.userId !== userId) {
            return res.status(403).send('No tienes permiso para eliminar esta reseña'); // Si no es el autor, retorna un error 403
        }

        await review.destroy();
        res.redirect('/reviews'); 
    } catch (error) {
        console.error('Error al eliminar la reseña:', error);
        res.status(500).send('Error al eliminar la reseña'); 
    }
};
