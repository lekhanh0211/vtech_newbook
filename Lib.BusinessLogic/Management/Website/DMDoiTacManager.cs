using Lib.BusinessLogic.DTO;
using Lib.BusinessLogic.Model;
using Lib.DataAccess;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Management
{
    public class DMDoiTacManager : BaseManager<DMDoiTacManager, DMDoiTac, DMDoiTacModel>
    {
        public IEnumerable<DMDoiTacModel> SelectAll()
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<DMDoiTacModel>(@"select x.* from DMDoiTac x where x.Active = 1 order by UuTien");
                return vResult;
            }
        }
    }
}
