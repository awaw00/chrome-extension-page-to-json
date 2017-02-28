import { mock } from 'mockjs';

export default {
  status: 1,
  data: mock({
    'user': {
      'id|1000-9999': 1000,
      'nickname': '@cname',
      'avatar': '@image("100x100", "#0094ff", "#ffffff", "TX")',
      'province': '@province',
      'city': '@city'
    },
    'qrcode': '@image("300x300", "#000000", "#ffffff", "QRCODE")',
    'type': 'SYSTEM'
  })
}
