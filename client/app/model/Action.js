Ext.define('App.model.Action', {
    extend: 'App.model.Base',

    fields: [
        { name: 'type', type: 'string' },
        { name: 'subject', type: 'string' },
        { name: 'recipient_id', reference: 'Person' },
        { name: 'created', type: 'date', dateFormat: 'C', persist: false }
    ],

    toUrl: function() {
        console.log("client->app->model->Action->toUrl");
        
        return Ext.String.format('person/{0}', this.getRecipient().get('username'));
    },

    proxy: {
        api: {
            prefix: 'Server.actions'
        }
    }
});
