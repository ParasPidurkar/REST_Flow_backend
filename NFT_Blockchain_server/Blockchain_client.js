const { create } = require('domain')
const config = require('getconfig')
const users = require("./userdata");
const fs =require('fs');
const { spawn,exec } = require('child_process');
const io = require('socket.io-client');
const { syncBuiltinESMExports } = require('module');
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

let userallInfo =[];
let socketURL
if (config.server.secure) {
    socketURL = `http://${config.server.ip}:${config.server.port}`
    console.log
} else {
    socketURL = `http://${config.server.ip}:${config.server.port}`
}

console.log(`socketURL => ${socketURL}`);

var arr =[{ 
    "name": "seller-account", 
    "address":"01cf0e2f2f715450" 
  },
  {
     "name": "buyer-account",
     "address": "179b6b1cb6755e31"
  }];

const socketOptions = {
    transports: ['websocket'],
    'force new connection': true,
    secure: config.server.secure,

    query: {
        token: 'cf29386d4478b579d37db9d67ec3ae6694cfb00953446bcda4554870ec527df86425997ac98b6f8e526584a00b83a24177b1e43b6824e3c7fb78aa8a1b779304e69b4436d2a5d1dfb7dcc287b5de9e66e66a221aa70dc24516d123de52a929022347f3beee9a97a06668515bb6409a890c17754e397b620cd3b5c1a11100786bc5c2ca1c4f9e3f82a9490fa028fe1e1725bfde4a725e3dd32cd94abed48500e1eb6be50c2a6163918d538cc4ab02859b28ed36cb837cf7506b63b9513d9e40a2'
    }
}

//const client = io.connect(socketURL, socketOptions)

var client = io.connect(socketURL,{secure: true,"rejectUnauthorized": false});

client.on('connect', () => {
    console.log("Device connected ")
        // client.emit('register', config.myDeviceName, null)
    client.emit('joinFacenetDevice',{});
    client.emit('joinFacenetDeviceEnroll',{});

   // getStatusOfAllContainer();
})

client.on('disconnect', () => {
    console.log("Device disconnected ")
    client.emit('joinFacenetDevice',{});
})

client.on('CreateBlockChainAccount',function(userdata)
{
console.log("Account username for  JSON update "+userdata.data1)
console.log("\nCreateBlockChainAccount called");
var assmbleComand = 'flow keys generate';
	var exec = require('child_process').exec, child;
	child = exec(assmbleComand,
	function (error, stdout, stderr) {		
	retStdOut = stdout;		
	if(error){
		console.log('userAccount creation  exec error: ' + error);
		}
		else{
			console.log('user Account creation success\n'+stdout);
            userPrivateKey=stdout.substr(325,64);
            //console.log("userPrivate Key is--"+userPrivateKey);
            userPublicKey=stdout.substr(404,128)
            let PublicKeyCmd = "flow accounts create --key "+userPublicKey;
            console.log("PublicKeyCmd:-"+PublicKeyCmd)
            //console.log("usePublickey--"+userPublicKey)

            //Adding the public key to account
            var pubKeyRegister = PublicKeyCmd;
	var exec = require('child_process').exec, child;
	child = exec(pubKeyRegister,
	function (error, stdout, stderr) {		
	retStdOut = stdout;		
	if(error){
		console.log('Error in enrolling pub key ' + error);
		}
		else{
			//console.log("Registering the public key "+JSON.stringify(stdout));
            console.log("User address is ")
            console.log("user registration successful")
		}	
	});

            //public key adding end

            //client.emit('EnrolledAccountData',{data:stdout})  //sending the data back to server 
		}	
	});
   
});

