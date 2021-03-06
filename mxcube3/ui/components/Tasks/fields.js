import React from 'react';
import { Field } from 'redux-form';
import { Row,
         Col,
         FormGroup,
         Checkbox,
         FormControl,
         ControlLabel,
         Button } from 'react-bootstrap';

export const FieldsHeader = ({ title }) => (
  <Row>
    <Col xs={12}>
      <center><b style={{ padding: '0.5em', backgroundColor: 'white' }}>{title}</b></center>
      <hr style={{ marginTop: '-10px' }}></hr>
    </Col>
  </Row>
);

export const StaticField = ({ label, data }) => (
    <FormGroup style={{ textAlign: 'left', marginBottom: '0px' }}>
      <Col xs={12}>
        <FormControl.Static
          style={{ padding: '5px 0px', minHeight: '0px' }}
        >
          <b>{label}:</b>{' '}{data}
        </FormControl.Static>
      </Col>
    </FormGroup>
);

const ReduxInputField = (prop) => (
       <FormGroup controlId={prop.input.name} validationState={prop.meta.error ? 'error' : null}>
         <Col xs={prop.col1 || 8} componentClass={ControlLabel} style={{ textAlign: 'left' }}>
           {prop.label}
         </Col>
         <Col xs={prop.col2 || 4}>
           <FormControl value={prop.input.value} onChange={prop.input.onChange} {...prop} />
         </Col>
       </FormGroup>
);

export const InputField = (prop) => (
   <Field name={prop.propName}
     component={ReduxInputField}
     {...prop}
   />
);

export const CheckboxField = ({ propName, label }) => (
   <Field name={propName}
     component={ (prop) =>
       <FormGroup controlId={prop.input.name} validationState={prop.meta.error ? 'error' : null }>
         <Col xs={prop.col1 || 8} componentClass={ControlLabel} style={{ textAlign: 'left' }}>
           {label}
         </Col>
         <Col xs={prop.col2 || 4}>
           <Checkbox value={prop.input.value} onChange={prop.input.onChange} {...prop} />
         </Col>
       </FormGroup>
     }
   />
);

export const SelectField = ({ propName, label, list }) => (
   <Field name={propName}
     component={ (prop) =>
       <FormGroup controlId={prop.input.name} validationState={prop.meta.error ? 'error' : null }>
         <Col xs={prop.col1 || 8} componentClass={ControlLabel} style={{ textAlign: 'left' }}>
           {label}
         </Col>
         <Col xs={prop.col2 || 4}>
           <FormControl componentClass="select" value={prop.input.value}
             onChange={prop.input.onChange} {...prop}
           >
             {list.map((val, i) => <option key={i} value={val}>{val}</option>)}
           </FormControl>
         </Col>
       </FormGroup>
     }
   />
);

export const FieldsRow = ({ children }) => (
   <Row>
     {children.length > 0 ? children.map((child, i) =>
       <Col key={i} xs={12 / children.length}>
         {child}
       </Col>
     ) : null }
   </Row>
);

/* eslint-disable react/no-set-state */
export class CollapsableRows extends React.Component {
  constructor(props) {
    super(props);

    this.state = { collapsed: true };
  }

  render() {
    return (<div>
      { this.state.collapsed ? '' : this.props.children }
      <Row>
        <Col xs={12}>
          { this.state.collapsed ?
            <Button bsStyle="link" className="pull-right"
              onClick={() => {this.setState({ collapsed: false });}}
            >
               Show more
            </Button> :
            <Button bsStyle="link" className="pull-right"
              onClick={() => {this.setState({ collapsed: true });}}
            >
               Show less
            </Button>
         }
        </Col>
      </Row>
    </div>);
  }
}
/* eslint-enable react/no-set-state */
