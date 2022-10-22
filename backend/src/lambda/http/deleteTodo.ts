// import 'source-map-support/register'

// import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';
// import {deleteToDo} from "../../businessLogic/ToDo";

// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     // TODO: Remove a TODO item by id
//     console.log("Processing Event ", event);
//     const authorization = event.headers.Authorization;
//     const split = authorization.split(' ');
//     const jwtToken = split[1];

//     const todoId = event.pathParameters.todoId;

//     const deleteData = await deleteToDo(todoId, jwtToken);

//     return {
//         statusCode: 200,
//         headers: {
//             "Access-Control-Allow-Origin": "*",
//         },
//         body: deleteData,
//     }
// };

import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  console.log("remove todo: " + todoId);

  const params = {
      TableName: todosTable,
      Key: {
          "userId": getUserId(event),
          "todoId": todoId
      },
  };

  const result = await docClient.delete(params).promise();
  console.log(result);

  return {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
    body: "",
  }
}
