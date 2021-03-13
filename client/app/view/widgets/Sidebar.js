Ext.define('App.view.widgets.Sidebar', {
    extend: 'Ext.Container',
    xtype: 'sidebar',

    config: {
        expanded: false
    },

    classCls: 'sidebar',

    initialize: function() {
        var me = this;

        me.callParent();

        me.el.insertFirst({
            cls: me.getBaseCls() + '-mask',
            tag: 'div'
        }).on({
            tap: 'onMaskTap',
            scope: me
        });
    },

    updateExpanded: function(value) {
        console.log("client->app->view->widgets->Sidebar->updateExpanded");
        this.toggleCls('expanded', value);
    },

    updateMode: function(curr, prev) {
        console.log("client->app->view->widgets->Sidebar->updateMode");
        this.replaceCls(prev, curr);
    },

    toggleExpanded: function() {
        console.log("client->app->view->widgets->Sidebar->toggleExpanded");
        this.setExpanded(!this.getExpanded());
    },

    onMaskTap: function(ev) {
        console.log("client->app->view->widgets->Sidebar->onMaskTap");
        this.setExpanded(false);
        ev.preventDefault();
    }
});
