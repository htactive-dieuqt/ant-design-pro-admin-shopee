import React, { useState } from 'react';
import { Form, Button, DatePicker, Input, Modal, Radio, Select, Steps } from 'antd';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const UpdateForm = props => {
  const [formVals, setFormVals] = useState({
    name: props.values.name,
    desc: props.values.desc,
    key: props.values.key,
    target: '0',
    template: '0',
    type: '1',
    time: '',
    frequency: 'month',
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

  const forward = () => setCurrentStep(currentStep + 1);

  const backward = () => setCurrentStep(currentStep - 1);

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });

    if (currentStep < 2) {
      forward();
    } else {
      handleUpdate({ ...formVals, ...fieldsValue });
    }
  };

  const renderContent = () => {
    if (currentStep === 1) {
      return (
        <>
          <FormItem name="target" label="Target">
            <Select
              style={{
                width: '100%',
              }}
            >
              <Option value="0">Table I</Option>
              <Option value="1">Table II</Option>
            </Select>
          </FormItem>
          <FormItem name="template" label="Rule template">
            <Select
              style={{
                width: '100%',
              }}
            >
              <Option value="0">Rule template I</Option>
              <Option value="1">Rule template II</Option>
            </Select>
          </FormItem>
          <FormItem name="type" label="Type">
            <RadioGroup>
              <Radio value="0">Strong</Radio>
              <Radio value="1">Weak</Radio>
            </RadioGroup>
          </FormItem>
        </>
      );
    }

    if (currentStep === 2) {
      return (
        <>
          <FormItem
            name="time"
            label="TIME"
            rules={[
              {
                required: true,
                message: 'Please enter the reason for the exception!',
              },
            ]}
          >
            <DatePicker
              style={{
                width: '100%',
              }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="Date time"
            />
          </FormItem>
          <FormItem name="frequency" label="Time">
            <Select
              style={{
                width: '100%',
              }}
            >
              <Option value="month">month</Option>
              <Option value="week">week</Option>
            </Select>
          </FormItem>
        </>
      );
    }

    return (
      <>
        <FormItem
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: 'Please enter the rule name!',
            },
          ]}
        >
          <Input placeholder="Please enter" />
        </FormItem>
        <FormItem
          name="desc"
          label="Description"
          rules={[
            {
              required: true,
              message: 'Please enter a rule description of at least 5 characters!',
              min: 5,
            },
          ]}
        >
          <TextArea rows={4} placeholder="Please enter at least 5 characters" />
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    if (currentStep === 1) {
      return (
        <>
          <Button
            style={{
              float: 'left',
            }}
            onClick={backward}
          >
            Back
          </Button>
          <Button onClick={() => handleUpdateModalVisible(false, values)}>Cancel</Button>
          <Button type="primary" onClick={() => handleNext()}>
            Next
          </Button>
        </>
      );
    }

    if (currentStep === 2) {
      return (
        <>
          <Button
            style={{
              float: 'left',
            }}
            onClick={backward}
          >
            Back
          </Button>
          <Button onClick={() => handleUpdateModalVisible(false, values)}>Cancel</Button>
          <Button type="primary" onClick={() => handleNext()}>
            Next
          </Button>
        </>
      );
    }

    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>Cancel</Button>
        <Button type="primary" onClick={() => handleNext()}>
          Next
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      destroyOnClose
      title="规则配置"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Steps
        style={{
          marginBottom: 28,
        }}
        size="small"
        current={currentStep}
      >
        <Step title="Information" />
        <Step title="Attributes" />
        <Step title="Set date time" />
      </Steps>
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          target: formVals.target,
          template: formVals.template,
          type: formVals.type,
          frequency: formVals.frequency,
          name: formVals.name,
          desc: formVals.desc,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
