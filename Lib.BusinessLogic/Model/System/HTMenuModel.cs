using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lib.BusinessLogic.Model
{
    public class HTMenuModel : BaseModel
    {
        public string DisplayIcon { get; set; }
        public string DisplayText { get; set; }
        public string ControllerName { get; set; }
        public string ActivityName { get; set; }
        public string UrlState { get; set; }
        public bool IsParent { get; set; }
        public string Param { get; set; }
        public decimal UuTien { get; set; }
    }
}
