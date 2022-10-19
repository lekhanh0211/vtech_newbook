using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.DTO
{
    public class DMTinhThanh : BaseDTO
    {
        public string Ten { get; set; }
        public string Ma { get; set; }
        public int UuTien { get; set; }
        public decimal PhiShip { get; set; }
        public DateTime NgayTao { get; set; }
        public bool Active { get; set; }
        public string StrSearch { get; set; }
        public int Cap { get; set; }
        public Guid? IdCapTren { get; set; }
    }
}
