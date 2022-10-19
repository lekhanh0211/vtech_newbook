using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace WebShop
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapRoute(
                name: "BanTin",
                url: "ban-tin",
                defaults: new { controller = "TinTuc", action = "Index", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "ChiTietBanTin",
                url: "ban-tin/{metaid}_{id}.html",
                defaults: new { controller = "TinTuc", action = "ChiTiet", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "TrangTinh",
                url: "gioi-thieu/{id}.html",
                defaults: new { controller = "TinTuc", action = "GioiThieu", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "YeuThich",
                url: "san-pham-yeu-thich",
                defaults: new { controller = "Product", action = "YeuThich", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "GioHang",
                url: "gio-hang",
                defaults: new { controller = "Product", action = "GioHang", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "DatHang",
                url: "dat-hang",
                defaults: new { controller = "Product", action = "DatHang", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "ThankYou",
                url: "thank-you",
                defaults: new { controller = "Product", action = "ThankYou", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "DanhMuc",
                url: "shop/{id}",
                defaults: new { controller = "Product", action = "DanhMuc", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "BanSi",
                url: "ban-si/{id}",
                defaults: new { controller = "Product", action = "BanSi", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "SanPham",
                url: "{url}.html",
                defaults: new { controller = "Product", action = "Index", url = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
