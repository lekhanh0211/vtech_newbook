using System;
using System.Security.Principal;

namespace WebShop.Principal
{
    public class MyPrincipal : IPrincipal
    {
        private readonly MyIdentity _identity;

        public MyPrincipal(MyIdentity ip_identity)
        {
            if (ip_identity == null)
            {
                throw new ArgumentNullException("identity");
            }
            _identity = ip_identity;
        }

        public IIdentity Identity
        {
            get { return _identity; }
        }

        public bool IsInRole(string role)
        {
            throw new NotImplementedException();
        }
    }
}
