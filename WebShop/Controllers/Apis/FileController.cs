using Lib.Extensions;
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace WebShop.Controllers.Apis
{
    [AllowAnonymous]
    public class FileController : ApiController
    {
        [HttpGet]
        [Route("api/files")]
        public HttpResponseMessage GetImage(string s)
        {
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
    }
}