const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function isId(req,res,next) {
  const {id} = req.params;

  if(!isUuid(id)) {
    return res.status(400).json({error: 'Id Invalid'})
  }

  return next();
}

app.use('/repositories/:id', isId);

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const {title , url, techs} = req.body; 

  const urlP = url 
  ? url
  : "https://github.com/Rocketseat/bootcamp-gostack-desafios/tree/master/desafio-conceitos-nodejs";
  const newRepo = {
    id: uuid(), 
    title, 
    url: urlP,
    techs, 
    likes: 0
  }

  repositories.push(newRepo);

  return res.status(200).json(newRepo);
});

app.put("/repositories/:id", (req, res) => {
  const {id} = req.params;

  const {title, url, techs} = req.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);
  const updateRepo = {
    id,
    title: title ? title : repositories[repoIndex].title ,
    url: url ? url : repositories[repoIndex].url,
    techs: techs ? techs : repositories[repoIndex].techs,
    likes: repositories[repoIndex].likes
  }

  const newRepo = repositories[repoIndex] = updateRepo;

  if(repoIndex < 0) {
    return res.status(400).json({error: 'Invalid id'});
  }

  return res.status(200).json(newRepo);

});

app.delete("/repositories/:id", (req, res) => {
  const {id} = req.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0) {
    return res.status(400).json({error: 'Invalid id'});
  }

  repositories.splice(repoIndex, 1);
  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const {id} = req.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0) {
    return res.status(400).json({error: 'Invalid id'});
  }

  repositories[repoIndex].likes += 1;

  return res.status(200).json(repositories[repoIndex]);
});

module.exports = app;
