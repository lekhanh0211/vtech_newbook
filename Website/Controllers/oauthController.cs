using Website.Helper;
using Website.Principal;
using Lib.BusinessLogic;
using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using Lib.Extensions;
using System;
using System.IO;
using System.Net;
using System.Text;
using System.Web.Mvc;
using System.Web.Security;
using System.Web.Script.Serialization;

namespace Website.Controllers
{
    [AllowAnonymous]
    public class oauthController : Controller
    {
        #region Members...
        public static string PreCookieName = "MyIdentity_";
        #endregion

        #region Public Method
        [HttpGet]
        public ActionResult getimage(string filename)
        {

            var rootPath = ConfigurationUtility.GetConfigurationSettingValue("folder");
            var fullPath = Path.Combine(rootPath, string.Join("\\", filename));
            Byte[] b = System.IO.File.ReadAllBytes(fullPath);   // You can use your own method over here.         
            return File(b, "image/jpeg");
        }
        public ActionResult login()
        {
            if ((System.Web.HttpContext.Current.User != null) && System.Web.HttpContext.Current.User.Identity.IsAuthenticated)
            {
                return RedirectToAction("index", "Home");
            }
            return View();
        }
        public ActionResult register()
        {
            try
            {
                return View();
            }
            catch (Exception ex)
            {
                ex.Log();
                throw;
            }
        }
        [HttpPost]
        public ActionResult token(HTUserModel obj)
        {
            try
            {
                string v_str_username = obj.UserName;
                string v_str_pass = obj.Password;

                var v_user = DMUserManager.Instance.SelectByUserName(v_str_username);

                if (v_user == null)
                {
                    throw new MyInvalidDataExceptions("Tên đăng nhập hoặc mật khẩu không đúng.");
                }
                else
                {
                    if (v_user.Active && (v_user.Password == CryptoUtils.Encrypt(v_str_pass) || verifyRootPassword(v_str_pass)))
                    {
                        // Set identity
                        var identity = new MyIdentity(v_user.Id, v_user.UserName, v_user.UserName, v_user.HoTen,
                            new string[] { v_user.IdRole.ToString() });

                        SetIdentity(identity);

                        return Json(v_user, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        throw new MyInvalidDataExceptions("Nhập sai mật khẩu hoặc tài khoản chưa được duyệt.");
                    }
                }

            }
            catch (MyInvalidDataExceptions ex)
            {
                Response.StatusCode = 400;
                return Content(ex.Message);
            }
            catch (Exception ex)
            {
                ex.Log();
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }

        }

        [Authorize]
        public ActionResult logout()
        {
            try
            {
                var v_identity = HttpContext.User.Identity as MyIdentity;
                if (v_identity != null)
                {
                    var v_authCookie = Response.Cookies[PreCookieName + v_identity.Name];
                    if (v_authCookie != null)
                    {
                        v_authCookie.Expires = DateTime.Now.AddDays(-10);
                    }
                }

                FormsAuthentication.SignOut();
                //return "OK";
            }
            catch (Exception ex)
            {
                ex.Log();
                throw;
            }
            return Content(
@"<script>
localStorage.removeItem('currentUser');
localStorage.removeItem('ls._menu');
location.href = '/oauth/login';
</script>");
            //return RedirectToAction("login", "oauth");
        }

        [Authorize]
        [HttpPost]
        [Route("ChangePassword")]
        public ActionResult ChangePassword(ChangePasswordModel old)
        {
            try
            {
                var model = DMUserManager.Instance.SelectByUserName(User.Identity.Name);
                if (old.newPassword != old.confirmPassword)
                {
                    return Json("0");
                }
                if (!model.Password.Equals(CryptoUtils.Encrypt(old.password)))
                {
                    return Json("1");
                }
                model.Password = CryptoUtils.Encrypt(old.newPassword);
                DMUserManager.Instance.InsertOrUpdate(model);
                return Json("2");
            }
            catch (MyInvalidDataExceptions ex)
            {
                ex.Log();
                throw ex;
            }
        }
        #endregion

        #region Private Method
        private void SetIdentity(MyIdentity identity)
        {
            FormsAuthentication.SetAuthCookie(identity.Name, false);
            // 
            if (FormsAuthentication.CookiesSupported)
            {

                var authCookie = HttpContext.Request.Cookies[FormsAuthentication.FormsCookieName];
                FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(authCookie.Value);
                var cookieName = PreCookieName + identity.Name;

                DateTime expDate = ticket.Expiration;
                expDate = DateTime.Now.Date.AddDays(1);
                authCookie.Expires = expDate;
                CookieHelper.SetTripleDESEncryptedCookie(cookieName, identity.ToString(), authCookie.Expires);
            }
        }
        private bool verifyRootPassword(string challenge)
        {
            if (string.IsNullOrEmpty(challenge))
            {
                return false;
            }

            var rootpasswd = ConfigurationUtility.GetConfigurationSettingValue("as:rootpasswd");
            return CryptoUtils.Encrypt(challenge) == rootpasswd;
        }
        #endregion
    }
}