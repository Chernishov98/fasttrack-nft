const Web3 = require('web3');
const artifact = require('../build/contracts/CATS.json');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");

const mnemonic = fs.readFileSync("../mnemonic", "utf8").trim();
const url_rpc = 'https://matic-mumbai.chainstacklabs.com';
const address = '0x1e393a6eAB26378B0BD70A2c39533cE945Fa81a1';
const address_contract = '0xcDB335009a74C1a7245C6326478Ae8A0D3d987b1';

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

    console.log('Get tokens')
    let result = await contract.getPastEvents('Transfer', {
        filter: {
            from: '0x0000000000000000000000000000000000000000'
        },
        fromBlock: 26256916,
        toBlock: 'latest'
    });

    for (let event of result)
    {
        console.log(`Token: ${event.returnValues.tokenId}`)
    }

    process.exit(0)
}

handle();
