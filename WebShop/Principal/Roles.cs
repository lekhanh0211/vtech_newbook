using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using Lib.Extensions;

namespace WebShop.Principal
{
    public static class UserIdentityExtension
    {
        public static string UserName(this IPrincipal user)
        {
            try
            {
                return user.Identity.Name;
            }
            catch (Exception)
            {
                return "";
            }
        }
        public static Guid UserId(this IPrincipal user)
        {
            try
            {
                return user.Identity().ID;
            }
            catch (Exception)
            {
                return Guid.Empty;
            }
        }
        public static IEnumerable<Guid> RoleId(this IPrincipal user)
        {
            try
            {
                return (user.Identity as MyIdentity).Roles.Select(x => Guid.Parse(x));
            }
            catch (Exception)
            {
                return null;
            }
        }
        public static MyIdentity Identity(this IPrincipal user)
        {
            try
            {
                return (user.Identity as MyIdentity);
            }
            catch (System.Exception)
            {
                return null;
            }
        }
        public static bool IsAuthenticated(this IPrincipal user)
        {
            try
            {
                return user.Identity.IsAuthenticated;
            }
            catch (System.Exception)
            {
                return false;
            }
        }
        public static string ClientRole(this IPrincipal user)
        {
            return (new
            {
                bitMask = 2,
                title = "capcuu"
            }).ToJson(); ;
        }
    }
}
