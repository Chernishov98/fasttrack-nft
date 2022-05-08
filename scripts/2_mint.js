const Web3 = require('web3');
const artifact = require('../build/contracts/CATS.json');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");

const mnemonic = fs.readFileSync("../mnemonic", "utf8").trim();
const url_rpc = 'https://matic-mumbai.chainstacklabs.com';
const address = '0x1e393a6eAB26378B0BD70A2c39533cE945Fa81a1';
const address_contract = '0x06Ef7bC4181f6823Aa18Da60e0028922aA14388b';
const uri = 'https://ipfs.io/ipfs/bafybeie35oy3nopzjjismauabmazij7bebwzioiwrvjj33kyervsgwjlra/1.json';

async function handle() {
    const provider = new HDWalletProvider({
            mnemonic: {
                phrase: mnemonic
            },
            providerOrUrl: url_rpc
        }
    );
    const web3 = await new Web3(provider)
    const contract = new web3.eth.Contract(artifact.abi, address_contract);

    console.log('Start minted token')
    let promise = contract.methods.safeMint(address, uri).send({
        from: address,
        gasPrice: '30000000000'
    }).on('transactionHash', (hash) => {
        console.log(`Transaction hash: ${hash}`)
    });

    let result = await promise;

    console.log(`Token is minted`)
    process.exit(0)
}

handle();
