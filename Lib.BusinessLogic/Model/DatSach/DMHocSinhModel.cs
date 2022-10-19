using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class DMHocSinhModel : BaseModel
    {
        [StrSearch]
        public string TenHS { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string Sdt { get; set; }
        public bool? GioiTinh { get; set; }
        public string Email { get; set; }
        public string DiaChi { get; set; }
        public string PhuHuynh { get; set; }
        public string SdtPhuHuynh { get; set; }
        public Guid? Truong { get; set; }
        public Guid? Lop { get; set; }
        public string TaiKhoan { get; set; }
        public string MatKhau { get; set; }
        public string MatKhauMacDinh { get; set; }
        public DateTime? NgayTao { get; set; }
    }
}
