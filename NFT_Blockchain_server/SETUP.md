 flow emulator start

flow deploy contracts

SELLER 
======

Create seller account
---------------------
flow keys generate


flow accounts create --key <PUB KEY>

Update flow.json (private key)

Setup Rewards for seller
-----------------------
flow transactions send ./transactions/rewards/setup_account.cdc --signer seller1

Setup FUSD for seller
---------------------
flow transactions send ./transactions/fusd/setup_account.cdc --signer seller1

Setup Marketplace for seller
----------------------------
flow transactions send ./transactions/marketplace/setup_account.cdc --signer seller1

BUYER
=====

Create buyer account
--------------------
flow keys generate


flow accounts create --key <PUB KEY>

Update flow.json (private key)

setup buyer account
----------------------
flow keys generate


flow accounts create --key <PUB KEY>

Update flow.json (private key)ewards for buyer
-----------------------
flow transactions send ./transactions/rewards/setup_account.cdc --signer buyer

Setup FUSD for buyer
--------------------
flow transactions send ./transactions/fusd/setup_account.cdc --signer buyer

Setup Marketplace for buyer
---------------------------
flow transactions send ./transactions/marketplace/setup_account.cdc --signer buyer


FUSD
----
Mint some FUSD for the buyer & seller
flow transactions send ./transactions/fusd/mint_tokens.cdc --arg Address:01cf0e2f2f715450 --arg UFix64:9001.0

flow transactions send ./transactions/fusd/mint_tokens.cdc --arg Address:179b6b1cb6755e31 --arg UFix64:9001.0


Mint & Distribute tokens
========================
Create a reward
---------------
flow transactions send ./transactions/rewards/admin/create_reward.cdc --arg String:movie-1 --arg UInt32:250
flow transactions send ./transactions/rewards/admin/create_reward.cdc --arg String:Movie-3.mp4;150;10;//backendserver/storage/movie3.jpg --arg UInt32:250
flow transactions send ./transactions/rewards/admin/create_reward.cdc --arg String:movie-2#50#10#//backendserver/storage/movie3.jpg --arg UInt32:250
flow transactions send ./transactions/rewards/admin/create_reward.cdc --arg String:movie-4#50#10#//backendserver/storage/movie4.jpg --arg UInt32:250
flow transactions send ./transactions/rewards/admin/create_reward.cdc --arg String:movie-10#50#10#//backendserver/storage/movie10.jpg#testurl --arg UInt32:250
flow transactions send ./transactions/rewards/admin/create_reward.cdc --arg String:movie-13#50#10#//backendserver/storage/movie13.jpg --arg UInt32:250



flow transactions send ./transactions/rewards/admin/create_reward.cdc --arg String:bigbuck#50#10#bigbuck.jpg --arg UInt32:250                       //REWARDID6
flow transactions send ./transactions/rewards/admin/create_reward.cdc --arg String:wildlife#50#10#wildlife.jpg --arg UInt32:250						//REWARDID7
flow transactions send ./transactions/rewards/admin/create_reward.cdc --arg String:soldier#120#55#soldier.jpg --arg UInt32:250						//REWARDID8


flow transactions send ./transactions/rewards/admin/create_reward.cdc --arg String:bigbuck#200#60#bigbuck.jpg#action#uchiha_madara.uzumaki_naruto#5 --arg UInt32:250   //11


Mint an NFT for seller
----------------------
flow transactions send ./transactions/rewards/admin/mint_nft.cdc --arg UInt32:1 --arg Address:01cf0e2f2f715450
flow transactions send ./transactions/rewards/admin/mint_nft.cdc --arg UInt32:5 --arg Address:01cf0e2f2f715450
flow transactions send ./transactions/rewards/admin/mint_nft.cdc --arg UInt32:3 --arg Address:01cf0e2f2f715450

flow transactions send ./transactions/rewards/admin/mint_nft.cdc --arg UInt32:11 --arg Address:01cf0e2f2f715450


Check status
------------
Check the created rewards
-------------------------


Check the NFTs in the seller collection
---------------------------------------
flow scripts execute ./scripts/rewards/get_collection_ids.cdc --arg Address:01cf0e2f2f715450


Check the RewardId for the NFTId
flow scripts execute ./scripts/rewards/get_nft_rewardID 01cf0e2f2f715450 2

Check FUSD balances
-------------------
flow scripts execute ./scripts/fusd/get_balance.cdc --arg Address:01cf0e2f2f715450
flow scripts execute ./scripts/fusd/get_balance.cdc --arg Address:179b6b1cb6755e31

Market Interactions
===================

SELLER

Sell the NFT
------------
flow transactions send ./transactions/marketplace/sell_market_item.cdc --arg UInt64:1 --arg UFix64:250.0 --signer seller-account
flow transactions send ./transactions/marketplace/sell_market_item.cdc --arg UInt64:5 --arg UFix64:250.0 --signer seller1
flow transactions send ./transactions/marketplace/sell_market_item.cdc --arg UInt64:13 --arg UFix64:250.0 --signer seller1

Check items for sale
flow scripts execute ./scripts/marketplace/get_collection_ids.cdc --arg Address:01cf0e2f2f715450

Buyer

Buy item
--------
flow transactions send ./transactions/marketplace/buy_market_item.cdc --arg UInt64:1 --arg Address:01cf0e2f2f715450 --signer buyer-account

Check sellers sales
flow scripts execute ./scripts/marketplace/get_collection_ids.cdc --arg Address:01cf0e2f2f715450
flow scripts execute ./scripts/marketplace/get_collection_ids.cdc --arg Address:179b6b1cb6755e31
flow transactions send ./transactions/rewards/admin/mint_nft.cdc --arg UInt32:4 --arg Address:179b6b1cb6755e31

Check buyers rewards collection
flow scripts execute ./scripts/rewards/get_collection_ids.cdc --arg Address:179b6b1cb6755e31
flow transactions send ./transactions/marketplace/sell_market_item.cdc --arg UInt64:6 --arg UFix64:250.0 --signer buyer
Check seller FUSD balance
flow scripts execute ./scripts/fusd/get_balance.cdc --arg Address:01cf0e2f2f715450
