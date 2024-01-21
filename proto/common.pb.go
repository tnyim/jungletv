// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.26.0
// 	protoc        v4.25.1
// source: common.proto

package proto

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type UserRole int32

const (
	UserRole_MODERATOR               UserRole = 0
	UserRole_TIER_1_REQUESTER        UserRole = 1
	UserRole_TIER_2_REQUESTER        UserRole = 2
	UserRole_TIER_3_REQUESTER        UserRole = 3
	UserRole_CURRENT_ENTRY_REQUESTER UserRole = 4
	UserRole_VIP                     UserRole = 5
	UserRole_APPLICATION             UserRole = 6
)

// Enum value maps for UserRole.
var (
	UserRole_name = map[int32]string{
		0: "MODERATOR",
		1: "TIER_1_REQUESTER",
		2: "TIER_2_REQUESTER",
		3: "TIER_3_REQUESTER",
		4: "CURRENT_ENTRY_REQUESTER",
		5: "VIP",
		6: "APPLICATION",
	}
	UserRole_value = map[string]int32{
		"MODERATOR":               0,
		"TIER_1_REQUESTER":        1,
		"TIER_2_REQUESTER":        2,
		"TIER_3_REQUESTER":        3,
		"CURRENT_ENTRY_REQUESTER": 4,
		"VIP":                     5,
		"APPLICATION":             6,
	}
)

func (x UserRole) Enum() *UserRole {
	p := new(UserRole)
	*p = x
	return p
}

func (x UserRole) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (UserRole) Descriptor() protoreflect.EnumDescriptor {
	return file_common_proto_enumTypes[0].Descriptor()
}

func (UserRole) Type() protoreflect.EnumType {
	return &file_common_proto_enumTypes[0]
}

func (x UserRole) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use UserRole.Descriptor instead.
func (UserRole) EnumDescriptor() ([]byte, []int) {
	return file_common_proto_rawDescGZIP(), []int{0}
}

type UserStatus int32

const (
	UserStatus_USER_STATUS_OFFLINE  UserStatus = 0
	UserStatus_USER_STATUS_WATCHING UserStatus = 1
	UserStatus_USER_STATUS_AWAY     UserStatus = 2
)

// Enum value maps for UserStatus.
var (
	UserStatus_name = map[int32]string{
		0: "USER_STATUS_OFFLINE",
		1: "USER_STATUS_WATCHING",
		2: "USER_STATUS_AWAY",
	}
	UserStatus_value = map[string]int32{
		"USER_STATUS_OFFLINE":  0,
		"USER_STATUS_WATCHING": 1,
		"USER_STATUS_AWAY":     2,
	}
)

func (x UserStatus) Enum() *UserStatus {
	p := new(UserStatus)
	*p = x
	return p
}

func (x UserStatus) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (UserStatus) Descriptor() protoreflect.EnumDescriptor {
	return file_common_proto_enumTypes[1].Descriptor()
}

func (UserStatus) Type() protoreflect.EnumType {
	return &file_common_proto_enumTypes[1]
}

func (x UserStatus) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use UserStatus.Descriptor instead.
func (UserStatus) EnumDescriptor() ([]byte, []int) {
	return file_common_proto_rawDescGZIP(), []int{1}
}

type User struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Address  string     `protobuf:"bytes,1,opt,name=address,proto3" json:"address,omitempty"`
	Roles    []UserRole `protobuf:"varint,2,rep,packed,name=roles,proto3,enum=jungletv.UserRole" json:"roles,omitempty"`
	Nickname *string    `protobuf:"bytes,3,opt,name=nickname,proto3,oneof" json:"nickname,omitempty"`
	Status   UserStatus `protobuf:"varint,4,opt,name=status,proto3,enum=jungletv.UserStatus" json:"status,omitempty"`
}

func (x *User) Reset() {
	*x = User{}
	if protoimpl.UnsafeEnabled {
		mi := &file_common_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *User) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*User) ProtoMessage() {}

func (x *User) ProtoReflect() protoreflect.Message {
	mi := &file_common_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use User.ProtoReflect.Descriptor instead.
func (*User) Descriptor() ([]byte, []int) {
	return file_common_proto_rawDescGZIP(), []int{0}
}

func (x *User) GetAddress() string {
	if x != nil {
		return x.Address
	}
	return ""
}

func (x *User) GetRoles() []UserRole {
	if x != nil {
		return x.Roles
	}
	return nil
}

func (x *User) GetNickname() string {
	if x != nil && x.Nickname != nil {
		return *x.Nickname
	}
	return ""
}

func (x *User) GetStatus() UserStatus {
	if x != nil {
		return x.Status
	}
	return UserStatus_USER_STATUS_OFFLINE
}

type PaginationParameters struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Offset uint64 `protobuf:"varint,1,opt,name=offset,proto3" json:"offset,omitempty"`
	Limit  uint64 `protobuf:"varint,2,opt,name=limit,proto3" json:"limit,omitempty"`
}

