using Lib.BusinessLogic.DTO;
using Lib.BusinessLogic.Model;
using Lib.DataAccess;
using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Lib.BusinessLogic.Management
{
    public class DMUserManager : BaseManager<DMUserManager, HTUser, HTUserModel>
    {
        public override IEnumerable<HTUserModel> SelectBy(List<Expression<Func<HTUserModel, bool>>> filter = null, string sOrder = null)
        {
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
                string strQurey = @"select x.*, r.[Name] sRole from HTUser x join HTRole r on x.IdRole = r.Id where 1 = 1 " + strWhere;

                if (sOrder.IsNotNullOrEmpty())
                {
                    strQurey = strQurey + @" order by " + sOrder;
                }

                var vResult = db.Query<HTUserModel>(strQurey, vParams);
                return vResult;
            }
        }
        public HTUserModel SelectByUserName(string userName)
        {
            List<Expression<Func<HTUserModel, bool>>> lFilter = new List<Expression<Func<HTUserModel, bool>>>();
            lFilter.Add(x => x.UserName == userName);
            return this.SelectBy(lFilter).FirstOrDefault();
        }
        public override HTUserModel InsertOrUpdate(HTUserModel obj)
        {
            if (obj.Id.IsNotNull())
            {
                obj.SetStrSearch();
                var saveObject = obj.CopyAs<HTUser>();
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
                obj.Password = CryptoUtils.Encrypt(obj.Password);
                obj.Id = Guid.NewGuid();
                obj.Active = true;
                obj.SetStrSearch();
                var saveObject = obj.CopyAs<HTUser>();
                using (BaseData db = new BaseData(_nameConnStr))
                {
                    db.Insert(saveObject);
                    return obj;
                }
            }
        }
    }
}
