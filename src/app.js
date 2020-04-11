const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const checkRepositoryExists = (request, response, next) => {
  const repository = repositories.find(repository => repository.id === request.params.id);
  if (!repository) {
    return response.status(400).json();
  }
  return next();
};

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { title, url, techs } = request.body;
  const repositoryIndex = repositories.findIndex(repository => repository.id === request.params.id);
  repositories[repositoryIndex] = { ...repositories[repositoryIndex], title, url, techs };
  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", checkRepositoryExists, (request, response) => {
  const repositoryIndex = repositories.findIndex(repository => repository.id === request.params.id);
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", checkRepositoryExists, (request, response) => {
  const repositoryIndex = repositories.findIndex(repository => repository.id === request.params.id);
  repositories[repositoryIndex].likes++;
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
