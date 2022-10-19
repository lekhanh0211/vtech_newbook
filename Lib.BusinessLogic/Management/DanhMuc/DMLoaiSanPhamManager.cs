using Lib.BusinessLogic.DTO;
using Lib.BusinessLogic.Model;
using Lib.DataAccess;
using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Lib.BusinessLogic.Management
{
    public class DMLoaiSanPhamManager : BaseManager<DMLoaiSanPhamManager, DMLoaiSanPham, DMLoaiSanPhamModel>
    {
        public IEnumerable<DMLoaiSanPhamModel> SelectDataByPage(string sSearch, Guid? idcap1, Guid? idcap2, int dcPageIndex, int dcPageItem, out int total, string sOrder = null)
        {
            total = 0;
            using (BaseData db = new BaseData(_nameConnStr))
            {
                // Add QueryParams
                Dictionary<string, object> vParams = new Dictionary<string, object>();
                vParams.Add("dcPageIndex", dcPageIndex);
                vParams.Add("dcPageItem", dcPageItem);
                var strWhere = "";

                if (idcap1.IsNotNull())
                {
                    vParams.Add("idcap1", idcap1);
                    strWhere += " and x.IdCap1 = @idcap1 ";
                }
                if (idcap2.IsNotNull())
                {
                    vParams.Add("idcap2", idcap2);
                    strWhere += " and x.IdCap2 = @idcap2 ";
                }
                if (sSearch.IsNotNullOrEmpty())
                {
                    sSearch = sSearch.ToTvKhongDau();
                    strWhere += string.Format(" and (x.StrSearch LIKE N'%{0}%') ", sSearch);
                }

                string strQurey = @"select * INTO #dataList from DMLoaiSanPham x where 1 = 1 " + strWhere;

                strQurey = strQurey + @"

                select count(id) Total from #dataList

                select x.* from #dataList x
                order by " + (sOrder ?? " x.Cap, x.UuTien ") + @" 
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
                return db.QueryAndTotal<DMLoaiSanPhamModel>(strQurey, out total, vParams);
            }
        }
        public override DMLoaiSanPhamModel GetById(Guid id)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<DMLoaiSanPhamModel>(@"select x.*, c1.Ten TenCap1, c1.Url UrlCap1, c2.Ten TenCap2, c2.Url UrlCap2 from DMLoaiSanPham x left join DMLoaiSanPham c1 on x.IdCap1 = c1.Id
left join DMLoaiSanPham c2 on x.IdCap2 = c2.Id where x.Id = @id"
                    , new { id = id }).FirstOrDefault();
                return vResult;
            }
        }
        public DMLoaiSanPhamModel GetByUrl(string id)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<DMLoaiSanPhamModel>(@"select x.*, c1.Ten TenCap1, c1.Url UrlCap1, c2.Ten TenCap2, c2.Url UrlCap2 from DMLoaiSanPham x left join DMLoaiSanPham c1 on x.IdCap1 = c1.Id
left join DMLoaiSanPham c2 on x.IdCap2 = c2.Id where x.Url = @id"
                    , new { id }).FirstOrDefault();
                return vResult;
            }
        }
        public IEnumerable<DMLoaiSanPhamModel> GetDMNoiBat()
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<DMLoaiSanPhamModel>(@"select top 3 x.* from DMLoaiSanPham x where Cap = 1 and x.Active = 1 order by UuTien");
                return vResult;
            }
        }

        public IEnumerable<DMLoaiSanPhamModel> SelectAll()
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<DMLoaiSanPhamModel>(@"select x.* from DMLoaiSanPham x where x.Cap = 1 and x.Active = 1 order by UuTien");
                foreach (var cap1 in vResult)
                {
                    cap1.DanhMucCon = db.Query<DMLoaiSanPhamModel>(@"select x.* from DMLoaiSanPham x where x.Cap = 2 and x.Active = 1 and x.IdCap1 = @Id order by UuTien", new { cap1.Id });
                    foreach (var cap2 in cap1.DanhMucCon)
                    {
                        cap2.DanhMucCon = db.Query<DMLoaiSanPhamModel>(@"select x.* from DMLoaiSanPham x where x.Cap = 3 and x.Active = 1 and x.IdCap2 = @Id order by UuTien", new { cap2.Id });
                    }
                }
                return vResult;
            }
        }

        public override DMLoaiSanPhamModel InsertOrUpdate(DMLoaiSanPhamModel obj)
        {
            if (obj.Id.IsNotNull())
            {
                obj.SetStrSearch();
                var saveObject = obj.CopyAs<DMLoaiSanPham>();
                using (BaseData db = new BaseData(_nameConnStr))
                {
                    db.Update(saveObject);
                    return obj;
                }
            }
            else
            {
                if (obj == null)
                    return null;
                using (BaseData db = new BaseData(_nameConnStr))
                {
                    if (obj.Code == 0)
                    {
                        var maxcode = db.Query<int>(@"select top 1 Code from DMLoaiSanPham order by Code desc").FirstOrDefault();
                        obj.Code = maxcode + 1;
                    }
                    obj.Id = Guid.NewGuid();
                    obj.Active = true;
                    obj.SetStrSearch();
                    var saveObject = obj.CopyAs<DMLoaiSanPham>();
                    db.Insert(saveObject);
                    return obj;
                }
            }
        }
    }
}
