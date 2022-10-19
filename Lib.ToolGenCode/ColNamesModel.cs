using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lib.ToolGenCode
{
    public class ColNamesModel
    {
        public string PubColumn { get; set; }
        public string NameColumn { get; set; }
        public bool IsNullAble { get; set; }
        public string TypeData { get; set; }
        public decimal StrLength { get; set; }
        public DateTime NgayTao { get; set; }
    }
}
