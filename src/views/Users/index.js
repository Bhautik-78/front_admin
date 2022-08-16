import React, {useEffect, useState} from "react";
import {message, Popconfirm, Switch, Table, Spin} from 'antd';
import DeleteIcon from '@material-ui/icons/Delete';
import {GetUsers,updateUsers,DeleteUsers} from '../../actions/Users'

message.config({top : 50});

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);

  const DeleteText = 'Are you sure to delete this Users?';

  useEffect(() => {
     getUsers();
  },[]);

  const getUsers = async () => {
    const res = await GetUsers();
    if (res && res.data) {
      setUserList(res.data)
    }else {
      message.error("something went wrong")
    }
  };

  const ToggleActivity =(record,index)=>{
    const isActive = userList[index].onboardingStatus;
    if(isActive === "active"){
      userList[index].onboardingStatus = 'inactive';
      updateStatus(record)
    }else {
      userList[index].onboardingStatus = 'active';
      updateStatus(record)
    }
    setUserList(userList);
  };

  const updateStatus = async (record) => {
    setLoading(true);
    const res = await updateUsers(record);
    if (res && res.data) {
      setLoading(false);
      message.success("status updated Successfully");
      getUsers();
    }else {
      setLoading(false);
      message.error("something went wrong")
    }
  };

  const confirmDeleteUsers = async (id) => {
    setLoading(true);
    const deleteId =(id._id);
    const res = await DeleteUsers(deleteId);
    if (res && res.data){
      setLoading(false);
      message.success("User Delete Successfully");
      getUsers()
    }else {
      setLoading(false);
      message.error("something went wrong")
    }
  };

  const columns = [
    {
      title: 'Display Name',
      dataIndex: 'displayName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Status',
      render:(record,data,index) =>{
        return(
          <span>
          <Switch defaultChecked checked={record.onboardingStatus === "active"} size='small' onClick={() =>{ToggleActivity(record,index)}}/>
        </span>
        )
      }
    },
    {
      title: 'Action',
      render: (record) => {
        return (
          <span>
             <Popconfirm
               placement="bottomLeft"
               title={DeleteText}
               onConfirm={() => {confirmDeleteUsers(record)}}
               okText="Yes"
               cancelText="No"
             >
                <DeleteIcon/>
             </Popconfirm>
          </span>
        )
      }
    },
  ];

  return(
    <div>
      <Spin spinning={loading}>
      <div>
        <Table columns={columns} dataSource={userList || []} size="middle" />
      </div>,
      </Spin>
    </div>
  );
};
export default Users
