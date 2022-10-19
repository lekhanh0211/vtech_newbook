using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class CMTuDienModel : BaseModel
    {
        public string MaLoai { get; set; }
        public string TenLoai { get; set; }
        public string MaTuDien { get; set; }
        public Guid IdLoaiTuDien { get; set; }
        public string TenNgan { get; set; }
        public string Ten { get; set; }
        public string GhiChu { get; set; }
        public decimal? UuTien { get; set; }
    }
}
