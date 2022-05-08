<template>
  <main class="container">
    <div>
      <button v-if="!isLogin" @click="login" class="btn btn-primary d-block my-2">Login</button>
      <button v-if="isLogin" @click="mint" class="btn btn-primary d-block my-2">Mint</button>
      <button v-if="isLogin" @click="getTokens" class="btn btn-primary d-block my-2">Get tokens</button>
    </div>
    <div v-for="token of tokens">
      <hr>
      <div>Name: {{ token.name }}</div>
      <div>Description: {{ token.description }}</div>
      <div>
        <div>Image:</div>
        <img :src="token.image" style="height: 200px; width: 200px">
      </div>
    </div>
  </main>
</template>

<script>
import artifact from './CATS.json';
import Web3 from 'web3';
import axios from 'axios';

export default {
  name: 'App',

  data: function () {
    return {
      isLogin: false,
      address_contract: '0x06Ef7bC4181f6823Aa18Da60e0028922aA14388b',
      tokens_uri: 'https://ipfs.io/ipfs/bafybeie35oy3nopzjjismauabmazij7bebwzioiwrvjj33kyervsgwjlra/1.json',
      tokens: []
    }
  },
  methods: {
    async login() {
      ethereum.on('disconnect', () => {
        window.location.reload();
      });

      return await this._init();
    },
    async mint() {
      const contract = new web3.eth.Contract(artifact.abi, this.address_contract);
      const address = window.web3.currentProvider.selectedAddress;

      let promise = contract.methods.safeMint(address, this.tokens_uri).send({
        from: address,
        gasPrice: '30000000000'
      }).on('transactionHash', (hash) => {
        console.log(`Transaction hash: ${hash}`)
      });

      await promise;
      await this.getTokens();
    },

    async getTokens() {
      await this.login();

      console.log('Start get tokens')
      const contract = new web3.eth.Contract(artifact.abi, this.address_contract);

      let result = await contract.getPastEvents('Transfer', {
        filter: {
          from: '0x0000000000000000000000000000000000000000'
        },
        fromBlock: 26256916,
        toBlock: 'latest'
      });

      let tokens = [];

      console.log('Get metadata')
      for (let event of result)
      {
        let uri = await contract.methods.tokenURI(event.returnValues.tokenId).call({});
        let token = (await axios.get(uri)).data;
        tokens.push(token)
      }

      console.log('Finish get tokens')
      this.tokens = tokens;
    },

    async _init() {
      var w3 = await this._web3();
      var net = await this._network();

      if (w3 && net) {
        this.isLogin = true;
        return window.web3.currentProvider.selectedAddress;
      } else {
        throw new Error('Error initialize integration');
      }
    },

    async _web3() {
      try {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          await ethereum.enable();
          return true;
        } else if (window.web3) {
          window.web3 = new Web3(web3.currentProvider);
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },

    async _network() {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: 'POLYGON (MUMBAI)',
              chainId: "0x13881",
              blockExplorerUrls: ["https://mumbai.polygonscan.com"],
              rpcUrls: [
                "https://matic-mumbai.chainstacklabs.com"
              ],
            },
          ],
        });

        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId: "0x13881"}],
        });
      } catch (switchError) {
        return false;
      }

      return true;
    },
  },
}
</script>
