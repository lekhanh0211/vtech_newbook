using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using Lib.Extensions;

namespace WebShop.Principal
{
    public class MyIdentity : IIdentity
    {
        #region Constructor
        public MyIdentity(Guid id, string strMa,  string strUsername, 
            string strDisplayName, string[] ip_Roles)
        {
            ID = id;
            Username = strUsername;
            Name = strMa;
            DisplayName = strDisplayName;
            Roles = ip_Roles;
        }

        public MyIdentity(string ip_username, string ip_data)
        {
            if (String.IsNullOrEmpty(ip_username))
            {
                throw new ArgumentNullException("name");
            }
            if (String.IsNullOrEmpty(ip_data))
            {
                throw new ArgumentNullException("data");
            }
            Name = ip_username;
            var parts = ip_data.SplitEmbeddedLength();
            if (parts.Length != 7)
            {
                throw new ArgumentException("data");
            }

            ID = Guid.Parse(parts[0]);
            Username = parts[1];
            Name = parts[2];
            DisplayName = parts[3];
            Roles = parts[4].SplitEmbeddedLength();
            Domain = parts[5];
            IdGiamDoc = Guid.Parse(parts[6]);
        }
        #endregion

        #region Properties

        public string AuthenticationType { get { return "Forms"; } }
        public bool IsAuthenticated { get { return true; } }

        public string Username { get; private set; }
        /// <summary>
        /// Username
        /// </summary>
        public string Name { get; private set; }
        public string DisplayName { get; private set; }
        public Guid ID { get; private set; }
        public string Domain { get; private set; }
        public string[] Roles { get; set; }
        public Guid IdGiamDoc { get; set; }
        #endregion

        #region Interface
        public override string ToString()
        {
            var values = new[] { 
                ID.ToString(),
                Username,
                Name,
                DisplayName,
                Roles.JoinEmbeddedLength(),
                Domain,
                IdGiamDoc.ToString()
            };

            return values.JoinEmbeddedLength();
        }

        #endregion
    }
}
