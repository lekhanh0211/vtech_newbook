using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.DTO
{
    public class DMSanPham : BaseDTO
    {
        public string Ten { get; set; }
        public string MaSanPham { get; set; }
        public decimal GiaGoc { get; set; }
        public decimal GiaBan { get; set; }
        public int PhanLoai { get; set; }
        public Guid? IdLoai { get; set; }
        public int TonKho { get; set; }
        public string UrlHinhAnh { get; set; }
        public string DanhSachHinhAnh { get; set; }
        public string MoTa { get; set; }
        public string ThuocTinh { get; set; }
        public bool NoiBat { get; set; }
        public DateTime NgayTao { get; set; }
        public bool Active { get; set; }
        public string StrSearch { get; set; }
        public string Url { get; set; }
        public decimal GiaSi { get; set; }
        public string CauHinhGiaSi { get; set; }
    }
}
