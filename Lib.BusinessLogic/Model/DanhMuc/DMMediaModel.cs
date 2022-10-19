using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class DMMediaModel : BaseModel
    {
        [StrSearch]
        public string ThuMuc { get; set; }
        public string FileUrl { get; set; }
        [StrSearch]
        public string FileName { get; set; }
        public DateTime NgayTao { get; set; }
    }
}
