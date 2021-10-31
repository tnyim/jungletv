protoc ^
  -I .\segchaproto ^
  --go_opt=paths=source_relative ^
  --go_out=.\segchaproto ^
  --go-grpc_opt=paths=source_relative ^
  --go-grpc_out=.\segchaproto ^
  .\segchaproto\segcha.proto