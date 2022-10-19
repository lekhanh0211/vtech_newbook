using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class DMMauPhieuInModel : BaseModel
    {
        [StrSearch]
        public string Ma { get; set; }
        public string NoiDung { get; set; }
        public string Script { get; set; }
        public string GhiChu { get; set; }
        public string PdfPagerFormat { get; set; }
        public bool PdfIsLandscape { get; set; }
    }
}
