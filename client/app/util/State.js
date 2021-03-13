Ext.define('App.util.State', {

    singleton: true,

    requires: [
        'Ext.util.LocalStorage'
    ],

    store: new Ext.util.LocalStorage({
        id: 'app-state'
    }),

    get: function(key, defaultValue) {
        console.log("client->app->util->State->get");
        
        var value = this.store.getItem(key);
        return value === undefined? defaultValue : Ext.decode(value);
    },

    set: function(key, value) {
        console.log("client->app->util->State->set");
        if (value == null) {    // !== undefined && !== null
            this.store.removeItem(key);
        } else {
            this.store.setItem(key, Ext.encode(value));
        }
    },

    clear: function(key) {
        console.log("client->app->util->State->clear");
        this.set(key, null);
    }
});
