using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.DTO
{
    public class DMTrangTinh : BaseDTO
    {
        public string url { get; set; }
        public string TieuDe { get; set; }
        public string NoiDung { get; set; }
        public string KeyWord { get; set; }
        public string GhiChu { get; set; }
        public DateTime NgayTao { get; set; }
        public bool Active { get; set; }
        public string StrSearch { get; set; }
    }
}
