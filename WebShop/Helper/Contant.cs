using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebShop
{
    public static class Contant
    {
        private static string _urlwebapp = ConfigurationUtility.GetConfigurationSettingValue("UrlWebApp");
        private static string _urlwebmobile = ConfigurationUtility.GetConfigurationSettingValue("UrlWebMobile");
        private static string _color1 = ConfigurationUtility.GetConfigurationSettingValue("Color1");
        private static string _color2 = ConfigurationUtility.GetConfigurationSettingValue("Color2");
        public static string UrlWebApp
        {
            get
            {
                return _urlwebapp;
            }
        }
        public static string UrlWebMobile
        {
            get
            {
                return _urlwebmobile;
            }
        }
        public static string Color1
        {
            get
            {
                return _color1;
            }
        }
        public static string Color2
        {
            get
            {
                return _color2;
            }
        }
    }
}