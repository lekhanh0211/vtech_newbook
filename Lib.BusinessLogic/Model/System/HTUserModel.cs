using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lib.BusinessLogic.Model
{
    public class HTUserModel : BaseModel
    {
        [StrSearch]
        public string UserName { get; set; }
        public string Password { get; set; }
        [StrSearch]
        public string HoTen { get; set; }
        public string Email { get; set; }
        public string SoDienThoai { get; set; }
        public Guid IdRole { get; set; }
        public string sRole { get; set; }
        public string GhiChu { get; set; }
        public string ReturnUrl { get; set; }
    }

    public class ChangePasswordModel
    {
        public string password { get; set; }
        public string newPassword { get; set; }
        public string confirmPassword { get; set; }

    }
}
