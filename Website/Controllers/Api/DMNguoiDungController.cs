using Website.Helper;
using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using System.Web.Http;
using System;
using System.Net.Http;
using System.Linq.Expressions;
using System.Collections.Generic;
using Lib.Extensions;

namespace Website.Controllers.Api
{
    [RoutePrefix("api/DMNguoiDung")]
    public class DMNguoiDungController : BaseApiController<DMNguoiDungManager, DMNguoiDungModel>
    {
        [Route("showPage")]
        [HttpGet]
        public HttpResponseMessage Get(string sSearch, string iRole, DateTime? from, DateTime? to, int iPageIndex, int iPageSize)
        {
            ListResult result = new ListResult();
            int iTotal = 0;
            List<Expression<Func<DMNguoiDungModel, bool>>> lFilter = new List<Expression<Func<DMNguoiDungModel, bool>>>();
            lFilter.Add(x => x.Role == iRole);
            if (sSearch.IsNotNullOrEmpty())
            {
                sSearch = sSearch.ToTvKhongDau();
                lFilter.Add(x => x.StrSearch.Contains(sSearch));
            }
            result.List = _manager.SelectDataByPage(from, to, iPageIndex, iPageSize, out iTotal, lFilter);
            result.Total = iTotal;
            return ApiOk(result);
        }
    }
}
