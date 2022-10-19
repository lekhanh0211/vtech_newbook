using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using System.Web.Mvc;

namespace WebShop.Controllers
{
    [AllowAnonymous]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Sách, văn phòng phẩm";
            ViewBag.Page = "Home";
            List<Expression<Func<DMBannerModel, bool>>> lFilter = new List<Expression<Func<DMBannerModel, bool>>>();
            lFilter.Add(x => x.Active == true);
            var lBanner = DMBannerManager.Instance.SelectBy(lFilter, " UuTien ");
            ViewBag.ListBanner = lBanner.Where(x => x.ViTri == 1);
            ViewBag.MiddleBanner = lBanner.Where(x => x.ViTri == 2).FirstOrDefault();
            ViewBag.ListDanhMucNoiBat = DMLoaiSanPhamManager.Instance.GetDMNoiBat();
            ViewBag.ListDanhMuc = DMLoaiSanPhamManager.Instance.SelectAll();
            ViewBag.ListDoiTac = DMDoiTacManager.Instance.SelectAll();

            return View();
        }
    }
}
