using Microsoft.VisualStudio.TestTools.UnitTesting;
using WebApi.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Services.Tests
{
    [TestClass()]
    public class ShortenerServiceTests
    {
        // Alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        // Alphabet.lenght == 62

        [TestMethod()]
        public void Decode_and_encode_id_0()
        {
            UInt64 expectedId = 0;
            String expectedEncoded = "0";

            ShortenerService s = new ShortenerService();
            string actualEncoded = s.Encode(expectedId);
            UInt64 actualId = s.Decode(expectedEncoded);

            Assert.AreEqual(expectedId, actualId);
            Assert.AreEqual(expectedEncoded, actualEncoded);
        }

        [TestMethod()]
        public void Decode_and_encode_id_62_min_two_rank()
        {
            UInt64 expectedId = 62;
            String expectedEncoded = "10";

            ShortenerService s = new ShortenerService();
            string actualEncoded = s.Encode(expectedId);
            UInt64 actualId = s.Decode(expectedEncoded);

            Assert.AreEqual(expectedId, actualId);
            Assert.AreEqual(expectedEncoded, actualEncoded);
        }


        [TestMethod()]
        public void Decode_and_encode_id_3844_min_three_rank()
        {
            UInt64 expectedId = 3844; // 62^2
            String expectedEncoded = "100";

            ShortenerService s = new ShortenerService();
            string actualEncoded = s.Encode(expectedId);
            UInt64 actualId = s.Decode(expectedEncoded);

            Assert.AreEqual(expectedId, actualId);
            Assert.AreEqual(expectedEncoded, actualEncoded);
        }

        [TestMethod()]
        public void Decode_and_encode_id_12832_three_rank()
        {
            UInt64 expectedId = 12832; //    3 * 62^2 + (20 * 62) + 60 
            String expectedEncoded = "3kY"; // Alphabet[3] == '3', Alphabet[20] == 'k', Alphabet[60] == 'Y'

            ShortenerService s = new ShortenerService();
            string actualEncoded = s.Encode(expectedId);
            UInt64 actualId = s.Decode(expectedEncoded);

            Assert.AreEqual(expectedId, actualId);
            Assert.AreEqual(expectedEncoded, actualEncoded);
        }

        [TestMethod()]
        public void Decode_and_encode_id_max_uint64()
        {
            UInt64 expectedId = UInt64.MaxValue; // 18`446`744`073`709`551`615
            String expectedEncoded = "lYGhA16ahyf";

            ShortenerService s = new ShortenerService();
            string actualEncoded = s.Encode(expectedId);
            UInt64 actualId = s.Decode(expectedEncoded);

            Assert.AreEqual(expectedId, actualId);
            Assert.AreEqual(expectedEncoded, actualEncoded);
        }


        [TestMethod()]
        public void Decode_unallowed_symbol()
        {
            // Alphabet doesn't contain letter 'ю' 
            String encoded = "111ю";
            String expected = "there is exception";
            String actual = "before exception have been caught";

            ShortenerService s = new ShortenerService();
            try
            {
                s.Decode(encoded);
            }
            catch (Exception)
            {
                actual = "there is exception";
            }

            Assert.AreEqual(expected, actual);
        }
    }
}