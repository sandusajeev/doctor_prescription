import { BASE_URL } from "./baseUrl"
import { commonAPI } from "./commonApi"

export const regDoctorApi = async (data) => {
    return await commonAPI("POST", `${BASE_URL}/doctor/register`, data, "")
}

// login
export const loginApi = async(data) => {
    return await commonAPI("POST",`${BASE_URL}/doctor/login`,data,"")
}