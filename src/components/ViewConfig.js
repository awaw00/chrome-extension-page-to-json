import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as types from 'types';

@connect(
  (state) => ({

  }),
  (dispatch) => ({
    setViewConfig (configs) {
      if (configs.shareData && !configs.shareData.link) {
        configs.shareData.link = window.location.href;
      }
      dispatch({
        type: types.SET_VIEW_CONFIGS,
        payload: configs
      });
    }
  })
)
class ViewConfig extends React.PureComponent {
  static propTypes = {
    setViewConfig: PropTypes.func,
    documentTitle: PropTypes.string,
    shareData: PropTypes.object,
    activeFooterItem: PropTypes.string
  };

  componentWillMount () {
    this.updateConfig(this.props);
  }

  componentWillReceiveProps (nextProps) {
    this.updateConfig(nextProps);
  }

  updateConfig (props) {
    const { setViewConfig, ...configs } = props;

    setViewConfig(configs);
  }

  render () {
    return null;
  }
}

export default ViewConfig;