//getting all the data from the blockchain to the main UI
client.on('listAll',function()
{
    console.log("get listAll:-getting the asset data from Blockchain")

    // 1. read the flow.json top get all users
    const flow_json = require("./flow");
    console.log(flow_json);
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
                {   
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
                        
                            //console.log("getting the REWARDID and metadata for NFTID"+NFTIDloc)
                            function waitforAssetEmit(i) {
                                //console.log("Emitting  the listall call")
                                //client.emit('FlowAssetData',{data:dataAllAsset})
                             console.log("waitforAssetEmit =entered")
                            var NFTIDloc= tokenID[i];
                            console.log("#####"+tokenID[i])
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
                                    console.log("Data to be updated in the database"+numb+'#'+accounts[key].address+'#'+NFTIDloc)
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
                                                    console.log("#"+Assetmetadata+"#"+REWARDID)

                                                    //const str = 'movie-2#50#10#//backendserver/storage/movie3.jpg';
                                                    const [first,second,third,fourth] = Assetmetadata.split('#');

                                                    console.log("Movie Title: "+first); 
                                                    console.log("Cost :"+second)
                                                    console.log("Duration"+third); 
                                                    console.log("thumbnail"+fourth)
                                                    //TODOget the Asset meta data store it in JSON array and send back to main server
                                                    var feed = {title: first, cost: second, duration: third, thumbnail: fourth, user: key, nftendpoint : NFTIDloc};

                                                    db.run(`INSERT OR REPLACE INTO users(insUserName,insUserAccount,inRewardId,inNFTId,inAsset)
                                                    VALUES("${key}","${accounts[key].address}","${REWARDID}","${NFTIDloc}","${Assetmetadata}")`, (err) => {
                                                    if (err) 
                                                    {
                                                        console.log(err);
                                                        throw err;
                                                    }
                                                    });
                                                    client.emit('FlowAssetData',{data:feed})  //sending the data 1 at a time  
                                                //}, time_interval);      
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
                    } 

                }

            });            
        }
        
    }
});




client.on('buyItem',function(data)
{
    console.log("receiving parameters for buying Item");
    var nftID = JSON.stringify(data.nftID);
    var buyAccAddress =JSON.stringify(data.buyAccAddress)
    var buyUserName = JSON.stringify(data.buyUserName)

    var buyAssetCmd = `flow transactions send ./transactions/marketplace/buy_market_item.cdc --arg UInt64:${nftID} --arg Address:${buyAccAddress} --signer ${buyUserName}`;
	var exec = require('child_process').exec, child;
	child = exec(,
	function (error, stdout, stderr) {		
	retStdOut = stdout;		
	if(error){
		console.log('Issue in getting the marketplace data for the user : ' + error);
		}
		else{
			console.log('Received the marketplace');
		}	
	}); 
    



});











