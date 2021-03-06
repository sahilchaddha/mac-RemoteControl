var express = require('express')
var sessionService = require('./SessionService.js')

function RouterService() { 
    this.routes = []
}

RouterService.prototype.initSessionManager = function(app) {
    app.use(function authenticateSessionToken (req, res, next) { 
        
        if (req.headers['token'] == null) {
            res.status(400).send({responseMessage: "Authentication Failed: token Header Required.", errorCode: 403})
            return
        }

        if (!sessionService.authenticate(req.headers['token'])) {
            // Authentication Failed
            res.status(400).send({responseMessage: "Error: Authentication Failed", errorCode: 401})
            return
        }

        // Continue Routing
        next()
      })
      app.use(express.json());       // to support JSON-encoded bodies
      app.use(express.urlencoded());
}
//Public Method
RouterService.prototype.addRoutes = function(app, routes) {
    this.initSessionManager(app)
    this.routes = routes

    // Adding Routes
    for (var i=0; i < this.routes.length; i++) {
        var route = this.routes[i]
        app.use(route.url, route.routerClass)
    }
}

module.exports = new RouterService()