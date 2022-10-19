using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class DMBangMaModel : BaseModel
    {
        public string Ma { get; set; }
        public string Ten { get; set; }
        public string TienTo { get; set; }
        public string SoHT { get; set; }
        public decimal? DoDai { get; set; }
        public string TienToHT { get; set; }
        public string DienGiai { get; set; }
        public decimal UuTien { get; set; }
        public string Domain { get; set; }
        public Guid? IdSubHospital { get; set; }
        public bool HienThiTienTo { get; set; }
    }
}
