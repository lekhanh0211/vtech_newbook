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
    }
}
