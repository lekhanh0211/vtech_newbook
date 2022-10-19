using Lib.BusinessLogic.DTO;
using Lib.BusinessLogic.Model;
using Lib.DataAccess;
using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Lib.BusinessLogic.Management
{
    public class DMSanPhamManager : BaseManager<DMSanPhamManager, DMSanPham, DMSanPhamModel>
    {
        public override DMSanPhamModel GetById(Guid id)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<DMSanPhamModel>(@"select x.*, l.Ten DanhMuc from DMSanPham x join DMLoaiSanPham l on x.IdLoai = l.Id where x.Id = @id"
                    , new { id = id }).FirstOrDefault();
                return vResult;
            }
        }
        public DMSanPhamModel GetByUrl(string url)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<DMSanPhamModel>(@"select * from DMSanPham where Url = @url"
                    , new { url }).FirstOrDefault();
                return vResult;
            }
        }
        public IEnumerable<DMSanPhamModel> SelectDataByPage(string sSearch, bool iGiaSi, Guid? idLoai, int? phanLoai, int? tinhTrang, bool Active,
            DateTime? dateFrom, DateTime? dateTo, int dcPageIndex, int dcPageItem, out int total, string sOrder = null)
        {
            total = 0;
            using (BaseData db = new BaseData(_nameConnStr))
            {
                // Add QueryParams
                Dictionary<string, object> vParams = new Dictionary<string, object>();
                vParams.Add("dcPageIndex", dcPageIndex);
                vParams.Add("dcPageItem", dcPageItem);
                var strWhere = " and x.Active = " + (Active ? "1 " : "0 ");

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
                if (idLoai.IsNotNull())
                {
                    vParams.Add("idLoai", idLoai.Value);
                    strWhere += " and (x.IdLoai = @idLoai or x.IdLoai in (select l.Id from DMLoaiSanPham l where l.IdCap1 = @idLoai or l.IdCap2 = @idLoai)) ";
                }
                if (phanLoai.HasValue)
                {
                    vParams.Add("phanLoai", phanLoai.Value);
                    strWhere += " and x.PhanLoai = @phanLoai ";
                }
                if (tinhTrang.HasValue)
                {
                    if (tinhTrang == 1)
                    {
                        strWhere += " and x.TonKho > 0 ";
                    }
                    else
                    {
                        strWhere += " and x.TonKho = 0 ";
                    }
                }
                string viewGiaSi = "";
                if (iGiaSi) viewGiaSi = ", x.GiaSi, x.CauHinhGiaSi";
                string strQurey = @"select * INTO #dataList from DMSanPham x where 1 = 1 " + strWhere;

                strQurey = strQurey + @"

                select count(id) Total from #dataList

                select x.Id, x.Ten, x.MaSanPham, x.GiaGoc, x.GiaBan, x.PhanLoai, x.IdLoai, x.TonKho, x.UrlHinhAnh, x.DanhSachHinhAnh, x.MoTa, x.ThuocTinh, x.NoiBat, x.NgayTao, x.Active, x.StrSearch, x.Url
                " + viewGiaSi + @"
                , dm.Ten DanhMuc, dm.TenCap1 DanhMucCap1, dm.TenCap2 DanhMucCap2 from #dataList x left join (select l.*, c1.Ten TenCap1, c2.Ten TenCap2 from DMLoaiSanPham l left join DMLoaiSanPham c1 on l.IdCap1 = c1.Id
                left join DMLoaiSanPham c2 on l.IdCap2 = c2.Id) dm on x.IdLoai = dm.Id
                order by " + (sOrder.IsNotNullOrEmpty()? sOrder : "x.NgayTao desc") + @" 
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
                return db.QueryAndTotal<DMSanPhamModel>(strQurey, out total, vParams);
            }
        }

        public void ImportExcel(List<DMSanPhamModel> value)
        {
            if (value.Count == 0 || value == null) throw new MyInvalidDataExceptions("Không có d? li?u!");
            DateTime dateNow = DateTime.Now;
            using (BaseData db = new BaseData(_nameConnStr))
            {
                using (var transaction = db.Conn.BeginTransaction())
                {
                    foreach (DMSanPhamModel item in value)
                    {
                        item.SetStrSearch();
                        DMSanPham objSave = item.CopyAs<DMSanPham>();
                        objSave.Id = Guid.NewGuid();
                        objSave.NgayTao = dateNow;
                        db.Insert(objSave, transaction);

                    }
                    transaction.Commit();
                }
            }
        }
    }
}
