using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApi.Helper;
using Lib.BusinessLogic.Management;

namespace WebApi.Controllers
{
    [RoutePrefix("api/sanpham")]
    public class SanPhamController : MyApiController
    {
        [Route("{id}")]
        [HttpGet]
        public HttpResponseMessage GetById(Guid id)
        {
            var result = DMSanPhamManager.Instance.GetById(id);
            if (_IsBanSi)
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
            var lSP = DMSanPhamManager.Instance.SelectDataByPage(sSearch, _IsBanSi, idLoai, null, null, true, null, null, iPageIndex, iPageSize, out iTotal);
            result.List = lSP;
            result.Total = iTotal;
            return ApiOk(result);
        }
    }
}