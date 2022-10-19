using Website.Helper;
using Lib.BusinessLogic.Management;
using Lib.BusinessLogic.Model;
using System.Web.Http;
using System.Threading.Tasks;
using System.Net.Http;
using Lib.Extensions;
using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace Website.Controllers.Api
{
    [RoutePrefix("api/DMSanPham")]
    public class DMSanPhamController : BaseApiController<DMSanPhamManager, DMSanPhamModel>
    {
        [Route("showPage")]
        [HttpGet]
        public HttpResponseMessage Get(string sSearch, Guid? idLoai, int? phanLoai, int? tinhTrang, bool Active, DateTime? from, DateTime? to, int iPageIndex, int iPageSize)
        {
            ListResult result = new ListResult();
            int iTotal = 0;
            var lSP = _manager.SelectDataByPage(sSearch, true, idLoai, phanLoai, tinhTrang, Active, from, to, iPageIndex, iPageSize, out iTotal);
            result.List = lSP;
            result.Total = iTotal;
            return ApiOk(result);
        }
        [Route("uploadfile")]
        [HttpPost]
        public async Task<IHttpActionResult> UploadFile(string delFile)
        {
            try
            {
                if (!Request.Content.IsMimeMultipartContent())
                {
                    return BadRequest("Không có ảnh");
                }

                var provider = new MultipartMemoryStreamProvider();
                await Request.Content.ReadAsMultipartAsync(provider);


                var now = DateTime.Now;
                var rootPath = ConfigurationUtility.GetConfigurationSettingValue("folder");
                var uploadPath = @"\Content\SanPham\";
                var uploadContainer = Path.Combine(uploadPath, string.Format("{0}\\{1}", now.Year, now.Month));
                var uploadPathTokens = uploadContainer.Split(new char[] { '\\', '/' }, StringSplitOptions.RemoveEmptyEntries);
                var uploadPathCreate = Path.Combine(rootPath, string.Join("\\", uploadPathTokens));
                if (!Directory.Exists(uploadPathCreate))
                {
                    DirectoryInfo direct = Directory.CreateDirectory(uploadPathCreate);
                }
                var listResult = new List<string>();
                var files = provider.Contents.Where(x => x.Headers.ContentDisposition.Name == "\"files\"");
                foreach (var file in files)
                {
                    var fileName = file.Headers.ContentDisposition.FileName.Replace("\"", string.Empty).ToTvKhongDau().Replace(" ", "-").Replace(";", "");
                    fileName = string.Format("{0}-{1}", Guid.NewGuid(), fileName);
                    var fullPath = Path.Combine(uploadPathCreate, fileName);
                    var buffer = await file.ReadAsByteArrayAsync();
                    File.WriteAllBytes(fullPath, buffer);
                    listResult.Add(string.Join("/", uploadPathTokens.Add(fileName)));
                }
                if (delFile.IsNotNullOrEmpty() && File.Exists(rootPath + delFile))
                {
                    File.Delete(rootPath + delFile);
                }
                return Ok(listResult);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Route("")]
        [HttpPost]
        public override HttpResponseMessage Post(DMSanPhamModel value)
        {
            var ipId = _manager.InsertOrUpdate(value);
            if (value.DsAnhXoa != null && value.DsAnhXoa.Count > 0)
            {
                var rootPath = ConfigurationUtility.GetConfigurationSettingValue("folder");
                foreach (var item in value.DsAnhXoa)
                {
                    if (File.Exists(rootPath + item))
                    {
                        File.Delete(rootPath + item);
                    }
                }
            }
            return ApiOk(ipId);
        }

        [Route("{id}")]
        [HttpPost]
        public override HttpResponseMessage Delete(Guid id)
        {
            _manager.Deactivate(id);
            return ApiOk();
        }

        [Route("importExcel")]
        [HttpPost]
        public HttpResponseMessage ImportExcel(List<DMSanPhamModel> value)
        {
            DMSanPhamManager.Instance.ImportExcel(value);
            return ApiOk();
        }
    }
}
