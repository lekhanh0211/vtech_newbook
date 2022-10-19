using Lib.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using WebApi.Helper;

namespace WebApi.Controllers
{
    [RoutePrefix("api/files")]
    public class FilesController: MyApiController
    {
        [Route("")]
        [HttpGet]
        public HttpResponseMessage GetImage(string s)
        {
            if (s.IsNullOrEmpty())
            {
                return Request.CreateResponse(HttpStatusCode.OK); ;
            }
            //var filename = @"Content\BanTin\2022\7\790782ba-9c7b-4e37-9f1d-f0e0fee51d45-download.jpg";
            var rootPath = ConfigurationUtility.GetConfigurationSettingValue("folder");
            var fullPath = Path.Combine(rootPath, string.Join("\\", s));
            Byte[] b = System.IO.File.ReadAllBytes(fullPath);   // You can use your own method over here.
                                                                // var result = Request.CreateResponse(HttpStatusCode.OK);
            var result = Request.CreateResponse(HttpStatusCode.OK);
            result.Content = new ByteArrayContent(b);
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");
            return result;
        }

        [Route("upload/{folder}")]
        [HttpPost]
        public async Task<IHttpActionResult> UploadFile(string folder, string delFile)
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
                var uploadPath = string.Format(@"\Content\{0}\", folder);
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