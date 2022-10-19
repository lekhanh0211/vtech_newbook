using Lib.BusinessLogic.Management;
using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Lib.Extensions;

namespace WebShop.Controllers
{
    [AllowAnonymous]
    public class TinTucController : Controller
    {
        // GET: BanTin
        public ActionResult Index()
        {
            ViewBag.Title = "Bản tin";
            ViewBag.ListDanhMuc = DMLoaiSanPhamManager.Instance.SelectAll();
            ViewBag.Page = "BanTin";
            return View();
        }
        public ActionResult ChiTiet(string id)
        {
            ViewBag.ListDanhMuc = DMLoaiSanPhamManager.Instance.SelectAll();
            ViewBag.Page = "BanTin";
            if (id.IsNotNullOrEmpty())
            {
                // Load Tin tức theo id
                var tinTuc = DMBanTinManager.Instance.GetById(id.ToGuid());
                ViewBag.Title = tinTuc.TieuDe;
                ViewBag.ListBanTin = DMBanTinManager.Instance.SelectTinLienQuan(tinTuc.NgayTao, tinTuc.Id);
                return View(tinTuc);
            }
            return RedirectToAction("Index", "TinTuc");
        }

        public ActionResult GioiThieu(string id)
        {
            ViewBag.ListDanhMuc = DMLoaiSanPhamManager.Instance.SelectAll();
            ViewBag.Page = id;
            if (id.IsNotNullOrEmpty())
            {
                // Load Tin tức theo id
                var tinTuc = DMTrangTinhManager.Instance.GetByUrl(id);
                ViewBag.Title = tinTuc.TieuDe;
                return View(tinTuc);
            }
            return RedirectToAction("Index", "Home");
        }
    }
}