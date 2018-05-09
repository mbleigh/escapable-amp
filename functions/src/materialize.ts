import { storage } from "./firebase";
import { regionPageData } from "./data";
import { RegionPage } from "./pages";
import { optimize } from "./render";
import * as request from "request-promise";

const ORIGIN = "https://escapable.app";

async function writeAndPurge(path: string, data: string): Promise<any> {
  const objectPath = path + ".html";
  await storage
    .bucket()
    .file(path + ".html")
    .save(data, {
      gzip: true,
      metadata: {
        contentType: "text/html; charset=utf-8",
        cacheControl: "max-age=300, s-maxage=31536000" // indef CDN cache since we purge manually
      }
    });
  console.log("wrote storage file", objectPath);

  const purgeUrl = `${ORIGIN}/${path}`;
  await request(purgeUrl, { method: "PURGE" });
  console.log("purged URL", purgeUrl);
  return;
}

export async function updateRegionPage(rid: string): Promise<any> {
  console.log("updating region", rid);
  const amp = RegionPage(await regionPageData(rid));
  const optimized = await optimize(amp, `/amp/${rid}`);
  console.log("rendered amp optimized version of region page", rid);
  await Promise.all([writeAndPurge(`amp/${rid}`, amp), writeAndPurge(`${rid}`, optimized)]);
}
