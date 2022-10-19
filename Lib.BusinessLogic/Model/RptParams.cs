using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lib.BusinessLogic.Model
{
    public class RptParams
    {
        public string procName { get; set; }
        public Dictionary<string, object> objParams { get; set; }
        public Dictionary<string, object> objReplace { get; set; }
        public string[] optParams { get; set; }
        public string TemplatesExcel { get; set; }
        public int? ExcelStartCol { get; set; }
        public int? ExcelStartRow { get; set; }
        public int? DataStartCol { get; set; }
        public int? DataEndCol { get; set; }
    }
    public class RptTblBaoCao
    {
        public DataTable Table { get; set; }
        public Dictionary<string, object> RptData { get; set; }
    }
    public class RptDSBaoCao
    {
        public DataSet Data { get; set; }
        public Dictionary<string, object> RptData { get; set; }
    }

    public class RptCellValue
    {
        public int row { get; set; }
        public int col { get; set; }
        public object value { get; set; }
    }

    public class RptExcelData
    {
        public Dictionary<string, object> objReplace { get; set; }
        public IEnumerable<object> ObjData { get; set; }
        public IEnumerable<RptCellValue> CellReplace { get; set; }
        public string[] ColmunName { get; set; }
        public bool? InsertSTT { get; set; }
        public DataTable TableData { get; set; }
        public int? DataStartCol { get; set; }
        public int? DataEndCol { get; set; }
        public string TemplatesExcel { get; set; }
        public int? ExcelStartCol { get; set; }
        public int? ExcelStartRow { get; set; }
    }
    public class RptBCTHThuChi
    {
        public DataTable DataThu { get; set; }
        public DataTable DataChi { get; set; }
        public string NamBaoCao { get; set; }
        public decimal TongDauKy { get; set; }
    }
}
