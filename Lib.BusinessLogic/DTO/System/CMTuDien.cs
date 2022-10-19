using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.DTO
{
    public class CMTuDien : BaseDTO
    {
        public string MaTuDien { get; set; }
        public Guid IdLoaiTuDien { get; set; }
        public string TenNgan { get; set; }
        public string Ten { get; set; }
        public string GhiChu { get; set; }
        public decimal? UuTien { get; set; }
        public bool Active { get; set; }
    }
}
