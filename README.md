# Welcome to Paper's Embedded Wallet Service (EWS) Alpha Sample App

**Note: This is private alpha. To get full access to this repository and product, you will need email Harpriya (harpriya@withpaper.com) for waitlist access.**

Feel free to play around with a live deployment of this sample app [here](https://wallet-managed-auth-react-demo-mug0.zeet-paper.zeet.app)
Find the docs with more information [here](https://ews.withpaper.com/docs)

To run this app locally, clone this repo, run `npm install`, and `npm start`
The rendered page should look like the following image:

<img width="351" alt="image" src="https://user-images.githubusercontent.com/26000274/207985092-74570c5d-3549-4619-bf4a-ceb0d20648a6.png">

Logging in with email address is using the `<Login>` component and sends a unique 6-digit code from Paper to the email given in the input. Upon verification, the user is then prompted to enter a security password and download an 8-word secret recovery phrase to reset the password in the event that the password is lost or forgotten. The user will be prompted to enter this password every time they log in using a new device.

After the initial setup, the following page will be rendered. On this page, you can sign a message, sign a transaction, call the custom gasless contract method (which airdrops an NFT to the wallet), and log out of your wallet.

<img width="775" alt="image" src="https://user-images.githubusercontent.com/26000274/207985008-9ca906db-de3a-4005-875b-1de97bb0f8ed.png">
