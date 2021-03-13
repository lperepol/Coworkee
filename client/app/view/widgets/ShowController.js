Ext.define('App.view.widgets.ShowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.show',

    control: {
        '#': {
            recordchange: 'onRecordChange'
        }
    },

    getRecord: function() {
        console.log("client->app->view->widgets->ShowController->getRecord");
        
        return this.getViewModel().get('record');
    },

    onRecordChange: function(view, record) {
        console.log("client->app->view->widgets->ShowController->onRecordChange");
        this.getViewModel().set('record', record);

        // Scroll to the top of the view but make sure that the view is still
        // valid since the record is reset to null when the view is destroyed.
        if (!view.destroying && !view.destroyed) {
            view.getScrollable().scrollTo(null, 0, true);
        }
    },

    onEditTap: function() {
        console.log("client->app->view->widgets->ShowController->onEditTap");
        this.redirectTo(this.getRecord().toEditUrl());
    },

    onPeopleChildTap: function(view, location) {
        console.log("client->app->view->widgets->ShowController->onPeopleChildTap");
        var record = location.record;
        if (record) {
            this.redirectTo(record);
        }
    },

    onHistoryChildTap: function(view, location) {
        console.log("client->app->view->widgets->ShowController->onHistoryChildTap");
        var record = location.record;
        if (record) {
            this.redirectTo(record.getRecipient());
        }
    },

    onHistoryAllTap: function() {
        console.log("client->app->view->widgets->ShowController->onHistoryAllTap");
        this.redirectTo('history/recipient/' + this.getRecord().getId());
    }
});
