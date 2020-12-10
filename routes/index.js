const cloudinary = require('./cloudinary')

module.exports = (router) => {
    router.get('/api', function(req, res) {
        res.send('API Prixz 1.0');
    });

    cloudinary(router)
    return router
};