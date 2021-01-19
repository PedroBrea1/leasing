import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: "", web3: null, accounts: null, contract: null, newValue:"" };

  componentDidMount = async () => {
    try {

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      // Get network provider and web3 instance.
      const web3 = await getWeb3(); 

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
       deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  //2 functions to change the data from a smart contract
  handleChange(event){
    this.setState({newValue: event.target.value});
  }

  async handleSubmit(event){
    event.preventDefault();

    const { accounts, contract } = this.state;
    await contract.methods.set(this.state.newValue).send({ from: accounts[0] });
    const response = await contract.methods.get().call();
    this.setState({storageValue: response});

  }

  

  runExample = async () => {
    const { contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Welcome to this dApp</h1>
        <div>Pedro likes {this.state.storageValue}</div>
        <form onSubmit = {this.handleSubmit}>
          <input type="text" value = {this.state.newValue} onChange = {this.handleChange.bind(this)}/>
          <input type = "submit" value = "Submit"/>
        </form>
      </div>
      
    );
  
  }

}

export default App;
