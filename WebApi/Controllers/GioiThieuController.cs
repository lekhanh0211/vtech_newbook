using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApi.Helper;

namespace WebApi.Controllers
{
    [RoutePrefix("api/gioithieu")]
    public class GioiThieuController : MyApiController
    {
        [Route("{id}")]
        [HttpGet]
        public HttpResponseMessage GetById(string id)
        {
            var result = DMTrangTinhManager.Instance.GetByUrl(id);
            return ApiOk(result);
        }
    }
}