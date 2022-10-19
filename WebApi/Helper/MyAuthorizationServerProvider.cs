using Microsoft.Owin.Security.OAuth;
using System.Security.Claims;
using System.Threading.Tasks;
using Lib.Extensions;
using Lib.BusinessLogic.Management;

namespace WebApi.Helper
{
    public class MyAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var user = DMNguoiDungManager.Instance.SelectByUserName(context.UserName);
            if (user == null)
            {
                context.SetError("invalid_grant", "Vui lòng kiểm tra lại tên đăng nhập không đúng.");
                return;
            }
            if (user.Password != CryptoUtils.Encrypt(context.Password))
            {
                context.SetError("invalid_grant", "Vui lòng kiểm tra lại mật khẩu không chính xác.");
                return;
            }
            
            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            identity.AddClaim(new Claim(ClaimTypes.Role, user.Role));
            identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName));
            identity.AddClaim(new Claim("Email", user.Email ?? ""));
            identity.AddClaim(new Claim("UserId", user.Id.ToString()));

            context.Validated(identity);
        }
    }
}