using Lib.BusinessLogic.DTO;
using Lib.BusinessLogic.Model;
using Lib.DataAccess;
using System;
using System.Linq;

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
    }
}
