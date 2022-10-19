using Website.Helper;
using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web.Http;

namespace Website.Controllers.Api
{
    [RoutePrefix("api/CMTuDien")]
    public class CMTuDienController : BaseApiController<CMTuDienManager, CMTuDienModel>
    {
        [Route("")]
        [HttpGet]
        public HttpResponseMessage Get(string type)
        {
            var result = _manager.SelectByType(type).Where(x => x.Active);
            return ApiOk(result);
        }

        [Route("ShowAllByTypes")]
        [HttpGet]
        public HttpResponseMessage ShowAllByTypes(string types)
        {
            Dictionary<string, IEnumerable<CMTuDienModel>> vLstTuDien = new Dictionary<string, IEnumerable<CMTuDienModel>>();
            var arr = Regex.Split(types, ",");
            for (int i = 0; i < arr.Count(); i++)
            {
                if (arr[i] != "")
                {
                    vLstTuDien.Add(arr[i], _manager.SelectByType(arr[i]).Where(x => x.Active));
                }
            }
            return ApiOk(vLstTuDien);
        }
        [Route("")]
        [HttpPost]
        public override HttpResponseMessage Post(CMTuDienModel value)
        {
            var ipId = _manager.InsertOrUpdate(value);
            return ApiOk(ipId);
        }
    }
}