func (x *PaginationParameters) Reset() {
	*x = PaginationParameters{}
	if protoimpl.UnsafeEnabled {
		mi := &file_common_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *PaginationParameters) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*PaginationParameters) ProtoMessage() {}

func (x *PaginationParameters) ProtoReflect() protoreflect.Message {
	mi := &file_common_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use PaginationParameters.ProtoReflect.Descriptor instead.
func (*PaginationParameters) Descriptor() ([]byte, []int) {
	return file_common_proto_rawDescGZIP(), []int{1}
}

func (x *PaginationParameters) GetOffset() uint64 {
	if x != nil {
		return x.Offset
	}
	return 0
}

func (x *PaginationParameters) GetLimit() uint64 {
	if x != nil {
		return x.Limit
	}
	return 0
}

var File_common_proto protoreflect.FileDescriptor

var file_common_proto_rawDesc = []byte{
	0x0a, 0x0c, 0x63, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x08,
	0x6a, 0x75, 0x6e, 0x67, 0x6c, 0x65, 0x74, 0x76, 0x22, 0xa6, 0x01, 0x0a, 0x04, 0x55, 0x73, 0x65,
	0x72, 0x12, 0x18, 0x0a, 0x07, 0x61, 0x64, 0x64, 0x72, 0x65, 0x73, 0x73, 0x18, 0x01, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x07, 0x61, 0x64, 0x64, 0x72, 0x65, 0x73, 0x73, 0x12, 0x28, 0x0a, 0x05, 0x72,
	0x6f, 0x6c, 0x65, 0x73, 0x18, 0x02, 0x20, 0x03, 0x28, 0x0e, 0x32, 0x12, 0x2e, 0x6a, 0x75, 0x6e,
	0x67, 0x6c, 0x65, 0x74, 0x76, 0x2e, 0x55, 0x73, 0x65, 0x72, 0x52, 0x6f, 0x6c, 0x65, 0x52, 0x05,
	0x72, 0x6f, 0x6c, 0x65, 0x73, 0x12, 0x1f, 0x0a, 0x08, 0x6e, 0x69, 0x63, 0x6b, 0x6e, 0x61, 0x6d,
	0x65, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x48, 0x00, 0x52, 0x08, 0x6e, 0x69, 0x63, 0x6b, 0x6e,
	0x61, 0x6d, 0x65, 0x88, 0x01, 0x01, 0x12, 0x2c, 0x0a, 0x06, 0x73, 0x74, 0x61, 0x74, 0x75, 0x73,
	0x18, 0x04, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x14, 0x2e, 0x6a, 0x75, 0x6e, 0x67, 0x6c, 0x65, 0x74,
	0x76, 0x2e, 0x55, 0x73, 0x65, 0x72, 0x53, 0x74, 0x61, 0x74, 0x75, 0x73, 0x52, 0x06, 0x73, 0x74,
	0x61, 0x74, 0x75, 0x73, 0x42, 0x0b, 0x0a, 0x09, 0x5f, 0x6e, 0x69, 0x63, 0x6b, 0x6e, 0x61, 0x6d,
	0x65, 0x22, 0x44, 0x0a, 0x14, 0x50, 0x61, 0x67, 0x69, 0x6e, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x50,
	0x61, 0x72, 0x61, 0x6d, 0x65, 0x74, 0x65, 0x72, 0x73, 0x12, 0x16, 0x0a, 0x06, 0x6f, 0x66, 0x66,
	0x73, 0x65, 0x74, 0x18, 0x01, 0x20, 0x01, 0x28, 0x04, 0x52, 0x06, 0x6f, 0x66, 0x66, 0x73, 0x65,
	0x74, 0x12, 0x14, 0x0a, 0x05, 0x6c, 0x69, 0x6d, 0x69, 0x74, 0x18, 0x02, 0x20, 0x01, 0x28, 0x04,
	0x52, 0x05, 0x6c, 0x69, 0x6d, 0x69, 0x74, 0x2a, 0x92, 0x01, 0x0a, 0x08, 0x55, 0x73, 0x65, 0x72,
	0x52, 0x6f, 0x6c, 0x65, 0x12, 0x0d, 0x0a, 0x09, 0x4d, 0x4f, 0x44, 0x45, 0x52, 0x41, 0x54, 0x4f,
	0x52, 0x10, 0x00, 0x12, 0x14, 0x0a, 0x10, 0x54, 0x49, 0x45, 0x52, 0x5f, 0x31, 0x5f, 0x52, 0x45,
	0x51, 0x55, 0x45, 0x53, 0x54, 0x45, 0x52, 0x10, 0x01, 0x12, 0x14, 0x0a, 0x10, 0x54, 0x49, 0x45,
	0x52, 0x5f, 0x32, 0x5f, 0x52, 0x45, 0x51, 0x55, 0x45, 0x53, 0x54, 0x45, 0x52, 0x10, 0x02, 0x12,
	0x14, 0x0a, 0x10, 0x54, 0x49, 0x45, 0x52, 0x5f, 0x33, 0x5f, 0x52, 0x45, 0x51, 0x55, 0x45, 0x53,
	0x54, 0x45, 0x52, 0x10, 0x03, 0x12, 0x1b, 0x0a, 0x17, 0x43, 0x55, 0x52, 0x52, 0x45, 0x4e, 0x54,
	0x5f, 0x45, 0x4e, 0x54, 0x52, 0x59, 0x5f, 0x52, 0x45, 0x51, 0x55, 0x45, 0x53, 0x54, 0x45, 0x52,
	0x10, 0x04, 0x12, 0x07, 0x0a, 0x03, 0x56, 0x49, 0x50, 0x10, 0x05, 0x12, 0x0f, 0x0a, 0x0b, 0x41,
	0x50, 0x50, 0x4c, 0x49, 0x43, 0x41, 0x54, 0x49, 0x4f, 0x4e, 0x10, 0x06, 0x2a, 0x55, 0x0a, 0x0a,
	0x55, 0x73, 0x65, 0x72, 0x53, 0x74, 0x61, 0x74, 0x75, 0x73, 0x12, 0x17, 0x0a, 0x13, 0x55, 0x53,
	0x45, 0x52, 0x5f, 0x53, 0x54, 0x41, 0x54, 0x55, 0x53, 0x5f, 0x4f, 0x46, 0x46, 0x4c, 0x49, 0x4e,
	0x45, 0x10, 0x00, 0x12, 0x18, 0x0a, 0x14, 0x55, 0x53, 0x45, 0x52, 0x5f, 0x53, 0x54, 0x41, 0x54,
	0x55, 0x53, 0x5f, 0x57, 0x41, 0x54, 0x43, 0x48, 0x49, 0x4e, 0x47, 0x10, 0x01, 0x12, 0x14, 0x0a,
	0x10, 0x55, 0x53, 0x45, 0x52, 0x5f, 0x53, 0x54, 0x41, 0x54, 0x55, 0x53, 0x5f, 0x41, 0x57, 0x41,
	0x59, 0x10, 0x02, 0x42, 0x21, 0x5a, 0x1f, 0x67, 0x69, 0x74, 0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f,
	0x6d, 0x2f, 0x74, 0x6e, 0x79, 0x69, 0x6d, 0x2f, 0x6a, 0x75, 0x6e, 0x67, 0x6c, 0x65, 0x74, 0x76,
	0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_common_proto_rawDescOnce sync.Once
	file_common_proto_rawDescData = file_common_proto_rawDesc
)

func file_common_proto_rawDescGZIP() []byte {
	file_common_proto_rawDescOnce.Do(func() {
		file_common_proto_rawDescData = protoimpl.X.CompressGZIP(file_common_proto_rawDescData)
	})
	return file_common_proto_rawDescData
}

var file_common_proto_enumTypes = make([]protoimpl.EnumInfo, 2)
var file_common_proto_msgTypes = make([]protoimpl.MessageInfo, 2)
var file_common_proto_goTypes = []interface{}{
	(UserRole)(0),                // 0: jungletv.UserRole
	(UserStatus)(0),              // 1: jungletv.UserStatus
	(*User)(nil),                 // 2: jungletv.User
	(*PaginationParameters)(nil), // 3: jungletv.PaginationParameters
}
var file_common_proto_depIdxs = []int32{
	0, // 0: jungletv.User.roles:type_name -> jungletv.UserRole
	1, // 1: jungletv.User.status:type_name -> jungletv.UserStatus
	2, // [2:2] is the sub-list for method output_type
	2, // [2:2] is the sub-list for method input_type
	2, // [2:2] is the sub-list for extension type_name
	2, // [2:2] is the sub-list for extension extendee
	0, // [0:2] is the sub-list for field type_name
}

func init() { file_common_proto_init() }
func file_common_proto_init() {
	if File_common_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_common_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*User); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_common_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*PaginationParameters); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	file_common_proto_msgTypes[0].OneofWrappers = []interface{}{}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_common_proto_rawDesc,
			NumEnums:      2,
			NumMessages:   2,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_common_proto_goTypes,
		DependencyIndexes: file_common_proto_depIdxs,
		EnumInfos:         file_common_proto_enumTypes,
		MessageInfos:      file_common_proto_msgTypes,
	}.Build()
	File_common_proto = out.File
	file_common_proto_rawDesc = nil
	file_common_proto_goTypes = nil
	file_common_proto_depIdxs = nil
}
