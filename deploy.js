// synchronous [solidity], code goes line by line
// asynchrounous [javascript] multiple lines of code can run at once

const { Console } = require("console")
const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    //first thing we need to do is compile sol file which we could do in file but we can use solc with yarn
    // yarn solcjs --bin --abi --include-path node_modules/ --base-path . -o . SimpleStorage.sol

    //after compiling we need to connect to a block chain. We can use Ganache (local blockchain)
    //http://127.0.0.1:7545  // if you want to call api directly refer to ethereum json-rpx specifications (found in bookmarks )
    //easier way is to ethers.js

    //connect to block chain
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    //connect to wallet (TIP do not hard code private key)(will find out later how  to do this property)
    //const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    // instead of creating wallet with private key plain text most secure method would be to use encypted key like below
    const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8")
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson,
        process.env.PRIVATE_KEY_PASSWORD //More security tip, if someone hacked into ur computer they could type "history" in command line and view all of your history within this file. Clear history with command line by entering history -c
    )
    //need to make sure wallet knows about provider
    wallet = await wallet.connect(provider)

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )

    // 1) Deploy contract with factory method
    //contract factory: object used to deploy contracts
    //abi knows how to interact with contract
    //binary code itself at low level
    //wallet used to deploy contract

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")

    //if we take await away we wont get result of contract being deployed
    //if you want to add gasLimit or gas price add to parameters in deploy

    const contract = await contractFactory.deploy()
    const deploymentReceipt = await contract.deployTransaction.wait(1)
    console.log(`contract address: ${contract.address}`)

    //   //transaction you get as soon as u deploy contract
    //   console.log("Here is the deployment transaction: ");
    //   console.log(contract.deployTransaction);
    //   //receipt you get once contract is deployed
    //   console.log("Here is the transaction receipt");
    //   console.log(deploymentReceipt);

    const currentFavoriteNumber = await contract.favoriteNumber()
    //returns bigNumber object use to sting to see string verion
    console.log(`current Favorite number: ${currentFavoriteNumber.toString()}`)
    const transacationResponse = await contract.store("5")
    const transactionReceipt = await transacationResponse.wait(1)
    const updatedFavoriteNumber = await contract.favoriteNumber()
    console.log(`Updated Favorite number: ${updatedFavoriteNumber.toString()}`)

    //2) deploy contract manually
    //console.log("Lets Deploy with only transaction Data!");
    //creating transaction

    //how to get nonce
    //   const nonce = await wallet.getTransactionCount();
    //   const tx = {
    //     nonce: nonce,
    //     gasPrice: 20000000000,
    //     gasLimit: 1000000,
    //     to: null,
    //     value: 0,
    //     data: "0x608060405234801561001057600080fd5b5061076d806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063471f7cdf1461005c5780636057361d1461007a5780636f760f41146100965780638bab8dd5146100b25780639e7a13ad146100e2575b600080fd5b610064610113565b6040516100719190610359565b60405180910390f35b610094600480360381019061008f91906103b4565b610119565b005b6100b060048036038101906100ab9190610527565b610123565b005b6100cc60048036038101906100c79190610583565b6101b3565b6040516100d99190610359565b60405180910390f35b6100fc60048036038101906100f791906103b4565b6101e1565b60405161010a929190610654565b60405180910390f35b60005481565b8060008190555050565b6001604051806040016040528083815260200184815250908060018154018082558091505060019003906000526020600020906002020160009091909190915060008201518160000155602082015181600101908051906020019061018992919061029d565b5050508060028360405161019d91906106c0565b9081526020016040518091039020819055505050565b6002818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b600181815481106101f157600080fd5b906000526020600020906002020160009150905080600001549080600101805461021a90610706565b80601f016020809104026020016040519081016040528092919081815260200182805461024690610706565b80156102935780601f1061026857610100808354040283529160200191610293565b820191906000526020600020905b81548152906001019060200180831161027657829003601f168201915b5050505050905082565b8280546102a990610706565b90600052602060002090601f0160209004810192826102cb5760008555610312565b82601f106102e457805160ff1916838001178555610312565b82800160010185558215610312579182015b828111156103115782518255916020019190600101906102f6565b5b50905061031f9190610323565b5090565b5b8082111561033c576000816000905550600101610324565b5090565b6000819050919050565b61035381610340565b82525050565b600060208201905061036e600083018461034a565b92915050565b6000604051905090565b600080fd5b600080fd5b61039181610340565b811461039c57600080fd5b50565b6000813590506103ae81610388565b92915050565b6000602082840312156103ca576103c961037e565b5b60006103d88482850161039f565b91505092915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b610434826103eb565b810181811067ffffffffffffffff82111715610453576104526103fc565b5b80604052505050565b6000610466610374565b9050610472828261042b565b919050565b600067ffffffffffffffff821115610492576104916103fc565b5b61049b826103eb565b9050602081019050919050565b82818337600083830152505050565b60006104ca6104c584610477565b61045c565b9050828152602081018484840111156104e6576104e56103e6565b5b6104f18482856104a8565b509392505050565b600082601f83011261050e5761050d6103e1565b5b813561051e8482602086016104b7565b91505092915050565b6000806040838503121561053e5761053d61037e565b5b600083013567ffffffffffffffff81111561055c5761055b610383565b5b610568858286016104f9565b92505060206105798582860161039f565b9150509250929050565b6000602082840312156105995761059861037e565b5b600082013567ffffffffffffffff8111156105b7576105b6610383565b5b6105c3848285016104f9565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156106065780820151818401526020810190506105eb565b83811115610615576000848401525b50505050565b6000610626826105cc565b61063081856105d7565b93506106408185602086016105e8565b610649816103eb565b840191505092915050565b6000604082019050610669600083018561034a565b818103602083015261067b818461061b565b90509392505050565b600081905092915050565b600061069a826105cc565b6106a48185610684565b93506106b48185602086016105e8565b80840191505092915050565b60006106cc828461068f565b915081905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061071e57607f821691505b602082108103610731576107306106d7565b5b5091905056fea2646970667358221220c18340d7acf38794481103c6a87284bacbb63bff604eb16e92e6c7946bf93a9564736f6c634300080e0033",
    //     chainId: 1337,
    //   };

    //techinqually at this point we only signed the transaction
    //const signedTxResponse = await wallet.signTransaction(tx);

    //this would be siging and sending transaction at once
    // const sentTxResponse = await wallet.sendTransaction(tx);
    //we wanna wait till one block is created to check response
    // await sentTxResponse.wait(1);
    // console.log(sentTxResponse);

    //to upload contract we need abi and binary
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
