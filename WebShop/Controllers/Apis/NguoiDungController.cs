using Lib.BusinessLogic.Model;
using Lib.BusinessLogic.Management;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using WebShop.Helper;
using System;
using Lib.BusinessLogic;
using System.Net;
using Lib.BusinessLogic.Utils;

namespace WebShop.Controllers
{
    [RoutePrefix("api/nguoidung")]
    public class UserController : MyApiController
    {
        [Authorize]
        [Route("{UserName}")]
        [HttpGet]
        public HttpResponseMessage Get(string UserName)
        {
            var vResult = DMNguoiDungManager.Instance.SelectByUserName(UserName);
            return ApiOk(vResult);
        }

        [Route("")]
        [HttpPost]
        public HttpResponseMessage Post(DMNguoiDungModel value)
        {
            if (value == null) return null;
            value.Role = CMaRole.User;
            var obj = DMNguoiDungManager.Instance.Insert(value);
            return ApiOk(obj);
        }
        [Route("update")]
        [HttpPost]
        public HttpResponseMessage PostUpdate(DMNguoiDungModel value)
        {
            var obj = DMNguoiDungManager.Instance.Update(value);
            return ApiOk(obj);
        }
        [Route("checkUsername/{username}")]
        [HttpPost]
        public HttpResponseMessage checkUsername(string username)
        {
            try
            {
                var htUser = DMNguoiDungManager.Instance.SelectByUserName(username);
                if (htUser != null)
                {
                    throw new MyInvalidDataExceptions("Đã có tài khoản này!");
                }
                return ControllerContext.Request.CreateResponse(HttpStatusCode.OK, "");
            }
            catch (MyInvalidDataExceptions ex)
            {
                return ControllerContext.Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception ex)
            {
                return ControllerContext.Request.CreateResponse(HttpStatusCode.InternalServerError, "Lỗi chưa xác đinh.");
            }
        }
    }
}