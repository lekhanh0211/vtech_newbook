using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class DMLoaiSanPhamModel : BaseModel
    {
        [StrSearch]
        public int Code { get; set; }
        [StrSearch]
        public string Ten { get; set; }
        public int UuTien { get; set; }
        public string UrlHinhAnh { get; set; }
        public int Cap { get; set; }
        public Guid? IdCap1 { get; set; }
        public string TenCap1 { get; set; }
        public string UrlCap1 { get; set; }
        public Guid? IdCap2 { get; set; }
        public string TenCap2 { get; set; }
        public string UrlCap2 { get; set; }
        public DateTime NgayTao { get; set; }
        public bool IsNoiBat { get; set; }
        public bool IsHienThiTrangChu { get; set; }
        public string UrlIcon { get; set; }
        public string Url { get; set; }
        public IEnumerable<DMLoaiSanPhamModel> DanhMucCon { get; set; }
    }
}
