using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.Model
{
    public class DMTinhThanhModel : BaseModel
    {
        [StrSearch]
        public string Ten { get; set; }
        [StrSearch]
        public string Ma { get; set; }
        public int UuTien { get; set; }
        public decimal PhiShip { get; set; }
        public DateTime NgayTao { get; set; }
        public int Cap { get; set; }
        public Guid? IdCapTren { get; set; }
    }
}
