import * as Crypto from 'expo-crypto';
import * as SQLite from 'expo-sqlite';
import { fetchUsersForShop, sendTransactionsToServer } from './lib/api';
import { APIuser, LocalTransaction } from './types';
const db= SQLite.openDatabaseSync('shopkeeperLedger_v8.db')

export function initDB()
{
 

    db.execSync(`
        CREATE TABLE IF NOT EXISTS Transactions(
            id INTEGER PRIMARY KEY AUTOINCREMENT,  
            rationCard TEXT NOT NULL,
            utid TEXT NOT NULL ,
            allocationKg INTEGER NOT NULL,
            timestamp TEXT NOT NULL,
            previousHash TEXT NOT NULL,
            hash TEXT UNIQUE NOT NULL,
            syncStatus INTEGER NOT NULL DEFAULT 0,
            shopId TEXT NOT NULL      )`)
   
   
    db.execSync(`CREATE TABLE IF NOT EXISTS RationUsers(
                  rationCard TEXT  PRIMARY KEY  NOT NULL ,
                  name TEXT NOT NULL,
                  shopId TEXT NOT NULL,
                  allocationKg REAL NOT NULL,
                  secretKey TEXT NOT NULL,
                  utid INTEGER NOT NULL,
                  phoneNumber TEXT,
                  lastMonth TEXT
                  )`)
       
  console.log('ALL USERS:',db.getAllSync(`SELECT * FROM RationUsers`))
  
}

export function insertUsers(users: APIuser[],shopId:string) {
  users.forEach((customer) => {
    console.log("INSERTING USER:", customer);

    db.runSync(
      `INSERT OR REPLACE INTO RationUsers
      (rationCard, name, shopId, allocationKg, secretKey, utid,phoneNumber,lastMonth)
      VALUES (?, ?, ?, ?, ?, ?,?,?)`,
      [
        customer.rationCard,
        customer.name,
        shopId,
        customer.allocationKg,
        customer.secretKey,
        customer.utid,
        customer.phoneNumber,
        null
      ]
    );
  });
}


export async function syncUsers(shopId:string)
{
  try{
      console.log("sync startd with",shopId)
      if(!shopId)
      {
        return;
      }
      const users =await fetchUsersForShop(shopId)
      
      insertUsers(users,shopId)
      const check = db.getAllSync("SELECT * FROM RationUsers");
      
      
      }
  catch(e){
    console.log("ACTUAL ERROR:",e)
  }
 

}

export async function saveTransaction(rationCard:string,shopId:string,utid:number,allocationKg:number,lastMonth:string){
    const rows = db.getAllSync<{hash:string}>(
  "SELECT hash FROM Transactions ORDER BY id DESC LIMIT 1"
);


let previousHash: string;

if (rows.length === 0) {
  previousHash = "0";
} else {
  previousHash = rows[0].hash;
}

const timestamp = new Date().toISOString()
const datatoHash=`
rationCard:${rationCard};
utid:${utid};
allocationKg:${allocationKg};

previousHash:${previousHash};
timestamp:${timestamp};
shopId:${shopId}`;

 const  hash =await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,datatoHash);
 try{
        const result=db.runSync(`INSERT INTO Transactions(syncStatus,rationCard,utid,allocationKg,previousHash,timestamp,hash,shopId) VALUES(?,?,?,?,?,?,?,?)`,[0,rationCard,utid,allocationKg,previousHash,timestamp,hash,shopId])
        const transc= db.getAllSync(`SELECT * FROM Transactions`)
        console.log("transactions:",transc)
        if(result.changes===1)
        {
          db.runSync(`UPDATE RationUsers SET lastMonth =? WHERE shopId=? AND rationCard=?`,[lastMonth,shopId,rationCard])
        }
        return { rationCard,
      utid,
      allocationKg,
      timestamp,
      previousHash,
      hash,
      syncStatus: 0,shopId}
 }
 catch(error)
 {
  console.log("Error in transaction:",error)
    return false

 }
 

}

export function getUsers(shopId:string)
{
  const Users= db.getAllSync<APIuser>(`SELECT * FROM RationUsers
                              WHERE shopId =?`,[shopId]
  )
  return Users
}
export function getUserByRationCard(rationCard:string,shopId:string):APIuser|null
{
  const user = db.getFirstSync<APIuser>(`SELECT * FROM RationUsers WHERE rationCard=? AND shopId=?`,[rationCard,shopId])
  return user
}
//Function to get unsysced transaction array
export function getUnsyncedTransactions():LocalTransaction[]
{
  const unsyncTransc = db.getAllSync<LocalTransaction>(`SELECT * FROM Transactions WHERE syncStatus=0`)
  return unsyncTransc

}

export async function performSync()
{try{
  const unsyncRows= getUnsyncedTransactions()
  if(unsyncRows.length===0)
  {
    return
  }
  console.log("UNSYNCROW:",unsyncRows)
  const payload = unsyncRows.map((t) => ({
  id: t.id,
  rationCard: t.rationCard,
  shopId: t.shopId,
  quantityGiven: t.allocationKg
}))
const results =await sendTransactionsToServer(payload)
for(let result of results)
{
  if(result.status==="SUCCESS")
  {
    db.runSync(`UPDATE Transactions SET syncstatus = 1 WHERE rationCard =? AND syncStatus=0`,[results.rationCard])
  }
}}
catch(e){
  console.log("API SYNC FAILED :",e)
}
 
}