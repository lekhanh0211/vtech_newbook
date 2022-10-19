using Lib.BusinessLogic.Model;
using Lib.BusinessLogic.Management;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using WebApi.Helper;
using System;
using Lib.BusinessLogic;
using System.Net;
using Lib.BusinessLogic.Utils;
using Lib.Extensions;

namespace WebApi.Controllers
{
    [RoutePrefix("api/user")]
    public class UserController : MyApiController
    {
        #region Public pai
        [Route("")]
        [HttpPost]
        public HttpResponseMessage Post(DMNguoiDungModel value)
        {
            if (value == null) return null;
            value.Role = CMaRole.User;
            var obj = DMNguoiDungManager.Instance.Insert(value);
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
        #endregion

        #region Auth api
        [Authorize]
        [Route("{UserName}")]
        [HttpGet]
        public HttpResponseMessage Get(string UserName)
        {
            var vResult = DMNguoiDungManager.Instance.SelectByUserName(UserName);
            return ApiOk(vResult);
        }

        [Authorize]
        [Route("update")]
        [HttpPost]
        public HttpResponseMessage PostUpdate(DMNguoiDungModel value)
        {
            var obj = DMNguoiDungManager.Instance.Update(value);
            return ApiOk(obj);
        }
        #endregion
    }
}