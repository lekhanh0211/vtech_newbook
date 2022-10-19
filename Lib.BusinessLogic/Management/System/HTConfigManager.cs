using Lib.BusinessLogic.DTO;
using Lib.BusinessLogic.Model;
using System.Collections.Generic;
using System.Linq;

namespace Lib.BusinessLogic.Management
{
    public class HTConfigManager : BaseManager<HTConfigManager, HTConfig, HTConfigModel>
    {
        private IEnumerable<HTConfigModel> _Config;
        public HTConfigManager() { }
        public HTConfigManager(bool getconfig)
        {
            _Config = this.SelectBy().Where(x => x.Active);
        }

        public Dictionary<string, string> GetConfig()
        {
            var value = this.SelectBy().Where(x => x.Active);
            Dictionary<string, string> dictionary = new Dictionary<string, string>();
            foreach (var item in value)
            {
                if (dictionary.ContainsKey(item.Ma))
                {
                    dictionary[item.Ma] = item.Value;
                }
                else
                {
                    dictionary.Add(item.Ma, item.Value);
                }
            }
            return dictionary;
        }

        public string SelectValuesByKey(string name)
        {
            var config = _Config.FirstOrDefault(x => x.Ma.Equals(name) && x.Active == true);
            if (config != null)
            {
                return config.Value;
            }
            return "";
        }

        public bool ValueIsTrue(string key)
        {
            var config = _Config.FirstOrDefault(x => x.Ma.Equals(key) && x.Active == true);
            if (config != null && config.Value == "true")
            {
                return true;
            }
            return false;
        }
    }
}
