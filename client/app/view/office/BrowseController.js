Ext.define('App.view.office.BrowseController', {
    extend: 'App.view.widgets.BrowseController',
    alias: 'controller.officebrowse',

    control: {
        '#': {
            reset: 'refresh'
        }
    },

    refresh: function() {
        console.log("client->app->view->office->BrowseController->refresh");
        
        var vm = this.getViewModel();
        vm.getStore('countries').reload();
    },

    onCreate: function() {
        console.log("client->app->view->office->BrowseController->onCreate");
        this.redirectTo('office/create');
    }
});
