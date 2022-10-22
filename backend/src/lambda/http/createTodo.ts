// import 'source-map-support/register'

// import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
// import {CreateTodoRequest} from '../../requests/CreateTodoRequest';
// import {createToDo} from "../../businessLogic/ToDo";

// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     // TODO: Implement creating a new TODO item
//     console.log("Processing Event ", event);
//     const authorization = event.headers.Authorization;
//     const split = authorization.split(' ');
//     const jwtToken = split[1];

//     const newTodo: CreateTodoRequest = JSON.parse(event.body);
//     const toDoItem = await createToDo(newTodo, jwtToken);

//     return {
//         statusCode: 201,
//         headers: {
//             "Access-Control-Allow-Origin": "*",
//         },
//         body: JSON.stringify({
//             "item": toDoItem
//         }),
//     }
// };
import 'source-map-support/register'
import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  
  const item = await docClient.put({
    TableName: todosTable,
    Item: {
      todoId: uuid.v4(),
      userId: getUserId(event),
      createdAt: new Date().getTime().toString(),
      done: false,
      ...newTodo
    }
  }).promise()

  console.log("create todo: " + item);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item
    })
  }
}
