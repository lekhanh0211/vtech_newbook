using Website.Helper;
using Lib.BusinessLogic;
using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using Lib.Extensions;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Website.Controllers.Api
{
    [RoutePrefix("api/users")]
    public class UsersController : BaseApiController<DMUserManager, HTUserModel>
    {
        [Route("checkUsername/{username}")]
        [HttpPost]
        public HttpResponseMessage checkUsername(string username)
        {
            try
            {
                var htUser = _manager.SelectByUserName(username);
                if (htUser != null)
                {
                    throw new MyInvalidDataExceptions("Đã có tài khoản này!");
                }
                return ControllerContext.Request.CreateResponse(HttpStatusCode.OK, "");
            }
            catch (MyInvalidDataExceptions ex)
            {
                ex.Log();
                return ControllerContext.Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception ex)
            {
                ex.Log();
                return ControllerContext.Request.CreateResponse(HttpStatusCode.InternalServerError, "Lỗi chưa xác đinh.");
            }
        }
    }
}