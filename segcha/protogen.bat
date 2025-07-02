protoc ^
  --plugin=protoc-gen-go-vtproto=%GOPATH%\bin\protoc-gen-go-vtproto.exe ^
  -I .\segchaproto ^
  --go_opt=paths=source_relative ^
  --go_out=.\segchaproto ^
  --go-grpc_opt=paths=source_relative ^
  --go-grpc_out=.\segchaproto ^
  --go-vtproto_opt=paths=source_relative ^
  --go-vtproto_out=.\segchaproto ^
  --go-vtproto_opt=features=marshal+unmarshal+size ^
  .\segchaproto\segcha.proto