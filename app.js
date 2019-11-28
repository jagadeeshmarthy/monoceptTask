'use strict';
const express = require('express');
const request = require('request');
const rp = require('request-promise');
const fs = require('fs');
const multer = require('multer');

const app = express();
const upload = multer({ dest: 'uploads/' });
const gitUrl = 'https://api.github.com/users/';
const PORT = '3000';

//api route to get the repos for user
app.post('/getRepos', upload.any(), async (request, response) => {
    var fileData = fs.readFileSync(request.files[0].path, 'utf8');
    var users = fileData.toString().split(",");
    var obj = {};
    var result;
    try {
        for (let i = 0; i < users.length; i++) {
            result = await getUserRepos(users[i]);
            obj[users[i]] = result.map(data => data.url);
        }
        // await fs.unlinkAsync(req.file.path)
        response.status(200).send(obj);
    }
    catch(e) {
        response.status(500).send(e);
    }
})

// calls github api for mentioned user
async function getUserRepos(user) {
    var options = {
        method: 'GET',
        json: true,
        uri: gitUrl + user + "/repos",
        headers: {
            'user-agent': 'node.js'
        }
    };
    return rp(options);
}

app.listen(PORT, () => {
    console.log(`==app is listening at ${PORT}===`)
})