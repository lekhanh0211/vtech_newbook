using System.Configuration;

namespace Lib.Extensions
{
    public static class ConfigurationUtility
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2122:DoNotIndirectlyExposeMethodsWithLinkDemands")]
        public static string GetConfigurationSettingValue(string configName)
        {
            return ConfigurationManager.AppSettings[configName];
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2122:DoNotIndirectlyExposeMethodsWithLinkDemands")]
        public static string GetConfigurationSettingValue(string configName, string defaultValue)
        {
            var configValue = ConfigurationManager.AppSettings[configName];
            return string.IsNullOrEmpty(configValue) ? defaultValue : configValue;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2122:DoNotIndirectlyExposeMethodsWithLinkDemands")]
        public static string GetConnectionStringValue(string configName)
        {
            return ConfigurationManager.ConnectionStrings[configName].ConnectionString;
        }
    }
}
