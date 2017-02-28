import React from 'react';
import { Button, Form, Select, Input, Checkbox, message, DatePicker } from 'antd';
import { fromJS, List, Map } from 'immutable';
import Block from 'components/Block';

const FormItem = Form.Item;
const Option = Select.Option;

class HomePage extends React.PureComponent {
  storageKey = '';
  constructor () {
    super();

    this.state = {
      rules: List()
    };

    contentScripts
      .getLocation()
      .then(({hostname, pathname}) => {
        this.storageKey = hostname + pathname;
        return storage.get(this.storageKey);
      })
      .then(rules => {
        if (rules) {
          this.setState({
            rules: fromJS(rules)
          });
        }
      });
  }

  handleAdd = (e) => {
    const {rules} = this.state;
    this.setState({
      rules: rules.push(fromJS({
        name: '',
        properties: [{
          name: '',
          type: 'TEXT',
          selector: ''
        }]
      }))
    });
  };

  updateRuleField (index, key, value) {
    if (!value) {
      return;
    }

    let {rules} = this.state;
    rules = rules.mergeIn([index], {[key]: value});
    this.setState({rules});
  }

  updateRulePropertyField (ruleIndex, propIndex, propKey, propValue) {
    const {rules} = this.state;
    let rule = rules.get(ruleIndex);
    const property = rule.getIn(['properties', propIndex]);
    rule = rule.setIn(['properties', propIndex], property.set(propKey, propValue));

    this.setState({
      rules: rules.set(ruleIndex, rule)
    });
  }

  addProperty (ruleIndex) {
    const {rules} = this.state;
    let rule = rules.get(ruleIndex);
    let properties = rule.get('properties');
    properties = properties.push(fromJS({
      name: '',
      type: 'TEXT',
      selector: ''
    }));
    rule = rule.set('properties', properties);

    this.setState({
      rules: rules.set(ruleIndex, rule)
    });
  }

  async getJson (ruleIndex) {
    const {rules} = this.state;
    const rule = rules.get(ruleIndex).toJS();
    const res = await contentScripts.getJson(rule);
    console.log(res);
  }

  removeRule (ruleIndex) {
    const {rules} = this.state;
    this.setState({
      rules: rules.splice(ruleIndex, 1)
    });
  }

  componentDidUpdate () {
    const {rules} = this.state;
    if (this.storageKey) {
      storage.set(this.storageKey, rules.toJS());
    }
  }

  render () {
    const {rules} = this.state;
    return (
      <div>
        <Block title="操作">
          <Button onClick={this.handleAdd}>添加规则</Button>
        </Block>

        {
          rules.map((rule, index) => {
            return (
              <Block
                key={'rule' + index}
                title={rule.get('name') || '新规则'}
                titleEditable
                onTitleChange={(title) => this.updateRuleField(index, 'name', title)}
              >
                {
                  rule.get('properties', List()).map((property, propIndex) => {
                    return (
                      <div key={`rule-${index}-prop-${propIndex}`} className="flex" style={{marginBottom: 10}}>
                        <Input
                          style={{width: 100}}
                          placeholder="属性名称"
                          value={property.get('name')}
                          onChange={(e) => this.updateRulePropertyField(index, propIndex, 'name', e.target.value)}
                        />
                        <Input
                          style={{width: 200}}
                          placeholder="选择器"
                          value={property.get('selector')}
                          onChange={(e) => this.updateRulePropertyField(index, propIndex, 'selector', e.target.value)}
                        />
                        <Select
                          style={{width: 80}}
                          value={property.get('type')}
                          onChange={(type) => this.updateRulePropertyField(index, propIndex, 'type', type)}
                        >
                          <Option value="TEXT">文本</Option>
                          <Option value="HTML">HTML</Option>
                          <Option value="IMAGE">图片</Option>
                          <Option value="LIST">列表</Option>
                        </Select>
                      </div>
                    );
                  })
                }
                <Button size="small" onClick={() => this.getJson(index)} type="primary">获取数据</Button>
                <Button size="small" style={{margin: '0 10px'}} onClick={() => this.addProperty(index)}>添加属性</Button>
                <Button size="small" onClick={() => this.removeRule(index)}>删除规则</Button>
              </Block>
            );
          })
        }
      </div>
    );
  }
}

export default HomePage;
