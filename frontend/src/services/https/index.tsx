import type { UserInterface } from "../../interface/UserInterface";
import axios from "axios";
const apiUrl = "http://localhost:8000";

const Authorization = localStorage.getItem("token");

const Bearer = localStorage.getItem("token_type");


const requestOptions = {

  headers: {

    "Content-Type": "application/json",

    Authorization: `${Bearer} ${Authorization}`,

  },

};
async function SignIn(data: UserInterface) {

  return await axios

    .post(`${apiUrl}/login`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

export{
    SignIn,
}