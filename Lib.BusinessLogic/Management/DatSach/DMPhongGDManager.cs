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
                    strWhere += " and (x.IdTinhThanh = @idTinhThanh or x.IdTinhThanh in (select l.Id from DMTinhThanh l where l.IdCapTren = @idTinhThanh )) ";
                }
               
                string strQurey = @"select * INTO #dataList from DMPhongGD x where 1 = 1 " + strWhere;

                strQurey = strQurey + @"

                select count(id) Total from #dataList

                select x.Id, x.TenPGD, x.IdTinhThanh, x.DiaChi, x.Email, x.TaiKhoan, x.MatKhau, x.MatKhauMacDinh,x.NgayTao, x.StrSearch,
                
                tt.Ten TinhThanh, tt.TenCapTren TinhThanhCapTren from #dataList x left join (select l.*, c1.Ten TenCapTren from DMTinhThanh l left join DMTinhThanh c1 on l.IdCapTren = c1.Id) tt on x.IdTinhThanh = tt.Id
                order by " + (sOrder.IsNotNullOrEmpty() ? sOrder : "x.NgayTao desc") + @" 
                OFFSET @dcPageItem * (@dcPageIndex - 1) ROWS
                FETCH NEXT @dcPageItem ROWS ONLY OPTION (RECOMPILE)

                drop table #dataList";
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
