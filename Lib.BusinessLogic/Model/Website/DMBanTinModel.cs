using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class DMBanTinModel : BaseModel
    {
        public string url { get; set; }
        [StrSearch]
        public string TieuDe { get; set; }
        [StrSearch]
        public string TomTat { get; set; }
        public string UrlHinh { get; set; }
        public string NoiDung { get; set; }
        [StrSearch]
        public string KeyWord { get; set; }
        public DateTime NgayDang { get; set; }
        public string NguoiDang { get; set; }
        public DateTime NgayTao { get; set; }
    }
}
