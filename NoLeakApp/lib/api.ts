import { PAYload } from "@/types";

export async function fetchUsersForShop(shopId: string) {
  const url = `https://kenspeckle-norah-guiltily.ngrok-free.dev/api/v1/shop/${shopId}/users`;
  console.log("Fetching from url:",url)
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await response.json();
  console.log("API response:",data)

  return data;
}



export async function sendTransactionsToServer(payload: PAYload[]) {
  try {

    const response = await fetch(
      "https://kenspeckle-norah-guiltily.ngrok-free.dev/api/v1/sync",  
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    )

    if (!response.ok) {
      throw new Error("Sync failed with status: " + response.status)
    }

    const data = await response.json()

    console.log("SYNC RESPONSE:", data)

    return data.results   // returns array of { rationCard, status, reason? }

  } catch (error: any) {
    console.log("SYNC ERROR:", error.message)
    throw error
  }
}


