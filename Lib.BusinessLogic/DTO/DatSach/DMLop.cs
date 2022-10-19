using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.DTO
{
    public class DMLop : BaseDTO
    {
        public string MaLop { get; set; }
        public string TenLop { get; set; }
        public Guid? Khoi { get; set; }
        public Guid? Truong { get; set; }
        public string GVChuNhiem { get; set; }
        public DateTime? NgayTao { get; set; }
        public string StrSearch { get; set; }
    }
}
