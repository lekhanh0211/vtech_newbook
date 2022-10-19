using System;
using System.Collections.Generic;

namespace Lib.BusinessLogic.DTO
{
    public class DMTruongKhoiDatSach : BaseDTO
    {
        public Guid? IdTruong { get; set; }
        public Guid? IdKhoi { get; set; }
    }
}
