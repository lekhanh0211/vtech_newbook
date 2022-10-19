using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lib.BusinessLogic.DTO
{
    public class HTRoleMenu: BaseDTO
    {
        public System.Guid IdRole { get; set; }
        public System.Guid IdMenu { get; set; }
        public string Note { get; set; }
        public decimal UuTien { get; set; }
        public Nullable<System.Guid> IdParent { get; set; }
    }
}
