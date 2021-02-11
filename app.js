const express = require("express");
const fs = require("fs");
const { connect } = require("http2");

const app = express();
const jsonParser = express.json();

app.use(express.static(__dirname + "/public"));

const filePath = "links.json";

app.get("/api/links", function (request, response) {

    const filePath = "links.json";
    const content = fs.readFileSync(filePath, "utf8");
    const links = JSON.parse(content);
    response.send(links);
});

app.get("/api/links/:id", function (request, response) {

    filepath = "links.json";
    const id = request.params["id"];
    const content = fs.readFileSync(filePath, "utf8");
    const links = JSON.parse(content);
    let link = null;

    for (var i = 0; i < links.length; i++) {
        if (links[i].id == id) {
            link = links[i];
            break;
        }
    }

    if (link) {
        response.send(link);
    }
    else {
        response.status(404).send();
    }
});

app.post("/api/links", jsonParser, function (request, response) {
    if (!request.body) return response.sendStatus(400);

    const userLink = request.body.link;
    const userRating = request.body.rating;
    console.log("3 - " + userLink + " - " + userRating);
    let link = { link: userLink, rating: userRating };
    console.log("4 - " + link);

    let data = fs.readFileSync(filePath, "utf8");
    let links = JSON.parse(data);

    const id = Math.max.apply(Math, links.map(function (o) { return o.id; }))
    link.id = id + 1;
    links.push(link);

    data = JSON.stringify(links);
    fs.writeFileSync("links.json", data);
    response.send(links);
});

app.delete("/api/links/:id", function (request, response) {
    const filepath = "links.json";
    const id = request.params.id;
    let data = fs.readFileSync(filepath, "utf8");
    let links = JSON.parse(data);
    let index = -1;

    for (var i = 0; i < links.length; i++) {
        if (links[i].id == id) {
            index = i;
            break;
        }
    }
    if (index > -1) {
        const link = links.splice(index, 1)[0];
        data = JSON.stringify(links);
        fs.writeFileSync("links.json", data);
        response.send(link);
    }
    else {
        response.sendStatus(404).send();
    }
});

app.put("/api/links", jsonParser, function (request, response) {
    if (!request.body) { return request.sendStatus(400); }

    const linkId = request.body.id;
    const userLink = request.body.link;
    const userRating = request.body.rating;

    let data = fs.readFileSync(filepath, "utf8");
    const links = JSON.parse(data);
    let link;

    for (var i = 0; i < links.length; i++) {
        if (links[i].id == linkId) {
            link = links[i];
            break;
        }
    }

    if (link) {
        if (userRating != null) {
            link.rating = userRating;
            link.link = userLink;
            data = JSON.stringify(links);
            fs.writeFileSync("links.json", data);
            response.send(link);
        }
        else{
            link.link = userLink;
            data = JSON.stringify(links);
            fs.writeFileSync("links.json", data);
            response.send(link);
        }
    }
    else {
        response.sendStatus(404).send();
    }
});

app.listen(3000, function () {
    console.log("Connected");
});