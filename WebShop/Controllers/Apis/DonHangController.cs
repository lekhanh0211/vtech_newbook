using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using Lib.BusinessLogic.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebShop.Helper;
using WebShop.Principal;

namespace WebShop.Controllers
{
    [RoutePrefix("api/donhang")]
    public class DonHangController : MyApiController
    {
        [Route("")]
        [HttpPost]
        public HttpResponseMessage Post(DMDonHangModel value)
        {
            var IsBanSi = false;
            var v_identity = User.Identity as MyIdentity;
            if (v_identity != null && v_identity.Roles[0] == CMaRole.BanSi) IsBanSi = true;
            value.Loai = IsBanSi ? 1: 0;
            var ipId = DMDonHangManager.Instance.InsertOrUpdate(value);
            return ApiOk(ipId); ;
        }
    }
}