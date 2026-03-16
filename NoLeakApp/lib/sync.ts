import { LocalTransaction } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";


export async function syncTransaction(transactions:LocalTransaction[]){
    const id= await AsyncStorage.getItem("shopId")
   const payload = transactions.map((t) => ({
  id: t.id,
  rationCard: t.rationCard,
  shopId: id,
  quantityGiven: t.allocationKg
}))
}
