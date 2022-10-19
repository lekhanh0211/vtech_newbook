using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Net.Http;
using System.Web.Http;

namespace Website.Helper
{
    [Authorize]
    public abstract class BaseApiController<TClass, TModel> : MyApiController
        where TClass : class, IManager<TModel>, new()
        where TModel : BaseModel
    {
        protected TClass _manager = new TClass();

        #region Danh sách Api mặc định
        [Route("")]
        [HttpGet]
        public virtual HttpResponseMessage Get()
        {
            var result = _manager.SelectBy();
            return ApiOk(result);
        }
        [Route("showPage")]
        [HttpGet]
        public virtual HttpResponseMessage Get(string sSearch, DateTime? from, DateTime? to, int iPageIndex, int iPageSize)
        {
            ListResult result = new ListResult();
            int iTotal = 0;
            List<Expression<Func<TModel, bool>>> lFilter = new List<Expression<Func<TModel, bool>>>();
            if (sSearch.IsNotNullOrEmpty())
            {
                sSearch = sSearch.ToTvKhongDau();
                lFilter.Add(x => x.StrSearch.Contains(sSearch));
            }
            result.List = _manager.SelectDataByPage(from, to, iPageIndex, iPageSize, out iTotal, lFilter);
            result.Total = iTotal;
            return ApiOk(result);
        }
        [Route("{id}")]
        [HttpGet]
        public virtual HttpResponseMessage Get(Guid id)
        {
            var vResult = _manager.GetById(id);
            return ApiOk(vResult);
        }

        [Route("")]
        [HttpPost]
        public virtual HttpResponseMessage Post(TModel value)
        {
            var ipId = _manager.InsertOrUpdate(value);
            return ApiOk(ipId);
        }

        [Route("{id}")]
        [HttpPost]
        public virtual HttpResponseMessage Delete(Guid id)
        {
            _manager.Delete(id);
            return ApiOk();
        }
        #endregion
    }
}