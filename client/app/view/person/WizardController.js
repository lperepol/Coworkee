Ext.define('App.view.person.WizardController', {
    extend: 'App.view.widgets.WizardController',
    alias: 'controller.personwizard',

    control: {
        '#': {
            reset: 'refresh'
        }
    },

    refresh: function() {
        console.log("client->app->view->person->WizardController->refresh");
        var vm = this.getViewModel();
        vm.getStore('offices').reload();
        vm.getStore('organizations').reload();
    },

    onNameFieldsBlur: function() {
        console.log("client->app->view->person->WizardController->onNameFieldsBlur");
        var me = this,
            vm = me.getViewModel(),
            record = vm.get('record'),
            firstname = record.get('firstname'),
            lastname = record.get('lastname'),
            username = record.get('username');

        // Don't try to generate a username if the user manually entered a value in
        // the username field or if the firstname and/or lastname fields are empty.
        if (Ext.isEmpty(firstname) || Ext.isEmpty(lastname) ||
            (!Ext.isEmpty(username) && me._generatedUsername !== username)) {
            return;
        }

        me._generatedUsername = true;
        Server.people.generateUsername({
            firstname: firstname,
            lastname: lastname
        }, function(result, response, success) {
            if (success && me._generatedUsername === true) {
                me._generatedUsername = result;
                record.set('username', result);
            }
        });
    },

    onUsernameChange: function(field, value) {
        console.log("client->app->view->person->WizardController->onUsernameChange");
        // If the username field changed and is different from the last generated value, then
        // the user has manually entered a value that we don't want to overwrite, so let's
        // cancel the current generating process (if any) and reset the generated value.
        if (value !== this._generatedUsername) {
            this._generatedUsername = false;
        }
    },

    doPasswordMatch: function(value) {
        console.log("client->app->view->person->WizardController->doPasswordMatch");
        return this.lookup('password').getValue() !== value?
            'Passwords do not match' :
            true;
    }
});
