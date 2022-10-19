using Website.Helper;
using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using System.Web.Http;
using System;
using System.Net.Http;
using System.Linq.Expressions;
using System.Collections.Generic;

namespace Website.Controllers.Api
{
    [RoutePrefix("api/DMDonHangChiTiet")]
    public class DMDonHangChiTietController : BaseApiController<DMDonHangChiTietManager, DMDonHangChiTietModel>
    {
        [Route("GetByDonHang")]
        [HttpGet]
        public  HttpResponseMessage GetByDonHang(Guid id)
        {
            int iTotal = 0;
            List<Expression<Func<DMDonHangChiTietModel, bool>>> lFilter = new List<Expression<Func<DMDonHangChiTietModel, bool>>>();
            lFilter.Add(x => x.IdDonHang == id);
            var result = _manager.SelectBy(lFilter, " ThuTu ");
            return ApiOk(result);
        }
    }
}
