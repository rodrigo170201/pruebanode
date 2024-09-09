module.exports =(sequelize, Sequelize)=>{
    const Restaurant = sequelize.define("restaurant",{
        nombre:{
            type:Sequelize.STRING
        },
        descripcion:{
            type: Sequelize.STRING
        }
    });
    return Restaurant;
}