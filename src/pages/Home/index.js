import classNames from 'classnames';
import React from 'react';
import { Button, Form, Select, Input, Icon } from 'antd';
import { fromJS, List, Map } from 'immutable';
import Block from 'components/Block';
import style from './style.less';

const FormItem = Form.Item;
const Option = Select.Option;

const initialProperty = {
  name: '',
  type: 'TEXT',
  selector: ''
};

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
        properties: [initialProperty]
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

  updateRulePropertyField (ruleIndex, propIndex, subPropIndex, propKey, propValue) {
    if (typeof subPropIndex === 'string') {
      propValue = propKey;
      propKey = subPropIndex;
      subPropIndex = null;
    }

    const {rules} = this.state;
    let rule = rules.get(ruleIndex);
    let property = rule.getIn(['properties', propIndex]);

    if (typeof subPropIndex === 'number') {
      let subProperties = property.get('subProperties');
      let subProperty = subProperties.get(subPropIndex);
      subProperty = subProperty.set(propKey, propValue);
      subProperties = subProperties.set(subPropIndex, subProperty);
      property = property.set('subProperties', subProperties);
    } else {
      property = property.set(propKey, propValue);
    }

    if (propKey === 'type' && propValue === 'LIST') {
      property = property.set('subProperties', fromJS([initialProperty]));
    }

    rule = rule.setIn(['properties', propIndex], property);

    this.setState({
      rules: rules.set(ruleIndex, rule)
    });
  }

  addProperty (ruleIndex) {
    const {rules} = this.state;
    let rule = rules.get(ruleIndex);
    let properties = rule.get('properties');
    properties = properties.push(fromJS(initialProperty));
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

  addSubProperty (ruleIndex, propIndex) {
    let {rules} = this.state;
    let rule = rules.get(ruleIndex);
    let properties = rule.get('properties');
    let property = properties.get(propIndex);
    let subProperties = property.get('subProperties');
    subProperties = subProperties.push(fromJS(initialProperty));
    property = property.set('subProperties', subProperties);
    properties = properties.set(propIndex, property);
    rule = rule.set('properties', properties);
    rules = rules.set(ruleIndex, rule);
    this.setState({rules});
  }

  removeSubProperty (ruleIndex, propIndex) {
    let {rules} = this.state;
    let rule = rules.get(ruleIndex);
    let properties = rule.get('properties');
    let property = properties.get(propIndex);
    let subProperties = property.get('subProperties');

    if (subProperties.size <= 1) {
      return;
    }

    subProperties = subProperties.splice(subProperties.size - 1, 1);
    property = property.set('subProperties', subProperties);
    properties = properties.set(propIndex, property);
    rule = rule.set('properties', properties);
    rules = rules.set(ruleIndex, rule);
    this.setState({rules});
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
                      <div key={`${index}-${propIndex}`} className={style.rule}>
                        <div className="flex">
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
                        {
                          property.get('type') === 'LIST' && (
                            property.get('subProperties').map((subProperty, subPropIndex) => {
                              return (
                                <div
                                  key={`${index}-${propIndex}-${subPropIndex}`}
                                  className={classNames(style.sub, 'flex')}
                                >
                                  <Input
                                    style={{width: 100}}
                                    placeholder="属性名称"
                                    value={subProperty.get('name')}
                                    onChange={(e) => this.updateRulePropertyField(
                                      index, propIndex, subPropIndex, 'name', e.target.value
                                    )}
                                  />
                                  <Input
                                    style={{width: 150}}
                                    placeholder="选择器"
                                    value={subProperty.get('selector')}
                                    onChange={(e) => this.updateRulePropertyField(
                                      index, propIndex, subPropIndex, 'selector', e.target.value
                                    )}
                                  />
                                  <Select
                                    style={{width: 80}}
                                    value={subProperty.get('type')}
                                    onChange={(type) => this.updateRulePropertyField(
                                      index, propIndex, subPropIndex, 'type', type
                                    )}
                                  >
                                    <Option value="TEXT">文本</Option>
                                    <Option value="HTML">HTML</Option>
                                    <Option value="IMAGE">图片</Option>
                                  </Select>
                                </div>
                              );
                            })
                          )
                        }
                        {
                          property.get('type') === 'LIST' && (
                            <Button.Group type="ghost" style={{marginLeft: 50}}>
                              <Button size="small" onClick={() => this.addSubProperty(index, propIndex)}>
                                <Icon type="plus"/>
                              </Button>
                              <Button size="small" onClick={() => this.removeSubProperty(index, propIndex)}>
                                <Icon type="minus"/>
                              </Button>
                            </Button.Group>
                          )
                        }
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
