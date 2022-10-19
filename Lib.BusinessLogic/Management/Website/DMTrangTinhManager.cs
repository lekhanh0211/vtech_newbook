using Lib.BusinessLogic.DTO;
using Lib.BusinessLogic.Model;
using Lib.DataAccess;
using System.Linq;

namespace Lib.BusinessLogic.Management
{
    public class DMTrangTinhManager : BaseManager<DMTrangTinhManager, DMTrangTinh, DMTrangTinhModel>
    {
        public DMTrangTinhModel GetByUrl(string url)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var vResult = db.Query<DMTrangTinhModel>(@"select * from DMTrangTinh where url = @url"
                    , new { url }).FirstOrDefault();
                return vResult;
            }
        }
    }
}
