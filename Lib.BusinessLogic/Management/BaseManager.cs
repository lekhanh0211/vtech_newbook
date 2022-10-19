using Lib.BusinessLogic.DTO;
using Lib.BusinessLogic.Model;
using Lib.DataAccess;
using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Lib.BusinessLogic.Management
{
    /// <summary>
    /// Base Manager cài đặt sẵn các hàm chung nhất
    /// + Lấy theo id, mã hoặc domain
    /// + Lấy danh sách theo id hoặc mã
    /// </summary>
    /// <typeparam name="TClass"></typeparam>
    /// <typeparam name="TEntity"></typeparam>
    /// <typeparam name="TModel"></typeparam>
    public abstract class BaseManager<TClass, TEntity, TModel> : IManager<TModel>
        where TClass : class, new()
        where TEntity : BaseDTO, new()
        where TModel : BaseModel, new()
    {
        protected string _nameConnStr = "AppConnection";
        #region Singleton
        protected static TClass __instance;
        public static TClass Instance
        {
            get
            {
                if (__instance == null)
                {
                    __instance = new TClass();
                }

                return __instance;
            }
        }
        #endregion

        #region Chức năng chung của danh mục
        /// <summary>
        /// Select dữ liệu theo điều kiện lọc filter gửi vào
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="sOrder"></param>
        /// <returns></returns>
        public virtual IEnumerable<TModel> SelectBy(List<Expression<Func<TModel, bool>>> filter = null, string sOrder = null)
        {
            var tbName = typeof(TEntity).Name;
            using (BaseData db = new BaseData(_nameConnStr))
            {
                // Add QueryParams
                Dictionary<string, object> vParams = new Dictionary<string, object>();
                var strWhere = "";
                if (filter != null)
                {
                    var translator = new MyQueryTranslator(vParams);
                    foreach (var item in filter)
                    {
                        strWhere = string.Format(" {0} and {1}", strWhere, translator.Translate(item));
                    }
                }
                string strQurey = @"select * from " + tbName + @" x where 1 = 1 " + strWhere;

                if (sOrder.IsNotNullOrEmpty())
                {
                    strQurey = strQurey + @" order by " + sOrder;
                }

                var vResult = db.Query<TModel>(strQurey, vParams);
                return vResult;
            }
        }
        /// <summary>
        /// Lấy danh sách dữ liệu theo Filter đã set
        /// </summary>
        /// <param name="domain"></param>
        /// <param name="dateFrom"></param>
        /// <param name="dateTo"></param>
        /// <param name="dcPageIndex"></param>
        /// <param name="dcPageItem"></param>
        /// <param name="total"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        /// vhNinh Edit 08/01/2021
        public virtual IEnumerable<TModel> SelectDataByPage(DateTime? dateFrom, DateTime? dateTo, int dcPageIndex, int dcPageItem, out int total
            , List<Expression<Func<TModel, bool>>> filter = null, string sOrder = null)
        {
            total = 0;
            var tbName = typeof(TEntity).Name;
            using (BaseData db = new BaseData(_nameConnStr))
            {
                // Add QueryParams
                Dictionary<string, object> vParams = new Dictionary<string, object>();
                vParams.Add("dcPageIndex", dcPageIndex);
                vParams.Add("dcPageItem", dcPageItem);
                var strWhere = "";

                if (dateFrom.IsNotNull())
                {
                    strWhere = strWhere + " and x.NgayTao >= @dateFrom ";
                    vParams.Add("dateFrom", dateFrom);
                }
                if (dateTo.IsNotNull())
                {
                    dateTo = dateTo.Value.Date.AddDays(1);
                    strWhere = strWhere + " and x.NgayTao < @dateTo ";
                    vParams.Add("dateTo", dateTo);
                }
                if (filter != null)
                {
                    var translator = new MyQueryTranslator(vParams);
                    foreach (var item in filter)
                    {
                        strWhere = string.Format(" {0} and {1}", strWhere, translator.Translate(item));
                    }
                }
                string strQurey = @"select * INTO #dataList from " + tbName + @" x where 1 = 1 " + strWhere;

                strQurey = strQurey + @"

                select count(id) Total from #dataList

                select x.* from #dataList x
                order by " + (sOrder ?? "x.NgayTao desc") + @" 
                OFFSET @dcPageItem * (@dcPageIndex - 1) ROWS
                FETCH NEXT @dcPageItem ROWS ONLY OPTION (RECOMPILE)

                drop table #dataList";
                if (dcPageItem > 10000)
                {
                    dcPageItem = 10000;
                }
                if (dcPageItem < 0)
                {
                    dcPageItem = 0;
                }
                return db.QueryAndTotal<TModel>(strQurey, out total, vParams);
            }
        }
        /// <summary>
        /// Select đối tượng theo Id hoặc Ma
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public virtual TModel GetById(Guid id)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var tbName = typeof(TEntity).Name;
                var vResult = db.Query<TModel>(@"select * from " + tbName + " where Id = @id"
                    , new { id = id }).FirstOrDefault();
                return vResult;
            }
        }
        /// <summary>
        /// Thêm mới hoặc cập nhật thông tin đối tượng
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public virtual TModel InsertOrUpdate(TModel obj)
        {
            if (obj.Id.IsNotNull())
            {
                obj.SetStrSearch();
                var saveObject = obj.CopyAs<TEntity>();
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
                obj.Id = Guid.NewGuid();
                obj.Active = true;
                obj.SetStrSearch();
                var saveObject = obj.CopyAs<TEntity>();
                using (BaseData db = new BaseData(_nameConnStr))
                {
                    db.Insert(saveObject);
                    return obj;
                }
            }
        }
        /// <summary>
        /// Xoá vĩnh viễn dữ liệu
        /// </summary>
        /// <param name="Id"></param>
        public virtual int Delete(Guid Id)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var tbName = typeof(TEntity).Name;
                var vResult = db.Execute($"delete {tbName} where Id = @id"
                    , new { id = Id });
                return vResult;
            }
        }
        /// <summary>
        /// Chuyển trạng thái active = 0
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="ipId"></param>
        /// <returns></returns>
        public virtual int Deactivate(Guid ipId)
        {
            using (BaseData db = new BaseData(_nameConnStr))
            {
                var tbName = typeof(TEntity).Name;
                var vResult = db.Execute($"update {tbName} set Active = 0 where Id = @id"
                    , new { id = ipId });
                return vResult;
            }
        }
        #endregion
    }
}
