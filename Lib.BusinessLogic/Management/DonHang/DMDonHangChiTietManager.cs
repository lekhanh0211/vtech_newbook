using Lib.BusinessLogic.DTO;
using Lib.BusinessLogic.Model;
using Lib.DataAccess;
using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Lib.BusinessLogic.Management
{
    public class DMDonHangChiTietManager : BaseManager<DMDonHangChiTietManager, DMDonHangChiTiet, DMDonHangChiTietModel>
    {
        public override IEnumerable<DMDonHangChiTietModel> SelectBy(List<Expression<Func<DMDonHangChiTietModel, bool>>> filter = null, string sOrder = null)
        {
            var tbName = typeof(DMDonHangChiTiet).Name;
            using (BaseData db = new BaseData(_nameConnStr))
            {
                // Add QueryParams
                Dictionary<string, object> vParams = new Dictionary<string, object>();
                var strWhere = "";
                if (filter != null)
                {
                    var translator = new MyQueryTranslator(vParams);
                    foreach (var item in filter)
                    {
                        strWhere = string.Format(" {0} and {1}", strWhere, translator.Translate(item));
                    }
                }
                string strQurey = @"select x.*, sp.MaSanPham, sp.UrlHinhAnh  from DMDonHangChiTiet x join DMSanPham sp on x.IdSanPham = sp.Id where 1 = 1 " + strWhere;

                if (sOrder.IsNotNullOrEmpty())
                {
                    strQurey = strQurey + @" order by " + sOrder;
                }

                var vResult = db.Query<DMDonHangChiTietModel>(strQurey, vParams);
                return vResult;
            }
        }
    }
}
