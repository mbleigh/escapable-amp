import * as express from "express";
import { regionPageData, getRegion, getRegions } from "./data";
import { optimize } from "./render";
import * as compression from "compression";
import { RegionPage, ListRegionsPage } from "./pages";
import { storage } from "./firebase";
const app = express();
app.use(compression());

function handler(fn) {
  return async function(req, res) {
    try {
      await fn(req, res);
    } catch (e) {
      console.log(e.stack);
      res.status(500).send("Internal Error");
    }
  };
}

app.get(
  "/",
  handler(async (req, res) => {
    res.set("Cache-Control", "s-maxage=1200, max-age=600");
    res.send(ListRegionsPage(await getRegions()));
  })
);

app.get(
  "/s/amp/:region",
  handler(async (req, res) => {
    res.set("Cache-Control", "s-maxage=600, max-age=300");
    res.send(RegionPage(await regionPageData(req.params.region)));
  })
);

app.get(
  "/s/:region",
  handler(async (req: express.Request, res: express.Response) => {
    res.set("Cache-Control", "s-maxage=600, max-age=300");
    res.send(await optimize(RegionPage(await regionPageData(req.params.region)), `/amp${req.url}`));
  })
);

async function bucketProxy(req: express.Request, res: express.Response) {
  console.log("proxying to file", req.path + ".html");
  const file = storage.bucket().file(req.path + ".html");
  const rs = file.createReadStream();

  const t0 = Date.now();
  res.set({
    "Cache-Control": "max-age=300, s-maxage=31536000",
    "Content-Type": "text/html; charset=utf-8"
  });
  rs.pipe(res);
  rs.on("finish", () => {
    console.log("file stream took", Date.now() - t0, "ms");
  });
}

app.get("/amp/:region", bucketProxy);
app.get("/:region", bucketProxy);

export default app;
