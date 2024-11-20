
const HttpStatus = {
    "OK": {
      "code": 200,
      "description": "The request was successful."
    },
    "CREATED": {
      "code": 201,
      "description": "The request was successful and a resource was created."
    },
    "ACCEPTED": {
      "code": 202,
      "description": "The request has been accepted for processing, but the processing has not been completed."
    },
    "NO_CONTENT": {
      "code": 204,
      "description": "The server successfully processed the request, but is not returning any content."
    },
    "BAD_REQUEST": {
      "code": 400,
      "description": "The server could not understand the request due to invalid syntax."
    },
    "UNAUTHORIZED": {
      "code": 401,
      "description": "Authentication is required and has failed or has not been provided."
    },
    "FORBIDDEN": {
      "code": 403,
      "description": "The client does not have access rights to the content."
    },
    "NOT_FOUND": {
      "code": 404,
      "description": "The server can not find the requested resource."
    },
    "METHOD_NOT_ALLOWED": {
      "code": 405,
      "description": "The request method is known by the server but is not supported by the target resource."
    },
    "CONFLICT": {
      "code": 409,
      "description": "The request conflicts with the current state of the server."
    },
    "GONE": {
      "code": 410,
      "description": "The content requested is no longer available and will not be available again."
    },
    "UNSUPPORTED_MEDIA_TYPE": {
      "code": 415,
      "description": "The media format of the requested data is not supported by the server."
    },
    "UNPROCESSABLE_ENTITY": {
      "code": 422,
      "description": "The request was well-formed but was unable to be followed due to semantic errors."
    },
    "INTERNAL_SERVER_ERROR": {
      "code": 500,
      "description": "The server encountered a situation it doesn't know how to handle."
    },
    "NOT_IMPLEMENTED": {
      "code": 501,
      "description": "The server does not recognize the request method, or it lacks the ability to fulfill the request."
    },
    "BAD_GATEWAY": {
      "code": 502,
      "description": "The server, while acting as a gateway or proxy, received an invalid response from the upstream server."
    },
    "SERVICE_UNAVAILABLE": {
      "code": 503,
      "description": "The server is not ready to handle the request, often due to maintenance or overload."
    },
    "GATEWAY_TIMEOUT": {
      "code": 504,
      "description": "The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server."
    },
    "HTTP_VERSION_NOT_SUPPORTED": {
      "code": 505,
      "description": "The server does not support the HTTP version used in the request."
    }
}


export default HttpStatus