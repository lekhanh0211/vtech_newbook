using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class DMNguoiDungModel : BaseModel
    {
        [StrSearch]
        public string UserName { get; set; }
        public string Password { get; set; }
        public string HoTen { get; set; }
        public bool? GioiTinh { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string FullDiaChi { get; set; }
        public string DiaChi { get; set; }
        public Guid? IdTinhThanh { get; set; }
        public Guid? IdHuyenTP { get; set; }
        public Guid? IdXaPhuong { get; set; }
        [StrSearch]
        public string DienThoai { get; set; }
        [StrSearch]
        public string Email { get; set; }
        public DateTime NgayDangKy { get; set; }
        public string GhiChu { get; set; }
        [StrSearch]
        public string GoogleId { get; set; }
        [StrSearch]
        public string FacebookId { get; set; }
        [StrSearch]
        public string PhoneId { get; set; }
        public string Avatar { get; set; }
        public bool IsResetPassword { get; set; }
        public DateTime NgayTao { get; set; }
        public string Role { get; set; }
    }
}
