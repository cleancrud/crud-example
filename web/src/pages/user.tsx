
import * as React from 'react';
import { ListUsersReq, ListUsersResp, User, UserField, UserFilter } from '../proto/user.api';
import { Box, Button, Card, CardBody, CardHeader, CheckBox, DataTable, Form, FormField, Layer, Page, PageContent, PageHeader, Pagination, Select, Tag, Text, TextInput, Notification } from 'grommet';
import { UserServiceClient } from '../proto/user.api.client'
import { Close } from 'grommet-icons';
import { RpcError } from '@protobuf-ts/runtime-rpc'



export interface IUserPageProps {
    client: UserServiceClient
}

export interface IUserPageState {
    request: ListUsersReq
    response: ListUsersResp | null
    filters: UserFilter[]
    current_filter: UserFilter
    current_item: User | null
    show_layer: boolean
    rpc_err: RpcError | null

}
export default class UserPage extends React.Component<IUserPageProps, IUserPageState> {
    constructor(props: IUserPageProps) {
        super(props);

        this.state = {
            request: {
                page: 1,
                page_size: 20,
                order_by_field: UserField.User_unknow,
                order_by_desc: true,
                filters: []
            },
            response: null,
            filters: [],
            current_filter: {
                field: UserField.User_unknow,
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
    fetchList(req: ListUsersReq) {
        this.props.client.listUsers(req).then((ret) => {
            console.log(req,ret )
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
                <PageHeader title="User Manager" alignSelf='center'></PageHeader>
                <PageContent>
                    <Box direction='row' gap='small' >
                        <Select
                            placeholder='Field'
                            labelKey={(option) => {
                                return UserField[option].substring("User_".length)
                            }}

                            options={[
                                    UserField.User_id,
                                    UserField.User_name,
                                    UserField.User_age,
                                    UserField.User_ctime,
                                    UserField.User_mtime,  
                               
                            ]}
                            value={this.state.current_filter?.field}
                            onChange={({ option }) => {

                                let f: UserFilter = this.state.current_filter
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
                                let f: UserFilter = this.state.current_filter
                                    ? {
                                        field: this.state.current_filter.field,
                                        op: option,
                                        value: this.state.current_filter.value
                                    }
                                    : {
                                        field: UserField.User_id,
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
                                let f: UserFilter = this.state.current_filter
                                    ? {
                                        field: this.state.current_filter.field,
                                        op: this.state.current_filter.op,
                                        value: event.target.value.toString()
                                    }
                                    : {
                                        field: UserField.User_id,
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
                                return UserField[option].substring("User_".length)
                            }}

                            options={[
                                    UserField.User_id,
                                    UserField.User_name,
                                    UserField.User_age,
                                    UserField.User_ctime,
                                    UserField.User_mtime,  
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

                                        let field = UserField[item.field].substring("User_".length)
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
                                            header: 'id字段',
                                            render: datum => (
                                                datum.id.toString()
                                            ),
                                        },
                                        {
                                            property: 'name',
                                            header: '名称',
                                            render: datum => (
                                                datum.name.toString()
                                            ),
                                        },
                                        {
                                            property: 'age',
                                            header: '年龄',
                                            render: datum => (
                                                datum.age.toString()
                                            ),
                                        },
                                        {
                                            property: 'ctime',
                                            header: '创建时间',
                                            render: datum => (
                                                datum.ctime.toString()
                                            ),
                                        },
                                        {
                                            property: 'mtime',
                                            header: '更新时间',
                                            render: datum => (
                                                datum.mtime.toString()
                                            ),
                                        },  

                        ]}
                        data={this.state.response?.users}
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
                                    let edit: User = {
                                            id:0n ,
                                            name:'' ,
                                            age:0n ,
                                            ctime:'' ,
                                            mtime:'' , 
                                       
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
                                let req: ListUsersReq = {
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
                                            onChange={(nextValue: User, options) => {

                                                this.setState((cur) => ({
                                                    ...cur,
                                                    current_item: nextValue
                                                }))
                                            }}
                                            onSubmit={(event) => {
                                                if (event.value.id > 0) {
                                                    this.props.client.updateUser({
                                                        user: event.value,
                                                        update_mask: Object.keys(event.touched)
                                                    })
                                                        .then(() => {
                                                            this.fetchList(this.state.request)
                                                        }).catch((status: RpcError) => {
                                                            this.setState((cur) => ({ ...cur, rpc_err: status }))

                                                        })

                                                } else {
                                                    this.props.client.createUser(event.value)
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
                                                label="id字段">
                                                <TextInput
                                                    id="text-input-id"
                                                    name="id"
 	                                                
                                                    disabled
                                                    
                                                    value={this.state.current_item.id.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="name"
                                                htmlFor="text-input-name"
                                                label="名称">
                                                <TextInput
                                                    id="text-input-name"
                                                    name="name"
 	                                                
                                                    value={this.state.current_item.name.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="age"
                                                htmlFor="text-input-age"
                                                label="年龄">
                                                <TextInput
                                                    id="text-input-age"
                                                    name="age"
 	                                                
                                                    value={this.state.current_item.age.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="ctime"
                                                htmlFor="text-input-ctime"
                                                label="创建时间">
                                                <TextInput
                                                    id="text-input-ctime"
                                                    name="ctime"
 	                                                
                                                    value={this.state.current_item.ctime.toString()}
                                                />
                                            </FormField>
                                            <FormField
                                                name="mtime"
                                                htmlFor="text-input-mtime"
                                                label="更新时间">
                                                <TextInput
                                                    id="text-input-mtime"
                                                    name="mtime"
 	                                                
                                                    value={this.state.current_item.mtime.toString()}
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
                                                                this.props.client.deleteUser({ id: id })
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