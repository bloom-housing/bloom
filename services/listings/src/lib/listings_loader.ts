import path from "path"
import fs from "fs"

const parseJsonFile = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, function(err, data) {
      if (err) {
        reject()
        return
      }

      resolve(JSON.parse(data.toString()))
    })
  })
}

export default function(folderName) {
  return new Promise((resolve, reject) => {
    const listings = []
    const directoryPath = path.join(__dirname, "..", "..", folderName)

    fs.readdir(directoryPath, async function(err, files) {
      if (err) {
        console.log("Unable to scan directory: " + err)
        reject()
      }

      for (const file of files) {
        const filePath = path.join(__dirname, "..", "..", folderName, file)
        if (/\.json$/.exec(filePath)) {
          const listingJSON = await parseJsonFile(filePath)
          listings.push(listingJSON)
        }
      }

      resolve(listings)
    })
  })
}
