//TO run the script use       node startFlow_enroll_user.js
var exec = require('child_process').exec, child;
const flow_json = require("./flow");
const fs =require('fs');
const myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);
var username ="seller3";
var nature_asset = "nature#200#60#nature.jpg#action#tony_doe.john_snow#5"
var coffee_asset = "coffee#200#60#coffee.jpg#action#sarutobi.uzumaki_naruto#5"
var bigbuck_asset = "bigbuck#200#60#bigbuck.jpg#action#tommy_lee.howrd_stark#5"

// var start_emulator = `flow emulator start`;
// 	child = exec(start_emulator,
// 	function (error, stdout, stderr) {		
// 	retStdOut = stdout;		
// 	if(error){
// 		console.log('Issue in getting the marketplace data for the user : ' + error);
// 		}
// 		else{
// 			console.log(stdout)
			
// 				var deploy_contracts = `flow deploy contracts`;
// 				child = exec(deploy_contracts,
// 				function (error, stdout, stderr) {		
// 				retStdOut = stdout;		
// 				if(error){
// 					console.log('Issue in getting the marketplace data for the user : ' + error);
// 					}
// 					else{
// 						console.log("output of deploy contracts"+stdout)
						
							var assmbleComand = 'flow keys generate';
							child = exec(assmbleComand,
							function (error, stdout, stderr) {		
							retStdOut = stdout;		
							if(error){
								console.log('flow keys generate  exec error: ' + error);
								}
								else
								{
                                    console.log(stdout)
                                    index  = stdout.indexOf('Private'),
                                    startIndex = index+14;
                                    console.log("startIndex"+startIndex)
                                    stopIndex= startIndex+64;
                                    userPrivateKey=stdout.substring(startIndex,stopIndex);
                                    //console.log(index)
									//userPrivateKey=stdout.substring(325,64);

                                    pubindex  = stdout.indexOf('Public'),
                                    pubstartIndex = pubindex+13;
                                    console.log("startIndex"+pubstartIndex)
                                    pubstopIndex= pubstartIndex+128;
                                    userPublicKey=stdout.substring(pubstartIndex,pubstopIndex);
									console.log("userPublic Key is:-"+userPublicKey);
									//userPublicKey=stdout.substring(404,128)
									let PublicKeyCmd = "flow accounts create --key "+userPublicKey;
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
													index  = stdout.indexOf('Address'),
													strOut = stdout.substring(index);
													StartIndex = strOut.indexOf('x');
													StopIndex =  StartIndex+17;
													accAddress=strOut.substring(StartIndex+1,StopIndex);
													console.log("user address  :-"+accAddress)

													//open the JSON file and update the new user
													console.log("parameters to update")
                                                    hexAccountAddress= "0x"+accAddress
													
													// var userDetails;
													console.log("username :-"+username,"\t private-key:-"+userPrivateKey,"\t Account-Address"+accAddress);
													console.log(flow_json.accounts)  // we have to push the new account inside flow_json.accounts
												   //var newUserAccount ={[username]:{address:accAddress,keys:userPrivateKey}}
													console.log(flow_json.accounts)
													var myObject = flow_json;
													//var myObject = JSON.parse(data);
													// Adding the new data to our object
													myObject["accounts"][username] = {address:hexAccountAddress,keys:userPrivateKey};
													console.log(myObject)
													// Writing to our JSON file
													var newData2 = JSON.stringify(myObject);
													fs.writeFile("flow.json", newData2, (err) => {
													// Error checking
													if (err) throw err;
													console.log("New data added");
													usernameCmd = username/*.split(1,-1);*/
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
                                                                                    console.log("Add the reward for the user"+bigbuck_asset);
																					var bigbuck_assetCmd = bigbuck_asset.split(1,-1)
																					var coffee_assetCmd = coffee_asset.split(1,-1)
																					var nature_assetCmd = nature_asset.split(1,-1)
                                                                                    let add_rewardCmd=`flow transactions send ./transactions/rewards/admin/create_reward.cdc --arg String:${bigbuck_assetCmd}} --arg UInt32:250`
                                                                                    child = exec(add_rewardCmd,
                                                                                    function (error, stdout, stderr) {		
                                                                                    retStdOut = stdout;		
                                                                                    if(error){
                                                                                        console.log('Issue in getting the marketplace data for the user : ' + error);
                                                                                        }
                                                                                        else{
                                                                                            console.log('reward added '+stdout);
                                                                                            rewindex  = stdout.indexOf('id (UInt32)'),
                                                                                            rewstartIndex = rewindex+13;
                                                                                            console.log("startIndex"+rewstartIndex)
                                                                                            rewstopIndex= rewstartIndex+3;
                                                                                            rewardIdStr=stdout.substring(rewstartIndex,rewstopIndex);
                                                                                            console.log("##"+rewardIdStr+"##")
                                                                                            var rewardId = parseInt(rewardIdStr.replace(/[A-Za-z$-]/g, ""));
                                                                                            console.log("RewardID for the asset enrolled "+rewardId);
                                                        
                                                                                            //get the reward ID and pass the same rewardID to mint NFT
                                                                                            var MintNFTCmd = `flow transactions send ./transactions/rewards/admin/mint_nft.cdc --arg UInt32:${rewardId} --arg Address:${accAddress}`;
                                                                                            var exec = require('child_process').exec, child;
                                                                                            child = exec(MintNFTCmd,
                                                                                            function (error, stdout, stderr) {		
                                                                                            retStdOut = stdout;		
                                                                                            if(error){
                                                                                                console.log('Issue in getting the marketplace data for the user : ' + error);
                                                                                                }
                                                                                                else{
                                                                                                    console.log('reward added '+stdout);
                                                                                                    nftindex  = stdout.indexOf('NFTID (UInt64)'),
                                                                                                    nftstartIndex = nftindex+16;
                                                                                                    console.log("startIndex"+nftstartIndex)
                                                                                                    nftstopIndex= nftstartIndex+5;
                                                                                                    nftIdStr=stdout.substring(nftstartIndex,nftstopIndex);
                                                                                                    console.log("##"+nftIdStr+"##")
                                                                                                    var sellnftId = parseInt(nftIdStr.replace(/[A-Za-z$-]/g, ""));
                                                                                                    console.log(`nftID is ${sellnftId} for RewardID ${rewardId} `);
                                                                                                    
                                                                                                    //sell the NFT just created
                                                                                                    var sellNFTCmd = `flow transactions send ./transactions/marketplace/sell_market_item.cdc --arg UInt64:${sellnftId} --arg UFix64:250.0 --signer ${username}`;
                                                                                                    var exec = require('child_process').exec, child;
                                                                                                    child = exec(sellNFTCmd,
                                                                                                    function (error, stdout, stderr) {		
                                                                                                    retStdOut = stdout;		
                                                                                                    if(error){
                                                                                                        console.log('Issue in getting the marketplace data for the user : ' + error);
                                                                                                        }
                                                                                                        else{
                                                                                                            console.log('sold the asset in NFT marketplace'+stdout);


																											
																											let add_rewardCmd=`flow transactions send ./transactions/rewards/admin/create_reward.cdc --arg String:${coffee_assetCmd}} --arg UInt32:250`
																											child = exec(add_rewardCmd,
																											function (error, stdout, stderr) {		
																											retStdOut = stdout;		
																											if(error){
																												console.log('Issue in getting the marketplace data for the user : ' + error);
																												}
																												else{
																													console.log('reward added '+stdout);
																													rewindex  = stdout.indexOf('id (UInt32)'),
																													rewstartIndex = rewindex+13;
																													console.log("startIndex"+rewstartIndex)
																													rewstopIndex= rewstartIndex+3;
																													rewardIdStr=stdout.substring(rewstartIndex,rewstopIndex);
																													console.log("##"+rewardIdStr+"##")
																													var rewardId = parseInt(rewardIdStr.replace(/[A-Za-z$-]/g, ""));
																													console.log("RewardID for the asset enrolled "+rewardId);
																				
																													//get the reward ID and pass the same rewardID to mint NFT
																													var MintNFTCmd = `flow transactions send ./transactions/rewards/admin/mint_nft.cdc --arg UInt32:${rewardId} --arg Address:${accAddress}`;
																													var exec = require('child_process').exec, child;
																													child = exec(MintNFTCmd,
																													function (error, stdout, stderr) {		
																													retStdOut = stdout;		
																													if(error){
																														console.log('Issue in getting the marketplace data for the user : ' + error);
																														}
																														else{
																															console.log('reward added '+stdout);
																															nftindex  = stdout.indexOf('NFTID (UInt64)'),
																															nftstartIndex = nftindex+16;
																															console.log("startIndex"+nftstartIndex)
																															nftstopIndex= nftstartIndex+5;
																															nftIdStr=stdout.substring(nftstartIndex,nftstopIndex);
																															console.log("##"+nftIdStr+"##")
																															var sellnftId = parseInt(nftIdStr.replace(/[A-Za-z$-]/g, ""));
																															console.log(`nftID is ${sellnftId} for RewardID ${rewardId} `);
																															
																															//sell the NFT just created
																															var sellNFTCmd = `flow transactions send ./transactions/marketplace/sell_market_item.cdc --arg UInt64:${sellnftId} --arg UFix64:250.0 --signer ${username}`;
																															var exec = require('child_process').exec, child;
																															child = exec(sellNFTCmd,
																															function (error, stdout, stderr) {		
																															retStdOut = stdout;		
																															if(error){
																																console.log('Issue in getting the marketplace data for the user : ' + error);
																																}
																																else{
																																	console.log('sold the asset in NFT marketplace'+stdout);

																																	
																																	//here we can add more asset ,mintnft and sell it

																																	let add_rewardCmd=`flow transactions send ./transactions/rewards/admin/create_reward.cdc --arg String:${nature_assetCmd}} --arg UInt32:250`
																																	child = exec(add_rewardCmd,
																																	function (error, stdout, stderr) {		
																																	retStdOut = stdout;		
																																	if(error){
																																		console.log('Issue in getting the marketplace data for the user : ' + error);
																																		}
																																		else{
																																			console.log('reward added '+stdout);
																																			rewindex  = stdout.indexOf('id (UInt32)'),
																																			rewstartIndex = rewindex+13;
																																			console.log("startIndex"+rewstartIndex)
																																			rewstopIndex= rewstartIndex+3;
																																			rewardIdStr=stdout.substring(rewstartIndex,rewstopIndex);
																																			console.log("##"+rewardIdStr+"##")
																																			var rewardId = parseInt(rewardIdStr.replace(/[A-Za-z$-]/g, ""));
																																			console.log("RewardID for the asset enrolled "+rewardId);
																										
																																			//get the reward ID and pass the same rewardID to mint NFT
																																			var MintNFTCmd = `flow transactions send ./transactions/rewards/admin/mint_nft.cdc --arg UInt32:${rewardId} --arg Address:${accAddress}`;
																																			var exec = require('child_process').exec, child;
																																			child = exec(MintNFTCmd,
																																			function (error, stdout, stderr) {		
																																			retStdOut = stdout;		
																																			if(error){
																																				console.log('Issue in getting the marketplace data for the user : ' + error);
																																				}
																																				else{
																																					console.log('reward added '+stdout);
																																					nftindex  = stdout.indexOf('NFTID (UInt64)'),
																																					nftstartIndex = nftindex+16;
																																					console.log("startIndex"+nftstartIndex)
																																					nftstopIndex= nftstartIndex+5;
																																					nftIdStr=stdout.substring(nftstartIndex,nftstopIndex);
																																					console.log("##"+nftIdStr+"##")
																																					var sellnftId = parseInt(nftIdStr.replace(/[A-Za-z$-]/g, ""));
																																					console.log(`nftID is ${sellnftId} for RewardID ${rewardId} `);
																																					
																																					//sell the NFT just created
																																					var sellNFTCmd = `flow transactions send ./transactions/marketplace/sell_market_item.cdc --arg UInt64:${sellnftId} --arg UFix64:250.0 --signer ${username}`;
																																					var exec = require('child_process').exec, child;
																																					child = exec(sellNFTCmd,
																																					function (error, stdout, stderr) {		
																																					retStdOut = stdout;		
																																					if(error){
																																						console.log('Issue in getting the marketplace data for the user : ' + error);
																																						}
																																						else{
																																							console.log('sold the asset in NFT marketplace'+stdout);

																																							
																																							//here we can add more asset ,mintnft and sell it
																																							
																																						}	
																																					});

																																				


																																						}	
																																					});


																																			
																																		}	
																																	});
																																	
																																}	
																															});

																														


																																}	
																															});


																													
																												}	
																											});
																											

                                                                                                        }	
                                                                                                    });

                                                                                                


                                                                                                        }	
                                                                                                    });


                                                                                            
                                                                                        }	
                                                                                    });

																					//

                                                                                    


																				}	
																			});


																			}	
																		});
																		
																	}	
																});
																

															}	
													});

													console.log("New User added")
													});


										}	
									});

									 
								}	
							});

						
						
						
						
	// 				}	
	// 			});

			
	// 	}	
	// });