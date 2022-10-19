using Lib.BusinessLogic.DTO;
using Lib.BusinessLogic.Model;
using Lib.BusinessLogic.Utils;
using Lib.DataAccess;
using Lib.Extensions;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace Lib.BusinessLogic.Management
{
    public class DMDonHangManager : BaseManager<DMDonHangManager, DMDonHang, DMDonHangModel>
    {
        public override DMDonHangModel InsertOrUpdate(DMDonHangModel obj)
        {
            if (obj.Id.IsNotNull())
            {
                obj.SetStrSearch();
                var saveObject = obj.CopyAs<DMDonHang>();
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
                obj.MaDonHang = DMBangMaManager.Instance.GenMaAndNew(null, CBangMa.MaDonHang, "DHyyMM", 10, true);
                obj.Id = Guid.NewGuid();
                obj.Active = true;
                var ls = new List<LichSuDonHangModel>();
                var tt = this.GetDsTrangThai().FirstOrDefault();
                ls.Add(new LichSuDonHangModel() {
                    TrangThai = tt.Ma,
                    TenTrangThai = tt.Ten,
                    Icon = tt.Icon,
                    ThoiGian = obj.NgayTao,
                    ThuTu = 0
                });
                obj.NgayTrangThai = obj.NgayTao;
                obj.LichSuDonHang = ls.ToJson();
                obj.SetStrSearch();
                using (BaseData db = new BaseData(_nameConnStr))
                using (var transaction = db.Conn.BeginTransaction())
                {
                    var saveObject = obj.CopyAs<DMDonHang>();
                    db.Insert(saveObject, transaction);

                    if (obj.DsSanPham.Count() > 0)
                    {
                        foreach (var item in obj.DsSanPham)
                        {
                            item.Id = Guid.NewGuid();
                            item.IdDonHang = obj.Id;
                            var saveItem = item.CopyAs<DMDonHangChiTiet>();
                            db.Insert(saveItem, transaction);
                        }
                    }
                    else
                    {
                        throw new MyInvalidDataExceptions("Đơn hàng không có sản phảm nào");
                    }
                    transaction.Commit();
                    return obj;
                }
            }
        }

        public IEnumerable<DMDonHangModel> SelectDataByPage(int? loai, string sSearch, int? trangthai, bool? active, DateTime? dateFrom, DateTime? dateTo, int dcPageIndex, int dcPageItem, out int total)
        {
            total = 0;
            using (BaseData db = new BaseData(_nameConnStr))
            {
                // Add QueryParams
                Dictionary<string, object> vParams = new Dictionary<string, object>();
                vParams.Add("dcPageIndex", dcPageIndex);
                vParams.Add("dcPageItem", dcPageItem);
                var strWhere = "";
                if (loai.HasValue)
                {
                    strWhere = strWhere + " and x.Loai = " + loai.Value;
                }

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
                if (trangthai.HasValue)
                {
                    vParams.Add("trangthai", trangthai);
                    strWhere += " and x.TrangThai = @trangthai ";
                }
                if (active.HasValue)
                {
                    strWhere += string.Format(" and x.Active = {0}", active.Value ? 1 : 0);
                }

                string strQurey = @"select * INTO #dataList from DMDonHang x where 1 = 1 " + strWhere;

                strQurey = strQurey + @"

                select count(id) Total from #dataList

                select x.* from #dataList x
                order by x.NgayTao desc 
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
                return db.QueryAndTotal<DMDonHangModel>(strQurey, out total, vParams);
            }
        }

        public IEnumerable<DMDonHangModel> SelectDataByUser(Guid idUser, int trangthai, int dcPageIndex, int dcPageItem, out int total)
        {
            total = 0;
            using (BaseData db = new BaseData(_nameConnStr))
            {
                // Add QueryParams
                Dictionary<string, object> vParams = new Dictionary<string, object>();
                vParams.Add("dcPageIndex", dcPageIndex);
                vParams.Add("dcPageItem", dcPageItem);
                vParams.Add("idUser", idUser);

                string strQurey = @"select * INTO #dataList from DMDonHang x where x.IdNguoiDung = @idUser and x.TrangThai = " + trangthai;

                strQurey = strQurey + @"

                select count(id) Total from #dataList

                select x.* from #dataList x
                order by x.NgayTao desc 
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
                return db.QueryAndTotal<DMDonHangModel>(strQurey, out total, vParams);
            }
        }

        public IEnumerable<DMTrangThaiDonHangModel> GetThongKeUser(Guid idUser)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<DMTrangThaiDonHangModel>(@"select dm.Ma, dm.Ten, dm.TenNgan, dm.Icon, COUNT(dh.Id) SoDonHang from DMTrangThaiDonHang dm
left join DMDonHang dh on dh.TrangThai = dm.Ma and dh.IdNguoiDung = @idUser
where dm.Ma <> 99
group by dm.Ma, dm.Ten, dm.TenNgan, dm.Icon
order by dm.Ma", new { idUser });
                return vResult;
            }
        }

        public IEnumerable<DMTrangThaiDonHangModel> GetDsTrangThai()
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<DMTrangThaiDonHangModel>(@"select * from DMTrangThaiDonHang order by ma");
                return vResult;
            }
        }

        public IEnumerable<DMDonHangModel> SelectDsDonHang(int trangthai, Guid idUser, int dcPageIndex, int dcPageItem, out int total)
        {
            total = 0;
            using (BaseData db = new BaseData(_nameConnStr))
            {
                // Add QueryParams
                Dictionary<string, object> vParams = new Dictionary<string, object>();
                vParams.Add("dcPageIndex", dcPageIndex);
                vParams.Add("dcPageItem", dcPageItem);
                vParams.Add("idUser", idUser);

                string strQurey = @"select * INTO #dataList from DMDonHang x where IdNguoiDung = @idUser and x.TrangThai =  " + trangthai;

                strQurey = strQurey + @"

                select count(id) Total from #dataList

                select x.*, (select count(ct.Id) from DMDonHangChiTiet ct where ct.IdDonHang = x.Id) from #dataList x
                order by x.NgayTao desc 
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
                return db.QueryAndTotal<DMDonHangModel>(strQurey, out total, vParams);
            }
        }

        public override DMDonHangModel GetById(Guid id)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<DMDonHangModel>(@"select * from DMDonHang where Id = @id"
                    , new { id = id }).FirstOrDefault();
                if (vResult!= null)
                {
                    vResult.DsSanPham = db.Query<DMDonHangChiTietModel>(@"select x.*, sp.MaSanPham, sp.UrlHinhAnh  from DMDonHangChiTiet x join DMSanPham sp on x.IdSanPham = sp.Id where x.IdDonHang = @id"
                    , new { id = id });
                    vResult.DMTrangThai = db.Query<DMTrangThaiDonHangModel>(@"select * from DMTrangThaiDonHang where Ma = @ma", new { ma = vResult.TrangThai }).FirstOrDefault();
                }
                return vResult;
            }
        }

        public int Deactivate(Guid ipId, string lydo)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Execute($"update DMDonHang set Active = 0, TrangThai = 99, LyDoHuy = @lydo where Id = @id"
                    , new { id = ipId, lydo = lydo ?? "" });
                return vResult;
            }
        }
    }
}
