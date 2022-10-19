using Website.Principal;
using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Web;

namespace Website.Helper
{
    public static class Utilities
    {
        static Utilities()
        {
            
        }

        public static MyIdentity CurrentUser
        {
            get
            {
                MyIdentity result;
                var principal = HttpContext.Current != null ?
                    HttpContext.Current.User : Thread.CurrentPrincipal;
                if (principal != null)
                {
                    result = principal.Identity as MyIdentity;
                }
                else
                {
                    result = null;
                }

                return result;
            }
        }

        public static Guid CurrentUserID
        {
            get
            {
                var usr = CurrentUser;
                return usr != null ? usr.ID : Guid.Empty;
            }
        }
        public static bool IsLogin
        {
            get
            {
                return CurrentUser != null;
            }
        }
        public static HTUserModel CurrentUserObj
        {
            get
            {
                if (CurrentUser == null) return null;
                var urs = DMUserManager.Instance.SelectByUserName(CurrentUser.Name);
                return urs;
            }
        }
        public static Version CurrentVersion { get; set; }

        public static string CurrentVersionString { get; private set; }
    }
}