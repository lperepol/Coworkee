Ext.define('App.model.Session', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'token', type: 'string' },
        { name: 'expires', type: 'date' },
        { name: 'user', reference: 'Person' }
    ],

    statics: {
        login: function(username, password) {
            console.log("client->app->model->Session->statics->login");
            
            return new Ext.Promise(function (resolve, reject) {
                Server.auth.login({
                    username: username,
                    password: password
                }, function(result, response, success) {
                    if (!success) {
                        return reject(result.message);
                    }

                    var session = App.model.Session.loadData(result);
                    if (!session.isValid()) {
                        return reject({ errors: {
                            username: 'Login failed: invalid session'
                        }});
                    }

                    resolve(session);
                });
            });
        }
    },

    isValid: function() {
        console.log("client->app->model->Session->isValid");
        return !Ext.isEmpty(this.get('token'))
            && this.get('expires') > new Date()
            && this.getUser() !== null;
    },

    logout: function() {
        console.log("client->app->model->Session->logout");
        return new Ext.Promise(function (resolve, reject) {
            Server.auth.logout({}, resolve);
        });
    }
});