/*
//getting all the data from the blockchain to the main UI
client.on('getAssetData',function(){
    console.log("get AssetData:-getting the asset data from Blockchain")
    var assetData = 'flow scripts execute ./scripts/rewards/get_all_rewards.cdc';
	var exec = require('child_process').exec, child;
	child = exec(assetData,
	function (error, stdout, stderr) {		
	retStdOut = stdout;		
	if(error){
		console.log('error in getting asset data: ' + error);
		}
		else{
			console.log('This is the Asset data \n'+stdout);
            //client.emit('FlowAssetData',{data:stdout})   //sending the data to the main server

            for (var i = 0; i < arr.length; i++){
                var obj = arr[i];
                for (var key in obj){
                  var value = obj[key];
                  //console.log("username " + key + " : account_address " + value);
                  //Able to iterate all the address in the blockchain network need to get the token from the marketplace for particular user
                  //market place data for each user 
                  var MarketPlaceCmd ="flow scripts execute ./scripts/marketplace/get_collection_ids.cdc --arg Address:"+value;
	var exec = require('child_process').exec, child;
	child = exec(MarketPlaceCmd,
	function (error, stdout, stderr) {				
	if(error){
		//console.log('Issue in getting the marketplace data for the user : ' + error);
		}
		else{
			//console.log('The user account '+value +"has"+stdout+"\n");
            index  = stdout.indexOf('Result'),
            //then get everything after the found index
            strOut = stdout.substr(index);
            tokenStartIndex = strOut.indexOf('[');
            tokenStopIndex =  strOut.indexOf(']')
            token=strOut.substring(tokenStartIndex+1,tokenStopIndex);
            console.log(token+"\n")
            //if the token string contains mutiple token then 
            if(token.includes(","))
            {
            var result=token.split(',').map(function(number){
              return parseInt(number);
            });
            console.log("Token"+JSON.stringify(result));
        }
            //console.log(strOut)
		}	
	});
                  //market place data end 


                }
              } 


		}	
	});  
});


client.on('updateImg',function(msg){
//fs.writeFile('/var/ai/enroll/enroll.txt', '', function(){console.log('we have logged out ')})
console.log('we have logged out ');
})


//TO-DO compare the images and send back the response 
client.on('Face-Register', function(msg) {
    console.log("call has been made to face register")
    console.log(" Facenet Register = " + JSON.stringify(msg.data));
    var img = JSON.stringify(msg.data);
    var pass =JSON.stringify(msg.data1)
    console.log("PassWord is "+pass)

    img = img.slice(1);
    img =img .slice(0,-1)
    //console.log("\n\n\nstoring this image URL"+img)
    var data = img.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer.from(data, 'base64');
    if (fs.existsSync('/var/log/face/face.jpg'))
    {
        fs.unlink('/var/log/face/face.jpg',(err) => {
            
            if (err) {
                throw err;
            }
            console.log("File has been deleted ");
            
             fs.writeFile('/var/log/face/face.jpg', buf, err =>{ 
            if (err)
                console.log(err);
            else{
                console.log("File is enrolled for matching.");     

                }
             });
        });
        
	//setTimeout(() => {
    console.log("this is the first message");
    console.log("Run the facedetect process");
    const match = spawn('./../../face_match/run.sh',[]);


                match.stdout.on('data',(data)=>{
                 console.log(`match op:  ${data}`); 
                console.log("USERID "+data);
                console.log("PASSWORD"+pass);
                fs.unlink('/var/ai/enroll/enroll.txt',(err) => {
            
                    if (err) {
                        throw err;
                    }
                    else{
                        console.log("enroll.txt file has been deleted ");
                    }
                
                  });
                 client.emit('FaceIddata',{data:data,data1:pass,req:msg.req,res:msg.res})
                 
               });
               match.stderr.on('data', (data) => {
                console.error(`match stderr: ${data}`);
        
                });
    
                match.on('close',(data)=>{
                    console.log("Processs end "+data);
                    console.log(`match op:  ${data}`) 
                      console.log("USERID "+data)
                      console.log("PASSWORD"+pass)
                      if (fs.existsSync('/var/ai/enroll/enroll.txt'))
                      {
                      fs.unlink('/var/ai/enroll/enroll.txt',(err) => {
                         
                         if (err) {
                             throw err;
                         }
                         else{
                             console.log("enroll.txt file has been deleted ");
                         }
                         
                         
                       });
                     } 

                    });
       // }, 1000);
    }
    else{console.log("face.jpg File does not exist");
    return;
    }
    
    
    });   

    
client.on('remove', message => {
    console.log(`removed : ${JSON.stringify(message)}`)
})

client.on('joined', message => {
    console.log(`joined : ${JSON.stringify(message)}`)
})

client.on('presence', message => {
    console.log(`presence :${JSON.stringify(message)}`)
})
//TAg
client.on('faceMatching', message => {
    console.log(`face matching  :${JSON.stringify(message)}`)
})



let val = null;

function DownloadContainer(message) {
    console.log("Url = " + message.payload.downloadInfo.url);
    var url = message.payload.downloadInfo.url;

    const { spawn } = require('child_process');

    const clean = spawn('../config/cleanOldContainer.sh', ["-d", message.payload.downloadInfo.url, "-n", message.payload.name, "-a", "linux32"]);


    clean.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        client.emit('update', {
            data: data,
            to: config.userName,
            from: config.deviceName
        })


    });

    clean.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        client.emit('update', {
            data: data,
            to: config.userName,
            from: config.deviceName
        })
    });

    clean.on('close', (code) => {
        console.log(`clean child process exited with code ${code}`);

        client.emit('update', {
            // data: data,
            to: config.userName,
            from: config.deviceName,
            type: "download",
            statusCode: 1,
            status: `clean child process exited with code ${code}`,
            description: "Image clean successful."

        })
        if (code == 0) {
            const wget = spawn('wget', [url]);
            wget.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);

            });

            wget.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);

                client.emit('update', {
                    data: data.toString(),
                    to: config.userName,
                    from: config.deviceName,
                    type: "download",
                    statusCode: 1.5,
                    status: `Connected and downloading`,
                    description: "Image is getting downloaded."
                })
            });

            wget.on('close', (code) => {

                console.log(`wget child process exited with code ${code}`);
                if (code == 0) {
                    client.emit('update', {
                        // data: data,
                        to: config.userName,
                        from: config.deviceName,
                        type: "download",
                        statusCode: 2,
                        status: `wget child process exited with code ${code}`,
                        description: "Image successfully downloaded."
                    })


                    const create = spawn('../config/createContainer.sh', ["-d", message.payload.downloadInfo.url, "-n", message.payload.name, "-a", "linux32", "-t", message.payload.device]);

                    create.stdout.on('data', (data) => {
                        // console.log(`stdout: ${data}`);
                    });

                    create.stderr.on('data', (data) => {
                        console.error(`stderr: ${data}`);
                        client.emit('update', {
                            data: data,
                            type: "download",
                            to: config.userName,
                            from: config.deviceName
                        })
                    });

                    create.on('close', (code) => {
                        console.log(`create child process exited with code ${code}`);





                        if (code == 0) {

                            client.emit('update', {
                                // data: data,
                                to: config.userName,
                                from: config.deviceName,
                                type: "download",
                                statusCode: 3,
                                status: `create child process exited with code ${code}`,
                                description: "Image created and ready to configure."
                            })


                            const preStartConfig = spawn(`../config/${message.payload.device}/preStartConfig.sh`, []);

                            preStartConfig.stdout.on('data', (data) => {
                                // console.log(`stdout: ${data}`);
                            });

                            preStartConfig.stderr.on('data', (data) => {
                                console.error(`stderr: ${data}`);
                                client.emit('update', {
                                    data: data,
                                    type: "download",
                                    to: config.userName,
                                    from: config.deviceName
                                })
                            });

                            preStartConfig.on('close', (code) => {

                                if (code == 0) {
                                    console.log(`preStartConfig child process exited with code ${code}`);
                                    client.emit('update', {
                                        // data: data,
                                        to: config.userName,
                                        from: config.deviceName,
                                        type: "download",
                                        statusCode: 3.5,
                                        status: `preStartConfig child process exited with code ${code}`,
                                        description: "Image created and pre start configuration done; ready to start."
                                    })
                                    client.emit('createdContainer', {
                                        to: config.userName,
                                        from: config.deviceName,
                                        returnValue: true,
                                        containerName: message.payload.name,
                                        device: message.payload.device,
                                        status: `create child process exited with code ${code}`,
                                        description: "Image created and ready to start."
                                    })
                                } else {
                                    client.emit('update', {
                                        // data: data,
                                        to: config.userName,
                                        from: config.deviceName,
                                        type: "download",
                                        statusCode: -3.5,
                                        status: `preStartConfig child process exited with code ${code}`,
                                        description: "Image created and pre start configuration done; ready to start."
                                    })
                                }
                            });

                        } else {
                            client.emit('update', {
                                // data: data,
                                to: config.userName,
                                from: config.deviceName,
                                type: "download",
                                statusCode: -3,
                                status: `create child process exited with code ${code}`,
                                description: "Image created and ready to configure."
                            })
                        }

                    });
                } else {
                    client.emit('update', {
                        // data: data,
                        to: config.userName,
                        from: config.deviceName,
                        type: "download",
                        statusCode: -2,
                        status: `wget child process exited with code ${code}`,
                        description: "Image successfully downloaded."
                    })
                }
            });
        }

    });

}

function ContainerOperator(message) {
    console.log(message.payload.name, message.payload.command);
    var cmd = '/usr/sbin/kettle -n ' + message.payload.name + ' -c ' + message.payload.command;
    console.log(cmd);
    require('child_process').exec(cmd, function(err, stdout, stderr) {
        if (err) {
            console.log('exec error: ' + error);
        }
    });
}


function getContainerList(cb) {

    const { spawn } = require('child_process');
    const lxcLs = spawn('lxc-ls', []);


    lxcLs.stdout.on('data', (data) => {
        var devLits = []
            // console.log(`stdout: ${data}`);
        data = data.toString('utf8');
        data = JSON.stringify(data);
        data = data.replace(/"| /g, "");
        data = data.split("\\n");
        for (var i = 0; i < data.length - 1; ++i) {
            devLits.push(data[i])
        }
        cb(devLits)
    });

    lxcLs.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);

    });

    lxcLs.on('close', (code) => {
        console.log(`lxcLs child process exited with code ${code}`);

    });

};

function getContainerStatus(contName, cb) {

    const { spawn } = require('child_process');
    const lxcInfo = spawn('lxc-info', ["-n", contName]);

    var info = ""
    lxcInfo.stdout.on('data', (data) => {
        // console.log(`lxcInfo stdout: ${data}`);
        data = data.toString('utf8');
        // console.log("data1 type = " + typeof(data))
        info = info + data;
    });

    lxcInfo.stderr.on('data', (data) => {
        console.error(`lxcInfo stderr: ${data}`);

    });

    lxcInfo.on('close', (code) => {
        console.log(`lxcInfo child process exited with code ${code}`);
        var ans = {}
        info = info.replace(/"| /g, "");
        info = info.split("\n");
        console.log(".......................................")
        console.log(info)
        console.log(".......................................")

        for (var i = 0; i < info.length - 1; ++i) {
            var temp = info[i].split(":");
            ans[temp[0]] = temp[1];
        }

        cb(contName, ans);
    });

}

function getContainerStatusCb(contName, data) {
    console.log("getContainerStatusCb => container name = " + contName + " data = " + data);
    console.log(data)

    console.log("getContainerStatusCb => container name = " + contName + " stat = " + data.State);
    client.emit('update', {
        to: config.userName,
        from: config.deviceName,
        type: "status",
        data: data
    })
}

function getStatusOfAllContainerCb(devArr) {
    console.log("getStatusOfAllContainerCb =>")
    console.log(devArr)
    for (var i = 0; i < devArr.length; ++i) {
        getContainerStatus(devArr[i], getContainerStatusCb);
    }
}


function getStatusOfAllContainer() {
    getContainerList(getStatusOfAllContainerCb);
}



function startContainer(data) {
    const { spawn } = require('child_process');
    const lxcStart = spawn('lxc-start', ["-n", data.payload.containerName]);
    lxcStart.stdout.on('data', (data) => {
        console.log(`lxcStart stdout: ${data}`);
    });

    lxcStart.stderr.on('data', (data) => {
        console.error(`lxcStart stderr: ${data}`);

    });

    lxcStart.on('close', (code) => {
        console.log(`lxcStart child process exited with code ${code}`);
        getContainerStatus(data.payload.containerName, getContainerStatusCb);

        client.emit('update', {
            to: config.userName,
            from: config.deviceName,
            type: "startContainer",
            containerName: data.payload.containerName,
            status: `lxcStart child process exited with code ${code}`
        })
        if (code == 0) {

            client.emit('update', {
                // data: data,
                to: config.userName,
                from: config.deviceName,
                type: "download",
                statusCode: 4,
                status: `lxcStart child process exited with code ${code}`,
                description: "Image created and started."
            })

            const postStartConfig = spawn(`../config/${data.payload.device}/postStartConfig.sh`, []);

            postStartConfig.stdout.on('data', (data) => {
                // console.log(`stdout: ${data}`);
            });

            postStartConfig.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
                client.emit('update', {
                    data: data,
                    type: "download",
                    to: config.userName,
                    from: config.deviceName
                })
            });

            postStartConfig.on('close', (code) => {
                console.log(`postStartConfig child process exited with code ${code}`);
                if (code == 0) {
                    client.emit('update', {
                        // data: data,
                        to: config.userName,
                        from: config.deviceName,
                        type: "download",
                        statusCode: 4.5,
                        status: `postStartConfig child process exited with code ${code}`,
                        description: "Image created and post start configuration done; ready to start."
                    })
                } else {
                    client.emit('update', {
                        // data: data,
                        to: config.userName,
                        from: config.deviceName,
                        type: "download",
                        statusCode: -4.5,
                        status: `postStartConfig child process exited with code ${code}`,
                        description: "Image created and post start configuration failed;."
                    })
                }

            })


        } else {
            client.emit('update', {
                // data: data,
                to: config.userName,
                from: config.deviceName,
                type: "download",
                statusCode: -4,
                status: `lxcStart child process exited with code ${code}`,
                description: "Image start failed."
            })
        }

    });

}


function startExistingContainer(data) {
    const { spawn } = require('child_process');
    const lxcStart = spawn('lxc-start', ["-n", data.payload.containerName]);
    lxcStart.stdout.on('data', (data) => {
        console.log(`lxcStart stdout: ${data}`);
    });

    lxcStart.stderr.on('data', (data) => {
        console.error(`lxcStart stderr: ${data}`);

    });

    lxcStart.on('close', (code) => {
        console.log(`lxcStart child process exited with code ${code}`);
        getContainerStatus(data.payload.containerName, getContainerStatusCb);

        client.emit('update', {
                to: config.userName,
                from: config.deviceName,
                type: "startContainer",
                containerName: data.payload.containerName,
                status: `lxcStart child process exited with code ${code}`,
                returnValue: code
            })
            // if (code == 0) {

        //     client.emit('startExistingContainer', {
        //         to: config.userName,
        //         from: config.deviceName,
        //         type: "startExistingContainer",
        //         status: `lxcStart child process exited with code ${code}`,
        //         description: "Image created and started.",
        //         returnValue: code,
        //         containerName: data.payload.containerName
        //     })
        // }
    });

}

function stopExistingContainer(data) {
    const { spawn } = require('child_process');
    const lxcStop = spawn('lxc-stop', ["-n", data.payload.containerName]);
    lxcStop.stdout.on('data', (data) => {
        console.log(`lxcStop stdout: ${data}`);
    });

    lxcStop.stderr.on('data', (data) => {
        console.error(`lxcStop stderr: ${data}`);

    });

    lxcStop.on('close', (code) => {
        console.log(`lxcStop child process exited with code ${code}`);
        getContainerStatus(data.payload.containerName, getContainerStatusCb);
        client.emit('stopExistingContainer', {
            to: config.userName,
            from: config.deviceName,
            type: "stopExistingContainer",
            containerName: data.payload.containerName,
            status: `lxcStop child process exited with code ${code}`,
            returnValue: code
        })
    });

}

function deleteExistingContainer(data) {
    const { spawn } = require('child_process');


    var lxcDestroyFun = (data) => {

        const lxcDestroy = spawn('lxc-destroy', ["-n", data.payload.containerName]);
        lxcDestroy.stdout.on('data', (data) => {
            console.log(`lxcDestroy stdout: ${data}`);
        });

        lxcDestroy.stderr.on('data', (data) => {
            console.error(`lxcDestroy stderr: ${data}`);

        });

        lxcDestroy.on('close', (code) => {
            console.log(` deleteExistingContainer lxcDestroy child process exited with code ${code}`);
            //getContainerStatus(data.payload.containerName, getContainerStatusCb);
            client.emit('deleteExistingContainer', {
                to: config.userName,
                from: config.deviceName,
                type: "deleteExistingContainer",
                containerName: data.payload.containerName,
                status: `lxcDestroy child process exited with code ${code}`,
                returnValue: code
            })
        });

    }


    const lxcStop = spawn('lxc-stop', ["-n", data.payload.containerName]);
    lxcStop.stdout.on('data', (data) => {
        console.log(`lxcStop stdout: ${data}`);
    });

    lxcStop.stderr.on('data', (data) => {
        console.error(`lxcStop stderr: ${data}`);
        // lxcDestroyFun(data)

    });

    lxcStop.on('close', (code) => {
        console.log(` deleteExistingContainer lxcStop child process exited with code ${code}`);
        lxcDestroyFun(data);

    });

}

client.on('message', message => {
    console.log(" massage => ");
    console.log(message);
    switch (message.payload.type) {
        case "download":
            console.log('type download');
            DownloadContainer(message);
            break;
        case 'startContainer':
            console.log('type startContainer');
            startContainer(message);
            break;

        case "startExistingContainer":
            console.log('type startExistingContainer');
            startExistingContainer(message);
            break;

        case 'stopExistingContainer':
            console.log('type stopExistingContainer');
            stopExistingContainer(message);
            break;

        case 'deleteExistingContainer':
            console.log('type deleteExistingContainer');
            deleteExistingContainer(message);
            break;

        case 'status':
            console.log('type status');
            getStatusOfAllContainer();
            break;
        default:
            break;
    }
})
*/