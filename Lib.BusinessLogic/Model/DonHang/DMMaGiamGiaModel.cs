using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class DMMaGiamGiaModel : BaseModel
    {
        [StrSearch]
        public string TieuDe { get; set; }
        [StrSearch]
        public string Code { get; set; }
        public DateTime? NgayBatDau { get; set; }
        public DateTime? NgayKetThuc { get; set; }
        public decimal GiaTriDonHang { get; set; }
        public int LoaiKM { get; set; }
        public decimal? GiaTriKM { get; set; }
        public decimal? KMToiDa { get; set; }
        public DateTime NgayTao { get; set; }
    }
}
