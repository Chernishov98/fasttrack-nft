const Web3 = require('web3');
const artifact = require('../build/contracts/CATS.json');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");

const mnemonic = fs.readFileSync("../mnemonic", "utf8").trim();
const url_rpc = 'https://matic-mumbai.chainstacklabs.com';
const address = '0x1e393a6eAB26378B0BD70A2c39533cE945Fa81a1';
const address_contract = '0xcDB335009a74C1a7245C6326478Ae8A0D3d987b1';
const tokenId = '0';

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

    console.log('Get metadata')
    let promise = await contract.methods.tokenURI(tokenId).call({
        from: address,
    });

    console.log(promise)

    process.exit(0)
}

handle();
