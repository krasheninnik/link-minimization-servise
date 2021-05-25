using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Model;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UrlTransformationController : ControllerBase
    {
        private DBInteractor context = new DBInteractor();

        private readonly ILogger<UrlTransformationController> _logger;

        public UrlTransformationController(ILogger<UrlTransformationController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [Route("/{shortUrl}")]
        public ActionResult<UrlTransformation> Get(string shortUrl)
        {
            // parse id from shortUrl:
            long id = Int64.Parse(shortUrl);

            // find item by id in database:
            var item = context.UrlTransformation.Find(id);

            if(item == null)
            {
                return NotFound();
            }

            return Ok(item);
        }

        [HttpPost]
        public ActionResult<UrlTransformation> Post(string longUrl)
        {
            // add new long url to database:
            var newUrlTransformation = new UrlTransformation() { longUrl = longUrl, shortUrl = "" };
            context.UrlTransformation.Add(newUrlTransformation);
            context.SaveChanges();

            // retrieve id (primary key) from database:
            long id = newUrlTransformation.Id;

            // generate short url by record id and save in database:
            string generatedShortUrl = "new short url for record with id: " + id;
            newUrlTransformation.shortUrl = generatedShortUrl;
            context.SaveChanges();

            return Ok(newUrlTransformation);
        }
    }
}
