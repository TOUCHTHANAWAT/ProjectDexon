import type { ThicknessInterface } from "../../interface/Thickness";
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

async function Listhickness(id: any) {
  try {
    const response = await fetch(`${apiUrl}/ListThicknesses/${id}`, {
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

async function createThickness(id: any, data: ThicknessInterface) {
  const requestOptions = {
    headers: getAuthHeaders(),
  };
  return await axios

    .post(`${apiUrl}/CreateThicknesses/${id}`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

 async function DeleteThickness(id?:number) {
    const requestOptions = {
      //method: "GET",
      headers: getAuthHeaders(),
    };
    return await axios
  
      .delete(`${apiUrl}/DeleteThickness/${id}`, requestOptions)
  
      .then((res) => res)
  
      .catch((e) => e.response);
  }

  async function GetThicknessByID(id: any) {
    try {
      const response = await fetch(`${apiUrl}/GetThickness/${id}`, {
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

  async function UpdateThicknessById(id: any, data: ThicknessInterface) {
  const requestOptions = {
    //method: "GET",
    headers: getAuthHeaders(),
  };
  return await axios
    //const response = await fetch(`${apiUrl}/gettakeahistoryformedicalrecord/${id}`, requestOptions);
    .patch(`${apiUrl}/UpdateThickness/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  Listhickness,
  createThickness,
  DeleteThickness,
  GetThicknessByID,
  UpdateThicknessById
};
