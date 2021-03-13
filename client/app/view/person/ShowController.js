Ext.define('App.view.person.ShowController', {
    extend: 'App.view.widgets.ShowController',
    alias: 'controller.personshow',

    doAction: function(type) {
        console.log("client->app->view->person->ShowController->doAction");
        
        this.fireEvent('actionexec', type, this.getRecord(), true);
    },

    onRecordChange: function(view, record) {
        console.log("client->app->view->person->ShowController->onRecordChange");
        var vm = this.getViewModel(),
            history = vm.getStore('history'),
            coworkers = vm.getStore('coworkers');

        history.removeAll();
        coworkers.removeAll();

        if (record) {
            history.filter('recipient_id', record.get('id'));
            history.load();

            coworkers.filter([
                { property: 'organization_id', value: record.get('organization_id') },
                { property: 'id', value: record.get('id'), operator: '!=' }
            ]);

            coworkers.load();
        }

        this.callParent(arguments);
    },

    onCallTap: function() {
        console.log("client->app->view->person->ShowController->onCallTap");
        this.doAction('phone');
    },

    onSkypeTap: function() {
        console.log("client->app->view->person->ShowController->onSkypeTap");
        this.doAction('skype');
    },

    onEmailTap: function() {
        console.log("client->app->view->person->ShowController->onEmailTap");
        this.doAction('email');
    },

    onLinkedInTap: function() {
        console.log("client->app->view->person->ShowController->onLinkedInTap");
        this.doAction('linkedin');
    },

    onOfficeHeadcountTap: function() {
        console.log("client->app->view->person->ShowController->onOfficeHeadcountTap");
        var office = this.getRecord().getOffice();
        this.redirectTo('people/office/' + office.getId())
    },

    onOrganizationHeadcountTap: function() {
        console.log("client->app->view->person->ShowController->onOrganizationHeadcountTap");
        var organization = this.getRecord().getOrganization();
        this.redirectTo('people/organization/' + organization.getId())
    }
});
