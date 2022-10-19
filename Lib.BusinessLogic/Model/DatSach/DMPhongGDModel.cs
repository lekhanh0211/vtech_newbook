using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class DMPhongGDModel : BaseModel
    {
        [StrSearch]
        public string TenPGD { get; set; }
        public Guid? IdTinhThanh { get; set; }
        public string DiaChi { get; set; }
        public string Email { get; set; }
        public string TaiKhoan { get; set; }
        public string MatKhau { get; set; }
        public string MatKhauMacDinh { get; set; }
        public DateTime? NgayTao { get; set; }
    }
}
