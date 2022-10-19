using Lib.Extensions;
using System.Collections;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace WebShop.Helper
{
    public abstract class MyApiController : ApiController
    {
        #region HttpResponse
        /// <summary>
        /// Create Response: HTTP 200 OK
        /// </summary>
        /// <returns></returns>
        protected HttpResponseMessage HttpOk()
        {
            return HttpOk("Ok");
        }

        protected HttpResponseMessage HttpOk(object result)
        {
            return ControllerContext.Request.CreateResponse(HttpStatusCode.OK, result, Configuration.Formatters.JsonFormatter);
        }

        protected HttpResponseMessage HttpOk(object result, HttpStatusCode code)
        {
            return ControllerContext.Request.CreateResponse(code, result, Configuration.Formatters.JsonFormatter);
        }

        protected HttpResponseMessage HttpBadRequest(object data)
        {
            return ControllerContext.Request.CreateResponse(HttpStatusCode.BadRequest, data, Configuration.Formatters.JsonFormatter);
        }

        protected HttpResponseMessage HttpNotFound(object data)
        {
            return ControllerContext.Request.CreateResponse(HttpStatusCode.NotFound, data, Configuration.Formatters.JsonFormatter);
        }

        protected HttpResponseMessage HttpForbidden(object data)
        {
            return ControllerContext.Request.CreateResponse(HttpStatusCode.Forbidden, data, Configuration.Formatters.JsonFormatter);
        }

        protected HttpResponseMessage HttpNotImplemented(object data)
        {
            return ControllerContext.Request.CreateResponse(HttpStatusCode.NotImplemented, data, Configuration.Formatters.JsonFormatter);
        }




        /// <summary>
        /// Tên gọi khác của HttpOk()
        /// </summary>
        /// <returns></returns>
        protected HttpResponseMessage ApiOk()
        {
            return HttpOk();
        }

        /// <summary>
        /// Tên gọi khác của HttpOk(object)
        /// Trả về mã lỗi: 200
        /// </summary>
        /// <returns></returns>
        protected HttpResponseMessage ApiOk(object result)
        {
            return HttpOk(result);
        }

        /// <summary>
        /// ApiOk with custom code
        /// </summary>
        /// <param name="result"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        protected HttpResponseMessage ApiOk(object result, HttpStatusCode code)
        {
            return HttpOk(result, code);
        }

        /// <summary>
        /// ApiCreated with HTTP 201
        /// </summary>
        /// <param name="result"></param>
        /// <returns></returns>
        protected HttpResponseMessage ApiCreated(object result)
        {
            return HttpOk(result, HttpStatusCode.Created);
        }

        /// <summary>
        /// Trả về file cho client
        /// </summary>
        /// <param name="stream"></param>
        /// <returns></returns>
        protected HttpResponseMessage ApiFile(FileStream stream)
        {
            var result = Request.CreateResponse(HttpStatusCode.OK);
            result.Content = new StreamContent(stream);
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = stream.Name
            };
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            result.Content.Headers.ContentLength = stream.Length;

            return result;
        }

        /// <summary>
        /// Trả về file cho client
        /// </summary>
        /// <param name="stream"></param>
        /// <param name="fileName"></param>
        /// <returns></returns>
        protected HttpResponseMessage ApiFile(Stream stream, string fileName)
        {
            var result = Request.CreateResponse(HttpStatusCode.OK);
            result.Content = new StreamContent(stream);
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = fileName
            };
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            result.Content.Headers.ContentLength = stream.Length;

            return result;
        }

        protected HttpResponseMessage ApiFile(byte[] content, string fileName, string contentType = "application/octet-stream")
        {
            var result = Request.CreateResponse(HttpStatusCode.OK);
            result.Content = new ByteArrayContent(content);
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = fileName
            };
            result.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType);
            result.Content.Headers.ContentLength = content.Length;

            return result;
        }


        /// <summary>
        /// Trả về client dạng chuỗi (string)
        /// </summary>
        /// <param name="data"></param>
        /// <param name="contentType"></param>
        /// <returns></returns>
        protected HttpResponseMessage ApiString(string data = "", string contentType = "text/html")
        {
            var result = Request.CreateResponse(HttpStatusCode.OK);
            result.Content = new StringContent(data);
            result.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType);
            return result;
        }


        /// <summary>
        /// Tên gọi khác của HttpBadRequest(object)
        /// Trả về mã lỗi: 400
        /// </summary>
        /// <returns></returns>
        protected HttpResponseMessage ApiBadRequest(object data)
        {
            return HttpBadRequest(data);
        }

        /// <summary>
        /// Tiện ích trả về thông báo request không hợp lệ với nhiều điều kiện user inputs
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        protected HttpResponseMessage ApiBadRequest(params string[] data)
        {
            var result = string.Join(",", data);
            return HttpBadRequest(result);
        }

        /// <summary>
        /// Tên gọi khác của HttpNotFound(object)
        /// Trả về mã lỗi: 404
        /// </summary>
        /// <returns></returns>
        protected HttpResponseMessage ApiNotFound(object data)
        {
            return HttpNotFound(data);
        }

        /// <summary>
        /// Tiện ích trả về thông báo ko tìm thấy với nhiều điều kiện user inputs
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        protected HttpResponseMessage ApiNotFound(params string[] data)
        {
            var result = string.Join(",", data);
            return HttpNotFound(result);
        }


        /// <summary>
        /// Tên gọi khác của HttpForbidden(object)
        /// Trả về mã lỗi: 403
        /// </summary>
        /// <returns></returns>
        protected HttpResponseMessage ApiForbidden(object data)
        {
            return HttpForbidden(data);
        }

        /// <summary>
        /// Tên gọi khác của HttpNotImplemented(object)
        /// Trả về mã lỗi: 501
        /// </summary>
        /// <returns></returns>
        protected HttpResponseMessage ApiNotImplemented(object data = null)
        {
            return HttpNotImplemented(data);
        }

        /// <summary>
        /// Trả về danh sách dữ liệu dạng mảng, danh sách hoặc collection
        /// </summary>
        /// <param name="list"></param>
        /// <param name="total"></param>
        /// <returns></returns>
        protected HttpResponseMessage ApiList(IEnumerable list, int total)
        {
            return HttpOk(new ListResult
            {
                List = list,
                Total = total
            });
        }

        #endregion
    }
}