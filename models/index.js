const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: "mysql",
    }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

/*db.personas = require("./persona.model.js")(sequelize, Sequelize);
db.mascotas = require("./mascota.model.js")(sequelize, Sequelize);
db.competencias = require("./competencia.model.js")(sequelize, Sequelize);*/

db.usuarios = require("./usuario.model.js")(sequelize, Sequelize);
db.burgers = require("./burger.model.js")(sequelize, Sequelize);
db.restaurants = require("./restaurant.model.js")(sequelize, Sequelize);
db.reviews = require("./review.model.js")(sequelize, Sequelize);

// one to many o many to one
db.restaurants.hasMany(db.burgers, { as: "burgers" });
db.burgers.belongsTo(db.restaurants, {
    foreignKey: "restaurantId",
    as: "restaurant",
});

// Burgers -> Reviews (one to many) check 2
db.burgers.hasMany(db.reviews, { as: "reviews", foreignKey: "burgerId" });
db.reviews.belongsTo(db.burgers, {
    foreignKey: "burgerId",
    as: "burger",
});

// Restaurants -> Reviews (optional: if you want direct relationship)
db.restaurants.hasMany(db.reviews, { as: "reviews", foreignKey: "restaurantId" });
db.reviews.belongsTo(db.restaurants, {
    foreignKey: "restaurantId",
    as: "restaurant",
});

// Users -> Reviews (one to many) check 1
db.usuarios.hasMany(db.reviews, { as: "reviews", foreignKey: "userId" });
db.reviews.belongsTo(db.usuarios, {
    foreignKey: "userId",
    as: "user",
});

module.exports = db;