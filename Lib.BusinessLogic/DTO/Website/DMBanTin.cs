using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.DTO
{
    public class DMBanTin : BaseDTO
    {
        public string url { get; set; }
        public string TieuDe { get; set; }
        public string TomTat { get; set; }
        public string UrlHinh { get; set; }
        public string NoiDung { get; set; }
        public string KeyWord { get; set; }
        public DateTime NgayDang { get; set; }
        public string NguoiDang { get; set; }
        public DateTime NgayTao { get; set; }
        public bool Active { get; set; }
        public string StrSearch { get; set; }
    }
}
