using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class DMDoiTacModel : BaseModel
    {
        public int UuTien { get; set; }
        public string LogoUrl { get; set; }
        [StrSearch]
        public string TenDoiTac { get; set; }
        public DateTime NgayTao { get; set; }
    }
}
