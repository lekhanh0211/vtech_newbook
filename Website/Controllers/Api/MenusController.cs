using Website.Helper;
using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace Website.Controllers.Api
{
    [RoutePrefix("api/menus")]
    public class MenusController : BaseApiController<HTMenuManager, HTMenuModel>
    {
        [HttpGet]
        [Route("roles/{id}")]
        public IList<ObjMenuItem> LoadMenuForClient(Guid id)
        {
            try
            {
                return _manager.LoadMenuForClient(id);
            }
            catch (Exception ex)
            {
                ex.Log();
                throw;
            }
        }
    }
}
