import fs from "fs"
import path from "path"
import readline from "readline"
// npm install cli-color
import clc from "cli-color"

run()

function escapedHTMLSpecialCharacters(text) {
  return text.replace(/[<>&]/g, (match) => {
    switch (match) {
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case "&":
        return "&amp"
      default:
        return match
    }
  })
}

function escapedHTMLFile(inputFilePath, outputFilePath) {
  try {
    const fileContent = fs.readFileSync(inputFilePath, "utf-8")
    const escapedContent = escapedHTMLSpecialCharacters(fileContent)
    fs.writeFileSync(outputFilePath, escapedContent, "utf-8")
    console.log(clc.green(`Arquivo escapado com sucesso: ${outputFilePath}`))
  } catch (error) {
    console.log(clc.red("Erro:", error.message))
    process.exit(1)
  }
}

function askFilePath(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
      rl.close()
    })
  })
}

async function userInterection() {
  // node html-escaper.js <inputPath> <outputPath>
  let inputPath = process.argv[2]
  if (!inputPath) {
    inputPath = await askFilePath(clc.cyan("Informe o caminho do arquivo de entrada: "))
  }
  inputPath = path.resolve(inputPath)

  const defaultName = `escaped_${path.basename(inputPath)}.txt`
  const answer = await askFilePath(clc.cyan(`Informe o caminho do arquivo de saída (padrão:${defaultName}: `))
  let outputPath = answer.length > 0 ? answer : defaultName
  outputPath = path.resolve(outputPath)

  escapedHTMLFile(inputPath, outputPath)
}

function run() {
  if (process.argv.length >= 4) {
    escapedHTMLFile(
      path.resolve(process.argv[2]),
      path.resolve(process.argv[3])
    )
  } else {
    console.log(clc.yellow("---------------------"))
    console.log(clc.red("HTML Tag Escaper v1.0"))
    console.log(clc.yellow("---------------------"))
    console.log(clc.green("Argumentos não informados!\nPor favor, informe os caminhos dos arquivos para realizar o escape."))
  }
  userInterection()
}