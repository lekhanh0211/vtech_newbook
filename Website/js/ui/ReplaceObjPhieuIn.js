
var ReplaceObj = function (str, obj) {
    str = str.replace("[HoVaTen]", obj.HoVaTen).replace("[NgaySinh]", obj.NgaySinh).replace("[GioiTinh]", obj.GioiTinh);
    str = str.replace("[DiaChi]", obj.DiaChi).replace("[Ma]", obj.Ma).replace("[Ma]", obj.Ma).replace("[LoaiKham]", obj.LoaiKham);
    str = str.replace("[LblTenPhongKham]", obj.TenBenhVien);
    str = str.replace("[LblDiaChiPK]", obj.DiaChiBenhVien).replace("[ChanDoan]", obj.chanDoanBS).replace("[BuongKham]", obj.TenBuongKham);
    str = str.replace("[Day]", obj.Ngay).replace("[Month]", obj.Thang).replace("[Year]", obj.Nam).replace("[BacSy]", obj.TenBacSy);
    str = str.replace("<tr></tr>", obj.NoiDung).replace("[BacSy]", obj.TenBacSy);
    str = str.replace("[NgayKham]", obj.NgayKham).replace("=:=", "").replace("=:=", "").replace("[NoiDung]", obj.NoiDung).replace("[YeuCau]", obj.YeuCau);
    return str;
};
var ReplaceNew = function (str, obj) {
    var dat = new Date();
    var date = dat.getDate();
    if (date < 10) {
        date = "0" + date;
    }
    var month = dat.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var Minutes = dat.getMinutes();
    if (Minutes < 10) {
        Minutes = "0" + Minutes;
    }
    var hour = dat.getHours();
    if (hour < 10) {
        hour = "0" + hour;
    }
    //Bo huyen và tỉnh trên phieu in
    str = str.replace("[HoVaTen]", obj.HoTen).replace("[NgaySinh]", obj.NgaySinh)
          .replace("[BHYT]", obj.SoBHYT).replace("[ChanDoan]", obj.chanDoanBS)
          .replace("[GioiTinh]", obj.GioiTinh).replace("[Khoa]", obj.TenKhoaKham)
          .replace("[DiaChi]", obj.DiaChi)
          .replace("[Buong]", obj.TenPhongKham).replace("[Giuong]", "")
          .replace("[Day]", date).replace("[Month]", month).replace("[Year]", dat.getFullYear())
          .replace("[hh]", hour).replace("[mm]", Minutes).replace("[BacSyKham]", obj.tenBacSyKe)
          .replace("[SoVV]", obj.SoVaoVien).replace("[Tuoi]", obj.Tuoi).replace("999px", obj.fontSize)
          .replace("888px", obj.lineHeight).replace("777px", obj.fontSize)
          .replace("[CC]", obj.CapCuu).replace("[MaBN]", obj.Ma).replace("[BT]", obj.BinhThuong);

    return str;
};