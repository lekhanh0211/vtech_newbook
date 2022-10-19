using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.DTO
{
    public class DMGiaoVien : BaseDTO
    {
        public string TenGV { get; set; }
        public string Email { get; set; }
        public string DiaChi { get; set; }
        public Guid? Truong { get; set; }
        public Guid? ChuNhiem { get; set; }
        public string HinhDaiDien { get; set; }
        public string TaiKhoan { get; set; }
        public string MatKhau { get; set; }
        public bool? PasswordMacDinh { get; set; }
        public string MatKhauMacDinh { get; set; }
        public DateTime? NgayTao { get; set; }
        public string StrSearch { get; set; }
    }
}
