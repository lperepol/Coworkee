Ext.define('App.view.widgets.WizardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.wizard',

    requires: [
        'Ext.History'
    ],

    getItemCount: function(tabs) {
        console.log("client->app->view->widgets->WizardController->getItemCount");
        
        return tabs.getInnerItems().length;
    },

    getActiveIndex: function(tabs) {
        console.log("client->app->view->widgets->WizardController->getActiveIndex");
        return tabs.getInnerItems().indexOf(tabs.getActiveItem());
    },

    advance: function(increment) {
        console.log("client->app->view->widgets->WizardController->advance");
        var me = this,
            tabs = me.lookup('tabs'),
            index = me.getActiveIndex(tabs),
            count = me.getItemCount(tabs),
            next = index + increment;

        tabs.setActiveItem(Math.max(0, Math.min(count-1, next)));
    },

    resync: function() {
        console.log("client->app->view->widgets->WizardController->resync");
        var me = this,
            vm = me.getViewModel(),
            tabs = me.lookup('tabs'),
            prev = me.lookup('prev'),
            next = me.lookup('next'),
            index = me.getActiveIndex(tabs),
            count = me.getItemCount(tabs),
            single = count < 2;

        tabs.getTabBar().setHidden(single);
        prev.setDisabled(index <= 0).setHidden(single);
        next.setDisabled(index == -1 || index >= count-1).setHidden(single);
    },

    finalize: function() {
        console.log("client->app->view->widgets->WizardController->finalize");
        var view = this.getView();
        if (view.getFloated()) {
            view.close();
        } else {
            Ext.History.back();
        }
    },

    onSubmitTap: function() {
        console.log("client->app->view->widgets->WizardController->onSubmitTap");
        var me = this,
            form = me.getView(),
            record = me.getViewModel().get('record');

        if (!form.validate()) {
            return;
        }

        if (!record.isDirty()) {
            me.finalize();
            return;
        }

        form.setMasked({ xtype: 'loadmask' });
        form.clearErrors();
        record.save({
            callback: function(result, operation) {
                form.setMasked(false);
                if (!App.util.Errors.process(operation, form)) {
                    me.finalize();
                }
            }
        });
    },

    onCancelTap: function() {
        console.log("client->app->view->widgets->WizardController->onCancelTap");
        this.finalize();
    },

    onPrevTap: function() {
        console.log("client->app->view->widgets->WizardController->onPrevTap");
        this.advance(-1);
    },

    onNextTap: function() {
        console.log("client->app->view->widgets->WizardController->onNextTap");
        this.advance(1);
    },

    onScreenAdd: function() {
        console.log("client->app->view->widgets->WizardController->onScreenAdd");
        this.resync();
    },

    onScreenRemove: function(tabs) {
        console.log("client->app->view->widgets->WizardController->onScreenRemove");
        if (!tabs.destroying) {
            this.resync();
        }
    },

    onScreenActivate: function(tabs) {
        console.log("client->app->view->widgets->WizardController->onScreenActivate");
        // This event is triggered when the view is being destroyed!
        if (!tabs.destroying) {
            this.resync();
        }
    }
});
