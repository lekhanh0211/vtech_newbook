using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Lib.BusinessLogic.Management
{
    public interface IManager<TModel>
    {
        IEnumerable<TModel> SelectBy(List<Expression<Func<TModel, bool>>> filter = null, string sOrder = null);
        IEnumerable<TModel> SelectDataByPage(DateTime? dateFrom, DateTime? dateTo, int dcPageIndex, int dcPageItem, out int total
            , List<Expression<Func<TModel, bool>>> filter = null, string sOrder = null);
        TModel GetById(Guid id);
        TModel InsertOrUpdate(TModel obj);
        int Delete(Guid Id);
        int Deactivate(Guid ipId);
    }
}
