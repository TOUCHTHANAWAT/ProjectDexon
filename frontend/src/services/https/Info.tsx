import type { InfoInterface } from "../../interface/Info";
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

async function ListInfo() {
  try {
    const response = await fetch(`${apiUrl}/ListInfo`, {
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

async function createInfo(data: InfoInterface) {
  const requestOptions = {
    //method: "GET",
    headers: getAuthHeaders(),
  };
  return await axios

    .post(`${apiUrl}/CreateInfo`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

async function GetCalculateByID(id: any) {
  try {
    const response = await fetch(`${apiUrl}/GetCalAuto/${id}`, {
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

async function GetInfoByID(id: any) {
  try {
    const response = await fetch(`${apiUrl}/GetInfo/${id}`, {
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

async function UpdateInfoById(id: any, data: InfoInterface) {
  const requestOptions = {
    //method: "GET",
    headers: getAuthHeaders(),
  };
  return await axios
    //const response = await fetch(`${apiUrl}/gettakeahistoryformedicalrecord/${id}`, requestOptions);
    .patch(`${apiUrl}/UpdateInfo/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteInfo(id?: number) {
  const requestOptions = {
    headers: getAuthHeaders(),
  };
  return await axios

    .delete(`${apiUrl}/DeleteInfo/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

export {
  ListInfo,
  createInfo,
  GetCalculateByID,
  GetInfoByID,
  UpdateInfoById,
  DeleteInfo
};
