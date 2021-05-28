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

        // Redirect on long URL by short Url
        [HttpGet]
        [Route("/{shortUrl}")]
        public ActionResult<string> Get(string shortUrl)
        {
            NumericalIndexType id = 0;
            // parse id from shortUrl:
            try
            {
                id = shortenerService.Decode(shortUrl);
            }
            catch (Exception e)
            {
                return BadRequest($"400. Short link contains an unallowed character {e.Message}");
            }

            // find item by id in database:
            var item = context.UrlTransformation.Find(id);

            if (item == null)
            {
                return NotFound($"404. Sorry, don't have original URL for this short: {shortUrl}");
            }

            return RedirectPermanent(item.LongUrl);
        }

        // Return record for this short Url
        // ( Just GET method without redirect for debug purpose)
        [HttpGet]
        [Route("test/{shortUrl}")]
        public ActionResult<UrlTransformation> GetTest(string shortUrl)
        {
            NumericalIndexType id = 0;
            // parse id from shortUrl:
            try
            {
                id = shortenerService.Decode(shortUrl);
            }
            catch (Exception e)
            {
                return BadRequest($"400. Short link contains an unallowed character {e.Message}");
            }

            // find item by id in database:
            var item = context.UrlTransformation.Find(id);

            if (item == null)
            {
                return NotFound($"404. Sorry, don't have original URL for this short: {shortUrl}");
            }

            return Ok(item);
        }

        // Create short url for long url
        [HttpPost]
        public ActionResult<UrlTransformation> Post(string longUrl)
        {
            // Validate long URL:
            bool isValideUrl = Uri.TryCreate(longUrl, UriKind.Absolute, out Uri uriResult)
                && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);

            if (!isValideUrl)
            {
                return BadRequest($"400. Can't accept this link, validation error: {longUrl}");
            }

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
