
export const createUser = async (name,username, email, dob, password) => {

  const response = await fetch(`${import.meta.env.VITE_API_URL}users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      username,
      email,
      dob,
      password
    }),
  });
  return response;

}

export const loginUser = async (email, password) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}users/login`, {
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

export const CurrentUser = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}users/current`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`,
    }
  });
  const json = await response.json()

  return json;


}

export const authenticate = async () => {

  const response = await fetch(`${import.meta.env.VITE_API_URL}users/current`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`,
    }
  });

  if (response.status === 200) {
    return true
  }
  else {
    return false
  }

}

export const getUserDetails = async (id) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  return response;
}

export const checkUsernameAvailability = async (username) =>{
  const response = await fetch(`${import.meta.env.VITE_API_URL}users/checkUsername/${username}`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  if(response.status===200){
    return true;
  }
  else{
    return false;
  }
}

