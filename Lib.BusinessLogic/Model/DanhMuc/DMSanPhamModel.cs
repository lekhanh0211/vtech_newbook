using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class DMSanPhamModel : BaseModel
    {
        [StrSearch]
        public string Ten { get; set; }
        [StrSearch]
        public string MaSanPham { get; set; }
        public decimal GiaGoc { get; set; }
        public decimal GiaBan { get; set; }
        public int PhanLoai { get; set; }
        public Guid? IdLoai { get; set; }
        public string DanhMuc { get; set; }
        public string DanhMucCap1 { get; set; }
        public string DanhMucCap2 { get; set; }
        public int TonKho { get; set; }
        public string UrlHinhAnh { get; set; }
        public string DanhSachHinhAnh { get; set; }
        public string MoTa { get; set; }
        public string ThuocTinh { get; set; }
        public bool NoiBat { get; set; }
        public DateTime NgayTao { get; set; }
        public List<string> DsAnhXoa { get; set; }
        public string Url { get; set; }
        public decimal GiaSi { get; set; }
        public string CauHinhGiaSi { get; set; }
    }
}
