using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class DMTrangTinhModel : BaseModel
    {
        public string url { get; set; }
        [StrSearch]
        public string TieuDe { get; set; }
        public string NoiDung { get; set; }
        [StrSearch]
        public string KeyWord { get; set; }
        public string GhiChu { get; set; }
        public DateTime NgayTao { get; set; }
    }
}
