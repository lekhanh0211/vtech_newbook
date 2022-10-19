using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using Lib.BusinessLogic.Utils;
using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebShop.Principal;

namespace WebShop.Controllers
{
    [AllowAnonymous]
    public class ProductController : Controller
    {
        // GET: Product
        public ActionResult Index(string url)
        {
            ViewBag.Title = "Shop";
            ViewBag.Page = "Shop";
            ViewBag.ListDanhMuc = DMLoaiSanPhamManager.Instance.SelectAll();
            var sp = DMSanPhamManager.Instance.GetByUrl(url);
            ViewBag.IsGiaSi = false;
            var v_identity = User.Identity as MyIdentity;
            if (v_identity != null && v_identity.Roles[0] == CMaRole.BanSi)
            {
                ViewBag.IsGiaSi = true;
            }
            if (sp != null)
            {
                if (sp.IdLoai.IsNotNull())
                {
                    ViewBag.DanhMuc = DMLoaiSanPhamManager.Instance.GetById(sp.IdLoai.Value);
                    int iTotal = 0;
                    var lsp = DMSanPhamManager.Instance.SelectDataByPage(null, (bool)ViewBag.IsGiaSi, sp.IdLoai.Value, null, null, true, null, null, 1, 13, out iTotal);
                    ViewBag.ListSanPham = lsp.Where(x => x.Id != sp.Id).Take(12);
                }
                ViewBag.Title = sp.Ten;
                return View(sp);
            }
            return RedirectToAction("Index", "Home");
        }
        public ActionResult YeuThich()
        {
            ViewBag.Title = "Sản phẩm yêu thích";
            ViewBag.Page = "YeuThich";
            ViewBag.ListDanhMuc = DMLoaiSanPhamManager.Instance.SelectAll();
            return View();
        }
        public ActionResult GioHang()
        {
            ViewBag.Title = "Giỏ hàng";
            ViewBag.Page = "GioHang";
            ViewBag.ListDanhMuc = DMLoaiSanPhamManager.Instance.SelectAll();
            return View();
        }
        public ActionResult DatHang()
        {
            ViewBag.Title = "Đặt hàng";
            ViewBag.Page = "DatHang";
            ViewBag.ListDanhMuc = DMLoaiSanPhamManager.Instance.SelectAll();
            return View();
        }
        public ActionResult ThankYou(string ma)
        {
            ViewBag.Title = "Đặt hàng thành công";
            ViewBag.Page = "ThankYou";
            ViewBag.MaDonHang = ma;
            ViewBag.ListDanhMuc = DMLoaiSanPhamManager.Instance.SelectAll();
            return View();
        }
        public ActionResult DanhMuc(string id, string sSearch, string order = "", int page = 1)
        {
            ViewBag.Title = "Shop";
            ViewBag.Page = "Shop";
            ViewBag.ListDanhMuc = DMLoaiSanPhamManager.Instance.SelectAll();
            ViewBag.ListDoiTac = DMDoiTacManager.Instance.SelectAll();
            string url = "/shop";
            Guid idDM = Guid.Empty;
            if (id.IsNotNullOrEmpty())
            {
                var vDM = DMLoaiSanPhamManager.Instance.GetByUrl(id);
                if (vDM != null)
                {
                    ViewBag.DanhMuc = vDM;
                    ViewBag.Title = vDM.Ten;
                    idDM = vDM.Id;
                    url += ("/" + vDM.Url);
                }
            }
            bool ischua = true;
            if (sSearch.IsNotNullOrEmpty())
            {
                ViewBag.sSearch = sSearch;
                url += ("?sSearch=" + sSearch);
                ischua = false;
            }
            if (order.IsNotNullOrEmpty())
            {
                url += (ischua ? "?" : "&");
                ischua = false;
                url += ("order=" + order);
            }
            int iTotal = 0;
            string vOrder = null;
            switch (order)
            {
                case "1":
                    vOrder = " Giaban ";
                    break;
                case "2":
                    vOrder = " Giaban desc";
                    break;
                case "3":
                    vOrder = " Ten ";
                    break;
                case "4":
                    vOrder = " Ten desc";
                    break;
            }
            var lSP = DMSanPhamManager.Instance.SelectDataByPage(sSearch, false, idDM, null, null, true, null, null, page, 24, out iTotal, vOrder);            
            ViewBag.Total = iTotal;
            ViewBag.Index = page;
            ViewBag.Order = order;
            ViewBag.Data = lSP.ToJson();
            url += string.Format("{0}page=", ischua ? "?" : "&");
            ViewBag.lstPage = GetlstPage(iTotal, page, url);
            return View(lSP);
        }

