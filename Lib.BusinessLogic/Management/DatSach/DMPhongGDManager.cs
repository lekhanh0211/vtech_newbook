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
    public class DMPhongGDManager : BaseManager<DMPhongGDManager, DMPhongGD, DMPhongGDModel>
    {
        public override DMPhongGDModel GetById(Guid id)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<DMPhongGDModel>(@"select x.*, l.Ten TinhThanh from DMPhongGD x join DMTinhThanh l on x.IdTinhThanh = l.Id where x.Id = @id"
                    , new { id = id }).FirstOrDefault();
                return vResult;
            }
        }
     
        public IEnumerable<DMPhongGDModel> SelectDataByPage(string sSearch, Guid? idTinhThanh,
           DateTime? dateFrom, DateTime? dateTo, int dcPageIndex, int dcPageItem, out int total, string sOrder = null)
        {
            total = 0;
            using (BaseData db = new BaseData(_nameConnStr))
            {
                // Add QueryParams
                Dictionary<string, object> vParams = new Dictionary<string, object>();
                vParams.Add("dcPageIndex", dcPageIndex);
                vParams.Add("dcPageItem", dcPageItem);
                var strWhere = "";

                if (dateFrom.IsNotNull())
                {
                    strWhere = strWhere + " and x.NgayTao >= @dateFrom ";
                    vParams.Add("dateFrom", dateFrom);
                }
                if (dateTo.IsNotNull())
                {
                    dateTo = dateTo.Value.Date.AddDays(1);
                    strWhere = strWhere + " and x.NgayTao < @dateTo ";
                    vParams.Add("dateTo", dateTo);
                }
                if (sSearch.IsNotNullOrEmpty())
                {
                    sSearch = sSearch.ToTvKhongDau();
                    strWhere += string.Format(" and (x.StrSearch LIKE N'%{0}%') ", sSearch);
                }
                if (idTinhThanh.IsNotNull())
                {
                    vParams.Add("idTinhThanh", idTinhThanh.Value);
                    strWhere += " and (x.IdTinhThanh = @idTinhThanh or x.IdTinhThanh in (select l.Id from DMTinhThanh l where l.Id = @idTinhThanh)) ";
                }

                // string strQurey = @"select * INTO #dataList from DMPhongGD x where 1 = 1 " + strWhere;

                string strQurey = @"select x.*, r.[Ten] TenTT from DMTinhThanh x join DMPhongGD r on x.IdTinhThanh = r.Id where 1 = 1 " + strWhere;

                if (sOrder.IsNotNullOrEmpty())
                {
                    strQurey = strQurey + @" order by " + sOrder;
                }

                if (dcPageItem > 10000)
                {
                    dcPageItem = 10000;
                }
                if (dcPageItem < 0)
                {
                    dcPageItem = 0;
                }
                return db.QueryAndTotal<DMPhongGDModel>(strQurey, out total, vParams);
            }
        }

    }
}
