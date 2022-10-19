using Lib.BusinessLogic.DTO;
using Lib.BusinessLogic.Model;
using Lib.DataAccess;
using Lib.Extensions;
using System.Collections.Generic;
using System.Linq;

namespace Lib.BusinessLogic.Management
{
    public class DMMauPhieuInManager : BaseManager<DMMauPhieuInManager, DMMauPhieuIn, DMMauPhieuInModel>
    {
        public DMMauPhieuInModel GetByMa(string ma)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<DMMauPhieuInModel>(@"select * from DMMauPhieuIn where Ma = @ma"
                    , new { ma }).FirstOrDefault();
                return vResult;
            }
        }

        public IEnumerable<DMMauPhieuInModel> GetByPage(string sSearch, int dcPageIndex, int dcPageItem, out int total)
        {
            total = 0;
            using (BaseData db = new BaseData(_nameConnStr))
            {
                // Add QueryParams
                Dictionary<string, object> vParams = new Dictionary<string, object>();
                vParams.Add("dcPageIndex", dcPageIndex);
                vParams.Add("dcPageItem", dcPageItem);
                var strWhere = "";

                if (sSearch.IsNotNullOrEmpty())
                {
                    strWhere = strWhere + " and x.Ma like '%" + sSearch.Trim().ToLower() + "%'";
                }
                string strQurey = @"select * INTO #dataList from DMMauPhieuIn x where 1 = 1 " + strWhere;

                strQurey = strQurey + @"

                select count(id) Total from #dataList

                select x.* from #dataList x
                order by x.Ma 
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
                return db.QueryAndTotal<DMMauPhieuInModel>(strQurey, out total, vParams);
            }
        }
    }
}
