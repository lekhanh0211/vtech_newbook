using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.DTO
{
    public class DMBanner : BaseDTO
    {
        public int UuTien { get; set; }
        public string UrlHinhAnh { get; set; }
        public string LinkWeb { get; set; }
        public string LienKetApp { get; set; }
        public DateTime NgayTao { get; set; }
        public bool Active { get; set; }
        public string TieuDe { get; set; }
        public int ViTri { get; set; }
    }
}
