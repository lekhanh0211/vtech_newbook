using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class DMTruongModel : BaseModel
    {
        [StrSearch]
        public string TenTruong { get; set; }
        public string DiaChi { get; set; }
        public string MaTruong { get; set; }
        public string Email { get; set; }
        public Guid? PGD { get; set; }
        public Guid? IdTinhThanh { get; set; }
        public Guid? IdQuanHuyen { get; set; }
        public string TaiKhoan { get; set; }
        public string MatKhau { get; set; }
        public string MatKhauMacDinh { get; set; }
        public DateTime? NgayTao { get; set; }
    }
}
