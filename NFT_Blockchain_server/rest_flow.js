const express = require('express');
const Joi = require('joi'); //used for validation
var exec = require('child_process').exec, child;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/imgs', express.static('imgs'));
//app.use('/videos', express.static('imgs'));

//const routes = require('./routes')(app);
const cors = require('cors');
app.use(cors());
const fs =require('fs');
let bodyParser = require('body-parser');
let multer = require('multer');
let upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sqlite3 = require('sqlite3').verbose();
var dataAllAsset = [];
const db = new sqlite3.Database('./data/users.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the users.db database.');
});
db.serialize(() => {
    // 1rst operation (run create table statement)
    db.run('CREATE TABLE IF NOT EXISTS users(inNFTId PRIMARY KEY,insUserName text, insUserAccount integer, inRewardId text,  inAsset text)', (err) => {
        if (err) {
            console.log("Error in creating database table"+err);
            throw err;
        }
    })
    });
//READ Request Handlers
app.get('/', (req, res) => {
res.send("Welcome to testing blockchain API's");
});



app.post('/api/createUserAccount',(req,res) =>{
    console.log('creating the user')
    console.log("Account username for  JSON update :-"+(req.body.userName).split(1,-1))
    var assmbleComand = 'flow keys generate';
	child = exec(assmbleComand,
	function (error, stdout, stderr) {		
	retStdOut = stdout;		
	if(error){
		console.log('flow keys generate  exec error: ' + error);
		}
		else
        {
			//console.log('user Account creation success\n'+stdout);
            userPrivateKey=stdout.substr(325,64);
            console.log("userPrivate Key is:-"+userPrivateKey);
            userPublicKey=stdout.substr(404,128)
            let PublicKeyCmd = "flow accounts create --key "+userPublicKey;
            //console.log("PublicKeyCmd:-"+PublicKeyCmd)
            console.log("usePublickey--"+userPublicKey)

            //Adding the public key to account
            var pubKeyRegister = PublicKeyCmd;
            child = exec(pubKeyRegister,
            function (error, stdout, stderr)
            {		
                retStdOut = stdout;		
                if(error){
                console.log('flow accounts create' + error);
                }
                else
                {
                    //console.log("Registering the public key "+JSON.stringify(stdout));
                            //console.log("User address is >"+stdout)
                            index  = stdout.indexOf('Address'),
                            strOut = stdout.substr(index);
                            StartIndex = strOut.indexOf('x');
                            //console.log("StartIndex"+StartIndex)
                            StopIndex =  /*strOut.indexOf('Balance')*/ StartIndex+17;
                            accAddress=strOut.substring(StartIndex+1,StopIndex);
                            console.log("user address  :-"+accAddress)

                            //open the JSON file and update the new user
                            const flow_json = require("./flow");
                            console.log("parameters to update")
                            var username =req.body.userName
                            // var userDetails;
                            console.log("username :-"+req.body.userName,"\t private-key:-"+userPrivateKey,"\t Account-Address"+accAddress);
                            console.log(flow_json.accounts)  // we have to push the new account inside flow_json.accounts
                           //var newUserAccount ={[username]:{address:accAddress,keys:userPrivateKey}}
                            console.log(flow_json.accounts)
                            // var obj = JSON.parse(flow_json.accounts);
                            // obj.username={address:accAddress,keys:userPublicKey}
                            //console.log(newUserAccount)
                            //jsonStr = JSON.stringify(obj);
  
                            // Storing the JSON format data in myObject
                            var myObject = flow_json;
                            //var myObject = JSON.parse(data);
                            // Adding the new data to our object
                            myObject["accounts"][username] = {address:accAddress,keys:userPrivateKey};
                            console.log(myObject)
                            // Writing to our JSON file
                            var newData2 = JSON.stringify(myObject);
                            fs.writeFile("flow.json", newData2, (err) => {
                            // Error checking
                            if (err) throw err;
                            console.log("New data added");
                            usernameCmd = username.split(1,-1);
                            var rewardSetupCmd = `flow transactions send ./transactions/rewards/setup_account.cdc --signer ${usernameCmd}`;
	                        var exec = require('child_process').exec, child;
	                        child = exec(rewardSetupCmd,
	                        function (error, stdout, stderr) {		
	                        retStdOut = stdout;		
                                if(error){
                                    console.log('Issue in flow transactions send ./transactions/rewards/setup_account.cdc : ' + error);
                                }
                                else{
                                        console.log('flow transactions send ./transactions/rewards/setup_account.cdc done');
                                        
                                        var fusdCmd = `flow transactions send ./transactions/fusd/setup_account.cdc --signer ${usernameCmd}`;
                                        var exec = require('child_process').exec, child;
                                        child = exec(fusdCmd,
                                        function (error, stdout, stderr) {		
                                        retStdOut = stdout;		
                                        if(error){
                                            console.log('Issue in flow transactions send ./transactions/fusd/setup_account.cdc : ' + error);
                                            }
                                            else{
                                                console.log('flow transactions send ./transactions/rewards/setup_account.cdc done');
                                                
                                                var marketSetupCmd = `flow transactions send ./transactions/marketplace/setup_account.cdc --signer ${usernameCmd}`;
	                                            var exec = require('child_process').exec, child;
	                                            child = exec(marketSetupCmd,
	                                            function (error, stdout, stderr) {		
	                                                retStdOut = stdout;		
	                                                if(error){
		                                            console.log('Issue in getting the marketplace data for the user : ' + error);
		                                            }
		                                            else{
			                                        console.log('flow transactions send ./transactions/marketplace/setup_account.cdc done');
                                                    //TODO add the user account
                                                    var addBalanceCmd = `flow transactions send ./transactions/fusd/mint_tokens.cdc --arg Address:${accAddress} --arg UFix64:10001.0`;
                                                    var exec = require('child_process').exec, child;
                                                    child = exec(addBalanceCmd,
                                                    function (error, stdout, stderr) {		
                                                    retStdOut = stdout;		
                                                    if(error){
                                                        console.log('Issue in adding balance in new user Account : ' + error);
                                                        }
                                                        else{
                                                            console.log('Balance added to user account');
                                                        }	
                                                    });


		                                            }	
	                                            });
                                                
                                            }	
                                        });
                                        

                                    }	
	                        });

                            res.send("New User added")
                            });


                }	
            });

             
		}	
	});


    
})
 
