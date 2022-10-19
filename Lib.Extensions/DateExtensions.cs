using System;

namespace Lib.Extensions
{
    public static class DateExtensions
    {
        public static bool IsNotNull(this DateTime date)
        {
            return date.ToString("MMddyyyy") != "01010001";
        }

        public static bool IsNotNull(this DateTime? date)
        {
            if (!date.HasValue) return false;
            return date.Value.IsNotNull();
        }

        public static bool IsNull(this DateTime? date)
        {
            if (!date.HasValue) return true;
            return date.Value.ToString() == "1/1/0001 12:00:00 AM";
        }
        /// <summary>
        /// Is MinDate
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        public static bool IsNull(this DateTime date)
        {
            return date.ToString() == "1/1/0001 12:00:00 AM";
        }
        public static long DateToUnixTimestamp(this DateTime date)
        {
            var offset = DateTimeOffset.Parse(date.ToString());
            return offset.ToUnixTimeMilliseconds();
        }

        /// <summary>
        /// Kiểm tra `ngày` hiện tại có phải là `hôm nay` hay không
        /// </summary>
        /// <param name="date">Ngày cần kiểm tra</param>
        /// <param name="now">Thời điểm kiểm tra (optional)</param>
        /// <returns></returns>
        public static bool IsToday(this DateTime date, DateTime now)
        {
            var today = DateTime.Today;
            return (date.Year == today.Year && date.Month == today.Month && date.Day == today.Day);
        }

        /// <summary>
        /// Kiểm tra `ngày` hiện tại có phải là `hôm nay` hay không
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        public static bool IsToday(this DateTime date)
        {
            return IsToday(date, DateTime.Now);
        }
        #region Convert to string
        public static string ToStrDbDate(this DateTime date)
        {
            return date.ToString("yyyy-MM-dd");
        }

        public static string ToStrDbDatetime(this DateTime date)
        {
            return date.ToString("yyyy-MM-dd HH:mm");
        }
        #endregion
    }
}
