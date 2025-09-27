import type { CMLInterface } from "../../interface/CML";
import axios from "axios";

const apiUrl = "http://localhost:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("token_type");
  return {
    "Content-Type": "application/json",
    Authorization: token && tokenType ? `${tokenType} ${token}` : "",
  };
}

async function ListCML(id: any) {
  try {
    const response = await fetch(`${apiUrl}/ListCML/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error listing medical records, status:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error listing listtakeahistoryformedicalrecord:", error);
    return false;
  }
}

async function createCML(id: any, data: CMLInterface) {
  const requestOptions = {
    //method: "GET",
    headers: getAuthHeaders(),
  };
  return await axios

    .post(`${apiUrl}/CreateCML/${id}`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

async function DeleteCML(id?: number) {
  const requestOptions = {
    headers: getAuthHeaders(),
  };
  return await axios

    .delete(`${apiUrl}/DeleteCML/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

async function GetCMLByID(id: any) {
  try {
    const response = await fetch(`${apiUrl}/GetCml/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error listing medical records, status:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error listing listtakeahistoryformedicalrecord:", error);
    return false;
  }
}

async function UpdateCMLById(id: any, data: CMLInterface) {
  const requestOptions = {
    //method: "GET",
    headers: getAuthHeaders(),
  };
  return await axios
    //const response = await fetch(`${apiUrl}/gettakeahistoryformedicalrecord/${id}`, requestOptions);
    .patch(`${apiUrl}/UpdateCML/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  ListCML,
  createCML,
  DeleteCML,
  GetCMLByID,
  UpdateCMLById
};
