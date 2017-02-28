import { mock } from 'mockjs';

export default {
  state: 1,
  data: mock({
    'list|10': [{
      'id|+1': 1,
      'name': '@ctitle(2, 4)',
      'icon_url': '@image("48x48")',
      'createdAt': Date.now(),
      'updatedAt': Date.now()
    }]
  }).list
}
