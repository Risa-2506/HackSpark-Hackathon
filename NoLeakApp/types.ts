export type APIuser={
    rationCard:string,
    name:string,
    allocationKg:number,
    secretKey:string,
    shopId:string,utid:number
    ,phoneNumber:string,
    lastMonth:string
}

export type PAYload={
    id:number,
    rationCard:string,
    shopId:string,
    quantityGiven:number
}
export type LocalTransaction = {
  id: number
  rationCard: string
  utid: number
  allocationKg: number
  timestamp: string
  previousHash: string
  hash: string
  syncStatus: number
  shopId: string
}
