Ext.define('App.view.main.MenuController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mainmenu',

    collapse: function() {
        console.log("client->app->view->main->MenuController->collapse");
        
        this.getView().setExpanded(false);
    },

    onTriggerTap: function() {
        console.log("client->app->view->main->MenuController->onTriggerTap");
        var view = this.getView();
        view.setExpanded(!view.getExpanded());
    },

    onMenuChildTap: function(menu, location) {
        console.log("client->app->view->main->MenuController->onMenuChildTap");
        var record = location.record;
        if (record) {
            this.redirectTo(record.getId());
            this.collapse();
        }
    },

    onProfileTap: function() {
        console.log("client->app->view->main->MenuController->onProfileTap");
        this.redirectTo(this.getViewModel().get('user'));
        this.collapse();
    },

    onLogoutTap: function() {
        console.log("client->app->view->main->MenuController->onLogoutTap");
        if (this.fireEvent('logout')) {
            this.collapse();
        }
    }
});
