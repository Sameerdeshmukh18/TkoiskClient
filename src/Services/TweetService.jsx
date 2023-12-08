export const postTweet = async (tweet) => {

  const response = await fetch(`${import.meta.env.VITE_API_URL}tweets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`,
    },
    body: JSON.stringify({
      tweet
    }),
  });
  return response;


}