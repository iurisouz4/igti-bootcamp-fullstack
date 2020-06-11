const express = require("express");
const moment = require("moment");
const app = express();
const fs = require("fs").promises;
const port = 3000;
const gradesFile = "./src/data/grades.json";

async function getGrade(id) {
  const json = await fs.readFile(gradesFile, "utf8");
  const data = JSON.parse(json);
  return data.grades.filter((grade) => {
    return grade.id == id;
  })[0];
}

async function insertGrade(grade, timestamp) {
  const json = await fs.readFile(gradesFile, "utf8");
  let data = JSON.parse(json);
  const newGrade = { id: data.nextId++, ...grade, timestamp: timestamp };
  let arr = Array.from(data.grades);
  arr.push(newGrade);
  data.grades = arr;
  await fs.writeFile(gradesFile, JSON.stringify(data));
  return data;
}

async function updateGrade(newGrade, id) {
  const json = await fs.readFile(gradesFile, "utf8");
  let data = JSON.parse(json);
  let oldGrade = data.grades.find((grade) => {
    return grade.id == id;
  });

  if (oldGrade) {
    oldGrade.student = newGrade.student;
    oldGrade.subject = newGrade.subject;
    oldGrade.type = newGrade.type;
    oldGrade.value = newGrade.value;
    await fs.writeFile(gradesFile, JSON.stringify(data));
    return oldGrade;
  }

  return { msg: "ID informada não existe..." };
}

async function deleteGrade(id) {
  const json = await fs.readFile(gradesFile, "utf8");
  let data = JSON.parse(json);
  data.grades = data.grades.filter((grade) => {
    return grade.id != id;
  });

  await fs.writeFile(gradesFile, JSON.stringify(data));
  return { msg: "Grade excluída..." };
}

app.use(express.json());

app.get("/grades/:id", async (req, res) => {
  const grade = await getGrade(req.params.id);
  return res.json(grade);
});

app.post("/grades", async (req, res) => {
  const timestamp = moment();
  const data = await insertGrade(req.body, timestamp);
  const { nextId } = data;
  return res.json({ id: nextId - 1, ...req.body, timestamp: timestamp });
});

app.put("/grades/:id", async (req, res) => {
  const data = await updateGrade(req.body, req.params.id);
  return res.json(data);
});

app.delete("/grades", async (req, res) => {
  const data = await deleteGrade(req.body.id);
  return res.json(data);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
