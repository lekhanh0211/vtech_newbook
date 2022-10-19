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
    public class DMBanTinManager : BaseManager<DMBanTinManager, DMBanTin, DMBanTinModel>
    {
        public DMBanTinModel GetByUrl(string url)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<DMBanTinModel>(@"select * from DMBanTin where Url = @url"
                    , new { url }).FirstOrDefault();
                return vResult;
            }
        }
        public IEnumerable<DMBanTinModel> SelectDataForShop(DateTime? dateFrom, DateTime? dateTo, int dcPageIndex, int dcPageItem, out int total
            , List<Expression<Func<DMBanTinModel, bool>>> filter = null, string sOrder = null)
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
                if (filter != null)
                {
                    var translator = new MyQueryTranslator(vParams);
                    foreach (var item in filter)
                    {
                        strWhere = string.Format(" {0} and {1}", strWhere, translator.Translate(item));
                    }
                }
                string strQurey = @"select * INTO #dataList from DMBanTin x where 1 = 1 " + strWhere;

                strQurey = strQurey + @"

                select count(id) Total from #dataList

                select Id,url,TieuDe,TomTat,UrlHinh,KeyWord,NgayDang,NguoiDang,StrSearch from #dataList x
                order by " + (sOrder ?? "x.NgayTao desc") + @" 
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
                return db.QueryAndTotal<DMBanTinModel>(strQurey, out total, vParams);
            }
        }

        public IEnumerable<DMBanTinModel> SelectTinLienQuan(DateTime? dateFrom, Guid id)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                // Add QueryParams
                Dictionary<string, object> vParams = new Dictionary<string, object>();
                vParams.Add("id", id);
                var strWhere = "";

                if (dateFrom.IsNotNull())
                {
                    strWhere = strWhere + " and x.NgayTao < @dateFrom ";
                    vParams.Add("dateFrom", dateFrom);
                }
                string strQurey = @"select top 3 Id,url,TieuDe,TomTat,UrlHinh,KeyWord,NgayDang,NguoiDang,StrSearch #dataList from DMBanTin x where x.Id <> @id " + strWhere + "order by NgayTao";
                return db.Query<DMBanTinModel>(strQurey, vParams);
            }
        }
    }
}
