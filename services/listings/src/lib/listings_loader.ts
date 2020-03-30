import path from "path"
import fs from "fs"

const parseJsonFile = (filePath: string) => {
  const data = fs.readFileSync(filePath)

  return JSON.parse(data.toString())
}

export default (folderName: string) => {
  return new Promise((resolve, reject) => {
    const listings = []
    const directoryPath = path.join(__dirname, "..", "..", folderName)

    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.log("Unable to scan directory: " + err)
        reject()
      }

      for (const file of files) {
        const filePath = path.join(__dirname, "..", "..", folderName, file)
        if (/\.json$/.exec(filePath)) {
          const listingJSON = parseJsonFile(filePath)
          listings.push(listingJSON)
        }
      }

      resolve(listings)
    })
  })
}
