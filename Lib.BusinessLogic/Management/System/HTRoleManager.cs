using Lib.BusinessLogic.DTO;
using Lib.BusinessLogic.Model;
using Lib.DataAccess;
using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace Lib.BusinessLogic.Management
{
    public class HTRoleManager : BaseManager<HTMenuManager, HTRole, HTRoleModel>
    {
        public override IEnumerable<HTRoleModel> SelectDataByPage(DateTime? dateFrom, DateTime? dateTo, int dcPageIndex, int dcPageItem, out int total
            , List<Expression<Func<HTRoleModel, bool>>> filter = null, string sOrder = null)
        {
            total = 0;
            var tbName = typeof(HTRole).Name;
            using (BaseData db = new BaseData(_nameConnStr))
            {
                // Add QueryParams
                Dictionary<string, object> vParams = new Dictionary<string, object>();
                vParams.Add("dcPageIndex", dcPageIndex);
                vParams.Add("dcPageItem", dcPageItem);
                var strWhere = "";
                if (filter != null)
                {
                    var translator = new MyQueryTranslator(vParams);
                    foreach (var item in filter)
                    {
                        strWhere = string.Format(" {0} and {1}", strWhere, translator.Translate(item));
                    }
                }
                string strQurey = @"select * INTO #dataList from " + tbName + @" x where 1 = 1 " + strWhere;

                strQurey = strQurey + @"

                select count(id) Total from #dataList

                select x.* from #dataList x
                order by " + (sOrder ?? "x.Code desc") + @" 
                OFFSET @dcPageItem * (@dcPageIndex - 1) ROWS
                FETCH NEXT @dcPageItem ROWS ONLY OPTION (RECOMPILE)

                drop table #dataList";
                if (dcPageItem > 1000)
                {
                    dcPageItem = 1000;
                }
                if (dcPageItem < 0)
                {
                    dcPageItem = 0;
                }
                return db.QueryAndTotal<HTRoleModel>(strQurey, out total, vParams);
            }
        }

        public IList<HTRoleMenuModel> SelectMenusByRole(Guid idRole)
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

                var result = vMenus.Where(m => m.IdParent.IsNull()).ToList();
                foreach (var x in result)
                {
                    if (x.IsParentGroup)
                    {
                        x.Children = vMenus.Where(m => m.IdParent == x.Id).ToList();
                    }
                }
                return result;
            }
        }

        public Guid? AddMenu(HTRoleMenuModel obj)
        {
            if (obj == null)
                return null;
            obj.Id = Guid.NewGuid();
            obj.Active = true;
            var saveObject = obj.CopyAs<HTRoleMenu>();
            using (BaseData db = new BaseData(_nameConnStr))
            {
                db.Insert(saveObject);
                return obj.Id;
            }
        }

        public int RemoveMenu(Guid id)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Execute($"delete HTRoleMenu where Id = @id"
                    , new { id });
                return vResult;
            }
        }

        public bool ChangePosition(IList<HTRoleMenuModel> ListMenus)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            using (var transaction = db.Conn.BeginTransaction())
            {
                foreach (var item in ListMenus)
                {
                    db.Execute($"update HTRoleMenu set UuTien = @uuTien where Id = @id"
                    , new { id = item.Id, uuTien = item.UuTien }, transaction);
                }
                transaction.Commit();
                return true;
            }
        }
    }
}
