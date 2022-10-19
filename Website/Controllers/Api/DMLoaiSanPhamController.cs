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
    [RoutePrefix("api/DMLoaiSanPham")]
    public class DMLoaiSanPhamController : BaseApiController<DMLoaiSanPhamManager, DMLoaiSanPhamModel>
    {
        [Route("")]
        [HttpGet]
        public override HttpResponseMessage Get()
        {
            List<Expression<Func<DMLoaiSanPhamModel, bool>>> lFilter = new List<Expression<Func<DMLoaiSanPhamModel, bool>>>();
            lFilter.Add(x => x.Active == true);
            var result = _manager.SelectBy(lFilter, " Cap, UuTien ");
            return ApiOk(result);
        }
        [Route("{id}")]
        [HttpGet]
        public override HttpResponseMessage Get(Guid id)
        {
            var vResult = _manager.GetById(id);
            return ApiOk(vResult);
        }

        [Route("")]
        [HttpPost]
        public override HttpResponseMessage Post(DMLoaiSanPhamModel value)
        {
            var ipId = _manager.InsertOrUpdate(value);
            return ApiOk(ipId);
        }

        [Route("{id}")]
        [HttpPost]
        public override HttpResponseMessage Delete(Guid id)
        {
            _manager.Delete(id);
            return ApiOk();
        }
        [Route("showPage")]
        [HttpGet]
        public HttpResponseMessage Get(string sSearch, Guid? idcap1, Guid? idcap2, int iPageIndex, int iPageSize)
        {
            ListResult result = new ListResult();
            int iTotal = 0;
            result.List = _manager.SelectDataByPage(sSearch, idcap1, idcap2, iPageIndex, iPageSize, out iTotal);
            result.Total = iTotal;
            return ApiOk(result);
        }
        [Route("bycap")]
        [HttpGet]
        public HttpResponseMessage bycap(int cap)
        {
            List<Expression<Func<DMLoaiSanPhamModel, bool>>> lFilter = new List<Expression<Func<DMLoaiSanPhamModel, bool>>>();
            lFilter.Add(x => x.Cap == cap);
            var result = _manager.SelectBy(lFilter, " UuTien ");
            return ApiOk(result);
        }
        [Route("bycaptren")]
        [HttpGet]
        public HttpResponseMessage bycaptren(Guid id, int cap)
        {
            List<Expression<Func<DMLoaiSanPhamModel, bool>>> lFilter = new List<Expression<Func<DMLoaiSanPhamModel, bool>>>();
            if (cap == 2)
            {
                lFilter.Add(x => x.Cap == 2 && x.IdCap1 == id);
            }
            if (cap == 3)
            {
                lFilter.Add(x => x.Cap == 3 && x.IdCap2 == id);
            }

            var result = _manager.SelectBy(lFilter, " UuTien ");
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
                var uploadPath = @"\Content\LoaiSanPham\";
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
    }
}
