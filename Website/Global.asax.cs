using Website.Helper;
using Website.Principal;
using Lib.BusinessLogic.Management;
using Lib.Extensions;
using System;
using System.Threading;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;

namespace Website
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            // Init log4net
            log4net.Config.XmlConfigurator.Configure();
        }

        public override void Init()
        {
            base.Init();
            PostAuthenticateRequest += MvcApplication_PostAuthenticateRequest;
        }

        void MvcApplication_PostAuthenticateRequest(object sender, EventArgs e)
        {
            try
            {
                var ctx = HttpContext.Current;
                if (ctx == null || ctx.Request == null
                    || ctx.Request.Url.AbsolutePath.EndsWith(".css", StringComparison.InvariantCultureIgnoreCase)
                    || ctx.Request.Url.AbsolutePath.EndsWith(".js", StringComparison.InvariantCultureIgnoreCase)
                    || ctx.Request.Url.AbsolutePath.EndsWith(".jsrex", StringComparison.InvariantCultureIgnoreCase)
                    || ctx.Request.Url.AbsolutePath.EndsWith(".png", StringComparison.InvariantCultureIgnoreCase)
                    || ctx.Request.Url.AbsolutePath.EndsWith(".jpg", StringComparison.InvariantCultureIgnoreCase)
                    || ctx.Request.Url.AbsolutePath.EndsWith(".gif", StringComparison.InvariantCultureIgnoreCase))
                {
                    return;
                }

                var usr = ctx.User;
                if (usr == null) return;

                if (usr.Identity == null || String.IsNullOrEmpty(usr.Identity.Name))
                {
                    return;
                }

                //Build up the custom Identity and Principle here from cookie cache for
                //from database for Authorization MVC attibutes to work
                string cookieName = "MyIdentity_" + usr.Identity.Name;
                var usrCookie = CookieHelper.GetTripleDESEncryptedCookieObject(cookieName);//Get encrypted cookie
                MyIdentity identity = null;
                if (usrCookie != null)
                {
                    var cookieValue = CookieHelper.GetTripleDESEncryptedCookieValue(cookieName);
                    identity = new MyIdentity(usr.Identity.Name, cookieValue);

                    // anti -fake, edit cookie name
                    //if (!identity.OrgDomainName.Equals(ctx.ParseCurrentDomain(), StringComparison.OrdinalIgnoreCase))
                    //{
                    //    ctx.User = null;
                    //    return;
                    //}
                }
                else
                {
                    var authCookie = Request.Cookies[FormsAuthentication.FormsCookieName];
                    if (authCookie != null)
                    {
                        //Todo : hard code
                        var u = DMUserManager.Instance.SelectByUserName(usr.Identity.Name);
                        if (u != null)
                        {
                            identity = new MyIdentity(u.Id, u.UserName, u.UserName, u.HoTen
                                , new[] { u.IdRole.ToString() });
                            CookieHelper.SetTripleDESEncryptedCookie(cookieName, identity.ToString());
                        }
                        else
                        {
                            throw new UnauthorizedAccessException();
                        }
                    }
                    else
                    {
                        throw new UnauthorizedAccessException();
                    }
                }

                var principal = new MyPrincipal(identity);
                ctx.User = Thread.CurrentPrincipal = principal;
            }
            catch (UnauthorizedAccessException uae)
            {
                uae.Log();
                return;
            }
            catch (Exception ex)
            {
                ex.Log();
                throw;
            }
        }
    }
}
