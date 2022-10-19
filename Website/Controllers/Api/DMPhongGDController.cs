using Website.Helper;
using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using System.Web.Http;
using System.Net.Http;

namespace Website.Controllers.Api
{
    [RoutePrefix("api/DMPhongGD")]
    public class DMPhongGDController : BaseApiController<DMPhongGDManager, DMPhongGDModel>
    {
      /*  [Route("showPage")]
        [HttpGet]
        public HttpResponseMessage Get(string sSearch, Guid? idLoai, int? phanLoai, int? tinhTrang, bool Active, DateTime? from, DateTime? to, int iPageIndex, int iPageSize)
        {
            ListResult result = new ListResult();
            int iTotal = 0;
            var lSP = _manager.SelectDataByPage(sSearch, true, idLoai, phanLoai, tinhTrang, Active, from, to, iPageIndex, iPageSize, out iTotal);
            result.List = lSP;
            result.Total = iTotal;
            return ApiOk(result);
        }*/
    }
}
