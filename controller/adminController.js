var adminModel = require('../model/adminModel.js');


exports.loginPage = function(req, res) {

    res.render("auth/login", {
      layout: false,
      title: "Book  App",
    });
}
