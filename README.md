```
██████╗  ██████╗ ███████╗████████╗███████╗██████╗
██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗
██████╔╝██║   ██║███████╗   ██║   █████╗  ██████╔╝
██╔═══╝ ██║   ██║╚════██║   ██║   ██╔══╝  ██╔══██╗
██║     ╚██████╔╝███████║   ██║   ███████╗██║  ██║
╚═╝      ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
    ___              
   /   |  ____  ____ 
  / /| | / __ \/ __ \
 / ___ |/ /_/ / /_/ /
/_/  |_/ .___/ .___/ 
      /_/   /_/      
```

An app for a ridiculously simple general purpose social media smart contract.
It takes a string as a parameter and emits that string, along with msg.sender, as an event. That's it.
The app is a simple UI to create and wrap the content in a PIP-friendly format parseable by our subgraphs.

The Poster smart contract can be found [here](https://github.com/onPoster/contract).

# Architecture

`Poster App` is structured by `4` main components:

1. `Poster` - A EVM-compatible append-only content smart contract. See [here](https://github.com/onPoster/contract) for more information.
2. `PIPs` - Poster Improvement Proposals (or PIPs), which define the schema and format of content that will be parsed in our [TheGraph](https://thegraph.com/) subgraph. All PIPs can be found [here](https://github.com/onPoster/PIP), and you can see the original PIP (PIP-01 or ERC-3722) [here](https://ethereum-magicians.org/t/erc-3722-poster-a-ridiculously-simple-general-purpose-social-media-smart-contract/6751)
3. `Subgraph` - An indexer powered by TheGraph protocol able to organize and parse posted contents sent to the Poster contract into readable and structured messages. See [here](https://github.com/onPoster/subgraph) for more information.
4. `App` - A sample UI to showcase Poster via a web3 provider like Metamask. See [here](https://github.com/onPoster/app) for more information.

# Apps

`Poster App` is one of other existing apps within the `Poster` ecosystem:

* [Postum](https://github.com/onPoster/postum). A forum-like alternative to Discourse powered by `Poster`.
* [Proxy Poster](https://github.com/onPoster/proxy). A meta-transaction layer to allow gas-less posts on top of `Poster` using `EIP-2771`.

# Getting started

1. Start a node and deploy `Poster` from [contracts repository](https://github.com/onPoster/contract) by running `yarn run node && yarn deploy`
2. Start a graph node from the [subgraph repository](https://github.com/onPoster/subgraph) by running `docker-compose up -d`
3. To deploy the subgraph to the graph node, run `NETWORK=localhost npm run define`, then `npm run codegen`, `npm run build`, `npm run create-local`, and finally, `npm run deploy-local`
4. Start the app ui frmo the [apps repository](https://github.com/onPoster/app) by running `yarn dev:local`

---

`Made with ❤️ by jjperezaguinaga.eth`