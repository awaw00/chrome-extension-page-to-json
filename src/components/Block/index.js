import React, { PropTypes } from 'react';
import { Input } from 'antd';
import style from './style.less';

class Block extends React.PureComponent {
  constructor () {
    super();
    this.state = {
      titleEditing: false,
      value: ''
    };
  }

  handleTitleClick = (e) => {
    this.setState({
      titleEditing: true,
      value: this.props.title
    });
  };

  handleTitleChange = () => {
    this.props.onTitleChange(this.state.value);
    this.setState({
      titleEditing: false,
      value: ''
    });
  };

  handleTitleKeyUp = (e) => {
    if (e.keyCode === 13) {
      this.handleTitleChange();
    }
  };

  handleTitleInput = (e) => {
    this.setState({
      value: e.target.value
    });
  };

  render () {
    const {titleEditing, value} = this.state;
    const {children, title, titleEditable} = this.props;
    return (
      <div className={style.wrapper}>
        <header onClick={titleEditable ? this.handleTitleClick : null} className={style.title + ' flex items-center'}>
          {titleEditing
            ? (
              <Input
                value={value}
                onChange={this.handleTitleInput}
                onBlur={this.handleTitleChange}
                onKeyUp={this.handleTitleKeyUp}
              />
            )
            : title
          }
        </header>

        <main className={style.content}>
          {children}
        </main>
      </div>
    );
  }
}

Block.propTypes = {
  title: PropTypes.string,
  titleEditable: PropTypes.bool,
  children: PropTypes.node,
  onTitleChange: PropTypes.func
};

Block.defaultProps = {
  titleEditable: false
};

export default Block;
