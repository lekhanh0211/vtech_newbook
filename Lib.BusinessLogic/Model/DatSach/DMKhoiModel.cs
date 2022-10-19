using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class DMKhoiModel : BaseModel
    {
        [StrSearch]
        public string TenKhoi { get; set; }
        public DateTime? NgayTao { get; set; }
    }
}
