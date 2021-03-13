Ext.define('App.view.phone.person.BrowseController', {
    extend: 'App.view.person.BrowseController',
    alias: 'controller.phone-personbrowse',

    onPhoneTap: function(button, event) {
        console.log("client->app->view->phone->person->BrowseController->onPhoneTap");
        
        var list = this.lookup('list'),
            record = list.mapToRecord(event);

        this.doAction('phone', record);
    },

    onSkypeAction: function(list, data) {
        console.log("client->app->view->phone->person->BrowseController->onSkypeAction");
        this.doAction('skype', data.record);
    },

    onEmailAction: function(list, data) {
        console.log("client->app->view->phone->person->BrowseController->onEmailAction");
        this.doAction('email', data.record);
    },

    doAction: function(type, record) {
        console.log("client->app->view->phone->person->BrowseController->doAction");
        this.fireEvent('actionexec', type, record);
    }
});
