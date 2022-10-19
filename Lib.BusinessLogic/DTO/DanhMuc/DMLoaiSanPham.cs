using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.DTO
{
    public class DMLoaiSanPham : BaseDTO
    {
        public int Code { get; set; }
        public string Ten { get; set; }
        public int UuTien { get; set; }
        public string UrlHinhAnh { get; set; }
        public int Cap { get; set; }
        public Guid? IdCap1 { get; set; }
        public Guid? IdCap2 { get; set; }
        public DateTime NgayTao { get; set; }
        public bool Active { get; set; }
        public string StrSearch { get; set; }
        public bool IsNoiBat { get; set; }
        public bool IsHienThiTrangChu { get; set; }
        public string UrlIcon { get; set; }
        public string Url { get; set; }
    }
}
