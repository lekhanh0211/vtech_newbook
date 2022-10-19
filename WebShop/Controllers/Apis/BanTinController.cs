using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using Lib.Extensions;
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
    [RoutePrefix("api/bantin")]
    public class BanTinController : MyApiController
    {
        [Route("list")]
        [HttpGet]
        public HttpResponseMessage GetList(string sSearch, int index, int size = 10)
        {
            ListResult result = new ListResult();
            int iTotal = 0;
            List<Expression<Func<DMBanTinModel, bool>>> lFilter = new List<Expression<Func<DMBanTinModel, bool>>>();
            lFilter.Add(x => x.Active == true);
            if (sSearch.IsNotNullOrEmpty())
            {
                sSearch = sSearch.ToTvKhongDau();
                lFilter.Add(x => x.StrSearch.Contains(sSearch));
            }
            result.List = DMBanTinManager.Instance.SelectDataForShop(null, null, index, size, out iTotal, lFilter);
            result.Total = iTotal;
            return ApiOk(result);
        }
        [Route("xemtin")]
        [HttpGet]
        public HttpResponseMessage GetByUrl(string url)
        {
            List<Expression<Func<DMBanTinModel, bool>>> lFilter = new List<Expression<Func<DMBanTinModel, bool>>>();
            lFilter.Add(x => x.url == url);

            var result = DMBanTinManager.Instance.SelectBy(lFilter).FirstOrDefault();
            return ApiOk(result);
        }
    }
}