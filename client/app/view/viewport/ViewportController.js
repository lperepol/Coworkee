Ext.define('App.view.viewport.ViewportController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.viewport',

    listen: {
        controller: {
            '*': {
                login: 'onLogin',
                logout: 'onLogout',
                unmatchedroute: 'handleUnmatchedRoute'
            }
        }
    },

    routes: {
        'login': 'handleLoginRoute'
    },

    onLaunch: function() {
        console.log("client->app->view->viewport->ViewportController->onLaunch");
        
        this.originalRoute = App.getApplication().getDefaultToken();
        this.initDirect();
        this.restoreSession();
    },

    showView: function(xtype) {
        console.log("client->app->view->viewport->ViewportController->showView");
        var view = this.lookup(xtype),
            viewport = this.getView();

        if (!view) {
            viewport.removeAll(true);
            view = viewport.add({
                xtype: xtype,
                reference: xtype
            });
        }

        viewport.setActiveItem(view);
    },

    showAuth: function() {
        console.log("client->app->view->viewport->ViewportController->showAuth");
        this.showView('authlogin');
    },

    showMain: function() {
        console.log("client->app->view->viewport->ViewportController->showMain");
        this.showView('main');
    },

    // ROUTING

    handleLoginRoute: function() {
        console.log("client->app->view->viewport->ViewportController->handleLoginRoute");
        var session = this.session;
        if (session && session.isValid()) {
            this.redirectTo('', {replace: true});
            return;
        }

        this.showAuth();
    },

    handleUnmatchedRoute: function(route) {
        console.log("client->app->view->viewport->ViewportController->handleUnmatchedRoute");
        var me = this;

        if (!me.session || !me.session.isValid()) {
            // There is no authenticated user, let's redirect to the login page but keep track
            // of the original route to restore the requested route after user authentication.
            me.originalRoute = route;
            me.redirectTo('login', {replace: true});
            return;
        }

        // There is an authenticated user, so let's simply redirect to the default token.
        var target = App.getApplication().getDefaultToken();
        Ext.log.warn('Route unknown: ', route);
        if (route !== target) {
            me.redirectTo(target, {replace: true});
        }
    },

    // EXT DIRECT

    initDirect: function() {
        console.log("client->app->view->viewport->ViewportController->initDirect");
        var api = Server.API;
        if (!api) {
            Ext.raise('Failed to load Direct API');
        }

        Ext.direct.Manager.addProvider(Ext.applyIf({
            id: 'server',
            listeners: {
                data: 'onDirectData',
                scope: this
            }
        }, api));
    },

    setDirectToken: function(token) {
        console.log("client->app->view->viewport->ViewportController->setDirectToken");
        // https://jwt.io/introduction/#how-do-json-web-tokens-work-
        var provider = Ext.direct.Manager.getProvider('server'),
            headers = provider.getHeaders() || {};

        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        } else {
            delete headers['Authorization'];
        }

        provider.setHeaders(headers);
    },

    onDirectData: function(provider, e) {
        console.log("client->app->view->viewport->ViewportController->onDirectData");
        if (e.type !== 'exception') {
            return;
        }

        var message = e.message || {};
        switch (message.code) {
        case -32098:    // AuthTokenExpired
        case -32097:    // AuthTokenInvalid
            // Defer user deauthentication until the current direct transaction is done.
            Ext.asap(this.terminateSession, this);
            break;
        default:
            break;
        }
    },

    // SESSION MANAGEMENT

    restoreSession: function() {
        console.log("client->app->view->viewport->ViewportController->restoreSession");
        var data = App.util.State.get('session'),
            session = data? App.model.Session.loadData(data) : null;

        if (session && session.isValid()) {
            this.initiateSession(session);
        } else {
            this.terminateSession();
        }

        return session;
    },

    initiateSession: function(session) {
        console.log("client->app->view->viewport->ViewportController->initiateSession");
        this.setDirectToken(session.get('token'));
        this.saveSession(session);
        this.showMain();
    },

    terminateSession: function() {
        console.log("client->app->view->viewport->ViewportController->terminateSession");
        this.setDirectToken(null);
        this.saveSession(null);
        this.showAuth();
    },

    saveSession: function(session) {
        console.log("client->app->view->viewport->ViewportController->saveSession");
        App.util.State.set('session', session && session.getData(true));
        this.getViewModel().set('user', session && session.getUser());
        this.session = session;
    },

    // AUTHENTICATION

    onLogin: function(session) {
        console.log("client->app->view->viewport->ViewportController->onLogin");
        if (!session || !session.isValid()) {
            return false;
        }

        this.initiateSession(session);
        this.redirectTo(this.originalRoute, {replace: true});
    },

    onLogout: function() {
        console.log("client->app->view->viewport->ViewportController->onLogout");
        var me = this,
            view = me.getView(),
            session = me.session;

        if (!session || !session.isValid()) {
            return false;
        }

        view.setMasked({ xtype: 'loadmask' });
        session.logout().catch(function() {
            // TODO handle errors
        }).then(function() {
            me.originalRoute = Ext.History.getToken();
            me.terminateSession();
            view.setMasked(false);
            me.redirectTo('login', {replace: true});
        });
    }
});