app.get('/api/listall', (req, res) => {

    console.log("get listAll:-getting the asset data from Blockchain")
    var dataAllAsset = [];
    var TotalNFT =0;
    var SignalNFT =0;
    // 1. read the flow.json top get all users
    const flow_json = require("./flow");
    //console.log(flow_json);
    const accounts  = flow_json.accounts
    console.log(accounts);
    let count = Object.keys(accounts).length
    const keys = Object.keys(accounts);
    for (let i = 0; i < keys.length; i++) //check all the accounts from flow.json
    //
    {
        const key = keys[i];
        // var account_address = accounts[key].address
        if (key.match("emulator-account")  || key.match("testnet-deployer")|| key.match("testnet-user") || key.match("buyer"))
        {
            console.log(" Not sellers account -hence ignore it")
        }
        else
        {
            //log the sellers account.
            console.log(key,accounts[key].address);
            // get the sellers marketplace nft.
            var MarketPlaceCmd ="flow scripts execute ./scripts/marketplace/get_collection_ids.cdc --arg Address:" +accounts[key].address  ;
            child = exec(MarketPlaceCmd, function (error, stdout, stderr) 
            {				
            if(error){
                console.log('Issue in getting items for sale from marketplace: ' + error);
                }
                else
                {   console.log(stdout);
                    index  = stdout.indexOf('Result'),
                    strOut = stdout.substr(index);
                    tokenStartIndex = strOut.indexOf('[');
                    tokenStopIndex =  strOut.indexOf(']')
                    token=strOut.substring(tokenStartIndex+1,tokenStopIndex);
                    if(token.length!=0)
                    {

                            var empty=""
                            //here run the command and get response for RewardId and userasset and update
                            account_address =(accounts[key].address).slice(2);
                            console.log("Account address for flow"+account_address)
                            console.log("token for flow command"+token)
                            var tokenID = token;
                            if(token.includes(","))
                            {
                                var result=token.split(',').map(function(number)
                                {
                                    console.log("NFTID seperated from the string"+number)
                                    return parseInt(number);
                                });
                                console.log("Token"+JSON.stringify(result));

                                tokenID = result;   
                            }

                            TotalNFT = TotalNFT+tokenID.length
                            console.log("Total NFT:"+TotalNFT);
                        
                            //console.log("getting the REWARDID and metadata for NFTID"+NFTIDloc)
                            function waitforAssetEmit(i) {
                                //console.log("Emitting  the listall call")
                                //client.emit('FlowAssetData',{data:dataAllAsset})
                             console.log("waitforAssetEmit =entered")
                            var NFTIDloc= tokenID[i];
                            console.log(tokenID[i])
                            var getRewardIdCmd = 'flow scripts execute ./scripts/rewards/get_nft_rewardID.cdc '+account_address+' '+tokenID[i];
                            console.log(getRewardIdCmd)
                            var exec = require('child_process').exec, child;
                            child = exec(getRewardIdCmd,
                            function (error, stdout, stderr)
                            {				
                                if(error)
                                {
                                    console.log(getRewardIdCmd)
                                    console.log('Issue in getting the REWARDID data for the user : ' + error);
                                }
                                else
                                {

                                    //TODO resolve Issue in updating all the asset 
                                    //currently the code is working for 1 NFT per asset
                                    console.log('updating the db for the token/NFT ID'+NFTIDloc);
                                    var REWARDID;
                                    var numb = stdout.match(/\d/g);
                                    numb = parseInt(numb.join(""));
                                    console.log("Data to be updated in the database"+numb+'\t'+accounts[key].address+'\t'+NFTIDloc)
                                    db.each(`UPDATE users SET inRewardId = ${numb} WHERE inNFTId = ${tokenID[i]}`, function(err, row) {
                                        console.log("updating the reward id ")
                                    });
                                    REWARDID =numb;
                                    console.log("REWARDID local"+REWARDID)

                                    //we got the NFT ID now get the aset data and update the db
                                        var getmetadataCmd = 'flow scripts execute ./scripts/rewards/get_metadata.cdc '+account_address+' '+NFTIDloc;
                                        console.log(getmetadataCmd)
                                        var exec = require('child_process').exec, child;
                                        child = exec(getmetadataCmd,
                                        function (error, stdout, stderr)
                                        {		
                                            retStdOut = stdout;		
                                            if(error){
                                                console.log('Issue in getting the asset data: ' + error);
                                                }
                                                else
                                                {   
                                                    //var time_interval = 2000*i; 
                                                    //setTimeout(() => {console.log("never happens")
                                                    index  = stdout.indexOf('Result'),
                                                    strOut = stdout.substr(index);
                                                    //tokenStartIndex = strOut.indexOf('"');
                                                    //tokenStopIndex =  strOut.indexOf('"')
                                                    var tokenStartIndex = strOut.indexOf('"');           // 3
                                                    var tokenStopIndex = strOut.indexOf('"', tokenStartIndex + 1);
                                                    Assetmetadata=strOut.substring(tokenStartIndex+1,tokenStopIndex);
                                                    console.log("Assetmetadata :- "+Assetmetadata+"  rewardID:-  "+REWARDID)

                                                    //const str = 'movie-2#50#10#//backendserver/storage/movie3.jpg';
                                                    const [Ctitle,Ccost,Cduration,Cthumbnail,Cgenre,Ccast,Cratings] = Assetmetadata.split('#');

                                                    console.log("Movie Title: "+Ctitle); 
                                                    console.log("Cost :"+Ccost)
                                                    console.log("Duration"+Cduration); 
                                                    console.log("thumbnail"+Cthumbnail)
                                                    console.log("genre"+Cgenre)
                                                    console.log("cast"+Ccast)
                                                    console.log("ratings"+Cratings)
                                                    //TODOget the Asset meta data store it in JSON array and send back to main server
                                                    var Asset = {title: Ctitle, cost: parseInt(Ccost), duration: parseInt(Cduration), thumbnail: Cthumbnail,genre:Cgenre,cast:Ccast,ratings:parseInt(Cratings), user: key, nftendpoint : NFTIDloc};
                                                    
                                                    db.run(`INSERT OR REPLACE INTO users(insUserName,insUserAccount,inRewardId,inNFTId,inAsset)
                                                    VALUES("${key}","${accounts[key].address}","${REWARDID}","${NFTIDloc}","${Assetmetadata}")`, (err) => {
                                                    if (err) 
                                                    {
                                                        console.log(err);
                                                        throw err;
                                                    }
                                                    });
                                                    //res.send(feed)  //sending the data 1 at a time  
                                                //}, time_interval);   
                                                 dataAllAsset.push(Asset);
                                                 SignalNFT =SignalNFT +1;
                                                 {
                                                    console.log(TotalNFT,SignalNFT);
                                                    if(TotalNFT == SignalNFT)
                                                    {
                                                        console.log("listall data sent")
                                                        res.send(dataAllAsset);
                                                      //  break;
                                                    }
                                                    
                                                    }
                                                }	
                                        });
                                    //then insert the data in the DB

                                }	
                            });
                            
                            }
                            for (var i = 0; i < tokenID.length; i++) 
                            {                                
                                waitforAssetEmit(i);
                            } //multi NFT 
                          // console.log("Asset in Marketplace\n"+JSON.stringify(AssetinMarketplace))
                        //} 
                       // while (true)
                        
                        
                    }
                    else
                    { 
                        if( (TotalNFT == 0) && (i == keys.length))
                            res.send("No NFT Items for Sale");
                    } 
                
                }

            });            
        }
        
    }
   
});

