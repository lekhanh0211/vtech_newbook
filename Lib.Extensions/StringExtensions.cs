using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

namespace Lib.Extensions
{
    public static class StringExtensions
    {
        public static bool EqualIgnoreCase(this string s, string d)
        {
            return s.Equals(d, StringComparison.InvariantCultureIgnoreCase);
        }
        public static bool ContainIgnoreCase(this string s, string search)
        {
            return s.ToTvKhongDau().IndexOf(search.ToTvKhongDau(), StringComparison.InvariantCultureIgnoreCase) != -1;
        }
        public static int IndexIgnoreCase(this string s, string search)
        {
            return s.ToTvKhongDau().IndexOf(search.ToTvKhongDau(), StringComparison.InvariantCultureIgnoreCase);
        }
        public static bool FirstIgnoreCase(this string s, string search)
        {
            return s.ToTvKhongDau().IndexOf(search.ToTvKhongDau(), StringComparison.InvariantCultureIgnoreCase) == 0;
        }
        public static string TrimIfOver(this string s, int maxLen)
        {
            return s.IsNotNullOrEmpty() && s.Length > maxLen ? s.Substring(0, maxLen) + "..." : s;
        }

        public static bool IsNullOrEmpty(this string str)
        {
            return string.IsNullOrEmpty(str);
        }

        public static bool IsNotNullOrEmpty(this string str)
        {
            return !string.IsNullOrEmpty(str);
        }

        public static string ToString(this DateTime? date, string def)
        {
            if (date.HasValue)
            {
                return date.Value.ToString(def);
            }
            return "";
        }

        public static string ToString(this decimal? nunber, string def)
        {
            if (nunber.HasValue)
            {
                return nunber.Value.ToString("0.###");
            }
            return def;
        }
        public static string ToCurrencyFormat(this decimal currency)
        {
            return string.Format("{0:#,##0.##}", currency);
        }

        public static string ToCurrencyFormat2(this decimal currency)
        {
            var temp = currency.ToString("#,##0.##");
            var arr = Regex.Split(temp, @"\.");
            if (arr.Count() < 2)
            {
                return arr[0].Replace(",", ".");
            }
            else
            {
                return arr[0].Replace(",", ".") + "," + arr[1];
            }
        }

        public static string JoinEmbeddedLength(this string[] values)
        {
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < values.Length; i++)
            {
                if (values[i].IsNotNullOrEmpty())
                {
                    builder.Append(values[i].Length).Append("|").Append(values[i]);
                }
                else
                {
                    builder.Append("0").Append("|");
                }
            }
            return builder.ToString();
        }

        public static string[] SplitEmbeddedLength(this string str)
        {
            int num2;
            List<string> list = new List<string>();
            int index = str.IndexOf('|');
            if ((index > 0) && int.TryParse(str.Substring(0, index), out num2))
            {
                while ((index > 0) && (num2 >= 0))
                {
                    list.Add(str.Substring(index + 1, num2));
                    int startIndex = (index + 1) + num2;
                    index = str.IndexOf('|', startIndex);
                    if ((index <= 0) || (index <= startIndex))
                    {
                        break;
                    }
                    if (!int.TryParse(str.Substring(startIndex, index - startIndex), out num2))
                    {
                        num2 = -1;
                    }
                }
            }
            else
            {
                return null;
            }
            return list.ToArray();
        }

        /// <summary>
        /// Deserialize string to object
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="s"></param>
        /// <returns></returns>
        public static T FromJson<T>(this string s)
        {
            T result = JsonConvert.DeserializeObject<T>(s);
            return result;
        }

        /// <summary>
        /// Trả về chuỗi không dấu
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string ToTvKhongDau(this string str)
        {
            if (string.IsNullOrEmpty(str))
            {
                return string.Empty;
            }

            str = str.ToLower();
            string[] signs = new string[] {
                "aeouidy",
                "áàạảãâấầậẩẫăắằặẳẵ",
                "éèẹẻẽêếềệểễ",
                "óòọỏõôốồộổỗơớờợởỡ",
                "úùụủũưứừựửữ",
                "íìịỉĩ",
                "đ",
                "ýỳỵỷỹ"
            };
            for (int i = 1; i < signs.Length; i++)
            {
                for (int j = 0; j < signs[i].Length; j++)
                {
                    str = str.Replace(signs[i][j], signs[0][i - 1]);
                }
            }
            return str;
        }

        /// <summary>
        /// Hàm chuyển đổi string sang dạng Guid
        /// </summary>
        /// <param name="guid"></param>
        /// <returns></returns>
        public static Guid ToGuid(this string guid)
        {
            var value = Guid.Empty;
            if (!string.IsNullOrEmpty(guid))
            {
                Guid.TryParse(guid, out value);
            }
            return value;
        }

        /// <summary>
        /// Hàm chuyển đổi string sang dạng Guid
        /// </summary>
        /// <param name="guid"></param>
        /// <returns></returns>
        public static bool IsGuid(this string guid)
        {
            var value = Guid.Empty;
            return Guid.TryParse(guid, out value);
        }

        /// <summary>
        /// Kiểm tra giá trị cấu hình là True
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static bool IsTrue(this string str)
        {
            return string.Equals(str, "true", StringComparison.CurrentCultureIgnoreCase);
        }

        /// <summary>
        /// Lấy các ký tự cuối của chuỗi string.
        /// </summary>
        /// <param name="source"></param>
        /// <param name="last"></param>
        /// <returns></returns>
        public static string GetLast(this string source, int last)
        {
            return (string.IsNullOrEmpty(source) || last >= source.Length) ? source : source.Substring(source.Length - last);
        }
    }
}
