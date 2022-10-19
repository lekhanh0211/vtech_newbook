using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.DTO
{
    public class DMKhoi : BaseDTO
    {
        public string TenKhoi { get; set; }
        public DateTime? NgayTao { get; set; }
        public string StrSearch { get; set; }
    }
}
