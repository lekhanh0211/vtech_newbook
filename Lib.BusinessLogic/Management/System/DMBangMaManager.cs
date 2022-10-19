using Lib.BusinessLogic.DTO;
using Lib.BusinessLogic.Model;
using Lib.DataAccess;
using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace Lib.BusinessLogic.Management
{
    public class DMBangMaManager : BaseManager<DMBangMaManager, DMBangMa, DMBangMaModel>
    {
        public string GenMaAndNew(Guid? IdLoai, string ma, string tienTo, decimal doDai, bool tangSo)
        {
            var date = DateTime.Now;
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var lFilter = new List<Expression<Func<DMBangMaModel, bool>>>();
                lFilter.Add(x => x.Ma == ma);
                if (IdLoai.IsNotNull())
                {
                    lFilter.Add(x => x.IdSubHospital == IdLoai.Value);
                }
                var maHienTai = this.SelectBy(lFilter).FirstOrDefault();
                if (maHienTai == null)
                {
                    maHienTai = new DMBangMaModel()
                    {
                        Ma = ma,
                        IdSubHospital = IdLoai,
                        TienTo = tienTo,
                        Ten = ma,
                        TienToHT = "",
                        UuTien = 0,
                        Domain = "",
                        SoHT = "0",
                        DoDai = doDai,
                    };
                }
                var vtienTo = maHienTai.TienTo;
                var soLuong = double.Parse(maHienTai.SoHT) + 1;
                // thêm thông tin ngày tháng nếu có
                if (vtienTo.Contains("yyyy")) vtienTo = vtienTo.Replace("yyyy", date.ToString("yyyy"));
                if (vtienTo.Contains("MM")) vtienTo = vtienTo.Replace("MM", date.ToString("MM"));
                if (vtienTo.Contains("dd")) vtienTo = vtienTo.Replace("dd", date.ToString("dd"));
                if (vtienTo.Contains("yy")) vtienTo = vtienTo.Replace("yy", date.ToString("yy"));
                // cập nhật lại số tự tăng nếu thay đổi tiền tố
                if (vtienTo != maHienTai.TienToHT) soLuong = 1;
                var strMoi = "";
                var vdoDai = maHienTai.DoDai.Value;
                if (vdoDai > 0)
                {
                    if (vtienTo.IsNotNullOrEmpty())
                    {
                        vdoDai = vdoDai - vtienTo.Length;
                    }
                    strMoi = vtienTo + String.Format("{0:D" + vdoDai + "}", Int32.Parse(soLuong.ToString()));
                }
                else
                {
                    strMoi = soLuong.ToString();
                }
                if (tangSo)
                {
                    maHienTai.SoHT = soLuong.ToString();
                    maHienTai.TienToHT = vtienTo;
                }
                this.InsertOrUpdate(maHienTai);
                return strMoi;
            }
        }
    }
}
