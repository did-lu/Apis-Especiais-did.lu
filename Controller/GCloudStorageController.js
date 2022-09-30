module.exports = {
  async istore(req, res) {
    var JSZip = require("jszip");
    var request = require("request");
    var axios = require("axios");

    const { Storage } = require("@google-cloud/storage");

    const storage = new Storage({
      projectId: "didlu-main",
      credentials: {
        client_email: "pranta-quest@didlu-main.iam.gserviceaccount.com",
        private_key:
          "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLkE9IWiFa/ODI\nVaYDE3/b1kakmJfi+130b/D2mJ/eoqFurhZJMj6sKczcluHi9ThOQRCZa3fuCYd+\n8E3bryKTICpYBWdLwudGOsHKOPFoZKdMpfEBo7KCIaozNGpR6mKBhanv0gViBP29\npOhHQUEjMh3L6H01RdiPa6X/Lq70+6ouW9HuALKkygclvsgm4UjNO2o1GS5Nc7O0\nA1RbO9wy92wz2xAW3WUVob2QPYcWsca+lCVp/fFzBkjXTWFj6f74I0LOswGfZyBl\n7BAthrQ8s4ygvCwppznICtdWHU7bt1qtWnU4lYku2Y6vSEIO+eLmddo+psShz/W0\nP7Yt9uxDAgMBAAECggEAFy5EyQFygPEBC+8s63bB/Z/GBaJW0YM8bMR+lSZGNk0g\nwwDSCt3M40ATUx9fc7/m/IpOQJpLWvD83AizZQvpjQWBrOpYm/kC6y1vuf6IBxJH\nNuRCsKQahNUek5wpa1CcjRFSi7vH3ySgXIM17D9TEpX3bKv57iIZCiQBEDEZvU3j\nGuiOsA172yqxh5Q6dag4EErAdPncrdjxRZrQjKmKOmydEUY3OyOPdboLJ7nAzxW3\nH+q/iAIiyNGGWVp4yBcPszt3cJx4vT2VDBbaCBrtNeog5BrUGtwFUUTs5vDBisF7\nuK2hZLCqmGGYeZkjofZAxgRHxiaf2aX6MsiUoZoTqQKBgQD6GwHXI63NZsJ9BX3T\n8h7Vc2OUwpYz7dtXuC7QJ3JuYREoS6zwiCL5x1tQjHp5M6ZT9ltGNCc3otFV5Ohg\nA3j9o0+JRbFHQ74zhuMR3Hh8TWe90StC0HdPlXG/ZeQmSjw3gkZqRTHZ5JrBnD5D\nvaqBNWMUCvu3z7gibzYDeg73xQKBgQDQXH8BhunUci9Of7EWcahbHaYAMphTd5Xr\nc9oRcaGbgxym+gH+K0IH6+DKmZlBYW6ByPJmKji8QBdXFIggZrlkC0bSMjCkT7Yn\n/F4Ge2uuoIab7p6XTq+vkItd2gHHEBdEKWtxeFgUpwb2IL0unLYGIQAwfZxeWTd9\n5hiSNkQMZwKBgHJSyAuUdozObRaC3Rp1sVx2i01jiQ8hqcK2IUfq0CbeXd5igSHN\nyNcOJpJyNEWUs3HryZsUmdyXo0K1CPdifvrJnMCtx7RApf+dp8vxUG3ZYBNnOnQn\nIHKTaFRJ+fj6s/3XoeJP0NK96XOYvOlwGDFJuwldX+SMoamz1ifOsmrVAoGBAMwI\nx5YHNxMCfbCw+giwY9xVvCiVYvTZNcXLPM+4JjjSu0wHpcvvMEnxgb7jil+ruTr+\nO+AvmD8/w5tST7rq3MBLCp7q5xb/t7CQQMK4OUpXh3lKwaIJO6EAOnk88mCsMRxe\nMwh6gEY5CWgbxyXN77Ewv668UlNRqjVvDMCgwyIhAoGASPxlcyrC8YkTHimCyeRV\nlYCdy7C4mAy2MYx1O3ikVIy16WFJTnwXRtt91HhhE6hl54hXth/uU31yeCYw2PL5\njQQmJXsC1cvXYo+VQ+Xxmq94X59vdX0n8G7ioA90M6DtKeKk7r17aHBnz/1VxkZx\nDIx1JOq2WbNNU05NQjnllyw=\n-----END PRIVATE KEY-----\n",
      },
    });
    const bucketName = req.query.bucketName;
    var new_zip = new JSZip();
    const filename = `https:${req.query.file}`;
    const callback = req.query.callback;
    var fUrl = "";
    const aux = filename.split("/");
    const folder = aux[aux.length - 1].split(".")[0];

    request(
      {
        method: "GET",
        url: filename,
        encoding: null, // <- this one is important !
      },
      async function (error, response, body) {
        if (error || response.statusCode !== 200) {
          console.log("Error", error);
          return;
        }

        new_zip.loadAsync(body).then(function (zip) {
          var entries = Object.keys(zip.files).map(function (name) {
            return zip.files[name];
          });

          // 2.
          var listOfPromises = entries.map(function (entry) {
            return entry.async("arraybuffer").then(function (u8) {
              return [entry.name, u8];
            });
          });

          // 3.
          var promiseOfList = Promise.all(listOfPromises);

          // 4.
          promiseOfList.then(async function (list) {
            for (let i = 0; i < list.length; i++) {
              let n = list[i];

              const dots = ".".repeat(i);
              const left = list.length - i;
              const empty = " ".repeat(left);
              let percentage = Math.round((i / list.length) * 100);
              process.stdout.write(`\r[${dots}${empty}] ${percentage}%`);

              if (!n[0].endsWith("/")) {
                var buffer = Buffer.from(n[1]);
                var fullFinalName = n[0];
                if (!n[0].startsWith(folder)) {
                  fullFinalName = `${folder}/${n[0]}`;
                }

                //console.log("FinalFilename ", fullFinalName);
                await storage.bucket(bucketName).file(fullFinalName).save(buffer);
              }
            }
            if (callback) {
              axios.get(callback);
            }
          });
        });
      }
    );

    fUrl = `https://storage.googleapis.com/${bucketName}/${folder}/index.js`;

    return res.json(fUrl);
  },
};
