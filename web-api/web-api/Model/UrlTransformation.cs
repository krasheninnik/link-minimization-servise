using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace WebApi.Model
{
    public class UrlTransformation
    {
        public System.UInt64 Id {get; set; }
        public string LongUrl { get; set; }
        public string ShortUrl { get; set; }
    }
}

