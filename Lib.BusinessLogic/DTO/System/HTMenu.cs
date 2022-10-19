using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lib.BusinessLogic.DTO
{
    public class HTMenu : BaseDTO
    {
        public string DisplayIcon { get; set; }
        public string DisplayText { get; set; }
        public string ControllerName { get; set; }
        public string ActivityName { get; set; }
        public string UrlState { get; set; }
        public bool IsParent { get; set; }
        public string Param { get; set; }
    }
}
