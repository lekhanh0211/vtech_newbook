using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class DMDonHangModel : BaseModel
    {
        [StrSearch]
        public string MaDonHang { get; set; }
        public int TrangThai { get; set; }
        /// <summary>
        /// Loai don hang: Le: 0, Si: 1
        /// </summary>
        public int Loai { get; set; }
        public DateTime NgayDatHang { get; set; }
        public string LichSuDonHang { get; set; }
        public Guid? IdNguoiDung { get; set; }
        [StrSearch]
        public string TenNguoiNhan { get; set; }
        [StrSearch]
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
        public string LyDoHuy { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime NgayTrangThai { get; set; }
        public IEnumerable<DMDonHangChiTietModel> DsSanPham { get; set; }
        public DMTrangThaiDonHangModel DMTrangThai { get; set; }
    }

    public class DMTrangThaiDonHangModel
    {
        public int Ma { get; set; }
        public string Ten { get; set; }
        public string TenNgan { get; set; }
        public string HanhDong { get; set; }
        public string Icon { get; set; }
        public int SoDonHang { get; set; }
    }

    public class LichSuDonHangModel
    {
        public int TrangThai { get; set; }
        public string TenTrangThai { get; set; }
        public string Icon { get; set; }
        public DateTime ThoiGian { get; set; }
        public string GhiChu { get; set; }
        public int ThuTu { get; set; }
    }
}
