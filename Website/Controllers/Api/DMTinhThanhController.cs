using Website.Helper;
using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using System.Web.Http;
using System.Net.Http;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Website.Controllers.Api
{
    [RoutePrefix("api/DMTinhThanh")]
    public class DMTinhThanhController : BaseApiController<DMTinhThanhManager, DMTinhThanhModel>
    {
        [Route("GetAllByLoai")]
        [HttpGet]
        public HttpResponseMessage GetAllByLoai(int loai)
        {
            List<Expression<Func<DMTinhThanhModel, bool>>> lFilter = new List<Expression<Func<DMTinhThanhModel, bool>>>();
            lFilter.Add(x => x.Cap == loai);
            var result = _manager.SelectBy(lFilter, " UuTien");
            return ApiOk(result);
        }

        [Route("GetCapDuoi")]
        [HttpGet]
        [AllowAnonymous]
        public HttpResponseMessage GetCapDuoi(Guid id)
        {
            List<Expression<Func<DMTinhThanhModel, bool>>> lFilter = new List<Expression<Func<DMTinhThanhModel, bool>>>();
            lFilter.Add(x => x.IdCapTren == id);
            var result = _manager.SelectBy(lFilter, " UuTien");
            return ApiOk(result);
        }

    }
}
