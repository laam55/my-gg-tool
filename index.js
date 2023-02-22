const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const jwt = require("jsonwebtoken");
const cheerio = require("cheerio");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/crawl-data", async (req, res) => {
	const url = req.query?.url;
	if (url) {
		const crawlData = await getCrawlData(url);
		let $ = cheerio.load(crawlData);

		res.json({
			title: $('meta[property="og:title"]').attr("content"),
			description: $('meta[property="og:description"]').attr("content"),
			image: $('meta[property="og:image"]').attr("content"),
		});
	} else {
		res.send("Crawl data! please add query string: ?url=...");
	}
});

app.post("/generateToken", (req, res) => {
	if (!req?.body?.payload) {
		return res.json({
			code: 400,
			message: "Data cannot be empty1!",
		});
	}

	if (!req?.body?.signature) {
		return res.json({
			code: 400,
			message: "Signature cannot be empty!",
		});
	}

	const token = jwt.sign(req?.body?.payload, req?.body?.signature, { algorithm: "HS256" });

	return res.json({ code: 200, token });
});

app.get("/", async (req, res) => {
	res.send("Hello world");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

async function getCrawlData(url) {
	try {
		const response = await fetch(url);
		const body = await response.text();
		return body;
	} catch (err) {
		return err;
	}
}
