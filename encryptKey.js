const { Console } = require("console")
const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
    //function will return a encrypted json key that we can store locally and only decypt it with a password
    const encryptedJsonKey = await wallet.encrypt(
        process.env.PRIVATE_KEY_PASSWORD,
        process.env.PRIVATE_KEY
    )

    console.log(encryptedJsonKey)

    //creating new file with encrypted key
    fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
