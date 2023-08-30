const express = require("express");
const app = express();
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

app.set("view engine", "ejs");

app.get("/",(req,res)=>{
    res.render("home");
})

// Configurar o módulo Multer para o upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });


app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const imgName = req.file.filename;

    // Converter o formato usando sharp
    const convertedImgName = imgName.replace(/\.[^.]+$/, ".webp");
    await sharp(`upload/${imgName}`).toFile(`upload/${convertedImgName}`);

     // Remover a imagem original após a conversão
     fs.unlinkSync(`upload/${imgName}`);

    res.status(200).send(`Imagem redimensionada e salva como ${convertedImgName}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao processar a imagem");
  }
});

app.listen(3000, () => {
  console.log("Servidor está rodando na porta 3000");
});
