using System.Collections;
using System.Runtime.Serialization;

namespace WebApi.Helper
{
    /// <summary>
    /// Kết quả dạng danh sách
    /// Và số lượng tổng có trong dữ liệu thực
    /// </summary>
    [DataContract]
    public struct ListResult
    {
        [DataMember]
        public IEnumerable List { get; set; }

        [DataMember]
        public int Total { get; set; }
    }
}