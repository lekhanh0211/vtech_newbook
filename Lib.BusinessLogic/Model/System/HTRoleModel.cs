using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lib.BusinessLogic.Model
{
    public class HTRoleModel : BaseModel
    {
        [StrSearch]
        public string Code { get; set; }
        [StrSearch]
        public string Name { get; set; }
        public string Note { get; set; }
        public string Clam { get; set; }
    }
}
