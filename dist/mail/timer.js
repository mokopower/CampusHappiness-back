"use strict";

var schedule = require('node-schedule');

var Models = require('../models/index.js');

var mailer = require('./mailer');

var id_generator = require('../custom_module/id_generator');

var scheduler = function scheduler() {
  schedule.scheduleJob('0 * * * * *', function () {
    Models.User.findAll({
      include: [{
        model: Models.Group
      }]
    }).then(function (users) {
      users.forEach(function (data) {
        var sondage_id = data.dataValues.group.dataValues.sondage_id;
        Models.JourSondage.findOrCreate({
          where: {
            date_emmission: Date.now(),
            sondage_id: sondage_id
          },
          defaults: {
            id: id_generator(),
            date_emmission: Date.now(),
            sondage_id: sondage_id,
            nombre_emission: 0
          }
        }).spread(function (jourSondage, created) {
          var token = data.generateJwt(sondage_id);
          var diff = Date.now() - data.dataValues.lastMailDate;

          if (data.dataValues.mailIntensity < diff / (1000 * 60 * 60 * 24) + 0.4) {
            mailer(data.dataValues, token);
            Models.User.update({
              lastMailDate: Date.now()
            }, {
              where: {
                id: data.dataValues.id
              }
            });
            jourSondage.increment({
              nombre_emission: 1
            });
          }
        });
      });
    });
    /**/
  });
};

module.exports = scheduler;
//# sourceMappingURL=timer.js.map