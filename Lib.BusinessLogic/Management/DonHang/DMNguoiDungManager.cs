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
    public class DMNguoiDungManager : BaseManager<DMNguoiDungManager, DMNguoiDung, DMNguoiDungModel>
    {
        public DMNguoiDungModel SelectByUserName(string userName)
        {
            List<Expression<Func<DMNguoiDungModel, bool>>> lFilter = new List<Expression<Func<DMNguoiDungModel, bool>>>();
            lFilter.Add(x => x.UserName == userName);
            return this.SelectBy(lFilter).FirstOrDefault();
        }
        public override DMNguoiDungModel InsertOrUpdate(DMNguoiDungModel obj)
        {
            var datenow = DateTime.Now;
            if (obj.Id.IsNotNull())
            {
                obj.SetStrSearch();
                var saveObject = obj.CopyAs<DMNguoiDung>();
                using (BaseData db = new BaseData(_nameConnStr))
                {
                    db.Update(saveObject);
                    return obj;
                }
            }
            else
            {
                if (obj == null)
                    return null;
                obj.Password = CryptoUtils.Encrypt(obj.Password);
                obj.Id = Guid.NewGuid();
                obj.Active = true;
                obj.NgayDangKy = datenow;
                obj.NgayTao = datenow;
                obj.SetStrSearch();
                var saveObject = obj.CopyAs<DMNguoiDung>();
                using (BaseData db = new BaseData(_nameConnStr))
                {
                    db.Insert(saveObject);
                    return obj;
                }
            }
        }
        public DMNguoiDungModel Insert(DMNguoiDungModel obj)
        {
            var datenow = DateTime.Now;
            if (obj == null)
                return null;
            obj.Password = CryptoUtils.Encrypt(obj.Password);
            obj.Id = Guid.NewGuid();
            obj.Active = true;
            obj.NgayDangKy = datenow;
            obj.NgayTao = datenow;
            obj.SetStrSearch();
            var saveObject = obj.CopyAs<DMNguoiDung>();
            using (BaseData db = new BaseData(_nameConnStr))
            {
                db.Insert(saveObject);
                return obj;
            }
        }

        public DMNguoiDungModel Update(DMNguoiDungModel obj)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var user = db.Query<DMNguoiDung>(@"select * from DMNguoiDung where Id = @id"
                , new { id = obj.Id }).FirstOrDefault();
                if (user != null)
                {
                    obj.SetStrSearch();
                    user.HoTen = obj.HoTen;
                    user.DienThoai = obj.DienThoai;
                    user.Email = obj.Email;
                    user.IdTinhThanh = obj.IdTinhThanh;
                    user.IdHuyenTP = obj.IdHuyenTP;
                    user.IdXaPhuong = obj.IdXaPhuong;
                    user.DiaChi = obj.DiaChi;
                    user.FullDiaChi = obj.FullDiaChi;
                    user.GioiTinh = obj.GioiTinh;
                    user.NgaySinh = obj.NgaySinh;
                    user.StrSearch = obj.StrSearch;
                    db.Update(user);
                }
            }
            return obj;
        }
    }
}
