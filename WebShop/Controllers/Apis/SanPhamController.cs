using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebShop.Helper;
using Lib.BusinessLogic.Management;
using WebShop.Principal;
using Lib.BusinessLogic.Utils;

namespace WebShop.Controllers
{
    [RoutePrefix("api/sanpham")]
    public class SanPhamController : MyApiController
    {
        [Route("{id}")]
        [HttpGet]
        public HttpResponseMessage GetByUrl(Guid id)
        {
            var result = DMSanPhamManager.Instance.GetById(id);
            var v_identity = User.Identity as MyIdentity;
            if (v_identity == null || v_identity.Roles[0] != CMaRole.BanSi)
            {
                result.GiaSi = 0;
                result.CauHinhGiaSi = "";
            }
            return ApiOk(result);
        }
        [Route("showpage")]
        [HttpGet]
        public HttpResponseMessage Get(string sSearch, Guid? idLoai, int iPageIndex, int iPageSize)
        {
            ListResult result = new ListResult();
            int iTotal = 0;
            var lSP = DMSanPhamManager.Instance.SelectDataByPage(sSearch, false, idLoai, null, null, true, null, null, iPageIndex, iPageSize, out iTotal);
            result.List = lSP;
            result.Total = iTotal;
            return ApiOk(result);
        }
    }
}