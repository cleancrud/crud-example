
import * as React from 'react';
import { ListUsersReq, ListUsersResp, User, UserField, UserFilter } from '../proto/user.api';
import { UserServiceClient } from '../proto/user.api.client'

import { RpcError } from '@protobuf-ts/runtime-rpc'
import { useEffect, useState } from 'react';




export interface IUserPageProps {
    client: UserServiceClient
}

export interface IUserPageState {
    request: ListUsersReq
    response: ListUsersResp | null
    filters: UserFilter[]
    current_filter: UserFilter
    currentItem: User | null
    show_layer: boolean
    rpc_err: RpcError | null
}



export function UserFc(client: UserServiceClient) {
    const [req, setReq] = useState<ListUsersReq>({
        page: 1,
        page_size: 20,
        order_by_field: UserField.User_unknow,
        order_by_desc: true,
        filters: []
    })
    const [resp, setResp] = useState<ListUsersResp | null>(null)
    const [filters, setFilters] = useState<UserFilter[]>([])
    const [currentFilter, setCurrentFilter] = useState<UserFilter | null>(null)
    const [currentItem, setCurrentItem] = useState<User | null>(null)
    const [showEdit, setShowEdit] = useState(false)
    const [rpcErr, setRpcErr] = useState<RpcError | null>(null)

    const fetchList = async (req: ListUsersReq) => {
        client.listUsers(req).then((ret) => {
            setResp(ret.response)
        }).catch((status: RpcError) => {
            setRpcErr(status)
        }).finally(() => {
            setReq(req)
        })
    }

    return (
        <div>
            <div title="User Manager" ></div>
            <div>
                <div className='flex flex-row'  >
                    <select
                        placeholder='Field'
                        value={currentFilter?.field}
                        onChange={(evt) => {
                            let f: UserFilter = currentFilter
                                ? {
                                    field: evt.target.value as unknown as UserField, //todo
                                    op: currentFilter.op,
                                    value: currentFilter.value
                                }
                                : {
                                    field: UserField.User_age, //todo
                                    op: "=",
                                    value: ""
                                }
                            setCurrentFilter(f)
                        }}

                    >
                        {

                            [
                                UserField.User_id,
                                UserField.User_name,
                                UserField.User_age,
                                UserField.User_ctime,
                                UserField.User_mtime,
                            ].map((v) => {
                                return (<option value={v}>{UserField[v].substring("User_".length)}</option>)
                            })
                        }



                    </select>
                    <select
                        placeholder="Operator"
                        value={currentFilter?.op}
                        onChange={(evt) => {
                            let f: UserFilter = currentFilter
                                ? {
                                    field: currentFilter.field,
                                    op: evt.target.value,
                                    value: currentFilter.value
                                }
                                : {
                                    field: UserField.User_id,
                                    op: evt.target.value,
                                    value: ""
                                }

                            setCurrentFilter(f)
                        }}
                    >

                        {
                            ["=", "<>", ">", ">=", "<", "<=", "IN", "NOT IN", "LIKE"].map((v) => {
                                return (<option value={v}>{v}</option>)
                            })
                        }
                    </select>
                    <input
                        placeholder="Condition Value"
                        value={currentFilter?.value}
                        onChange={event => {
                            let f: UserFilter = currentFilter
                                ? {
                                    field: currentFilter.field,
                                    op: currentFilter.op,
                                    value: event.target.value.toString()
                                }
                                : {
                                    field: UserField.User_id,
                                    op: "=",
                                    value: event.target.value.toString()
                                }
                            setCurrentFilter(f)
                        }}
                    />
                    <button
                        onClick={() => {
                            let f = filters
                            if (currentFilter) {
                                f.push(currentFilter)
                                setFilters(f)
                            }
                        }

                        }
                    >+Add</button>
                    <select
                        placeholder='OrderBy'
                        value={req.order_by_field}
                        onChange={(evt) => {
                            let request = req
                            request.order_by_field = evt.target.value as unknown as UserField
                            fetchList(request)
                        }}

                    >
                        {

                            [
                                UserField.User_id,
                                UserField.User_name,
                                UserField.User_age,
                                UserField.User_ctime,
                                UserField.User_mtime,
                            ].map((v) => {
                                return (<option value={v}>{UserField[v].substring("User_".length)}</option>)
                            })
                        }
                    </select>

                    <input
                        type='checkbox'
                        checked={req.order_by_desc}
                        onChange={(event) => {
                            let request = req
                            request.order_by_desc = event.target.checked
                            fetchList(request)
                        }}

                    >IsDesc</input>

                    <button
                        onClick={() => {
                            let request = req
                            request.filters = filters
                            fetchList(request)
                        }
                        }
                    >Fliter</button>
                </div>

                {
                    filters.length > 0 &&
                    <div className='flex flex-row'>
                        {
                            filters.map((item, index) => {
                                let field = UserField[item.field].substring("User_".length)
                                return <div
                                    key={index}
                                    onClick={() => {
                                        let f = filters
                                        if (index > -1) {
                                            f.splice(index, 1);
                                        }
                                        setFilters(f)
                                    }}
                                >{field + " " + item.op + " " + item.value}</div>
                            })
                        }
                    </div>

                }
                <table>
                    <tr>
                        {[
                            UserField.User_id,
                            UserField.User_name,
                            UserField.User_age,
                            UserField.User_ctime,
                            UserField.User_mtime,
                        ].map((v) => {
                            return (<th>{UserField[v].substring("User_".length)}</th>)
                        })
                        }

                    </tr>
                    <tr>
                        <td></td>
                    </tr>
                </table>

                <div className='flex flex-row justify-between'
                >
                    <button
                        onClick={
                            () => {
                                let edit: User = {
                                    id: 0n,
                                    name: '',
                                    age: 0n,
                                    ctime: '',
                                    mtime: '',

                                }
                                setCurrentItem(edit)
                                setShowEdit(true)

                            }
                        }
                    >New</button>

                    {/* <Pagination
                        numberItems={response?.total_count}
                        step={request.page_size}
                        page={request.page}
                        onChange={({ page }) => {
                            let req: ListUsersReq = {
                                ...request,
                                page: page
                            }
                            this.fetchList(req)
                        }}
                    /> */}
                    <div className='flex flex-row'>

                        <select

                            placeholder="page_size"

                            value={req.page_size}
                            onChange={(evt) => {
                                let request = req
                                if (request.page_size != evt.target.value as unknown as number) {
                                    request.page_size = evt.target.value as unknown as number
                                    fetchList(req)
                                }
                            }}
                        >
                            {
                                [20, 50, 100].map((x) => {
                                    return (<option value={x}>{x.toString()}</option>)
                                })
                            }

                        </select>
                        <div>total{resp ? resp.total_count : 0}</div>
                    </div>

                </div>

                {
                    currentItem && showEdit ?
                        <div >
                            <div >

                                <button
                                    onClick={() => {
                                        setShowEdit(false)
                                    }} >close</button>

                                <div>
                                    <form

                                        onSubmit={(event) => {
                                            // if (event.value.id > 0) {
                                            //     client.updateUser({
                                            //         user: event.value,
                                            //         update_mask: Object.keys(event.touched)
                                            //     })
                                            //         .then(() => {
                                            //             this.fetchList(request)
                                            //         }).catch((status: RpcError) => {
                                            //             this.setState((cur) => ({ ...cur, rpc_err: status }))

                                            //         })

                                            // } else {
                                            //     client.createUser(event.value)
                                            //         .then(() => {
                                            //             this.fetchList(request)
                                            //         }).catch((status: RpcError) => {
                                            //             this.setState((cur) => ({ ...cur, rpc_err: status }))

                                            //         })
                                            // }
                                        }}
                                    >
                                        <div >
                                            <input
                                                id="text-input-id"
                                                name="id"
                                                disabled
                                                value={currentItem.id.toString()}
                                            />id字段
                                        </div>

                                        <div
                                        >
                                            <button
                                                type="submit"
                                            >Save</button>
                                            <button
                                                color='red'
                                                type="button"
                                                onClick={
                                                    (event) => {
                                                        let id = currentItem?.id
                                                        if (id) {
                                                            client.deleteUser({ id: id })
                                                                .then(() => {
                                                                    fetchList(req)
                                                                    setCurrentItem(null)
                                                                })
                                                        }
                                                    }
                                                } >Delete</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        : null
                }
            </div >
            {
                rpcErr ? <div
                // toast
                // time={3000}
                // title={rpc_err.code}
                // message={rpc_err.message}
                // onClose={() => {
                //     this.setState((cur) => ({
                //         ...cur,
                //         rpc_err: null
                //     }))
                // }}
                //status="warning"
                /> :
                    null
            }
        </div >
    );

}




