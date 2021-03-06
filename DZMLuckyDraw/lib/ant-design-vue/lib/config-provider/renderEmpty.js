'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _empty = require('../empty');

var _empty2 = _interopRequireDefault(_empty);

var _ = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* babel-plugin-inline-import './empty.svg' */var emptyImg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K';


var RenderEmpty = {
  functional: true,
  inject: {
    configProvider: { 'default': function _default() {
        return _.ConfigConsumerProps;
      } }
  },
  props: {
    componentName: _vueTypes2['default'].string
  },
  render: function render(createElement, context) {
    var h = arguments[0];
    var props = context.props,
        injections = context.injections;

    function renderHtml(componentName) {
      var getPrefixCls = injections.configProvider.getPrefixCls;
      var prefix = getPrefixCls('empty');
      switch (componentName) {
        case 'Table':
        case 'List':
          return h(_empty2['default'], {
            attrs: { image: emptyImg },
            'class': prefix + '-normal' });

        case 'Select':
        case 'TreeSelect':
        case 'Cascader':
        case 'Transfer':
          return h(_empty2['default'], {
            attrs: { image: emptyImg },
            'class': prefix + '-small' });

        default:
          return h(_empty2['default']);
      }
    }
    return renderHtml(props.componentName);
  }
};

function renderEmpty(h, componentName) {
  return h(RenderEmpty, {
    attrs: { componentName: componentName }
  });
}

exports['default'] = renderEmpty;