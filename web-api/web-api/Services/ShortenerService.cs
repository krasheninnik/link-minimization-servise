using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WebApi.Model;
using NumericalIndexType = System.UInt64;

namespace WebApi.Services
{
    public class ShortenerService
    {
        private const string Alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        private static readonly IDictionary<char, NumericalIndexType> AlphabetIndex;
        private static readonly NumericalIndexType Base = (NumericalIndexType)Alphabet.Length;

        static ShortenerService()
        {
            AlphabetIndex = Alphabet
                .Select((c, i) => new { Index = i, Char = c })
                .ToDictionary(c => c.Char, c => (NumericalIndexType)c.Index);
        }

        public string Encode(NumericalIndexType seed)
        {
            if (seed < Base)
            {
                return Alphabet[(int)seed].ToString();
            }

            var str = new StringBuilder();
            var i = seed;

            while (i > 0)
            {
                str.Insert(0, Alphabet[(int)(i % Base)]);
                i /= Base;
            }

            return str.ToString();
        }

        public NumericalIndexType Decode(string str)
        {
            NumericalIndexType agregateSum = 0;
            return str.Aggregate(agregateSum, (current, c) => current * Base + AlphabetIndex[c]);
        }
    }
}
