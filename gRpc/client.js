const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the .proto file
const packageDefinition = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const todoPackage = grpcObject.todoPackage;

const url = "localhost:40000";


const client = new todoPackage.Todo(
  url, 
  grpc.credentials.createInsecure()
);

// Call the createTodo method

(() => {
  return;
  const data =  { id: -1, text: "text " };

  client.createTodo(data, (error, response) => {
    
  });
  
})()

// Call the readTodos method
/*
client.readTodos({}, (error, response) => {
  console.log("response ",response);
});
*/

const call = client.readTodosStream();

call.on("data", (data) => {
  console.log("data ",data);
});

call.on("end", () => {
  console.log("end");
});
