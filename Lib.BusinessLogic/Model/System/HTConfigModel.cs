using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class HTConfigModel : BaseModel
    {
        public string Ma { get; set; }
        public string Value { get; set; }
        public string GhiChu { get; set; }
        public bool IsUserEdit { get; set; }
        public DateTime NgayTao { get; set; }
    }
}
