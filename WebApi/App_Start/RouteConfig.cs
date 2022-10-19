using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;


namespace WebApi
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "ApiDoc",
                url: "Helper/ApiDoc.html",
                defaults: new { controller = "Home", action = "ApiDoc", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "Default",
                url: "{*anything}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}