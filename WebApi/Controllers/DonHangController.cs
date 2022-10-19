using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using Lib.BusinessLogic.Utils;
using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using WebApi.Helper;

namespace WebShop.Controllers
{
    [RoutePrefix("api/donhang")]
    public class DonHangController : MyApiController
    {
        [Route("{id}")]
        [HttpGet]
        public HttpResponseMessage GetById(Guid id)
        {
            var result = DMDonHangManager.Instance.GetById(id);
            return ApiOk(result);
        }
        [Route("")]
        [HttpPost]
        public HttpResponseMessage Post(DMDonHangModel value)
        {
            value.Loai = _IsBanSi ? 1 : 0;
            var ipId = DMDonHangManager.Instance.InsertOrUpdate(value);
            return ApiOk(ipId); ;
        }
        [Route("dmtranghtai")]
        [HttpGet]
        public HttpResponseMessage GetDMTrangThai()
        {
            var vResult = DMDonHangManager.Instance.GetDsTrangThai();
            return ApiOk(vResult);
        }
        [Authorize]
        [Route("thongke")]
        [HttpGet]
        public HttpResponseMessage GetThongKe()
        {
            Guid id = _UserId;
            if (id.IsNull()) return null;
            var vResult = DMDonHangManager.Instance.GetThongKeUser(id);
            return ApiOk(vResult);
        }
        [Authorize]
        [Route("danhsach")]
        [HttpGet]
        public HttpResponseMessage GetDsTheoTrangThai(int tt, int index)
        {
            Guid id = _UserId;
            if (id.IsNull()) return null;
            ListResult result = new ListResult();
            int iTotal = 0;
            result.List = DMDonHangManager.Instance.SelectDataByUser(id, tt, index, 10, out iTotal);
            result.Total = iTotal;
            return ApiOk(result);
        }
        [Authorize]
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