app.post('/api/buyAsset', upload.array(), (req, res) => {

    console.log("receiving parameters for buying Item");
    var nftID = JSON.stringify(req.body.nftID);
    var sellerUserName = (JSON.stringify(req.body.sellerUserName)).slice(1,-1);
    console.log("sellerUserName:-    "+sellerUserName)
    var buyUserName = (JSON.stringify(req.body.buyUserName)).slice(1,-1)
    console.log(nftID+"\t"+buyUserName)

    db.all("SELECT insUserAccount, inAsset FROM users where inNFTId=$nftid", {
        $nftid: nftID
    },
    (error, rows) => {rows.forEach((row) => {

        var sellerAccAddress =row.insUserAccount;
        console.log(sellerAccAddress)
        var assetdata =row.inAsset
        console.log(assetdata)
        const [title,cost,duration,thumbnail] = assetdata.split('#');
        console.log("Movie Title: "+title); 
        console.log("Cost :"+cost)
        console.log("Duration"+duration); 
        console.log("thumbnail"+thumbnail)
        console.log(sellerAccAddress);
        console.log("sellerAccAddress   :-"+sellerAccAddress)
        var buyAssetCmd = `flow transactions send ./transactions/marketplace/buy_market_item.cdc --arg UInt64:${nftID} --arg Address:${sellerAccAddress} --signer ${buyUserName}`;
        child = exec(buyAssetCmd,
        function (error, stdout, stderr) {		
        retStdOut = stdout;		
        if(error){
            console.log('Issue in purchasing the Asset : ' + error);
            }
            else{
                //console.log('Item purchased');
                var movieURL="http://10.221.40.223:9999/imgs/"+title+".mp4"
                console.log(stdout)
                res.send(movieURL);
            }	
        }); 

    })
});
});




 
//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 9999;
app.listen(port, () => console.log(`Listening on port ${port}..`));