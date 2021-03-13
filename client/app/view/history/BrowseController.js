Ext.define('App.view.history.BrowseController', {
    extend: 'App.view.widgets.BrowseController',
    alias: 'controller.historybrowse',

    control: {
        '#': {
            reset: 'refresh'
        }
    },

    refresh: function() {
        console.log("client->app->view->history->BrowseController->refresh");
        
        var vm = this.getViewModel();
        vm.getStore('offices').reload();
        vm.getStore('organizations').reload();
        vm.getStore('recipients').reload();
        vm.getStore('types').reload();
    },

    onDeleteAction: function(list, data) {
        console.log("client->app->view->history->BrowseController->onDeleteAction");
        var store = this.getViewModel().getStore('history');
        store.remove(data.record);
        store.save();
    }
});
