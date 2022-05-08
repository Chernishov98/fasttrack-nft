const Web3 = require('web3');
const artifact = require('../build/contracts/CATS.json');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");

const mnemonic = fs.readFileSync("../mnemonic", "utf8").trim();
const url_rpc = 'https://matic-mumbai.chainstacklabs.com';
const address = '0x1e393a6eAB26378B0BD70A2c39533cE945Fa81a1';

async function handle() {
    const provider = new HDWalletProvider({
            mnemonic: {
                phrase: mnemonic
            },
            providerOrUrl: url_rpc
        }
    );
    const web3 = await new Web3(provider)
    const contract = new web3.eth.Contract(artifact.abi);

    console.log('Start deploy contract')
    let promise = contract.deploy({data: artifact.bytecode}).send({
        // value: 0,
        // nonce: 0,
        // data: '',
        // gas: 0,
        gasPrice: '30000000000',
        from: address
    }).on('transactionHash', (hash) => {
        console.log(`Transaction hash: ${hash}`)
    });

    let result = await promise;

    console.log(`Contract deployed: ${result.options.address}`)
    process.exit(0)
}

handle();
