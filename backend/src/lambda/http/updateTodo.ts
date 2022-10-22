// import 'source-map-support/register'
// import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
// import {UpdateTodoRequest} from '../../requests/UpdateTodoRequest'
// import {updateToDo} from "../../businessLogic/ToDo";

// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
//     console.log("Processing Event ", event);
//     const authorization = event.headers.Authorization;
//     const split = authorization.split(' ');
//     const jwtToken = split[1];

//     const todoId = event.pathParameters.todoId;
//     const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

//     const toDoItem = await updateToDo(updatedTodo, todoId, jwtToken);

//     return {
//         statusCode: 200,
//         headers: {
//             "Access-Control-Allow-Origin": "*",
//         },
//         body: JSON.stringify({
//             "item": toDoItem
//         }),
//     }
// };

import 'source-map-support/register'

import * as AWS from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("process event: " + event)

  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const params = {
    TableName: todosTable,
    Key: {
        "userId": getUserId(event),
        "todoId": todoId
    },
    UpdateExpression: "set #a = :a, #b = :b, #c = :c",
    ExpressionAttributeNames: {
        "#a": "name",
        "#b": "dueDate",
        "#c": "done"
    },
    ExpressionAttributeValues: {
        ":a": updatedTodo.name,
        ":b": updatedTodo.dueDate,
        ":c": updatedTodo.done
    },
    ReturnValues: "ALL_NEW"
};

  const updatedItem = await docClient.update(params).promise()

  console.log("update todo " + todoId + " with " + updatedItem);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      updatedItem
    })
  }
}
