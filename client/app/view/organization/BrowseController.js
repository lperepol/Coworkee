Ext.define('App.view.organization.BrowseController', {
    extend: 'App.view.widgets.BrowseController',
    alias: 'controller.organizationbrowse',

    control: {
        '#': {
            reset: 'refresh'
        }
    },

    refresh: function() {
        console.log("client->app->view->organization->BrowseController->refresh");
        
        var vm = this.getViewModel();
        vm.getStore('managers').reload();
    },

    onCreate: function() {
        console.log("client->app->view->organization->BrowseController->onCreate");
        this.redirectTo('organization/create');
    }
});
