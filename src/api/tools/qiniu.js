import request from '@/utils/request'

export function get() {
  return request({
    url: 'api/ossContent/config?servicer=aliyun',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: 'api/ossContent/config',
    data,
    method: 'put'
  })
}

export function download(id) {
  return request({
    url: 'api/ossContent/download/' + id,
    method: 'get'
  })
}

export function sync() {
  return request({
    url: 'api/ossContent/synchronize?servicer=aliyun',
    method: 'post'
  })
}

export function del(ids) {
  return request({
    url: 'api/ossContent?servicer=aliyun',
    method: 'delete',
    data: ids
  })
}

export default { del, download, sync }
