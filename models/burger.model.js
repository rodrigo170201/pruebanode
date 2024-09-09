module.exports = (sequelize, Sequelize)=>{
    const Burger = sequelize.define("burger",{
        nombre:{
            type: Sequelize.STRING
        },
        descripcion: {
            type: Sequelize.STRING
        },
        restaurantId:{
            type: Sequelize.INTEGER,
            allowNull:false
        },
    });
    return Burger;
}