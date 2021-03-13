"use strict";

var helpers = require('../utils/helpers.js');
var session = require('../utils/session.js');
var errors = require('../utils/errors.js');
var models = require('../models');

function writableFields(params) {
    return helpers.extractFields(params, [
        'name',
        'address',
        'postcode',
        'region',
        'city',
        'country',
        'location'
    ]);
}

var Service = {
    list: function(params, callback, sid, req) {
        console.log("offices->Service->list");
        
        session.verify(req).then(function() {
            return models.Office.scope('nested').findAndCountAll(
                helpers.sequelizify(params, models.Office));
        }).then(function(result) {
            callback(null, {
                total: result.count,
                data: result.rows
            });
        }).catch(function(err) {
            callback(err);
        });
    },

    insert: function(params, callback, sid, req) {
        console.log("offices->Service->insert");
        session.verify(req).then(function() {
            return models.sequelize.transaction(function(t) {
                return models.Office.create(writableFields(params), {
                    transaction: t
                }).then(function(row) {
                    if (session.readonly) {
                        throw errors.types.readonly();
                    }
                    return row;
                });
            });
        }).then(function(row) {
            callback(null, { data: row });
        }).catch(function(err) {
            callback(errors.parse(err));
        });
    },

    update: function(params, callback, sid, req) {
        console.log("offices->Service->update");
        session.verify(req).then(function() {
            if (!params.id) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Missing required parameter: id',
                });
            }
            return models.Office.scope('nested').findOne({
                where: {
                    id: params.id
                }
            });
        }).then(function(row) {
            if (!row) {
                throw errors.types.invalidParams({
                    path: 'id', message: 'Office with the specified id cannot be found',
                });
            }
            return models.sequelize.transaction(function(t) {
                return row.update(writableFields(params), {
                    transaction: t
                }).then(function(row) {
                    if (session.readonly) {
                        throw errors.types.readonly();
                    }
                    return row;
                });
            });
        }).then(function(row) {
            // reload record data in case associations have been updated.
            return row.reload();
        }).then(function(row) {
            callback(null, {
                data: [ row ],
                total: 1
            });
        }).catch(function(err) {
            callback(errors.parse(err));
        });
    },

    remove: function(params, callback, sid, req) {
        console.log("offices->Service->remove");
        session.verify(req).then(function() {
            throw errors.types.notImplemented();
        }).catch(function(err) {
            callback(err);
        });
    },

    filters: function(params, callback, sid, req) {
        console.log("offices->Service->filters");
        session.verify(req).then(function() {
            return helpers.fetchFilters(params, models.Office);
        }).then(function(results) {
            callback(null, {
                data: results
            });
        }).catch(function(err) {
            callback(err);
        });
    }
};

module.exports = Service;
