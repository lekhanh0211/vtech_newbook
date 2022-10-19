using Lib.BusinessLogic.Model;
using Lib.DataAccess;
using System.Collections.Generic;
using System.Data;

namespace Lib.BusinessLogic.Management
{
    public class BaoCaoManager
    {
        protected string _nameConnStr = "AppConnection";
        #region Singleton
        private static BaoCaoManager _instance;
        private BaoCaoManager() { }
        public static BaoCaoManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new BaoCaoManager();
                }
                return _instance;
            }
        }
        #endregion

        #region public method
        public DataSet getDataSetProc(RptParams objBaoCao, out Dictionary<string, object> optParams)
        {
            var data = new BaseData(_nameConnStr);
            data.AddListParameter(objBaoCao.objParams);
            if (objBaoCao.optParams != null)
            {
                data.AddListOptParameter(objBaoCao.optParams);
            }
            var ds = data.GetDataSet(objBaoCao.procName, out optParams);

            return ds;
        }
        #endregion
    }
}
