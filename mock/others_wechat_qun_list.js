import { mock } from 'mockjs';

export default {
  status: 1,
  data: mock({
    'totalItem': 20,
    'page': 0,
    'size': 20,
    'data|19-20': [{
      'id': '@int(1, 99999999)',
      'name': '@ctitle(5, 10)',
      'owner': '@cname',
      'ownerId|1-100': 1,
      'category': {
        'id': '@int(1, 9999999)',
        'name': '@ctitle(4)'
      },
      'icon_url': '@image("48x48")',
      'detail': '@cparagraph',
      'maxMemberNum|200-500': 200,
      'currentMemberNum|10-200': 10,
      'createdAt': Date.now(),
      'updatedAt': Date.now()
    }]
  })
}