        public ActionResult BanSi(string id, string sSearch, string order = "", int page = 1)
        {
            var v_identity = User.Identity as MyIdentity;
            if (v_identity != null)
            {
                var v_role = v_identity.Roles[0];
                if (v_role == CMaRole.BanSi)
                {

                    ViewBag.Title = "Bán sỉ";
                    ViewBag.Page = "BanSi";
                    ViewBag.ListDanhMuc = DMLoaiSanPhamManager.Instance.SelectAll();
                    ViewBag.ListDoiTac = DMDoiTacManager.Instance.SelectAll();
                    string url = "/ban-si";
                    Guid idDM = Guid.Empty;
                    if (id.IsNotNullOrEmpty())
                    {
                        var vDM = DMLoaiSanPhamManager.Instance.GetByUrl(id);
                        if (vDM != null)
                        {
                            ViewBag.DanhMuc = vDM;
                            ViewBag.Title = vDM.Ten;
                            idDM = vDM.Id;
                            url += ("/" + vDM.Url);
                        }
                    }
                    bool ischua = true;
                    if (sSearch.IsNotNullOrEmpty())
                    {
                        ViewBag.sSearch = sSearch;
                        url += ("?sSearch=" + sSearch);
                        ischua = false;
                    }
                    if (order.IsNotNullOrEmpty())
                    {
                        url += (ischua ? "?" : "&");
                        ischua = false;
                        url += ("order=" + order);
                    }
                    int iTotal = 0;
                    string vOrder = null;
                    switch (order)
                    {
                        case "1":
                            vOrder = " GiaSi ";
                            break;
                        case "2":
                            vOrder = " GiaSi desc";
                            break;
                        case "3":
                            vOrder = " Ten ";
                            break;
                        case "4":
                            vOrder = " Ten desc";
                            break;
                    }
                    var lSP = DMSanPhamManager.Instance.SelectDataByPage(sSearch, true, idDM, null, null, true, null, null, page, 24, out iTotal, vOrder);
                    ViewBag.Total = iTotal;
                    ViewBag.Index = page;
                    ViewBag.Order = order;
                    ViewBag.Data = lSP.ToJson();
                    url += string.Format("{0}page=", ischua ? "?" : "&");
                    ViewBag.lstPage = GetlstPage(iTotal, page, url);
                    return View(lSP);
                }
            }
            return RedirectToAction("Index", "Home");
        }

        private string GetlstPage(int total, int pageIndex, string url)
        {
            int pageTotal = (total - 1) / 24 + 1;
            var str = "";
            if (pageTotal > 1)
            {
                // Button previous
                if (pageIndex > 1)
                    str = str + "<li class='page-item'><a class='page-link' title='Trang đầu' href='" + (url + 1) + "'> << </a></li>";
                else
                    str = str + "<li class='page-item disabled'><a class='page-link' title='Trang đầu'> << </a></li>";
                // Các Button giữa
                if (pageTotal <= 9)
                {
                    for (var i = 1; i < pageTotal + 1; i++)
                    {
                        if (pageIndex == i)
                        {
                            str = str + "<li class='page-item active'><a class='page-link'>" + i + "</a></li>";
                        }
                        else
                        {
                            str = str + "<li class='page-item'><a class='page-link' href='" + (url + i) + "'>" + i + "</a></li>";
                        }
                    }
                }
                else // Neu co nhieu hon 9 page
                {
                    if (pageIndex > 1 && pageIndex < pageTotal)
                    {
                        if (pageIndex - 3 > 1) str = str + "<li class='page-item '><a class='page-link'>...</a></li>";
                        for (var i = pageIndex - 3; i < pageIndex + 4; i++)
                        {
                            if (i > 0 && i <= pageTotal)
                            {
                                if (i == pageIndex)
                                    str = str + "<li class='page-item active'><a class='page-link'>" + pageIndex + "</a></li>";
                                else
                                    str = str + "<li class='page-item '><a class='page-link' href='" + (url + i) + "'>" + i + "</a></li>";
                            }
                        }
                        if (pageIndex + 4 < pageTotal) str = str + "<li class='page-item '><a class='page-link'>...</a></li>";
                    }
                    else if (pageIndex == 1)
                    {
                        str = str + "<li class='page-item active'><a class='page-link'>" + pageIndex + "</a></li>";
                        for (var i = pageIndex + 1; i < pageIndex + 6; i++)
                        {
                            if (i <= pageTotal)
                            {
                                str = str + "<li class='page-item '><a class='page-link' href='" + (url + i) + "'>" + i + "</a></li>";
                            }
                        }
                        if (pageIndex + 5 < pageTotal) str = str + "<li ><a class='page-link'>...</a></li>";
                    }
                    else if (pageIndex == pageTotal)
                    {
                        if (pageIndex - 5 > 1) str = str + "<li class='page-item '><a class='page-link'>...</a></li>";
                        for (var i = pageIndex - 5; i < pageIndex; i++)
                        {
                            if (i > 0)
                            {
                                str = str + "<li class='page-item '><a class='page-link' href='" + (url + i) + "'>" + i + "</a></li>";
                            }
                        }
                        str = str + "<li class='page-item active'><a class='page-link'>" + pageIndex + "</a></li>";
                    }
                }

                if (pageIndex < pageTotal)
                    str = str + "<li class='page-item'><a class='page-link' title='Trang cuối' href='" + (url + pageTotal) + "'> >> </a></li>";
                else
                    str = str + "<li class='page-item disabled'><a class='page-link' title='Trang cuối'> >> </a></li>";
            }
            return str;
        }
    }
}