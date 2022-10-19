using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class DMBannerModel : BaseModel
    {
        public int UuTien { get; set; }
        public string UrlHinhAnh { get; set; }
        public string LinkWeb { get; set; }
        public string LienKetApp { get; set; }
        public DateTime NgayTao { get; set; }
        public string TieuDe { get; set; }
        public int ViTri { get; set; }
    }
}
