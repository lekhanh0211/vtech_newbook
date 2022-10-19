using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebShop.Helper;

namespace WebShop.Controllers
{
    [RoutePrefix("api/danhmuc")]
    public class DanhMucController : MyApiController
    {
        [Route("")]
        [HttpGet]
        public HttpResponseMessage Get()
        {
            List<Expression<Func<DMLoaiSanPhamModel, bool>>> lFilter = new List<Expression<Func<DMLoaiSanPhamModel, bool>>>();
            lFilter.Add(x => x.Active == true);
            var result = DMLoaiSanPhamManager.Instance.SelectBy(lFilter, " Cap, UuTien ");
            return ApiOk(result);
        }
        [Route("bycap")]
        [HttpGet]
        public HttpResponseMessage bycap(int cap)
        {
            List<Expression<Func<DMLoaiSanPhamModel, bool>>> lFilter = new List<Expression<Func<DMLoaiSanPhamModel, bool>>>();
            lFilter.Add(x => x.Cap == cap);
            var result = DMLoaiSanPhamManager.Instance.SelectBy(lFilter, " UuTien ");
            return ApiOk(result);
        }
        [Route("bycaptren")]
        [HttpGet]
        public HttpResponseMessage bycaptren(Guid id, int cap)
        {
            List<Expression<Func<DMLoaiSanPhamModel, bool>>> lFilter = new List<Expression<Func<DMLoaiSanPhamModel, bool>>>();
            if (cap == 2)
            {
                lFilter.Add(x => x.Cap == 2 && x.IdCap1 == id);
            }
            if (cap == 3)
            {
                lFilter.Add(x => x.Cap == 3 && x.IdCap2 == id);
            }

            var result = DMLoaiSanPhamManager.Instance.SelectBy(lFilter, " UuTien ");
            return ApiOk(result);
        }
    }
}