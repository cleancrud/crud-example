package service

import (
	"context"
	"math"
	"strings"
	"time"

	"github.com/happycrud/crud-grpc-gin-micro-service-example/api"
	"github.com/happycrud/crud-grpc-gin-micro-service-example/crud"
	"github.com/happycrud/crud-grpc-gin-micro-service-example/crud/alltypetable"

	"github.com/happycrud/crud/xsql"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
)

// AllTypeTableServiceImpl AllTypeTableServiceImpl
type AllTypeTableServiceImpl struct {
	api.UnimplementedAllTypeTableServiceServer
	Client *crud.Client
}

type IValidateAllTypeTable interface {
	ValidateAllTypeTable(a *api.AllTypeTable) error
}

// CreateAllTypeTable CreateAllTypeTable
func (s *AllTypeTableServiceImpl) CreateAllTypeTable(ctx context.Context, req *api.AllTypeTable) (*api.AllTypeTable, error) {
	if checker, ok := interface{}(s).(IValidateAllTypeTable); ok {
		if err := checker.ValidateAllTypeTable(req); err != nil {
			return nil, err
		}
	}

	a := &alltypetable.AllTypeTable{
		Id:              0,
		TInt:            req.GetTInt(),
		SInt:            req.GetSInt(),
		MInt:            req.GetMInt(),
		BInt:            req.GetBInt(),
		F32:             req.GetF32(),
		F64:             req.GetF64(),
		DecimalMysql:    req.GetDecimalMysql(),
		CharM:           req.GetCharM(),
		VarcharM:        req.GetVarcharM(),
		JsonM:           req.GetJsonM(),
		NvarcharM:       req.GetNvarcharM(),
		NcharM:          req.GetNcharM(),
		TimeM:           req.GetTimeM(),
		TimestampM:      time.Now(),
		TimestampUpdate: time.Now(),
		YearM:           req.GetYearM(),
		TText:           req.GetTText(),
		MText:           req.GetMText(),
		TextM:           req.GetTextM(),
		LText:           req.GetLText(),
		BinaryM:         req.GetBinaryM(),
		BlobM:           req.GetBlobM(),
		LBlob:           req.GetLBlob(),
		MBlob:           req.GetMBlob(),
		TBlob:           req.GetTBlob(),
		BitM:            req.GetBitM(),
		EnumM:           req.GetEnumM(),
		SetM:            req.GetSetM(),
		BoolM:           req.GetBoolM(),
	}
	var err error
	if a.DateM, err = time.ParseInLocation("2006-01-02", req.GetDateM(), time.Local); err != nil {
		return nil, err
	}
	if a.DataTimeM, err = time.ParseInLocation("2006-01-02 15:04:05", req.GetDataTimeM(), time.Local); err != nil {
		return nil, err
	}
	_, err = s.Client.AllTypeTable.
		Create().
		SetAllTypeTable(a).
		Save(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	// query after create and return
	a2, err := s.Client.Master.AllTypeTable.
		Find().
		Where(
			alltypetable.IdOp.EQ(a.Id),
		).
		One(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	return convertAllTypeTable(a2), nil
}

// DeleteAllTypeTable DeleteAllTypeTable
func (s *AllTypeTableServiceImpl) DeleteAllTypeTable(ctx context.Context, req *api.AllTypeTableId) (*emptypb.Empty, error) {
	_, err := s.Client.AllTypeTable.
		Delete().
		Where(
			alltypetable.IdOp.EQ(req.GetId()),
		).
		Exec(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	return &emptypb.Empty{}, nil
}

// Updatealltypetable UpdateAllTypeTable
func (s *AllTypeTableServiceImpl) UpdateAllTypeTable(ctx context.Context, req *api.UpdateAllTypeTableReq) (*api.AllTypeTable, error) {
	if checker, ok := interface{}(s).(IValidateAllTypeTable); ok {
		if err := checker.ValidateAllTypeTable(req.AllTypeTable); err != nil {
			return nil, err
		}
	}
	if len(req.GetUpdateMask()) == 0 {
		return nil, status.Error(codes.InvalidArgument, "empty filter condition")
	}
	update := s.Client.AllTypeTable.Update()
	for _, v := range req.GetUpdateMask() {
		switch v {
		case alltypetable.TInt:
			update.SetTInt(req.GetAllTypeTable().GetTInt())
		case alltypetable.SInt:
			update.SetSInt(req.GetAllTypeTable().GetSInt())
		case alltypetable.MInt:
			update.SetMInt(req.GetAllTypeTable().GetMInt())
		case alltypetable.BInt:
			update.SetBInt(req.GetAllTypeTable().GetBInt())
		case alltypetable.F32:
			update.SetF32(req.GetAllTypeTable().GetF32())
		case alltypetable.F64:
			update.SetF64(req.GetAllTypeTable().GetF64())
		case alltypetable.DecimalMysql:
			update.SetDecimalMysql(req.GetAllTypeTable().GetDecimalMysql())
		case alltypetable.CharM:
			update.SetCharM(req.GetAllTypeTable().GetCharM())
		case alltypetable.VarcharM:
			update.SetVarcharM(req.GetAllTypeTable().GetVarcharM())
		case alltypetable.JsonM:
			update.SetJsonM(req.GetAllTypeTable().GetJsonM())
		case alltypetable.NvarcharM:
			update.SetNvarcharM(req.GetAllTypeTable().GetNvarcharM())
		case alltypetable.NcharM:
			update.SetNcharM(req.GetAllTypeTable().GetNcharM())
		case alltypetable.TimeM:
			update.SetTimeM(req.GetAllTypeTable().GetTimeM())
		case alltypetable.DateM:
			t, err := time.ParseInLocation("2006-01-02", req.GetAllTypeTable().GetDateM(), time.Local)
			if err != nil {
				return nil, status.Error(codes.InvalidArgument, err.Error())
			}
			update.SetDateM(t)
		case alltypetable.DataTimeM:
			t, err := time.ParseInLocation("2006-01-02 15:04:05", req.GetAllTypeTable().GetDataTimeM(), time.Local)
			if err != nil {
				return nil, status.Error(codes.InvalidArgument, err.Error())
			}
			update.SetDataTimeM(t)
		case alltypetable.TimestampM:
			t, err := time.ParseInLocation("2006-01-02 15:04:05", req.GetAllTypeTable().GetTimestampM(), time.Local)
			if err != nil {
				return nil, status.Error(codes.InvalidArgument, err.Error())
			}
			update.SetTimestampM(t)
		case alltypetable.TimestampUpdate:
			t, err := time.ParseInLocation("2006-01-02 15:04:05", req.GetAllTypeTable().GetTimestampUpdate(), time.Local)
			if err != nil {
				return nil, status.Error(codes.InvalidArgument, err.Error())
			}
			update.SetTimestampUpdate(t)
		case alltypetable.YearM:
			update.SetYearM(req.GetAllTypeTable().GetYearM())
		case alltypetable.TText:
			update.SetTText(req.GetAllTypeTable().GetTText())
		case alltypetable.MText:
			update.SetMText(req.GetAllTypeTable().GetMText())
		case alltypetable.TextM:
			update.SetTextM(req.GetAllTypeTable().GetTextM())
		case alltypetable.LText:
			update.SetLText(req.GetAllTypeTable().GetLText())
		case alltypetable.BinaryM:
			update.SetBinaryM(req.GetAllTypeTable().GetBinaryM())
		case alltypetable.BlobM:
			update.SetBlobM(req.GetAllTypeTable().GetBlobM())
		case alltypetable.LBlob:
			update.SetLBlob(req.GetAllTypeTable().GetLBlob())
		case alltypetable.MBlob:
			update.SetMBlob(req.GetAllTypeTable().GetMBlob())
		case alltypetable.TBlob:
			update.SetTBlob(req.GetAllTypeTable().GetTBlob())
		case alltypetable.BitM:
			update.SetBitM(req.GetAllTypeTable().GetBitM())
		case alltypetable.EnumM:
			update.SetEnumM(req.GetAllTypeTable().GetEnumM())
		case alltypetable.SetM:
			update.SetSetM(req.GetAllTypeTable().GetSetM())
		case alltypetable.BoolM:
			update.SetBoolM(req.GetAllTypeTable().GetBoolM())
		}
	}
	_, err := update.
		Where(
			alltypetable.IdOp.EQ(req.GetAllTypeTable().GetId()),
		).
		Save(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	// query after update and return
	a, err := s.Client.Master.AllTypeTable.
		Find().
		Where(
			alltypetable.IdOp.EQ(req.GetAllTypeTable().GetId()),
		).
		One(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	return convertAllTypeTable(a), nil
}

// GetAllTypeTable GetAllTypeTable
func (s *AllTypeTableServiceImpl) GetAllTypeTable(ctx context.Context, req *api.AllTypeTableId) (*api.AllTypeTable, error) {
	a, err := s.Client.AllTypeTable.
		Find().
		Where(
			alltypetable.IdOp.EQ(req.GetId()),
		).
		One(ctx)
	if err != nil {
		return nil, status.Error(codes.NotFound, err.Error())
	}
	return convertAllTypeTable(a), nil
}

// ListAllTypeTables ListAllTypeTables
func (s *AllTypeTableServiceImpl) ListAllTypeTables(ctx context.Context, req *api.ListAllTypeTablesReq) (*api.ListAllTypeTablesResp, error) {
	page := req.GetPage()
	size := req.GetPageSize()
	if size <= 0 {
		size = 20
	}
	offset := size * (page - 1)
	if offset < 0 {
		offset = 0
	}
	finder := s.Client.AllTypeTable.
		Find().
		Offset(offset).
		Limit(size)

	if req.GetOrderByField() == api.AllTypeTableField_AllTypeTable_unknow {
		req.OrderByField = api.AllTypeTableField_AllTypeTable_id
	}
	odb := strings.TrimPrefix(req.GetOrderByField().String(), "AllTypeTable_")
	if req.GetOrderByDesc() {
		finder.OrderDesc(odb)
	} else {
		finder.OrderAsc(odb)
	}
	counter := s.Client.AllTypeTable.
		Find().
		Count()

	var ps []*xsql.Predicate
	for _, v := range req.GetFilters() {
		p, err := xsql.GenP(strings.TrimPrefix(v.Field.String(), "AllTypeTable_"), v.Op, v.Value)
		if err != nil {
			return nil, err
		}
		ps = append(ps, p)
	}
	if len(ps) > 0 {
		p := xsql.And(ps...)
		finder.WhereP(p)
		counter.WhereP(p)
	}
	list, err := finder.All(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	count, err := counter.Int64(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	pageCount := int32(math.Ceil(float64(count) / float64(size)))

	return &api.ListAllTypeTablesResp{AllTypeTables: convertAllTypeTableList(list), TotalCount: int32(count), PageCount: pageCount}, nil
}

func convertAllTypeTable(a *alltypetable.AllTypeTable) *api.AllTypeTable {
	return &api.AllTypeTable{
		Id:              a.Id,
		TInt:            a.TInt,
		SInt:            a.SInt,
		MInt:            a.MInt,
		BInt:            a.BInt,
		F32:             a.F32,
		F64:             a.F64,
		DecimalMysql:    a.DecimalMysql,
		CharM:           a.CharM,
		VarcharM:        a.VarcharM,
		JsonM:           a.JsonM,
		NvarcharM:       a.NvarcharM,
		NcharM:          a.NcharM,
		TimeM:           a.TimeM,
		DateM:           a.DateM.Format("2006-01-02"),
		DataTimeM:       a.DataTimeM.Format("2006-01-02 15:04:05"),
		TimestampM:      a.TimestampM.Format("2006-01-02 15:04:05"),
		TimestampUpdate: a.TimestampUpdate.Format("2006-01-02 15:04:05"),
		YearM:           a.YearM,
		TText:           a.TText,
		MText:           a.MText,
		TextM:           a.TextM,
		LText:           a.LText,
		BinaryM:         a.BinaryM,
		BlobM:           a.BlobM,
		LBlob:           a.LBlob,
		MBlob:           a.MBlob,
		TBlob:           a.TBlob,
		BitM:            a.BitM,
		EnumM:           a.EnumM,
		SetM:            a.SetM,
		BoolM:           a.BoolM,
	}
}

func convertAllTypeTableList(list []*alltypetable.AllTypeTable) []*api.AllTypeTable {
	ret := make([]*api.AllTypeTable, 0, len(list))
	for _, v := range list {
		ret = append(ret, convertAllTypeTable(v))
	}
	return ret
}
