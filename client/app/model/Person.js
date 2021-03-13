Ext.define('App.model.Person', {
    extend: 'App.model.Base',

    fields: [
        { name: 'username', type: 'string' },
        { name: 'firstname', type: 'string' },
        { name: 'lastname', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'skype', type: 'string' },
        { name: 'linkedin', type: 'string' },
        { name: 'phone', type: 'string' },
        { name: 'extension', type: 'string' },
        { name: 'birthday', type: 'date', dateFormat: 'Y-m-d' },
        { name: 'title', type: 'string' },
        { name: 'picture', type: 'string' },
        { name: 'started', type: 'date', dateFormat: 'Y-m-d' },
        { name: 'ended', type: 'date', dateFormat: 'Y-m-d' },
        { name: 'office_id', reference: 'Office' },
        { name: 'organization_id', reference: 'Organization' },

        // Calculated fields
        { name: 'fullname', calculate: function (data) {
            console.log("client->app->model->Person->calculate");
                
            return data.firstname + ' ' + data.lastname;
        }}
    ],

    proxy: {
        api: {
            prefix: 'Server.people'
        }
    },

    statics: {
        /**
         * The server people.list() API treats differently a request containing a specific id,
         * in which case it will lookup for the id (GUID), username and email. That means the
         * returned id may be different from the requested one. Since the static Model.load()
         * method perfoms a check on the returned id, we need first to create a phantom record,
         * then request the server with the desired id.
         */
        load: function(id, options, session) {
            console.log("client->app->model->Person->statics->load");
            
            var record = Ext.create('App.model.Person');
            record.setSession(session),
            record.load(
                Ext.apply({ params: { id: id } }, options)
            );
        }
    },

    // @see https://tools.ietf.org/html/rfc3966
    phoneCall: function() {
        console.log("client->app->model->Person->phoneCall");
        
        var me = this,
            num = me.get('phone'),
            ext, url;

        if (Ext.isEmpty(num)) {
            return false;
        }

        url = 'tel:' + num;
        ext = me.get('extension');
        if (!Ext.isEmpty(ext)) {
            url += ';ext=' + ext;
        }

        return me.openUrl(url);
    },

    // @see https://msdn.microsoft.com/en-us/library/office/dn745882.aspx
    skypeCall: function(username) {
        console.log("client->app->model->Person->skypeCall");
        
        var username = this.get('username');
        if (Ext.isEmpty(username)) {
            return false;
        }

        return this.openUrl('skype:' + username + '?call');
    },

    // Android 4.4.2 issue: https://code.google.com/p/android/issues/detail?id=63538
    // @see https://tools.ietf.org/html/rfc6068
    mailTo: function(emails) {
        console.log("client->app->model->Person->mailTo");
        var email = this.get('email');
        if (Ext.isEmpty(email)) {
            return false;
        }

        return this.openUrl('mailto:' + email);
    },

    linkedIn: function(username) {
        console.log("client->app->model->Person->linkedIn");
        var username = this.get('username');
        if (Ext.isEmpty(username)) {
            return false;
        }

        return this.openUrl('http://www.linkedin.com/in/' + username, true);
    },

    openUrl: function(url, browser) {
        console.log("client->app->model->Person->openUrl");
        return !!window.open(url, browser? '_system' : '_self');
    }
});
