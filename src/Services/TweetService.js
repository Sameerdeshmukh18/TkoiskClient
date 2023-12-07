export const postTweet = async(tweet) =>{

    const response = await fetch(`${process.env.REACT_APP_API_URL}tweets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":`Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          tweet
        }),
      });
      return response;


}