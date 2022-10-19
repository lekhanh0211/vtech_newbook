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
    [RoutePrefix("api/tinhthanh")]
    public class TinhThanhController : MyApiController
    {
        [Route("cap/{cap}")]
        [HttpGet]
        public HttpResponseMessage GetByCap(int cap)
        {
            var result = DMTinhThanhManager.Instance.GetByCap(cap);
            return ApiOk(result);
        }
        [Route("{id}/diaphuong")]
        [HttpGet]
        public HttpResponseMessage GetByCapTren(Guid id)
        {
            var result = DMTinhThanhManager.Instance.GetByCapTren(id);
            return ApiOk(result);
        }
    }
}