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

async function getTotal(student, subject) {
  const json = await fs.readFile(gradesFile, "utf8");
  const data = JSON.parse(json);
  const filteredGrades = data.grades.filter((grade) => {
    return grade.student == student && grade.subject == subject;
  });
  const total = filteredGrades.reduce((acum, curr) => {
    return acum + curr.value;
  }, 0);
  return total;
}

async function getAverage(type, subject) {
  const json = await fs.readFile(gradesFile, "utf8");
  const data = JSON.parse(json);
  const filteredGrades = data.grades.filter((grade) => {
    return grade.type == type && grade.subject == subject;
  });
  const total = filteredGrades.reduce((acum, curr) => {
    return acum + curr.value;
  }, 0);
  const average = total / filteredGrades.length;
  return average;
}

async function getTop3(type, subject) {
  const json = await fs.readFile(gradesFile, "utf8");
  const data = JSON.parse(json);
  const filteredGrades = data.grades.filter((grade) => {
    return grade.type == type && grade.subject == subject;
  });

  const sortedGrades = filteredGrades.sort((a, b) => {
    return b.value - a.value;
  });

  return sortedGrades.slice(0, 3);
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

app.get("/total", async (req, res) => {
  const total = await getTotal(req.body.student, req.body.subject);
  return res.json({
    value: total,
    msg:
      "Soma de todas as notas de atividades correspondentes à " +
      req.body.subject,
  });
});

app.get("/average", async (req, res) => {
  const average = await getAverage(req.body.type, req.body.subject);
  return res.json({
    value: average,
    msg: `Média de todas as notas de ${req.body.type} correspondentes à ${req.body.subject}`,
  });
});

app.get("/top3", async (req, res) => {
  const top3 = await getTop3(req.body.type, req.body.subject);
  return res.json({
    values: top3,
    msg: `3 melhores notas de ${req.body.type} correspondentes à ${req.body.subject}`,
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
