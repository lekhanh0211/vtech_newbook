using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.DTO
{
    public class DMDoiTac : BaseDTO
    {
        public int UuTien { get; set; }
        public string LogoUrl { get; set; }
        public string TenDoiTac { get; set; }
        public DateTime NgayTao { get; set; }
        public bool Active { get; set; }
        public string StrSearch { get; set; }
    }
}
