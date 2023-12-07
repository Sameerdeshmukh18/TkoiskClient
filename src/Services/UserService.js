
export const createUser= async(username,email,dob,password)=>{
    
    const response = await fetch(`${process.env.REACT_APP_API_URL}users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        dob,
        password
      }),
    });
    return response;

}

export const loginUser = async(email,password)=>{
  const response = await fetch(`${process.env.REACT_APP_API_URL}users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password
    }),
  });
  return response;

}

export const CurrentUser = async()=>{
  const response = await fetch(`${process.env.REACT_APP_API_URL}users/current`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization":`Bearer ${sessionStorage.getItem("authToken")}`,
    }
  });
  const json = await response.json()
  
  return json;

  
}

export const authenticate = async()=>{

  const response = await fetch(`${process.env.REACT_APP_API_URL}users/current`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization":`Bearer ${sessionStorage.getItem("authToken")}`,
    }
  });
  
  if(response.status === 200){
    return true
  }
  else{
    return false
  }

}

