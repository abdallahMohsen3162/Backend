const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the .proto file
const packageDefinition = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const todoPackage = grpcObject.todoPackage;

let arr = []
const server = new grpc.Server();

// readTodosStream

function readTodosStream(call, callback) {
  arr.forEach(item => {
    call.write(item);
  })
  call.end();
}

// Dummy functions
function createTodo(call, callback) {
  console.log("created");
  arr.push({
    id: arr.length + 1,
    text: call.request.text
  })
  console.log(arr);
  
  callback(null, call);
}

function readTodos(call, callback) {
  callback(null, { "items": arr });
}

// Add service implementation
server.addService(todoPackage.Todo.service, {
  createTodo,
  readTodos,
  readTodosStream
});

// Use bindAsync instead of bind
server.bindAsync("0.0.0.0:40000", grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error("Server failed to start:", error);
    return;
  }
  console.log(`gRPC Server running on port ${port}`);
  server.start();
});
