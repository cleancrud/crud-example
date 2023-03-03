
import * as React from 'react';
import { ListAllTypeTablesReq, ListAllTypeTablesResp, AllTypeTable, AllTypeTableField, AllTypeTableFilter } from '../proto/alltypetable.api';
import { Box, Button, Card, CardBody, CardHeader, CheckBox, DataTable, Form, FormField, Layer, Page, PageContent, PageHeader, Pagination, Select, Tag, Text, TextInput, Notification } from 'grommet';
import { AllTypeTableServiceClient } from '../proto/alltypetable.api.client'
import { Close } from 'grommet-icons';
import { RpcError } from '@protobuf-ts/runtime-rpc'



export interface IAllTypeTablePageProps {
    client: AllTypeTableServiceClient
}

export interface IAllTypeTablePageState {
    request: ListAllTypeTablesReq
    response: ListAllTypeTablesResp | null
    filters: AllTypeTableFilter[]
    current_filter: AllTypeTableFilter
    current_item: AllTypeTable | null
    show_layer: boolean
    rpc_err: RpcError | null

}
export default class AllTypeTablePage extends React.Component<IAllTypeTablePageProps, IAllTypeTablePageState> {
    constructor(props: IAllTypeTablePageProps) {
        super(props);

        this.state = {
            request: {
                page: 1,
                page_size: 20,
                order_by_field: AllTypeTableField.AllTypeTable_unknow,
                order_by_desc: true,
                filters: []
            },
            response: null,
            filters: [],
            current_filter: {
                field: AllTypeTableField.AllTypeTable_unknow,
                op: "",
                value: ""
            },
            current_item: null,
            show_layer: false,
            rpc_err: null

        }
    }
    componentDidMount(): void {
        this.fetchList(this.state.request)
    }
    fetchList(req: ListAllTypeTablesReq) {
        this.props.client.listAllTypeTables(req).then((ret) => {
            this.setState((current) => ({
                ...current,
                response: ret.response,
                request: req,
                show_layer: false
            }))
        }).catch((status: RpcError) => {
            this.setState((cur) => ({ ...cur, rpc_err: status }))

        }).finally()
    }
    public render() {
        return (
            <Page>
                <PageHeader title="AllTypeTable Manager" alignSelf='center'></PageHeader>
                <PageContent>
                    <Box direction='row' gap='small' >
                        <Select
                            placeholder='Field'
                            labelKey={(option) => {
                                return AllTypeTableField[option].substring("AllTypeTable_".length)
                            }}

                            options={[
                                    AllTypeTableField.AllTypeTable_id,
                                    AllTypeTableField.AllTypeTable_t_int,
                                    AllTypeTableField.AllTypeTable_s_int,
                                    AllTypeTableField.AllTypeTable_m_int,
                                    AllTypeTableField.AllTypeTable_b_int,
                                    AllTypeTableField.AllTypeTable_f32,
                                    AllTypeTableField.AllTypeTable_f64,
                                    AllTypeTableField.AllTypeTable_decimal_mysql,
                                    AllTypeTableField.AllTypeTable_char_m,
                                    AllTypeTableField.AllTypeTable_varchar_m,
                                    AllTypeTableField.AllTypeTable_json_m,
                                    AllTypeTableField.AllTypeTable_nvarchar_m,
                                    AllTypeTableField.AllTypeTable_nchar_m,
                                    AllTypeTableField.AllTypeTable_time_m,
                                    AllTypeTableField.AllTypeTable_date_m,
                                    AllTypeTableField.AllTypeTable_data_time_m,
                                    AllTypeTableField.AllTypeTable_timestamp_m,
                                    AllTypeTableField.AllTypeTable_timestamp_update,
                                    AllTypeTableField.AllTypeTable_year_m,
                                    AllTypeTableField.AllTypeTable_t_text,
                                    AllTypeTableField.AllTypeTable_m_text,
                                    AllTypeTableField.AllTypeTable_text_m,
                                    AllTypeTableField.AllTypeTable_l_text,
                                    AllTypeTableField.AllTypeTable_binary_m,
                                    AllTypeTableField.AllTypeTable_blob_m,
                                    AllTypeTableField.AllTypeTable_l_blob,
                                    AllTypeTableField.AllTypeTable_m_blob,
                                    AllTypeTableField.AllTypeTable_t_blob,
                                    AllTypeTableField.AllTypeTable_bit_m,
                                    AllTypeTableField.AllTypeTable_enum_m,
                                    AllTypeTableField.AllTypeTable_set_m,
                                    AllTypeTableField.AllTypeTable_bool_m,  
                               
                            ]}
                            value={this.state.current_filter?.field}
                            onChange={({ option }) => {

                                let f: AllTypeTableFilter = this.state.current_filter
                                    ? {
                                        field: option,
                                        op: this.state.current_filter.op,
                                        value: this.state.current_filter.value
                                    }
                                    : {
                                        field: option,
                                        op: "=",
                                        value: ""
                                    }
                                this.setState(
                                    (current) => ({
                                        ...current,
                                        current_filter: f
                                    })
                                )
                            }}
                        />
                        <Select
                            placeholder="Operator"
                            options={["=", "<>", ">", ">=", "<", "<=", "IN", "NOT IN", "LIKE"]}
                            value={this.state.current_filter?.op}
                            onChange={({ option }) => {
                                let f: AllTypeTableFilter = this.state.current_filter
                                    ? {
                                        field: this.state.current_filter.field,
                                        op: option,
                                        value: this.state.current_filter.value
                                    }
                                    : {
                                        field: AllTypeTableField.AllTypeTable_id,
                                        op: option,
                                        value: ""
                                    }

                                this.setState(
                                    (current) => ({
                                        ...current,
                                        current_filter: f
                                    })
                                )
                            }}
                        />
                        <TextInput
                            placeholder="Condition Value"
                            value={this.state.current_filter?.value}
                            onChange={event => {
                                let f: AllTypeTableFilter = this.state.current_filter
                                    ? {
                                        field: this.state.current_filter.field,
                                        op: this.state.current_filter.op,
                                        value: event.target.value.toString()
                                    }
                                    : {
                                        field: AllTypeTableField.AllTypeTable_id,
                                        op: "=",
                                        value: event.target.value.toString()
                                    }
                                this.setState(
                                    (current) => ({
                                        ...current,
                                        current_filter: f
                                    })
                                )
                            }}
                        />
                        <Button
                            label="+Add"
                            onClick={() => {
                                let f = this.state.filters
                                if (this.state.current_filter) {
                                    f.push(this.state.current_filter)
                                    this.setState((cur) => ({
                                        ...cur,
                                        filters: f
                                    }))
                                }
                            }

                            }
                        />
                        <Select
                            placeholder='OrderBy'
                            labelKey={(option) => {
                                return AllTypeTableField[option].substring("AllTypeTable_".length)
                            }}

                            options={[
                                    AllTypeTableField.AllTypeTable_id,
                                    AllTypeTableField.AllTypeTable_t_int,
                                    AllTypeTableField.AllTypeTable_s_int,
                                    AllTypeTableField.AllTypeTable_m_int,
                                    AllTypeTableField.AllTypeTable_b_int,
                                    AllTypeTableField.AllTypeTable_f32,
                                    AllTypeTableField.AllTypeTable_f64,
                                    AllTypeTableField.AllTypeTable_decimal_mysql,
                                    AllTypeTableField.AllTypeTable_char_m,
                                    AllTypeTableField.AllTypeTable_varchar_m,
                                    AllTypeTableField.AllTypeTable_json_m,
                                    AllTypeTableField.AllTypeTable_nvarchar_m,
                                    AllTypeTableField.AllTypeTable_nchar_m,
                                    AllTypeTableField.AllTypeTable_time_m,
                                    AllTypeTableField.AllTypeTable_date_m,
                                    AllTypeTableField.AllTypeTable_data_time_m,
                                    AllTypeTableField.AllTypeTable_timestamp_m,
                                    AllTypeTableField.AllTypeTable_timestamp_update,
                                    AllTypeTableField.AllTypeTable_year_m,
                                    AllTypeTableField.AllTypeTable_t_text,
                                    AllTypeTableField.AllTypeTable_m_text,
                                    AllTypeTableField.AllTypeTable_text_m,
                                    AllTypeTableField.AllTypeTable_l_text,
                                    AllTypeTableField.AllTypeTable_binary_m,
                                    AllTypeTableField.AllTypeTable_blob_m,
                                    AllTypeTableField.AllTypeTable_l_blob,
                                    AllTypeTableField.AllTypeTable_m_blob,
                                    AllTypeTableField.AllTypeTable_t_blob,
                                    AllTypeTableField.AllTypeTable_bit_m,
                                    AllTypeTableField.AllTypeTable_enum_m,
                                    AllTypeTableField.AllTypeTable_set_m,
                                    AllTypeTableField.AllTypeTable_bool_m,  
                            ]}
                            value={this.state.request.order_by_field}
                            onChange={({ option }) => {
                                let request = this.state.request
                                request.order_by_field = option
                                this.fetchList(request)
                            }}
                        />

                        <CheckBox
                            checked={this.state.request.order_by_desc}
                            label="IsDesc"
                            onChange={(event) => {
                                let request = this.state.request
                                request.order_by_desc = event.target.checked
                                this.fetchList(request)
                            }}

                        />

                        <Button
                            label="Fliter"
                            onClick={() => {
                                this.fetchList({
                                    ...this.state.request,
                                    filters: this.state.filters
                                })
                            }
                            }
                        />
                    </Box>

                    {
                        this.state.filters.length > 0 ?
                            <Box
                                align="center"
                                pad="large"
                                direction='row'>
                                {
                                    this.state.filters.map((item, index) => {

                                        let field = AllTypeTableField[item.field].substring("AllTypeTable_".length)
                                        return <Tag
                                            key={index}
                                            value={field + " " + item.op + " " + item.value}
                                            onRemove={() => {
                                                let f = this.state.filters
                                                if (index > -1) {
                                                    f.splice(index, 1);
                                                }
                                                this.setState((cur) => ({
                                                    ...cur,
                                                    filters: f
                                                }))
                                            }}
                                        />
                                    })
                                }
                            </Box>
                            : ""
                    }
                    <DataTable
                        columns={[
                                        {
                                            property: 'id',
                                            header: '自增id',
                                            render: datum => (
                                                datum.id.toString()
                                            ),
                                        },
                                        {
                                            property: 't_int',
                                            header: '小小整型',
                                            render: datum => (
                                                datum.t_int.toString()
                                            ),
                                        },
                                        {
                                            property: 's_int',
                                            header: '小整数',
                                            render: datum => (
                                                datum.s_int.toString()
                                            ),
                                        },
                                        {
                                            property: 'm_int',
                                            header: '中整数',
                                            render: datum => (
                                                datum.m_int.toString()
                                            ),
                                        },
                                        {
                                            property: 'b_int',
                                            header: '大整数',
                                            render: datum => (
                                                datum.b_int.toString()
                                            ),
                                        },
                                        {
                                            property: 'f32',
                                            header: '小浮点',
                                            render: datum => (
                                                datum.f32.toString()
                                            ),
                                        },
                                        {
                                            property: 'f64',
                                            header: '大浮点',
                                            render: datum => (
                                                datum.f64.toString()
                                            ),
                                        },
                                        {
                                            property: 'decimal_mysql',
                                            header: '',
                                            render: datum => (
                                                datum.decimal_mysql.toString()
                                            ),
                                        },
                                        {
                                            property: 'char_m',
                                            header: '',
                                            render: datum => (
                                                datum.char_m.toString()
                                            ),
                                        },
                                        {
                                            property: 'varchar_m',
                                            header: '',
                                            render: datum => (
                                                datum.varchar_m.toString()
                                            ),
                                        },
                                        {
                                            property: 'json_m',
                                            header: '',
                                            render: datum => (
                                                datum.json_m.toString()
                                            ),
                                        },
                                        {
                                            property: 'nvarchar_m',
                                            header: '',
                                            render: datum => (
                                                datum.nvarchar_m.toString()
                                            ),
                                        },
                                        {
                                            property: 'nchar_m',
                                            header: '',
                                            render: datum => (
                                                datum.nchar_m.toString()
                                            ),
                                        },
                                        {
                                            property: 'time_m',
                                            header: '',
                                            render: datum => (
                                                datum.time_m.toString()
                                            ),
                                        },
                                        {
                                            property: 'date_m',
                                            header: '',
                                            render: datum => (
                                                datum.date_m.toString()
                                            ),
                                        },
                                        {
                                            property: 'data_time_m',
                                            header: '',
                                            render: datum => (
                                                datum.data_time_m.toString()
                                            ),
                                        },
                                        {
                                            property: 'timestamp_m',
                                            header: '创建时间',
                                            render: datum => (
                                                datum.timestamp_m.toString()
                                            ),
                                        },
                                        {
                                            property: 'timestamp_update',
                                            header: '更新时间',
                                            render: datum => (
                                                datum.timestamp_update.toString()
                                            ),
                                        },
                                        {
                                            property: 'year_m',
                                            header: '年',
                                            render: datum => (
                                                datum.year_m.toString()
                                            ),
                                        },
                                        {
                                            property: 't_text',
                                            header: '',
                                            render: datum => (
                                                datum.t_text.toString()
                                            ),
                                        },
                                        {
                                            property: 'm_text',
                                            header: '',
                                            render: datum => (
                                                datum.m_text.toString()
                                            ),
                                        },
                                        {
                                            property: 'text_m',
                                            header: '',
                                            render: datum => (
                                                datum.text_m.toString()
                                            ),
                                        },
                                        {
                                            property: 'l_text',
                                            header: '',
                                            render: datum => (
                                                datum.l_text.toString()
                                            ),
                                        },
                                        {
                                            property: 'binary_m',
                                            header: '',
                                            render: datum => (
                                                datum.binary_m.toString()
                                            ),
                                        },
                                        {
                                            property: 'blob_m',
                                            header: '',
                                            render: datum => (
                                                datum.blob_m.toString()
                                            ),
                                        },
                                        {
                                            property: 'l_blob',
                                            header: '',
                                            render: datum => (
                                                datum.l_blob.toString()
                                            ),
                                        },
                                        {
                                            property: 'm_blob',
                                            header: '',
                                            render: datum => (
                                                datum.m_blob.toString()
                                            ),
                                        },
                                        {
                                            property: 't_blob',
                                            header: '',
                                            render: datum => (
                                                datum.t_blob.toString()
                                            ),
                                        },
                                        {
                                            property: 'bit_m',
                                            header: '',
                                            render: datum => (
                                                datum.bit_m.toString()
                                            ),
                                        },
                                        {
                                            property: 'enum_m',
                                            header: '',
                                            render: datum => (
                                                datum.enum_m.toString()
                                            ),
                                        },
                                        {
                                            property: 'set_m',
                                            header: '',
                                            render: datum => (
                                                datum.set_m.toString()
                                            ),
                                        },
                                        {
                                            property: 'bool_m',
                                            header: '',
                                            render: datum => (
                                                datum.bool_m.toString()
                                            ),
                                        },  

                        ]}
                        data={this.state.response?.all_type_tables}
                        onClickRow={(event) => {
                            this.setState((cur) => ({
                                ...cur,
                                current_item: event.datum,
                                show_layer: true
                            }))
                        }}
                    />

                    <Box
                        direction='row'
                        justify='between'>
                        <Button
                            label="New"
                            onClick={
                                () => {
                                    let edit: AllTypeTable = {
                                            id:0n ,
                                            t_int:0n ,
                                            s_int:0n ,
                                            m_int:0n ,
                                            b_int:0n ,
                                            f32:0 ,
                                            f64:0 ,
                                            decimal_mysql:0 ,
                                            char_m:'' ,
                                            varchar_m:'' ,
                                            json_m:'' ,
                                            nvarchar_m:'' ,
                                            nchar_m:'' ,
                                            time_m:'' ,
                                            date_m:'' ,
                                            data_time_m:'' ,
                                            timestamp_m:'' ,
                                            timestamp_update:'' ,
                                            year_m:'' ,
                                            t_text:'' ,
                                            m_text:'' ,
                                            text_m:'' ,
                                            l_text:'' ,
                                            binary_m:new Uint8Array() ,
                                            blob_m:new Uint8Array() ,
                                            l_blob:new Uint8Array() ,
                                            m_blob:new Uint8Array() ,
                                            t_blob:new Uint8Array() ,
                                            bit_m:new Uint8Array(1) ,
                                            enum_m:'y' ,
                                            set_m:'a' ,
                                            bool_m:0n , 
                                       
                                    }
                                    this.setState((cur) => ({
                                        ...cur, current_item: edit, show_layer: true
                                    }))
                                }
                            }
                        />

                        <Pagination
                            numberItems={this.state.response?.total_count}
                            step={this.state.request.page_size}
                            page={this.state.request.page}
                            onChange={({ page }) => {
                                let req: ListAllTypeTablesReq = {
                                    ...this.state.request,
                                    page: page
                                }
                                this.fetchList(req)
                            }}
                        />
                        <Box direction='row'>

                            <Select
                                size='small'
                                placeholder="page_size"
                                options={[20, 50, 100]}
                                value={this.state.request.page_size}
                                onChange={({ option }) => {
                                    let request = this.state.request
                                    if (request.page_size != option) {
                                        request.page_size = option
                                        this.fetchList(request)
                                    }
                                }}
                            />
                            <Tag
                                name="total"
                                value={this.state.response ? this.state.response.total_count : 0}
                            />
                        </Box>

                    </Box>

                    {
                        this.state.current_item && this.state.show_layer ?
                            <Layer
                                position="center"
                                modal
                                onClickOutside={() => {
                                    this.setState((cur) => ({ ...cur, show_layer: false }))
                                }}
                                onEsc={() => {
                                    this.setState((cur) => ({ ...cur, show_layer: false }))
                                }}
                            >
                                <Card overflow={ {vertical:'scroll' } }>
                                    <CardHeader pad="medium" >Edit
                                        <Button icon={<Close />}
                                            onClick={() => {
                                                this.setState((cur) => ({
                                                    ...cur,
                                                    show_layer: false
                                                }))
                                            }} />
                                    </CardHeader>
                                    <CardBody pad="small">
                                        <Form
                                            value={this.state.current_item}
                                            onChange={(nextValue: AllTypeTable, options) => {

                                                this.setState((cur) => ({
                                                    ...cur,
                                                    current_item: nextValue
                                                }))
                                            }}
                                            onSubmit={(event) => {
                                                if (event.value.id > 0) {
                                                    this.props.client.updateAllTypeTable({
                                                        all_type_table: event.value,
                                                        update_mask: Object.keys(event.touched)
                                                    })
                                                        .then(() => {
                                                            this.fetchList(this.state.request)
                                                        }).catch((status: RpcError) => {
                                                            this.setState((cur) => ({ ...cur, rpc_err: status }))

                                                        })

                                                } else {
                                                    this.props.client.createAllTypeTable(event.value)
                                                        .then(() => {
                                                            this.fetchList(this.state.request)
                                                        }).catch((status: RpcError) => {
                                                            this.setState((cur) => ({ ...cur, rpc_err: status }))

                                                        })
                                                }
                                            }}
                                        >
                                            <FormField
                                                name="id"
                                                htmlFor="text-input-id"
                                                label="自增id">
                                                <TextInput
                                                    id="text-input-id"
                                                    name="id"
 	                                                
                                                    disabled
                                                    
                                                    value={this.state.current_item.id.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="t_int"
                                                htmlFor="text-input-t_int"
                                                label="小小整型">
                                                <TextInput
                                                    id="text-input-t_int"
                                                    name="t_int"
 	                                                
                                                    value={this.state.current_item.t_int.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="s_int"
                                                htmlFor="text-input-s_int"
                                                label="小整数">
                                                <TextInput
                                                    id="text-input-s_int"
                                                    name="s_int"
 	                                                
                                                    value={this.state.current_item.s_int.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="m_int"
                                                htmlFor="text-input-m_int"
                                                label="中整数">
                                                <TextInput
                                                    id="text-input-m_int"
                                                    name="m_int"
 	                                                
                                                    value={this.state.current_item.m_int.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="b_int"
                                                htmlFor="text-input-b_int"
                                                label="大整数">
                                                <TextInput
                                                    id="text-input-b_int"
                                                    name="b_int"
 	                                                
                                                    value={this.state.current_item.b_int.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="f32"
                                                htmlFor="text-input-f32"
                                                label="小浮点">
                                                <TextInput
                                                    id="text-input-f32"
                                                    name="f32"
 	                                                
                                                    value={this.state.current_item.f32.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="f64"
                                                htmlFor="text-input-f64"
                                                label="大浮点">
                                                <TextInput
                                                    id="text-input-f64"
                                                    name="f64"
 	                                                
                                                    value={this.state.current_item.f64.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="decimal_mysql"
                                                htmlFor="text-input-decimal_mysql"
                                                label="">
                                                <TextInput
                                                    id="text-input-decimal_mysql"
                                                    name="decimal_mysql"
 	                                                
                                                    value={this.state.current_item.decimal_mysql.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="char_m"
                                                htmlFor="text-input-char_m"
                                                label="">
                                                <TextInput
                                                    id="text-input-char_m"
                                                    name="char_m"
 	                                                
                                                    value={this.state.current_item.char_m.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="varchar_m"
                                                htmlFor="text-input-varchar_m"
                                                label="">
                                                <TextInput
                                                    id="text-input-varchar_m"
                                                    name="varchar_m"
 	                                                
                                                    value={this.state.current_item.varchar_m.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="json_m"
                                                htmlFor="text-input-json_m"
                                                label="">
                                                <TextInput
                                                    id="text-input-json_m"
                                                    name="json_m"
 	                                                
                                                    value={this.state.current_item.json_m.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="nvarchar_m"
                                                htmlFor="text-input-nvarchar_m"
                                                label="">
                                                <TextInput
                                                    id="text-input-nvarchar_m"
                                                    name="nvarchar_m"
 	                                                
                                                    value={this.state.current_item.nvarchar_m.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="nchar_m"
                                                htmlFor="text-input-nchar_m"
                                                label="">
                                                <TextInput
                                                    id="text-input-nchar_m"
                                                    name="nchar_m"
 	                                                
                                                    value={this.state.current_item.nchar_m.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="time_m"
                                                htmlFor="text-input-time_m"
                                                label="">
                                                <TextInput
                                                    id="text-input-time_m"
                                                    name="time_m"
 	                                                
                                                    value={this.state.current_item.time_m.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="date_m"
                                                htmlFor="text-input-date_m"
                                                label="">
                                                <TextInput
                                                    id="text-input-date_m"
                                                    name="date_m"
 	                                                
                                                    value={this.state.current_item.date_m.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="data_time_m"
                                                htmlFor="text-input-data_time_m"
                                                label="">
                                                <TextInput
                                                    id="text-input-data_time_m"
                                                    name="data_time_m"
 	                                                
                                                    value={this.state.current_item.data_time_m.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="timestamp_m"
                                                htmlFor="text-input-timestamp_m"
                                                label="创建时间">
                                                <TextInput
                                                    id="text-input-timestamp_m"
                                                    name="timestamp_m"
 	                                                
                                                    value={this.state.current_item.timestamp_m.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="timestamp_update"
                                                htmlFor="text-input-timestamp_update"
                                                label="更新时间">
                                                <TextInput
                                                    id="text-input-timestamp_update"
                                                    name="timestamp_update"
 	                                                
                                                    value={this.state.current_item.timestamp_update.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="year_m"
                                                htmlFor="text-input-year_m"
                                                label="年">
                                                <TextInput
                                                    id="text-input-year_m"
                                                    name="year_m"
 	                                                
                                                    value={this.state.current_item.year_m.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="t_text"
                                                htmlFor="text-input-t_text"
                                                label="">
                                                <TextInput
                                                    id="text-input-t_text"
                                                    name="t_text"
 	                                                
                                                    value={this.state.current_item.t_text.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="m_text"
                                                htmlFor="text-input-m_text"
                                                label="">
                                                <TextInput
                                                    id="text-input-m_text"
                                                    name="m_text"
 	                                                
                                                    value={this.state.current_item.m_text.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="text_m"
                                                htmlFor="text-input-text_m"
                                                label="">
                                                <TextInput
                                                    id="text-input-text_m"
                                                    name="text_m"
 	                                                
                                                    value={this.state.current_item.text_m.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="l_text"
                                                htmlFor="text-input-l_text"
                                                label="">
                                                <TextInput
                                                    id="text-input-l_text"
                                                    name="l_text"
 	                                                
                                                    value={this.state.current_item.l_text.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="binary_m"
                                                htmlFor="text-input-binary_m"
                                                label="">
                                                <TextInput
                                                    id="text-input-binary_m"
                                                    name="binary_m"
 	                                                
                                                    value={this.state.current_item.binary_m.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="blob_m"
                                                htmlFor="text-input-blob_m"
                                                label="">
                                                <TextInput
                                                    id="text-input-blob_m"
                                                    name="blob_m"
 	                                                
                                                    value={this.state.current_item.blob_m.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="l_blob"
                                                htmlFor="text-input-l_blob"
                                                label="">
                                                <TextInput
                                                    id="text-input-l_blob"
                                                    name="l_blob"
 	                                                
                                                    value={this.state.current_item.l_blob.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="m_blob"
                                                htmlFor="text-input-m_blob"
                                                label="">
                                                <TextInput
                                                    id="text-input-m_blob"
                                                    name="m_blob"
 	                                                
                                                    value={this.state.current_item.m_blob.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="t_blob"
                                                htmlFor="text-input-t_blob"
                                                label="">
                                                <TextInput
                                                    id="text-input-t_blob"
                                                    name="t_blob"
 	                                                
                                                    value={this.state.current_item.t_blob.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="bit_m"
                                                htmlFor="text-input-bit_m"
                                                label="">
                                                <TextInput
                                                    id="text-input-bit_m"
                                                    name="bit_m"
 	                                                
                                                    value={this.state.current_item.bit_m.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="enum_m"
                                                htmlFor="text-input-enum_m"
                                                label="">
                                                <TextInput
                                                    id="text-input-enum_m"
                                                    name="enum_m"
 	                                                
                                                    value={this.state.current_item.enum_m.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="set_m"
                                                htmlFor="text-input-set_m"
                                                label="">
                                                <TextInput
                                                    id="text-input-set_m"
                                                    name="set_m"
 	                                                
                                                    value={this.state.current_item.set_m.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="bool_m"
                                                htmlFor="text-input-bool_m"
                                                label="">
                                                <TextInput
                                                    id="text-input-bool_m"
                                                    name="bool_m"
 	                                                
                                                    value={this.state.current_item.bool_m.toString()}
                                                />
                                            </FormField>  
                                            <Box
                                                direction="row"
                                                justify='between'  >
                                                <Button
                                                    type="submit"
                                                    primary
                                                    label="Save"
                                                />
                                                <Button
                                                    color='red'
                                                    type="button"
                                                    label="Delete"
                                                    onClick={
                                                        (event) => {
                                                            let id = this.state.current_item?.id
                                                            if (id) {
                                                                this.props.client.deleteAllTypeTable({ id: id })
                                                                    .then(() => {
                                                                        this.fetchList(this.state.request)
                                                                        this.setState((cur) => ({
                                                                            ...cur,
                                                                            current_item: null,
                                                                        }))
                                                                    })
                                                            }
                                                        }
                                                    } />
                                            </Box>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Layer>
                            : null
                    }
                </PageContent>
                {
                    this.state.rpc_err ? <Notification
                        toast
                        time={3000}
                        title={this.state.rpc_err.code}
                        message={this.state.rpc_err.message}
                        onClose={() => {
                            this.setState((cur) => ({
                                ...cur,
                                rpc_err: null
                            }))
                        }}
                        status="warning"
                    /> :
                        null
                }
            </Page>
        );
    }

}