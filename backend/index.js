import express from "express";
import { configDotenv } from "dotenv";
import { nanoid } from "nanoid";
import connectDb from "./src/config/mongodb.config.js";
import urlSchema from "./src/models/shortUrl.model.js";

configDotenv();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/create", (req, res) => {
  const { url } = req.body;
  console.log(url);
  const shortUrl = nanoid(7);
  const newUrl = new urlSchema({
    full_url: url,
    short_url: shortUrl,
  });

  newUrl.save();
  res.send(nanoid(7));
});
app.get("/api/:shortUrl", async(req,res)=>{
    const {shortUrl} = req.params
    const url = await  urlSchema.findOne({short_url: shortUrl})
    if(url){
        res.redirect(url.full_url)
    }else{
        res.status(404).send("Not Found")
    }

})
app.listen(PORT, () => {
  connectDb();
  console.log("Server is running on port: ", PORT);
});
