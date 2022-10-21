using Website.Helper;
using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using System.Web.Http;
using System.Net.Http;
using System;
using System.Collections.Generic;
using Lib.Extensions;
using System.Linq.Expressions;

namespace Website.Controllers.Api
{
    [RoutePrefix("api/DMPhongGD")]
    public class DMPhongGDController : BaseApiController<DMPhongGDManager, DMPhongGDModel>
    {
        [Route("showPage")]
        [HttpGet]
        public HttpResponseMessage Get(string sSearch, Guid? idTinhThanh, DateTime? from, DateTime? to, int iPageIndex, int iPageSize)
        {
            ListResult result = new ListResult();
            int iTotal = 0;
            var lSP = _manager.SelectDataByPage(sSearch, idTinhThanh, from, to, iPageIndex, iPageSize, out iTotal);
            result.List = lSP;
            result.Total = iTotal;
            return ApiOk(result);
        }
    }
}
