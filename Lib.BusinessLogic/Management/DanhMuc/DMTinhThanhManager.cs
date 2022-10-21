using Lib.BusinessLogic.DTO;
using Lib.BusinessLogic.Model;
using Lib.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Lib.BusinessLogic.Management
{
    public class DMTinhThanhManager : BaseManager<DMTinhThanhManager, DMTinhThanh, DMTinhThanhModel>
    {
        public IEnumerable<DMTinhThanhModel> GetByCap(int cap)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<DMTinhThanhModel>(@"select * from DMTinhThanh where Cap = @cap order by UuTien"
                    , new { cap });
                return vResult;
            }
        }

        public IEnumerable<DMTinhThanhModel> GetByCapTren(Guid id)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<DMTinhThanhModel>(@"select * from DMTinhThanh where IdCapTren = @id order by UuTien"
                    , new { id });
                return vResult;
            }
        }

      /*  public override DMTinhThanhModel GetById(Guid id)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<DMTinhThanhModel>(@"select x.*, c1.Ten TenCap1, c1.Url UrlCap1, c2.Ten TenCap2, c2.Url UrlCap2 from DMLoaiSanPham x left join DMLoaiSanPham c1 on x.IdCap1 = c1.Id
                        left join DMLoaiSanPham c2 on x.IdCap2 = c2.Id where x.Id = @id"
                    , new { id = id }).FirstOrDefault();
                return vResult;
            }
        }*/
     
        public IEnumerable<DMTinhThanhModel> SelectAll()
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<DMTinhThanhModel>(@"select x.* from DMTinhThanh x where x.Cap = 1 order by UuTien");
              /*  foreach (var cap1 in vResult)
                {
                    cap1.DanhMucCon = db.Query<DMTinhThanhModel>(@"select x.* from DMLoaiSanPham x where x.Cap = 2 and x.Active = 1 and x.IdCap1 = @Id order by UuTien", new { cap1.Id });
                    foreach (var cap2 in cap1.DanhMucCon)
                    {
                        cap2.DanhMucCon = db.Query<DMTinhThanhModel>(@"select x.* from DMLoaiSanPham x where x.Cap = 3 and x.Active = 1 and x.IdCap2 = @Id order by UuTien", new { cap2.Id });
                    }
                }*/
                return vResult;
            }
        }
    }
}
