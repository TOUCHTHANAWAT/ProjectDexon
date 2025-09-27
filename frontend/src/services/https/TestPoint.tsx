import type { TestPointInterface } from "../../interface/TestPoint";
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

async function ListTestPoint(id: any) {
  try {
    const response = await fetch(`${apiUrl}/ListTestPoint/${id}`, {
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

async function createTestPoint(id: any, data: TestPointInterface) {
  const requestOptions = {
    //method: "GET",
    headers: getAuthHeaders(),
  };
  return await axios

    .post(`${apiUrl}/CreateTestPoint/${id}`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

async function DeleteTestPoint(id?: number) {
  const requestOptions = {
    //method: "GET",
    headers: getAuthHeaders(),
  };
  return await axios

    .delete(`${apiUrl}/DeleteTestPoint/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

async function GetTestPointByID(id: any) {
  try {
    const response = await fetch(`${apiUrl}/GetTestpoint/${id}`, {
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


async function UpdateTestPointById(id: any, data: TestPointInterface) {
  const requestOptions = {
    //method: "GET",
    headers: getAuthHeaders(),
  };
  return await axios
    //const response = await fetch(`${apiUrl}/gettakeahistoryformedicalrecord/${id}`, requestOptions);
    .patch(`${apiUrl}/UpdateTestPoint/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  ListTestPoint,
  createTestPoint,
  DeleteTestPoint,
  GetTestPointByID,
  UpdateTestPointById
};
