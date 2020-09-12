import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Drawer, Upload } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { firebaseStorage } from '@/Firebase/firebase';
import { extend } from 'lodash';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { queryRule, updateRule, addRule, removeRule, addImage } from './service';
/**
 * 添加节点
 * @param fields
 */

/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async (fields) => {
  const hide = message.loading('Updating');

  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('Update is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Update failed, please try again!');
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async (selectedRows) => {
  const hide = message.loading('Deleting');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully, will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Deletion failed, please try again');
    return false;
  }
};

const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [fileUpload, setFileUpload] = useState('');
  const [imag, setImag] = useState('');

  const beforeUpload = (file) => {
    setFileUpload(file);
    // eslint-disable-next-line no-console
    console.log('image', file);
  };

  const uploadImage = async (image) => {
    const uploadTask = firebaseStorage.ref(`/images_Product/${image.uid}/`).put(image);
    await uploadTask.on(
      'state_changed',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (snapshot) => {
        // eslint-disable-next-line no-console
        console.log(snapshot);
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.log(error, 'hello');
      },
      () => {
        firebaseStorage
          .ref('/images_Product')
          .child(image.uid)
          .getDownloadURL()
          .then((url) => {
            setImag(url);
          });
      },
    );
  };

  const handleUpload = () => {
    uploadImage(fileUpload);
  };

  const handleAdd = async (fields) => {
    const hide = message.loading('正在添加');
    try {
      await addRule(extend(fields, { image: imag }));
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
      return false;
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'Yeu cau nhap',
          },
        ],
      },
      render: (dom, entity) => <a onClick={() => setRow(entity)}>{dom}</a>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      sorter: true,
    },
    {
      title: 'Color',
      dataIndex: 'color',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      valueType: 'file',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return (
          <>
            <Upload {...rest} beforeUpload={beforeUpload}>
              <Button>Click to Upload</Button>
            </Upload>
            <Button type="primary" style={{ marginTop: 12 }} onClick={handleUpload}>
              Upload
            </Button>
          </>
        );
      },
      // eslint-disable-next-line jsx-a11y/alt-text
      render: (dom, entity) => <img src={entity.image} style={{ width: 60, height: 60 }} />,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Size',
      dataIndex: 'size',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: 'Hide',
          status: 'Default',
        },
        1: {
          text: 'Show',
          status: 'Processing',
        },
      },
    },
    {
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            UPDATE
          </a>
          <Divider type="vertical" />
          {/* <a href="">DELETE</a> */}
        </>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable
        headerTitle="LIST PRODUCT"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> ADD
          </Button>,
        ]}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              Chosen{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              item&nbsp;&nbsp;
              <span>
                Total calls {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)} 万
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Batch Delete
          </Button>
          <Button type="primary">Batch Approval</Button>
        </FooterToolbar>
      )}
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable
          onSubmit={async (value) => {
            const success = await handleAdd(value);

            if (success) {
              handleModalVisible(false);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);

            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
