using System;
using Website.Helper;
using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using System.Web.Http;
using System.Net.Http;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Website.Controllers.Api
{
    [RoutePrefix("api/HTConfig")]
    public class HTConfigController : BaseApiController<HTConfigManager, HTConfigModel>
    {
        [Route("")]
        [HttpGet]
        public override HttpResponseMessage Get()
        {
            var result = _manager.GetConfig();
            return ApiOk(result);
        }
        [Route("{id}")]
        [HttpGet]
        public override HttpResponseMessage Get(Guid id)
        {
            var vResult = _manager.GetById(id);
            return ApiOk(vResult);
        }
        [Route("")]
        [HttpPost]
        public override HttpResponseMessage Post(HTConfigModel value)
        {
            var ipId = _manager.InsertOrUpdate(value);
            return ApiOk(ipId);
        }

        [Route("{id}")]
        [HttpPost]
        public override HttpResponseMessage Delete(Guid id)
        {
            _manager.Delete(id);
            return ApiOk();
        }

        [Route("UserEdit")]
        [HttpGet]
        public HttpResponseMessage UserEdit()
        {
            List<Expression<Func<HTConfigModel, bool>>> lFilter = new List<Expression<Func<HTConfigModel, bool>>>();
            lFilter.Add(x => x.IsUserEdit == true && x.Active == true);
            var result = _manager.SelectBy(lFilter, " NgayTao ");
            return ApiOk(result);
        }
    }
}
