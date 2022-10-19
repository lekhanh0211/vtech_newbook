using Lib.BusinessLogic.DTO;
using Lib.BusinessLogic.Model;
using Lib.DataAccess;
using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lib.BusinessLogic.Management
{
    public class HTMenuManager : BaseManager<HTMenuManager, HTMenu, HTMenuModel>
    {
        public IList<ObjMenuItem> LoadMenuForClient(Guid idRole)
        {
            try
            {
                using (BaseData db = new BaseData(_nameConnStr))
                {
                    // Add QueryParams
                    var strQurey = @"select rl.Id, rl.IdRole, rl.IdMenu, m.ActivityName, m.ControllerName, m.DisplayIcon as Icon,
m.DisplayText, rl.UuTien, m.IsParent as IsParentGroup, rl.Note as [Type], rl.IdParent, m.UrlState, m.Param as Params
from HTRoleMenu rl join HTMenu m on rl.IdMenu = m.Id
where rl.IdRole = @idRole order by rl.UuTien";
                    
                    var vMenus = db.Query<HTRoleMenuModel>(strQurey, new { idRole });
                    if (vMenus == null || vMenus.Count() == 0)
                    {
                        //throw new Exception("This role have not any menu!");
                        return null;
                    }
                    IList<ObjMenuItem> result = new List<ObjMenuItem>();

                    foreach (var x in vMenus.Where(m => m.IdParent.IsNull()))
                    {
                        var vMenuItem = new ObjMenuItem()
                        {
                            Action = x.ActivityName,
                            Controller = x.ControllerName,
                            Icon = x.Icon,
                            Text = x.DisplayText,
                            UuTien = (int)x.UuTien,
                            IsParent = x.IsParentGroup,
                            Params = x.Params,
                            UrlState = x.UrlState,
                            Type = x.Type
                        };
                        if (x.IsParentGroup)
                        {
                            vMenuItem.Children = vMenus.Where(m => m.IdParent == x.Id).Select(y =>
                                new ObjMenuItem()
                                {
                                    Action = y.ActivityName,
                                    Controller = y.ControllerName,
                                    Icon = y.Icon,
                                    Text = y.DisplayText,
                                    UuTien = (int)y.UuTien,
                                    Params = y.Params,
                                    UrlState = y.UrlState,
                                    Type = y.Type
                                });
                        }
                        result.Add(vMenuItem);
                    }

                    return result;
                }
            }
            catch (Exception ex)
            {
                ex.Log();
                throw;
            }
        }
    }
}
