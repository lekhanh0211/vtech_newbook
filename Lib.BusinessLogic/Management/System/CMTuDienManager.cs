using Lib.BusinessLogic.DTO;
using Lib.BusinessLogic.Model;
using Lib.DataAccess;
using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Lib.BusinessLogic.Management
{
    public class CMTuDienManager : BaseManager<CMTuDienManager, CMTuDien, CMTuDienModel>
    {
        public IEnumerable<CMTuDienModel> SelectByType(string type)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<CMTuDienModel>(@"select l.MaLoai, l.TenLoai, x.* from CMTuDien x 
join CMLoaiTuDien l on x.IdLoaiTuDien = l.Id
where l.MaLoai = @type
order by UuTien", new { type });
                return vResult;
            }
        }

        public CMTuDienModel SelectByCode(string type, string code)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<CMTuDienModel>(@"select l.MaLoai, l.TenLoai, x.* from CMTuDien x 
join CMLoaiTuDien l on x.IdLoaiTuDien = l.Id
where l.MaLoai = @type and MaTuDien = @code", new { type, code }).FirstOrDefault();
                return vResult;
            }
        }
    }
}
