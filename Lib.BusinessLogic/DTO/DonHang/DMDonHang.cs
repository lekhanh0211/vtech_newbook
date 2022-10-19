using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.DTO
{
    public class DMDonHang : BaseDTO
    {
        public string MaDonHang { get; set; }
        public int TrangThai { get; set; }
        public DateTime NgayDatHang { get; set; }
        public string LichSuDonHang { get; set; }
        public Guid? IdNguoiDung { get; set; }
        public string TenNguoiNhan { get; set; }
        public string SoDienThoai { get; set; }
        public string Email { get; set; }
        public Guid IdTinhThanh { get; set; }
        public Guid IdQuanHuyen { get; set; }
        public Guid IdXaPhuong { get; set; }
        public string DiaChi { get; set; }
        public string DiaChiFull { get; set; }
        public string GhiChuNhanHang { get; set; }
        public int SoLuongSanPham { get; set; }
        public decimal TongTienhang { get; set; }
        public string MaGiamGia { get; set; }
        public decimal GiamGia { get; set; }
        public decimal TienVanChuyen { get; set; }
        public decimal TongTien { get; set; }
        public int TTLoai { get; set; }
        public int TTTrangThai { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime NgayTrangThai { get; set; }
        public bool Active { get; set; }
        public string StrSearch { get; set; }
        public int Loai { get; set; }
    }
}
