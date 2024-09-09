module.exports = (sequelize, Sequelize)=>{
    const Review = sequelize.define("review",{
       puntuacion:{
        type:Sequelize.INTEGER
       },
       descripcion:{
        type:Sequelize.STRING
       },
       
       burgerId:{
        type: Sequelize.INTEGER,
        allowNull:false
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
    return Review;
}