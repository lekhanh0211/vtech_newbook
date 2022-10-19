using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using Lib.BusinessLogic.Utils;
using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Website.Helper;

namespace Website.Controllers.Api
{
    [RoutePrefix("api/BaoCao")]
    public class BaoCaoController : MyApiController
    {
        [HttpPost]
        [Route("getData")]
        public RptDSBaoCao getDuLieuBaoCao(RptParams value)
        {
            if (value != null)
            {
                var result = new RptDSBaoCao();
                Dictionary<string, object> lstOpt;
                result.Data = BaoCaoManager.Instance.getDataSetProc(value, out lstOpt);
                result.RptData = lstOpt;
                return result;
            }
            return null;
        }

        [HttpPost]
        [Route("getExcel")]
        public HttpResponseMessage getBaoCaoExce(RptParams value)
        {
            if (value != null)
            {
                Dictionary<string, object> lstOpt;
                var data = BaoCaoManager.Instance.getDataSetProc(value, out lstOpt);
                if (data != null)
                {
                    #region xuất excel
                    ReportExcelDataSet cReport = new ReportExcelDataSet(value.TemplatesExcel);
                    var objParams = value.objParams;
                    if (objParams != null)
                    {
                        DateTime from, to, timefrom, timeto;
                        if (objParams.ContainsKey("dateFrom") && DateTime.TryParse(objParams["dateFrom"].ToString(), out from))
                        {
                            cReport.AddFindAndReplaceItem("<DATE_FROM>", from.ToString("dd/MM/yyyy"));
                        }
                        if (objParams.ContainsKey("dateTo") && DateTime.TryParse(objParams["dateTo"].ToString(), out to))
                        {
                            cReport.AddFindAndReplaceItem("<DATE_TO>", to.ToString("dd/MM/yyyy"));
                        }
                        if (objParams.ContainsKey("dateTimeFrom") && DateTime.TryParse(objParams["dateTimeFrom"].ToString(), out timefrom))
                        {
                            cReport.AddFindAndReplaceItem("<DATETIME_FROM>", timefrom.ToString("HH:mm dd/MM/yyyy"));
                        }
                        if (objParams.ContainsKey("dateTimeTo") && DateTime.TryParse(objParams["dateTimeTo"].ToString(), out timeto))
                        {
                            cReport.AddFindAndReplaceItem("<DATETIME_TO>", timeto.ToString("HH:mm dd/MM/yyyy"));
                        }
                    }
                    if (value.objReplace != null)
                    {
                        foreach (string item in value.objReplace.Keys)
                        {
                            object obj2 = value.objReplace[item];
                            cReport.AddFindAndReplaceItem(string.Format("<{0}>", item), obj2);
                        }
                    }

                    cReport.FindAndReplace();
                    cReport.Export2ExcelBold(data.Tables[0], value.ExcelStartRow ?? 1, value.ExcelStartCol ?? 1, value.DataEndCol ?? -1);
                    var result = cReport.SaveStream();
                    return ApiFile(result, string.Format("{0}_{1}.xlsx", value.TemplatesExcel, DateTime.Now.ToString("yyyyMMddHHmmss")));
                    #endregion
                }
                return ApiBadRequest("datanull");
            }
            return ApiBadRequest("datanull");
        }

        [HttpPost]
        [Route("exportExcel")]
        public HttpResponseMessage exportExce(RptExcelData value)
        {
            if (value != null)
            {
                #region xuất excel
                ReportExcelDataSet cReport = new ReportExcelDataSet(value.TemplatesExcel);
                if (value.objReplace != null)
                {
                    foreach (string item in value.objReplace.Keys)
                    {
                        object obj2 = value.objReplace[item];
                        cReport.AddFindAndReplaceItem(string.Format("<{0}>", item), obj2);
                    }
                    cReport.FindAndReplace();
                }
                if (value.CellReplace != null)
                {
                    foreach (var item in value.CellReplace)
                    {
                        cReport.SetValueToCell(item.row, item.col, item.value);
                    }
                }
                if (value.ObjData != null)
                {
                    cReport.Export2ExcelByJson(value.ObjData, value.ExcelStartRow ?? 1, value.ExcelStartCol ?? 1, value.ColmunName, value.InsertSTT ?? false);
                }
                if (value.TableData != null)
                {
                    cReport.Export2ExcelBold(value.TableData, value.ExcelStartRow ?? 1, value.ExcelStartCol ?? 1, value.DataEndCol ?? -1);
                }
                var result = cReport.SaveStream();
                return ApiFile(result, string.Format("{0}_{1}.xlsx", value.TemplatesExcel, DateTime.Now.ToString("yyyyMMddHHmmss")));
                #endregion
            }
            return ApiBadRequest("datanull");
        }

        [HttpPost]
        [Route("getFileExcelDMSanPham")]
        public HttpResponseMessage getFileExcelDMSanPham()
        {
            ReportExcelDataSet cReport = new ReportExcelDataSet(CFileNameTemplate.FileImportDMSanPham);
            int totalLoaiSP = 0;
            var dmLoaiSanPham = DMLoaiSanPhamManager.Instance.SelectDataByPage("", null, null, 1, 1000, out totalLoaiSP);
            string[] cols = new string[1]
            {
                "Ten"
            };
            cReport.goToSheet(1);
            foreach (var item in dmLoaiSanPham)
            {
                item.Ten = item.Code + " - " + item.Ten;
            }
            cReport.Export2ExcelByList(dmLoaiSanPham, 2, 1, cols);
            var result = cReport.SaveStream();
            return ApiFile(result, string.Format("{0}_{1}.xlsx", CFileNameTemplate.FileImportDMSanPham, DateTime.Now.ToString("yyyyMMddHHmmss")));
        }
    }
}