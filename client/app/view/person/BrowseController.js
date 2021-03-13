Ext.define('App.view.person.BrowseController', {
    extend: 'App.view.widgets.BrowseController',
    alias: 'controller.personbrowse',

    control: {
        '#': {
            reset: 'refresh'
        }
    },

    refresh: function() {
        console.log("client->app->view->person->BrowseController->refresh");
        
        var vm = this.getViewModel();
        vm.getStore('offices').reload();
        vm.getStore('organizations').reload();
    },

    onCreate: function() {
        console.log("client->app->view->person->BrowseController->onCreate");
        this.redirectTo('person/create');
    }
});
