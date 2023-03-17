protoc ^
  --plugin=protoc-gen-ts=.\app\node_modules\.bin\protoc-gen-ts.cmd ^
  --plugin=protoc-gen-js=.\app\node_modules\.bin\protoc-gen-js.cmd ^
  -I .\proto ^
  --js_out=import_style=commonjs,binary:.\app\src\proto ^
  --go_opt=paths=source_relative ^
  --go_out=.\proto ^
  --go-grpc_opt=paths=source_relative ^
  --go-grpc_out=.\proto ^
  --ts_out=service=grpc-web:.\app\src\proto ^
  .\proto\*.proto