﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lib.BusinessLogic.DTO
{
    public class HTRole : BaseDTO
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Note { get; set; }
        public string Clam { get; set; }
        public string StrSearch { get; set; }
    }
}
