using Website.Helper;
using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using System.Web.Http;
using System.Net.Http;

namespace Website.Controllers.Api
{
    [RoutePrefix("api/DMMauPhieuIn")]
    public class DMMauPhieuInController : BaseApiController<DMMauPhieuInManager, DMMauPhieuInModel>
    {
        [Route("getByMa/{sMa}")]
        [HttpGet]
        public HttpResponseMessage GetByMa(string sMa)
        {
            var result = _manager.GetByMa(sMa);
            return ApiOk(result);
        }
        [Route("showPage")]
        [HttpGet]
        public ListSelect showPage(string sSearch, int iPageIndex, int iPageSize)
        {
            ListSelect result = new ListSelect();
            int iTotal = 0;
            result.List = _manager.GetByPage(sSearch, iPageIndex, iPageSize, out iTotal);
            result.total = iTotal;
            return result;
        }
    }
}
