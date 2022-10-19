using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.DTO
{
    public class DMMedia : BaseDTO
    {
        public string ThuMuc { get; set; }
        public string FileUrl { get; set; }
        public string FileName { get; set; }
        public DateTime NgayTao { get; set; }
        public bool Active { get; set; }
        public string StrSearch { get; set; }
    }
}
