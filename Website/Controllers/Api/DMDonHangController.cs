using Website.Helper;
using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using Lib.Extensions;
using System.Web.Http;
using System;
using System.Net.Http;
using System.Collections.Generic;
using System.Linq;

namespace Website.Controllers.Api
{
    [RoutePrefix("api/DMDonHang")]
    public class DMDonHangController : BaseApiController<DMDonHangManager, DMDonHangModel>
    {
        [Route("showPage")]
        [HttpGet]
        public HttpResponseMessage Get(int loai, string sSearch, int? trangthai, bool? active, DateTime? from, DateTime? to, int iPageIndex, int iPageSize)
        {
            ListResult result = new ListResult();
            int iTotal = 0;
            result.List = _manager.SelectDataByPage(loai, sSearch, trangthai, active, from, to, iPageIndex, iPageSize, out iTotal);
            result.Total = iTotal;
            return ApiOk(result);
        }
        [Route("dmtranghtai")]
        [HttpGet]
        public HttpResponseMessage GetDMTrangThai()
        {
            var vResult = DMDonHangManager.Instance.GetDsTrangThai();
            return ApiOk(vResult);
        }
        [Route("huy")]
        [HttpPost]
        public HttpResponseMessage unActive(DMDonHangModel value)
        {
            var manger = DMDonHangManager.Instance;
            if (value.LichSuDonHang.IsNullOrEmpty()) value.LichSuDonHang = "[]";
            var ls = value.LichSuDonHang.FromJson<List<LichSuDonHangModel>>();
            var tt = manger.GetDsTrangThai().FirstOrDefault(x => x.Ma == 99);
            ls.Add(new LichSuDonHangModel()
            {
                TrangThai = tt.Ma,
                TenTrangThai = tt.Ten,
                Icon = tt.Icon,
                ThoiGian = DateTime.Now,
                ThuTu = ls.Count, 
                GhiChu = value.LyDoHuy
            });
            value.LichSuDonHang = ls.ToJson();
            value.Active = false;
            value.TrangThai = 99;
            manger.InsertOrUpdate(value);
            return ApiOk();
        }
    }
}
