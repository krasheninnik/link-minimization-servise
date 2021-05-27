using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Model;
using WebApi.Services;
using NumericalIndexType = System.UInt64;


namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UrlTransformationController : ControllerBase
    {
        private DBInteractor context = new DBInteractor();
        private ShortenerService shortenerService = new ShortenerService();
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
            NumericalIndexType id = shortenerService.Decode(shortUrl);

            // find item by id in database:
            var item = context.UrlTransformation.Find(id);

            if(item == null)
            {
                return NotFound($"404. Sorry, don't have original URL for this short: {shortUrl}");
            }

            return RedirectPermanent(item.LongUrl);
        }

        [HttpPost]
        public ActionResult<UrlTransformation> Post(string longUrl)
        {
            // add new long url to database:
            var newUrlTransformation = new UrlTransformation() { LongUrl = longUrl, ShortUrl = "" };
            context.UrlTransformation.Add(newUrlTransformation);
            context.SaveChanges();

            // retrieve id (primary key) from database:
            NumericalIndexType id = newUrlTransformation.Id;

            // generate short url by record id and save in database:
            string generatedShortUrl = shortenerService.Encode(id);
            newUrlTransformation.ShortUrl = generatedShortUrl;
            context.SaveChanges();

            return Ok(newUrlTransformation);
        }
    }
}
