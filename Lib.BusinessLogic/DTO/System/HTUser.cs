using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lib.BusinessLogic.DTO
{
    public class HTUser: BaseDTO
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string HoTen { get; set; }
        public string Email { get; set; }
        public string SoDienThoai { get; set; }
        public Guid IdRole { get; set; }
        public string GhiChu { get; set; }
        public bool Active { get; set; }
    }
}
