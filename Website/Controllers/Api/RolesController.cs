using Website.Helper;
using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Linq;
using System.Net.Http;

namespace Website.Controllers.Api
{
    [RoutePrefix("api/Roles")]
    public class RolesController : BaseApiController<HTRoleManager, HTRoleModel>
    {
        [HttpGet]
        [Route("menus/{id}/{level}")]
        public IList<HTRoleMenuModel> GetAllMenuByRole(Guid id, int level)
        {
            try
            {
                var value = _manager.SelectMenusByRole(id);
                if (level == 0)
                {
                    if (value == null) return null;
                    return value.Where(x => x.IsParentGroup).ToList();
                }
                else if (level == 1)
                {
                    return value;
                }
                else
                {
                    throw new Exception(string.Format("Menu collect not accept this level: {0}", level));
                }
            }
            catch (Exception ex)
            {
                ex.Log();
                throw;
            }
        }
        [Route("menus")]
        [HttpPost]
        public HttpResponseMessage AddMenu(HTRoleMenuModel value)
        {
            return ApiOk(_manager.AddMenu(value));
        }

        [Route("menus/{id}")]
        [HttpPost]
        public void RemoveMenu(Guid id)
        {
            _manager.RemoveMenu(id);
        }

        [Route("menus/change")]
        [HttpPost]
        public void ChangeMenuPosition(IList<HTRoleMenuModel> value)
        {
            _manager.ChangePosition(value);
        }
    }
}