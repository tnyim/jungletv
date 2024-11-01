protoc ^
  --plugin=protoc-gen-ts=.\app\node_modules\.bin\protoc-gen-ts.cmd ^
  --plugin=protoc-gen-js=.\app\node_modules\.bin\protoc-gen-js.cmd ^
  --plugin=protoc-gen-go-vtproto=%GOPATH%\bin\protoc-gen-go-vtproto.exe ^
  -I .\proto ^
  --js_out=import_style=commonjs,binary:.\app\src\proto ^
  --go_opt=paths=source_relative ^
  --go_out=.\proto ^
  --go-grpc_opt=paths=source_relative ^
  --go-grpc_out=.\proto ^
  --go-vtproto_opt=paths=source_relative ^
  --go-vtproto_out=.\proto ^
  --go-vtproto_opt=features=marshal+unmarshal+size ^
  --ts_out=service=grpc-web:.\app\src\proto ^
  .\proto\*.proto