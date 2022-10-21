using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class DMLopModel : BaseModel
    {
        [StrSearch]
        public string MaLop { get; set; }
        [StrSearch]
        public string TenLop { get; set; }
        public Guid? Khoi { get; set; }
        public Guid? Truong { get; set; }
        public string GVChuNhiem { get; set; }
        public DateTime? NgayTao { get; set; }
    }
}
