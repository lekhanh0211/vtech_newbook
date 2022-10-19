using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.DTO
{
    public class HTConfig : BaseDTO
    {
        public string Ma { get; set; }
        public string Value { get; set; }
        public string GhiChu { get; set; }
        public bool IsUserEdit { get; set; }
        public DateTime NgayTao { get; set; }
        public bool Active { get; set; }
        public string StrSearch { get; set; }
    }
}
