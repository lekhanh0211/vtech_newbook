using Website.Helper;
using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using System.Web.Http;

namespace Website.Controllers.Api
{
    [RoutePrefix("api/DMKhoi")]
    public class DMKhoiController : BaseApiController<DMKhoiManager, DMKhoiModel>
    {
    }
}
