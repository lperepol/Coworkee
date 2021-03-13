Ext.define('App.view.organization.WizardController', {
    extend: 'App.view.widgets.WizardController',
    alias: 'controller.organizationwizard',

    control: {
        '#': {
            reset: 'refresh'
        }
    },

    refresh: function() {
        console.log("client->app->view->organization->WizardController->refresh");
        
        this.getViewModel().getStore('managers').reload();
    }
});
