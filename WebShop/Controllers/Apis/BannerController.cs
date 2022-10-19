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
    [RoutePrefix("api/banner")]
    public class BannerController : MyApiController
    {
        [Route("")]
        [HttpGet]
        public HttpResponseMessage Get()
        {
            List<Expression<Func<DMBannerModel, bool>>> lFilter = new List<Expression<Func<DMBannerModel, bool>>>();
            lFilter.Add(x => x.Active == true);
            var result = DMBannerManager.Instance.SelectBy(lFilter, " ViTri, UuTien ");
            return ApiOk(result);
        }
    }
}