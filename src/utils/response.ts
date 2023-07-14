/**
 * Format data to be sent to the client
 * 
 * - result.success("I'm a success") = { success: true, message: "I'm a success", data: "" }
 * - result.error("I'm an error") = { success: false, message: "I'm an error", data: "" }
 * 
 * If it has a second parameter, it will be the data to be sent to the client.
 * 
 * - result.success("I'm a success", "Data") = { success: true, message: "I'm a success", data: "Data" }
 */
export const result = {
  /**
   * Success response format
   * @param message Message to be sent to the client
   * @param data Data to be sent to the client
   */
  success: (message?: any, data?: any) => {
    return JSON.stringify({ success: true, message: message ?? "", data }, null, 0);
  },
  /**
   * Error response format
   * @param message Message to be sent to the client
   * @param data Data to be sent to the client
   */
  error: (message?: any, data?: any) => {
    return JSON.stringify({ success: false, message: message ?? "", data }, null, 0);
  }
};