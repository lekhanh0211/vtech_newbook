using Lib.Extensions;
using System;
using System.Linq;
using System.Reflection;

namespace Lib.BusinessLogic.Model
{
    public class BaseModel
    {
        public virtual Guid Id { get; set; }
        public bool Active { get; set; }
        public string StrSearch { get; set; }
        public void SetStrSearch()
        {
            string strSearch = "";
            var properties = this.GetType().GetProperties().Where(prop => prop.IsDefined(typeof(StrSearchAttribute), false));
            foreach (PropertyInfo prop in properties)
            {
                var str = prop.GetValue(this) as string;
                if (str != null)
                {
                    strSearch = string.Format("{0},{1}", strSearch, str);
                }
            }
            this.StrSearch = strSearch.ToTvKhongDau();
        }
    }
}
