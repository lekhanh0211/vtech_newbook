using Website.Helper;
using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using System.Web.Http;

namespace Website.Controllers.Api
{
    [RoutePrefix("api/CMLoaiTuDien")]
    public class CMLoaiTuDienController : BaseApiController<CMLoaiTuDienManager, CMLoaiTuDienModel>
    {
    }
}
