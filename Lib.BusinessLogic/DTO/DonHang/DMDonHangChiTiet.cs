using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.DTO
{
    public class DMDonHangChiTiet : BaseDTO
    {
        public Guid IdDonHang { get; set; }
        public Guid IdSanPham { get; set; }
        public string TenSanPham { get; set; }
        public int SoLuong { get; set; }
        public string ThuocTinh { get; set; }
        public decimal GiaGoc { get; set; }
        public decimal GiaBan { get; set; }
        public int ThuTu { get; set; }
    }
}
