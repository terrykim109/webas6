const app = require('../user-api/server');

module.exports = (req, res) => {
    app(req, res);
};
