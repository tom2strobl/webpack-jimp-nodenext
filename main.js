import { Jimp } from "jimp";

const image = await Jimp.read("./forsenE.jpeg");
image.resize({ w: 200 });
image.write("./forsenE_resized.jpeg");
