module.exports = app => {
    require('./usuarios.routes')(app);
    require('./home.routes')(app);
    require('./burger.routes')(app);
    require('./restaurant.routes')(app);
    require('./review.routes')(app);
}