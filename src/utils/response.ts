import type { ResponseBody } from "../types"

const response = {
  /**
   * Success response format
   * @param message Message to be sent to the client
   * @param data Data to be sent to the client
   */
  success: (message?: any, data?: any, count?: number): ResponseBody => {
    return { success: true, message: message ?? "", data, count };
  },
  /**
   * Error response format
   * @param message Message to be sent to the client
   * @param data Data to be sent to the client
   */
  error: (message?: any, data?: any, count?: number): ResponseBody  => {
    return { success: false, message: message ?? "", data, count };
  }
};

export default response;