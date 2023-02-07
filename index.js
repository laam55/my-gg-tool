const express = require("express");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cheerio = require("cheerio");

const app = express();
const port = 4000;

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
