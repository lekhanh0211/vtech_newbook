using log4net;

namespace Lib.Extensions
{
    public static class ExceptionExtension
    {
        private static ILog logger = LogManager.GetLogger((System.Type)typeof(ExceptionExtension));

        public static void Log(this System.Exception ex, bool sendmail = true)
        {
            if (ex != null)
            {
                logger.Error(ex);
            }
        }
    }
}
